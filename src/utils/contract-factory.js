'use strict';

const { ethers } = require("ethers");

const contractFactory = {
    create: function(address,abi,signerOrProvider){
        return new ethers.Contract(address,abi,signerOrProvider);
    }
}

module.exports = contractFactory;