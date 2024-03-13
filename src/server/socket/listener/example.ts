import { Socket } from 'socket.io';
import { injectable } from 'inversify';

@injectable()
export default class ExampleRouter {
    async loadListeners(socket: Socket) {
        socket.on('example', () => console.log('hello'));
    }
}
