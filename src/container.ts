import { Container } from 'inversify';
import path from 'path';
import { glob } from 'glob';

import RestServer from './server/rest';
import SocketServer from './server/socket';
import MessagingServer from './server/messaging';
import MessagingConsumer from './server/messaging/consumer';
import MessagingController from './server/messaging/controller';
import MessagingProducer from './server/messaging/producer';

import SessionService from './domain/service/session';

enum Scope {
    TRANSIENT,
    SINGLETON,
    REQUEST
}

enum Type {
    CLASS,
    CONSTANT,
    FACTORY
}

export let globalContainer: Container | null = null;

export class ContainerFactory {
    static instance: Promise<Container>;

    static getInstance() {
        if (this.instance) return this.instance;

        this.instance = (new ContainerFactory()).factory();
        return this.instance;
    }

    private async factory(): Promise<Container> {
        const container = new Container({ skipBaseClassChecks: true });

        container.bind(SessionService).to(SessionService).inSingletonScope();

        container.bind(MessagingProducer).to(MessagingProducer).inSingletonScope();
        container.bind(MessagingController).to(MessagingController).inSingletonScope();
        container.bind(MessagingConsumer).to(MessagingConsumer).inSingletonScope();
        container.bind(MessagingServer).to(MessagingServer).inSingletonScope();

        await this.load(container, path.resolve(__dirname, './application/useCase'), Scope.SINGLETON);

        await this.load(container, path.resolve(__dirname, './server/socket/controller'), Scope.SINGLETON);
        await this.load(container, path.resolve(__dirname, './server/socket/listener'), Scope.SINGLETON);
        await this.loadList(container, path.resolve(__dirname, './server/socket/listener'), 'listeners');

        await this.load(container, path.resolve(__dirname, './server/rest/controller'), Scope.SINGLETON);
        await this.load(container, path.resolve(__dirname, './server/rest/router'), Scope.SINGLETON);
        await this.loadList(container, path.resolve(__dirname, './server/rest/router'), 'routers');

        container.bind(SocketServer).to(SocketServer).inSingletonScope();
        container.bind(RestServer).to(RestServer).inSingletonScope();

        globalContainer = container;
        return container;
    }

    private async loadList(container: Container, dir: string, identifier: string): Promise<void> {
        const files = await glob(dir + '/**/*.@(ts|js)');
        const list: any[] = [];

        for (const filename of files) {
            const file = path.parse(filename);

            if (file.name === 'index') continue;
            let Class = require(path.join(file.dir, file.name));

            if (typeof Class === 'object' && Class.default) Class = Class.default;
            if (typeof Class !== 'function') continue;

            const item = container.get(Class);

            list.push(item);
        }

        container.bind(identifier).toConstantValue(list);
    }

    private async load(
        container: Container,
        dir: string,
        scope: Scope,
        type: Type = Type.CLASS,
        resolution = 'default',
        ignoreIndex = true,
        named = false,
    ) {
        if (type === Type.CONSTANT) named = true;

        const files = await glob(dir + '/**/*.@(ts|js)');

        for (const filename of files) {
            if (filename.includes('__test__')) continue;
            const file = path.parse(filename);

            if (file.name === 'index' && ignoreIndex) continue;

            const module = require(path.join(file.dir, file.name));

            let Class = module;
            const target = module[resolution] || Class.default?.[resolution];

            if (typeof Class === 'object' && Class.default) Class = Class.default;
            if (typeof target !== 'function') continue;

            let binding;

            switch (type) {
                case Type.CLASS:
                    switch (scope) {
                        case Scope.TRANSIENT:
                            binding = container.bind(Class).to(target).inTransientScope();
                            break;
                        case Scope.SINGLETON:
                            binding = container.bind(Class).to(target).inSingletonScope();
                            break;
                        case Scope.REQUEST:
                            binding = container.bind(Class).to(target).inRequestScope();
                            break;
                    }
                    break;
                case Type.FACTORY:
                    switch (scope) {
                        case Scope.REQUEST:
                        case Scope.TRANSIENT:
                            binding = container.bind(Class).toFactory(target);
                            break;
                        case Scope.SINGLETON:
                            binding = container.bind(Class).toDynamicValue(target).inSingletonScope();
                            break;
                    }
                    break;
                case Type.CONSTANT:
                    const dir = path.parse(file.dir).name;
                    binding = container.bind(dir).toConstantValue(target);
                    break;
            }

            if (binding) {
                if (named) binding.whenTargetNamed(file.name);
                else binding.whenTargetIsDefault();
            }
        }
    }
}
