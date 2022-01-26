
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
const signerManager = new SignerManager(0,1,[providerService.rpcProviders[0]]);
const signer = signerManager.nextSigner();

async function delay(ms) {
  // return await for better async stack trace support in case of errors.
  return await new Promise(resolve => setTimeout(resolve, ms));
}

const address = signer.signer.address;

const tcpSummonAbi = fs.readFileSync(`./lib/abi/tcpSummon.json`).toString().trim();
const tcpSummonAddress = "0x97da15F6a0397E86D6165220Dd36b8c8E347BAE0";

const tcpSummonContract =  contractFactory.create(tcpSummonAddress,tcpSummonAbi,signer);
const orbId = config.orbId;

const tcpOrbsAbi = fs.readFileSync(`./lib/abi/tcpOrbs.json`).toString().trim();
const tcpOrbsAddress = "0x084Aa2372920607196D8AeAEfb2a78cf3D039B6B";
let tcpOrbsContract =  contractFactory.create(tcpOrbsAddress,tcpOrbsAbi,providerService.rpcProviders[0]);

const main = async function(){   
    const numberOfOrbs = await tcpOrbsContract.balanceOf(address,orbId);
    console.log(`Number of orbs: ${numberOfOrbs}`);

    for(let i = 0; i < numberOfOrbs; i++)
    {
        let isBeingSummoned = await tcpSummonContract.isSummoning(signer.signer.address,orbId);
        let seconds = 0;
        while(isBeingSummoned){
          await delay(1000); 
          seconds++;
          isBeingSummoned = await tcpSummonContract.isSummoning(signer.signer.address,orbId);
          console.log(`Waiting ${seconds} seconds...`);        
        } 
        try{
          const tx = await tcpSummonContract.summon(
            orbId, 
            {
              gasPrice: ethers.utils.parseUnits(config.transactionGasPriceInGwei, "gwei"), gasLimit: 320000
            });
    
          const txResult = await tx.wait(1);
          console.log(txResult.transactionHash);
    
          console.log("Orb has been summoned", i);
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