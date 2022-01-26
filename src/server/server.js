'use strict';

const delay = require('./../utils/delay.js');

class Server  {
    constructor(logger){
        this.logger = logger;
    }

    async start(delayInMilliseconds){
        while (1){
            this.logger.log(`Server heartbeat`);
    
            await delay(30000);        
        }
    }
}

module.exports = Server;