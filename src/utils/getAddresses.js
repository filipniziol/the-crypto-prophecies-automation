'use strict';

const getWallets = require("./getWallets");

function getAddresses(startingIndex, numberOfWallets){
    return getWallets(startingIndex, numberOfWallets).map(wallet => {
        return wallet.address;
    });
}

module.exports = getAddresses;
