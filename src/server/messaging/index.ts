import { inject, injectable } from 'inversify';

import Consumer from './consumer';

@injectable()
export default class Messaging {
    constructor(
        @inject(Consumer) private readonly consumers: Consumer,
    ) {}

    setup() {
        this.consumers.loadConsumers();
    }
}
