'use strict';

const fs = require('fs');
const mnemonic = process.env.SECRET;
const { ethers } = require("ethers");

function getWalletByIndex(index){
    return ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${index.toString()}`);
}

module.exports = getWalletByIndex;