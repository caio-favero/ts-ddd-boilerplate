import 'reflect-metadata';
import 'dotenv/config';

import { ContainerFactory } from './container';
import MessagingServer from './server/messaging';
import RestServer from './server/rest';
import SocketServer from './server/socket';

async function setup() {
    const container = await ContainerFactory.getInstance();

    const messagingServer = container.get(MessagingServer);
    messagingServer.setup();

    const socketServer = container.get(SocketServer);
    socketServer.serverFactory();

    const restServer = container.get(RestServer);
    restServer.serverFactory();
}

setup();
