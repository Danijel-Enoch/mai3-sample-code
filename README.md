# MCDEX Sample Code
## Setup
1. npm install
2. `cp .env.example ./.env`
   1. edit your private key
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
   2. set leverage from 5 to 2
   3. deposit amount into margin account
