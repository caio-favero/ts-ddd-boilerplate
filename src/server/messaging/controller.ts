import { injectable, inject } from 'inversify';

import MessagingProducer from './producer';

@injectable()
export default class Controller {
    constructor(
        @inject(MessagingProducer) private readonly producer: MessagingProducer,
    ) {}

    example() {
        this.producer.publish('example.response', 'hi');
    }
}
