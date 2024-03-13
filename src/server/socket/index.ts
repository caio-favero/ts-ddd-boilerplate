import { Server } from 'socket.io';
import { inject, injectable } from 'inversify';

import { createServer } from '..';
import { IListener } from './listener';

@injectable()
export default class UserSocket {
    constructor(
        @inject('listeners') private readonly listeners: IListener[],
    ) {}

    serverFactory() {
        const server = this.setupServer();
        this.setupListeners(server);
    }

    private setupServer() {
        const port = Number(process.env.SOCKET_SERVER_PORT);
        const server = createServer(port);

        const io = new Server(server);

        server.on('listening', () => {
            console.info(`Socket server initialized on ${port}`);
        });

        return io;
    }

    private setupListeners(io: Server) {
        io.on('connection', (socket) => {
            console.info('connected');

            socket.on('disconnect', (reason) => {
                console.warn(`disconnected - ${reason}`);
            });

            for (const listener of this.listeners) {
                listener.loadListeners(socket);
            }
        });
    }
}
