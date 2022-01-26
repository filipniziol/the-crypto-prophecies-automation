
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

const tcpProphetAbi = fs.readFileSync(`./lib/abi/tcpProphet.json`).toString().trim();
const tcpProphetAddress = "0x3687dA0bf6486D367f26E4B2cF071C926df65C99";

const tcpProphetContract =  contractFactory.create(tcpProphetAddress,tcpProphetAbi,signer);

const blackListed = [50,10000];

const main = async function(){  
  
    const maxBatchCount = 50;
    let batchNr = 0;
    
    for(let rarity = config.upgradeMinRarity; rarity < config.upgradeMaxRarity; rarity++){

      let prophetCount = await tcpProphetContract.balanceOf(address);     
      console.log(`Prophet count: ${prophetCount}`);
  
      let prophets = [];
      for(let i = 0; i < prophetCount; i++){
        console.log(`Getting prophet ${i}`);

        const prophetId = await tcpProphetContract.tokenOfOwnerByIndex(address,i);
        const prophetDetail = await tcpProphetContract.prophets(prophetId);

        const prophet = {
          prophetId: parseInt(prophetId.toString()),
          rarity: prophetDetail.rarity,
          race: prophetDetail.race
        };

        if(prophet.rarity === rarity){
          prophets.push(prophet);
        }
      }

      for(let race = 0; race < 4; race++){
        console.log(`Getting rarity and race for rarity ${rarity} and race ${race}`);
        const sameRarityAndRace = prophets.filter(prophet => prophet.rarity === rarity && prophet.race === race && !blackListed.includes(prophet.prophetId));

        let i, j, batchToUpgrade, chunk = 5;
        for (i = 0, j = sameRarityAndRace.length; i < j && sameRarityAndRace.length >= chunk; i += chunk) {
          batchToUpgrade = sameRarityAndRace.slice(i, i + chunk).map(prophet => { return prophet.prophetId });
          if(batchToUpgrade.length === 5){
            console.log(`Sending batch ${batchNr} to upgrade`);
            console.log(batchToUpgrade);

            const tx = await tcpSummonContract.upgradeProphet(
            batchToUpgrade, 
            {
              gasPrice: ethers.utils.parseUnits(config.transactionGasPriceInGwei, "gwei"), gasLimit: 500000
            });
 
            const txResult = await tx.wait(1);
            console.log(`Batch has been sent to upgrade. Transaction hash ${txResult.transactionHash}`);
            batchNr++;

            if(batchNr === maxBatchCount){
              return;
            }
          }
        }

      }

      console.log(`Waiting 60 seconds for new rarity...`); 
      await delay(60000); 
    }        
}; 

main()
  .then(() => process.exit(0))
  .catch(error => {
  console.error(error);
  process.exit(1);
});