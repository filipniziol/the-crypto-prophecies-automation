'use strict';

const fs = require('fs');
const { ethers } = require("ethers");

class ProviderService  {
    #logger;
    app;
    rpcProviders;

    constructor(config,logger) {     
        this.#logger = logger;
        this.rpcProviders = [];

        for(const rpcIndex in config.rpcs){
          const provider = new ethers.providers.JsonRpcProvider(config.rpcs[rpcIndex]);
          this.rpcProviders.push(provider);
        }         
    }
}

module.exports = ProviderService;