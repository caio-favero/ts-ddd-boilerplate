import { KafkaProducer } from '55tec_messaging_lib';
import { injectable } from 'inversify';

@injectable()
export default class Producer {
    private producer: KafkaProducer;

    constructor() {
        this.producer = new KafkaProducer();
    }

    async publish(topic: string, message: any) {
        this.producer.sendMessage(topic, message);
    }
}
