import 'reflect-metadata';

import { injectable } from 'inversify';
import { Socket } from 'socket.io';

@injectable()
export abstract class IListener {
    abstract loadListeners(socket: Socket): void;
}
