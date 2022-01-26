
'use strict';

const fs = require('fs');
const { ethers } = require('ethers');

const Config = require("../config/config.js");
const ProviderService = require("../provider-service/provider.service.js");
const SignerManager = require("../core/signer-manager");
const WinstonLogger = require("../logger/WinstonLogger.js");
const getWallets = require("../utils/getWallets");
const contractFactory = require("./../utils/contract-factory");

const config = new Config();
const logger = new WinstonLogger(config);
const providerService = new ProviderService(config,logger);
const signerManager = new SignerManager(0,1,[providerService.rpcProviders[0]]);
const signer = signerManager.nextSigner();

const addresses = getWallets(1,config.workerAccountCount).map(wallet => {
  return wallet.address;
});

const tokenAbi = fs.readFileSync(`./lib/abi/ERC20.json`).toString().trim();
const tcpAddress = "0x032F85b8FbF8540a92B986d953e4C3A61C76d39E";

const tcpContract =  contractFactory.create(tcpAddress,tokenAbi,signer);

const main = async function(){   


    for(let i = 0; i < addresses.length; i++)
    {
      let tcpBalance = await tcpContract.balanceOf(addresses[i]);

      console.log(`Account ${addresses[i]} has balance of ${ethers.utils.formatEther(tcpBalance)} TCP`);

      if (tcpBalance.isZero()){

        console.log("Sending TCP to", addresses[i]);

        const tx = await tcpContract.transfer(
          addresses[i], 
          ethers.utils.parseEther(config.orbPrice).mul(config.orbCount), 
          {
            gasPrice: ethers.utils.parseUnits(config.transactionGasPriceInGwei, "gwei")
          });

        const txResult = await tx.wait(1);
        console.log(txResult.transactionHash);

        tcpBalance = await tcpContract.balanceOf(addresses[i]);
        console.log(`Account ${addresses[i]} has balance of ${ethers.utils.formatEther(tcpBalance)} TCP`);
      }
    }
}; 

main()
  .then(() => process.exit(0))
  .catch(error => {
  console.error(error);
  process.exit(1);
});