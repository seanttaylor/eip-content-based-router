import figlet from 'figlet';
import { promisify } from 'util';;

import KafkaDataPipe from './src/pipes/kafka.js';

const APP_NAME = process.env.APP_NAME || 'message-router';
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

(async function() {
    await kafkaDP.open();
    kafkaDP.onPull({ 
        topic: 'ingress', 
        onMessage: async({ message }) => {
            try {
                const incomingMessage = JSON.parse(message.value.toString());
                const { payload } = incomingMessage;

                console.info('Info: Routing message...', {
                    id: payload.id,
                    sequenceNo: payload.sequenceNo
                });

                if (payload.dietary_certifications.includes('Kosher')) {
                    kafkaDP.put({ 
                        topic: 'kosher', 
                        message:JSON.stringify(payload)
                    });
                    return;
                }

                kafkaDP.put({ 
                    topic: 'trefa', 
                    message:JSON.stringify(payload)
                });

            } catch(e) {
                console.error(e);
            }
        }
    });
}());
