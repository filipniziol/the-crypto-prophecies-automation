
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
const mpotAddress = "0x9ECb2e9b098b8254AE58c10E6343c382F4229260";
let mpotContract =  contractFactory.create(mpotAddress,tokenAbi,providerService.rpcProviders[0]);

const tcpSummonAddress = "0x97da15F6a0397E86D6165220Dd36b8c8E347BAE0";

const main = async function(){       

    for(let i = 0; i < signerManager.signers.length; i++)
    {
        const signer = signerManager.nextSigner();

        console.log("Approving address",signer.signer.address);
        mpotContract = mpotContract.connect(signer);

        const txa = await mpotContract.approve(
          tcpSummonAddress, 
          ethers.utils.parseEther(config.MPOT),
          {
            gasPrice: ethers.utils.parseUnits(config.transactionGasPriceInGwei, "gwei"), gasLimit: 300000
          });
  
        const txaResult = await txa.wait(1);

        console.log(txaResult.transactionHash);  

        console.log("The address",signer.signer.address, "has been approved");
    } 
}; 

main()
  .then(() => process.exit(0))
  .catch(error => {
  console.error(error);
  process.exit(1);
});