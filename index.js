import figlet from 'figlet';
import { promisify } from 'util';;

import messageList from './src/data/index.js';
import { Message, MessageHeader, MessageBody } from './src/message/index.js';
import KafkaDataPipe from './src/pipes/kafka.js';

const APP_NAME = process.env.APP_NAME || 'ice_cream_pipeline';
const APP_VERSION = process.env.APP_VERSION || '0.0.1';
const GROUP_ID = process.env.KAFKA_GROUP_ID || 'sherbert_group';
const KAFKA_BOOTSTRAP_SERVER = process.env.KAFKA_BOOTSTRAP_SERVER;
const CLIENT_ID = process.env.KAFKA_CLIENT_ID;

const figletize = promisify(figlet);
const banner = await figletize(`${APP_NAME} v${APP_VERSION}`);
console.log(banner);

/********* MAIN **********/
const kafkaDP = new KafkaDataPipe({ 
    BOOTSTRAP_SERVER: KAFKA_BOOTSTRAP_SERVER, 
    CLIENT_ID, 
    GROUP_ID 
});

function until(timeout) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
}

const messageIterator = messageList.items[Symbol.iterator]();

(async function() {
    let sequenceNo = 0;
    await kafkaDP.open();

    for (let item of messageIterator) {
        console.info('Info: Processing item...', {
            id: item.id,
            name: item.name
        });

        await until(5000);

        const myMessage = new Message(
            new MessageHeader({
                id: item.id,
                eventType: 'create',
                eventName: 'create.ice_cream'
            }),
            new MessageBody({
                ...item,
                sequenceNo
            })
        );
              
        kafkaDP.put({ 
            topic: 'ingress', 
            message:JSON.stringify(myMessage.value())
        });

        sequenceNo++;        
    }
}())
