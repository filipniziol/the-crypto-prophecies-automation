'use strict';

const fs = require('fs');

class Config  {
    constructor() {
        const config = JSON.parse(fs.readFileSync("./lib/config/config.json").toString().trim());

        Object.assign(this,config);
    }
}

module.exports = Config;