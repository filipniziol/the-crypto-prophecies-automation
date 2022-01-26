const getSigners = require("./../utils/getSigners");

class SignerManager {

    signers;
    currentTransaction;

    constructor(startingIndex, numberOfWallets, providers){
        this.signers = getSigners(startingIndex,numberOfWallets,providers);
        this.currentTransaction = 0;
    }

    nextSigner(){
        const signer = this.signers[this.currentTransaction % this.signers.length];
        this.currentTransaction++;

        return signer;
    }
}

module.exports = SignerManager;