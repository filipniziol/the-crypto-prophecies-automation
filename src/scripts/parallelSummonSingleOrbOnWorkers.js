
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

const tcpSummonAbi = fs.readFileSync(`./lib/abi/tcpSummon.json`).toString().trim();
const tcpSummonAddress = "0x97da15F6a0397E86D6165220Dd36b8c8E347BAE0";

let tcpSummonContract =  contractFactory.create(tcpSummonAddress,tcpSummonAbi,providerService.webSocketProvider);
const orbId = config.orbId;

const main = async function(){   
    for(let i = 0; i < signerManager.signers.length; i++)
    { 
        const signer = signerManager.nextSigner();
        tcpSummonContract = tcpSummonContract.connect(signer);

        try{
          const tx = await 
            tcpSummonContract.summon(
            orbId, 
            {
              gasPrice: ethers.utils.parseUnits(config.transactionGasPriceInGwei, "gwei"), gasLimit: 320000
            });
          console.log("Orb has been sent to summon", i);
        }
        catch(error){
          console.log("Error occured");
          console.log(error);
        } 
    }
}; 

main()
  .then(() => process.exit(0))
  .catch(error => {
  console.error(error);
  process.exit(1);
});