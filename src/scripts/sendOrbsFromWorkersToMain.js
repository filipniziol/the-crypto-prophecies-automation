
'use strict';

const fs = require('fs');
const { ethers } = require('ethers');

const Config = require("../config/config.js");
const ProviderService = require("../provider-service/provider.service.js");
const SignerManager = require("../core/signer-manager");
const WinstonLogger = require("../logger/WinstonLogger.js");
const contractFactory = require("./../utils/contract-factory");

const address = "0x60E3cb3D6dF9b831C3BA3d4E4fEc1525B68141a6";
const config = new Config();
const logger = new WinstonLogger(config);
const providerService = new ProviderService(config,logger);
const signerManager = new SignerManager(1,config.workerAccountCount,[providerService.rpcProviders[0]]);

const tcpOrbsAbi = fs.readFileSync(`./lib/abi/tcpOrbs.json`).toString().trim();
const tcpOrbsAddress = "0x084Aa2372920607196D8AeAEfb2a78cf3D039B6B";
let tcpOrbsContract =  contractFactory.create(tcpOrbsAddress,tcpOrbsAbi,providerService.webSocketProvider);


const main = async function(){   

    for(let i = 0; i < signerManager.signers.length; i++)
    {
      const signer = signerManager.nextSigner();
      tcpOrbsContract = tcpOrbsContract.connect(signer);

      //await delay(1000); 
      console.log("Sending orbs",signer.signer.address);

      const tx = await tcpOrbsContract.safeTransferFrom(
        signer.signer.address, 
        address, 
        config.orbId,
        config.orbCount,
        "0x",
        {
          gasPrice: ethers.utils.parseUnits(config.transactionGasPriceInGwei, "gwei"), gasLimit: 300000
        });

      const txResult = await tx.wait(1);
      console.log(txResult.transactionHash);

      console.log(`${config.orbCount} orbs has been sent to ${address}`);
    }
}; 

main()
  .then(() => process.exit(0))
  .catch(error => {
  console.error(error);
  process.exit(1);
});