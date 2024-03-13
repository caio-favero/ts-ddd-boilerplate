import { KafkaConsumer } from '55tec_messaging_lib';
import { inject, injectable } from 'inversify';

import Controller from './controller';

@injectable()
export default class Consumer {
    consumer: KafkaConsumer;

    constructor(
        @inject(Controller) private readonly controller: Controller,
    ) {
        this.consumer = new KafkaConsumer();
    }

    private on(topic: string, handle: (...params: any[]) => (void)) {
        this.consumer.startConsumer([topic], (params) => {
            handle(params.message);
        });
    }

    async loadConsumers() {
        this.on('example', this.controller.example.bind(this.controller));
    }
}
