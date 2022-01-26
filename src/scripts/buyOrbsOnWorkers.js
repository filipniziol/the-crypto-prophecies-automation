
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

const tokenAbi = fs.readFileSync(`./lib/abi/ERC20.json`).toString().trim();
const tcpAddress = "0x032F85b8FbF8540a92B986d953e4C3A61C76d39E";
let tcpContract =  contractFactory.create(tcpAddress,tokenAbi,providerService.rpcProviders[0]);

const saleAbi = fs.readFileSync(`./lib/abi/tcpSale.json`).toString().trim();
const saleAddress = "0x449bFfFE4554910C3D72C7c071f4C68fe195dbFf";

let saleContract =  contractFactory.create(saleAddress,saleAbi,providerService.rpcProviders[0]);

const main = async function(){   

    for(let i = 0; i < signerManager.signers.length; i++)
    {
      const signer = signerManager.nextSigner();
      tcpContract = tcpContract.connect(signer);

      console.log("Approving address",saleAddress);

      const txa = await tcpContract.approve(
        saleAddress, 
        ethers.utils.parseEther(config.orbPrice).mul(config.orbCount),
        {
          gasPrice: ethers.utils.parseUnits(config.transactionGasPriceInGwei, "gwei"), gasLimit: 300000
        });

      const txaResult = await txa.wait(1);
      console.log(txaResult.transactionHash);

      saleContract = saleContract.connect(signer);

      console.log("Purchasing orbs",signer.signer.address);

      const tx = await saleContract.purchase(
        "084aa2372920607196d8aeaefb2a78cf3d039b6b", 
        config.orbId, 
        config.orbCount,
        {
          gasPrice: ethers.utils.parseUnits(config.transactionGasPriceInGwei, "gwei"), gasLimit: 300000
        });

      const txResult = await tx.wait(1);
      console.log(txResult.transactionHash);

      console.log(`${config.orbCount} orb has been bought by ${signer.signer.address}`);
    }
}; 

main()
  .then(() => process.exit(0))
  .catch(error => {
  console.error(error);
  process.exit(1);
});