import express from 'express';
import { inject, injectable } from 'inversify';

import IRouter from './router';
import { createServer } from '..';

@injectable()
export default class RestServer {
    constructor(
        @inject('routers') private readonly routers: IRouter[],
    ) {}

    async serverFactory() {
        const app = express();

        app.use(express.json());

        const port = Number(process.env.HTTP_SERVER_PORT);

        for (const router of this.routers) {
            const iRouter = await router.loadRouter();
            await app.use(iRouter);
        }

        const server = createServer(port, app);

        server.on('listening', () => {
            console.info(`HTTPS server initialized on ${port}`);
        });
    }
}
