# MCDEX Sample Code
## Setup
1. npm install
2. `cp .env.example ~/.env`
   1. edit your private key
## Sample Code (Take Arb-Rinkeby for example)
## Example Position
### Setup
- liquidityPool (0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13)
- 0 perpetualIndex (ETH-USDC)
- 5x Leverage 
### Typescript Sample Code
1. ts-node sdk-sample-code/position.ts: 
   1. setup
   2. setTargetLeverage if you didn't set.
   3. positionMain
      1. use queryTrade() to know totalFee, cost before executing trade().
         1. cost ~= (mark price / leverage) + Keeper Gas Reward 
      2. execute trade(): open position
      3. execute trade(): close position
   4. collateralMain
      1. use collateral to calculate position.
         1. Take 3500 USDC for example: long 3500 USDC
      2. execute trade(): open position
      3. execute trade(): close position

## Example Remargin
### Setup
- liquidityPool (0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13)
- 0 perpetualIndex (ETH-USDC)
- 1 position
### Typescript Sample Code
1. ts-node sdk-sample-code/remargin.ts
   1. setup a position 1
   2. calculate margin with target leverage
   3. deposit/withdraw amount into margin account

## Example Funding
### Typescript Sample Code
1. ts-node sdk-sample-code/funding.ts
   1. get fundingRate
   2. get unitAccumulativeFunding
   3. calculate funding payment
      1. need to get entryFunding from MAI3-graph
