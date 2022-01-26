'use strict';

const winston = require('winston');
require('winston-daily-rotate-file');

const logConfiguration = {
    transports: [
        new winston.transports.DailyRotateFile({
            filename: "./log/log-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxFiles: '14d'
        })
    ],
    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss.SSS",
        }),
        winston.format.printf(info => `${[info.timestamp]}: ${info.message}`)
    )
};

function createLogConfiguration(config){
    if(config.logToConsole){
        logConfiguration.transports.push(new winston.transports.Console());
    }
}

class WinstonLogger{
    logger;

    constructor(config){
        createLogConfiguration(config);
        this.logger = winston.createLogger(logConfiguration);
    }

    log(message){
        this.logger.info(message);
    }    
}

module.exports = WinstonLogger;




