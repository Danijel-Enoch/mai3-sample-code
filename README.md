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
### Contract Sample Code
1. ts-node sdk-sample-code/position.ts: 
   1. Get contract ABI, LiquidityPoolAddress
   2. setTargetLeverage if you didn't set.
   3. positionMain
      1. use queryTrade() to know totalFee, cost before executing trade().
         1. cost ~= (mark price / leverage) + Keeper Gas Reward 
      2. execute trade(): open position
      3. execute trade(): close position
   4. collateralMain
      1. Using collateral to calculate position.
         1. Take 3500 USDC for example: long 3500 USDC
      2. execute trade(): open position
      3. execute trade(): close position

## Example Remargin
### Setup
- liquidityPool (0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13)
- 0 perpetualIndex (ETH-USDC)
- 5x Leverage
- 1 position
### Contract Sample Code
1. ts-node sdk-sample-code/remargin.ts
   1. setup a position 1 with 5x leverage
   2. deposit amount into margin account
   3. set leverage from 5 to 2
   4. withdraw amount from margin account
   5. set leverage from 2 to 10

## Example Funding
### Contract Sample Code
1. ts-node sdk-sample-code/funding.ts
   1. get fundingRate
   2. get unitAccumulativeFunding
   3. get funding payment
      1. get entryFunding from MAI3-graph

