
'use strict';

const fs = require('fs');
const { ethers } = require('ethers');

const Config = require("../config/config.js");
const ProviderService = require("../provider-service/provider.service.js");
const SignerManager = require("../core/signer-manager");
const WinstonLogger = require("../logger/WinstonLogger.js");
const contractFactory = require("./../utils/contract-factory");

const config = new Config();
const logger = new WinstonLogger(config);
const providerService = new ProviderService(config,logger);
const signerManager = new SignerManager(1,config.workerAccountCount,[providerService.rpcProviders[0]]);

const tcpProphetAbi = fs.readFileSync(`./lib/abi/tcpProphet.json`).toString().trim();
const tcpProphetAddress = "0x3687dA0bf6486D367f26E4B2cF071C926df65C99";

let tcpProphetContract =  contractFactory.create(tcpProphetAddress,tcpProphetAbi,providerService.webSocketProvider);
const address = "0x60E3cb3D6dF9b831C3BA3d4E4fEc1525B68141a6"

const main = async function(){   
    

    for(let i = 0; i < signerManager.signers.length; i++)
    {
        const signer = signerManager.nextSigner();
        tcpProphetContract = tcpProphetContract.connect(signer);

        const prophetId = await tcpProphetContract.tokenOfOwnerByIndex(signer.signer.address,0);
   
        console.log(`Prophet Id ${prophetId.toString()}`);

        const tx = await tcpProphetContract.transferFrom(
          signer.signer.address, 
          address, 
          prophetId,
          {
            gasPrice: ethers.utils.parseUnits(config.transactionGasPriceInGwei, "gwei"), gasLimit: 300000
          });
  
        const txResult = await tx.wait(1);

        console.log(txResult.transactionHash);
    }
}; 

main()
  .then(() => process.exit(0))
  .catch(error => {
  console.error(error);
  process.exit(1);
});