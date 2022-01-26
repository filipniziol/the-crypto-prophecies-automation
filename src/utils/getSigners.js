'use strict';

const { NonceManager } = require("@ethersproject/experimental");

const getWallets = require("./../utils/getWallets.js");

function getSigners(startingIndex, numberOfWallets, providers){
    return getWallets(startingIndex, numberOfWallets).map( (wallet,index) =>{
        wallet = new NonceManager(wallet);
        return wallet.connect(providers[index % providers.length]);
    });
}

module.exports = getSigners;