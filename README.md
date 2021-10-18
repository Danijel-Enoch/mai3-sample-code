# MCDEX Sample Code
## Setup
1. npm install
2. `cp .env.example ./.env`
   1. edit your private key
3. update hardhat.config.ts
   1. edit network (Example is using arb-rinkeby, pool 0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13)
## Sample Code (Take Arb-Rinkeby for example)
## Example Position
### Setup
- liquidityPool (0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13)
- 0 perpetualIndex (ETH-USDC)
- 5x Leverage 
- 1 position
### Contract Sample Code
1. /src/position/contract-sample-code.ts: 
   1. Get contract ABI, LiquidityPoolAddress
   2. setTargetLeverage if you didn't set.
   3. use queryTrade() to know totalFee, cost before executing trade().
      1. cost ~= (mark price / leverage) + Keeper Gas Reward 
   4. execute trade(): open position
   5. execute trade(): close position

## Example Remargin
### Setup
- liquidityPool (0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13)
- 0 perpetualIndex (ETH-USDC)
- 5x Leverage
- 1 position
### Contract Sample Code
1. /src/remargin/contract-sample-code.ts
   1. setup a position 1 with 5x leverage
   2. deposit amount into margin account
   3. set leverage from 5 to 2
   4. withdraw amount from margin account
   5. set leverage from 2 to 10

## Example Funding
### Contract Sample Code
1. /src/funding/contract-sample-code.ts
   1. get fundingRate

