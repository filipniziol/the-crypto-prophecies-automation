const { ethers } = require('ethers');

const Config = require("../config/config.js");
const ProviderService = require("../provider-service/provider.service.js");
const WinstonLogger = require("../logger/WinstonLogger.js");
const getWallets = require("../utils/getWallets");

const config = new Config();
const logger = new WinstonLogger(config);
const providerService = new ProviderService(config,logger);

const addresses = getWallets(0,1 + config.workerAccountCount).map(wallet => {
  return wallet.address;
});


const main = async function(){  
    let totalBalance = ethers.BigNumber.from("0");

    for(let i = 0; i < addresses.length; i++)
    {
      const balance = await providerService.rpcProviders[0].getBalance(addresses[i]);
      totalBalance = totalBalance.add(balance);

      console.log(`Account ${i} with address ${addresses[i]} has balance of ${ethers.utils.formatEther(balance)} MATIC`);
    }

    console.log(`Total account balance of ${ethers.utils.formatEther(totalBalance)} MATIC`);
  }; 

main()
.then(() => process.exit(0))
.catch(error => {
console.error(error);
process.exit(1);
});