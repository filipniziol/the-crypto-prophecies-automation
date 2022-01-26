'use strict';

const moment = require('moment');

class ConsoleLogger  {
    log(message){
        console.log(`${moment().format("YYYY-MM-DD hh:mm:ss")}: ${message}`);
    }
}

module.exports = ConsoleLogger;