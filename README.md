# The scripts to automate buing, summoning and upgrading the NFT of The Crypto Prophecies game

## Installation

1. Download the project
2. Run npm install within src folder
3. Create a SECRET environment variable with your mnemonic phrase.

## Usage

In order to exacute an action you will need to change setup configuration in the lib/config/config.json file

### Summon all the orbs of the specific type

1. Set the following variables in the config file:
- 'transactionGasPriceInGwei' - the gas price
- 'orbId' - the id of the orb (111 - common prophet, 121 - uncommon prophet) 
2. Run the script 'scripts/summonAllOrbsOnMain.js'

### Upgrade all the prophets from the selected rarity up the ladder 

1. Set the following variables in the config file:
- 'transactionGasPriceInGwei' - the gas price
- 'upgradeMinRarity' - starting rarity (0 - common, 1 - uncommon etc.)
- 'upgradeMaxRarity' - max rarity. For example you may want upgrade commons to rares. The setup will be upgradeMinRarity = 0 and upgradeMaxRarity = 2.
2. Run the script 'scripts/upgradeProphetsOnMain.js'

### Send TCP and MPOT from main account to workers, buy the orbs, send the orbs to main

1. Set the following variables in the config file:
- 'transactionGasPriceInGwei' - the gas price
- 'orbCount' - number of orbs to be bought on each worker
- 'orbPrice' - the price of the single orb
- 'workerAccountCount' - number of workers
2. Run the scripts:
- 'scripts/sendTcpToWorkers.js'
- 'scripts/buyOrbsOnWorkers.js'
- 'scripts/sendOrbsFromWorkersToMain.js'

## Send TCP and MPOT from main account to workers, buy the single orb, parallel summon the single orb on worker, send the prophet to main

1. Set the following variables in the config file:
- 'transactionGasPriceInGwei' - the gas price
- 'orbCount' = 1
- 'orbPrice' - the price of the single orb
- 'workerAccountCount' - number of workers
- 'MPOT' - MPOT needed for summoning
2. Run the scripts:
- 'scripts/sendTcpAndMpotToWorkers'
- 'scripts/buyOrbsOnWorkers'
- 'scripts/approveMpotOnWorkersForParallelSummon'
- 'scripts/parallelSummonSingleOrbOnWorkers'
- 'scripts/transferProphetsFromWorkersToMain'

