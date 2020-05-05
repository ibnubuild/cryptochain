const PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-c7a53fcf-0737-4a48-a537-f5d91fa8e078',
    subscribeKey: 'sub-c-cf1b4014-8e87-11ea-927a-2efbc014b69f',
    secretKey: 'sec-c-MjllM2QxYzgtM2IxOC00MjM2LWJiOWEtNjQ2YzYxM2M1YTlj'
};

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
};

class PubSub {
    constructor({ blockchain }) {
        this.blockchain = blockchain;
        this.pubnub = new PubNub(credentials);

        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

        this.pubnub.addListener(this.listener());
    }

    broadcastChain() {
        this.publish({
          channel: CHANNELS.BLOCKCHAIN,
          message: JSON.stringify(this.blockchain.chain)
        });
      }

    subscribeToChannels() {
        this.pubnub.subscribe({
          channels: [Object.values(CHANNELS)]
        });
      }

    listener(){
        return {
            message: messageObject => {
                const { channel, message } = messageObject;

                console.log(`Message received. Channel: ${channel}. Message: ${message}.`);
                const parsedMessage = JSON.parse(message);

                if (channel === CHANNELS.BLOCKCHAIN) {
                    this.blockchain.replaceChain(parsedMessage);
                }
            }
        }
    };

    publish({ channel, message }) {
        this.pubnub.publish({ channel, message});
    }
}

// const testPubSub = new PubSub();
// testPubSub.publish({ channel: CHANNELS.TEST, message: 'hello pubnub' });

module.exports = PubSub;