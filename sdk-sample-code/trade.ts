import { JsonRpcProvider } from "@ethersproject/providers";
import { getReaderContract, LiquidityPoolFactory } from '@mcdex/mai3.js';
import { ethers } from 'ethers';
import * as dotenv from "dotenv";
dotenv.config({ path: '~/.env' });
import {
  toWei,
  fromWei,
  NONE,
  ensureFinished,
} from "../utils/utils"
import { BigNumber } from 'bignumber.js';

async function main() {
  const liquidityPoolAddress = "0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13"
  const provider = new JsonRpcProvider('https://rinkeby.arbitrum.io/rpc')

  const pk = process.env.PRIVATE_KEY
  if (pk == undefined) {
    console.log("PRIVATE_KEY is undefined")
    return
  }
  // @ts-ignore
  const signer = new ethers.Wallet(pk, provider)
  // @ts-ignore
  const liquidityPool = LiquidityPoolFactory.connect(liquidityPoolAddress, provider)

  // @ts-ignore
  const reader = await getReaderContract(provider)
  // 1. use queryTrade() to know totalFee, cost before executing trade() with 1x leverage
  let { tradePrice, totalFee, cost } = await reader.callStatic.queryTrade(liquidityPool.address, 0, signer.address, toWei("1"), NONE, 12800)
  console.log("tradePrice " + fromWei(tradePrice.toString()))
  console.log("totalFee " + fromWei(totalFee.toString()))
  console.log("cost " + fromWei(cost.toString()) + " ~= (mark price / leverage) + Keeper Gas Reward")

  let tradePriceBigNumber = new BigNumber(tradePrice.toString())
  console.log("tradePriceBigNumber", tradePriceBigNumber.toFixed(0))
  let openProductBy = new BigNumber(1.002)
  let closeProductBy = new BigNumber(0.998)
  let openTradePrice = tradePriceBigNumber.times(openProductBy)
  let closeTradePrice = tradePriceBigNumber.times(closeProductBy)
  console.log("openTradePrice", openTradePrice.toFixed(0), "closeTradePrice", closeTradePrice.toFixed(0))

  // 2. execute trade(): open position with 1x leverage
  await ensureFinished(liquidityPool.connect(signer).trade(0, signer.address, toWei("1"), openTradePrice.toFixed(0), Math.floor(Date.now()/1000)+999999, NONE, 12800))
  console.log("open position with 1x leverage")

  // 3. execute trade(): close position
  await ensureFinished(liquidityPool.connect(signer).trade(0, signer.address, toWei("-1"), closeTradePrice.toFixed(0), Math.floor(Date.now()/1000)+999999, NONE, 12800))
  console.log("close position")

  // 4. execute trade(): open position with 2x leverage
  await ensureFinished(liquidityPool.connect(signer).trade(0, signer.address, toWei("1"), openTradePrice.toFixed(0), Math.floor(Date.now()/1000)+999999, NONE, 25600))
  console.log("open position with 2x leverage")

  // 5. execute trade(): close position
  await ensureFinished(liquidityPool.connect(signer).trade(0, signer.address, toWei("-1"), closeTradePrice.toFixed(0), Math.floor(Date.now()/1000)+999999, NONE, 25600))
  console.log("close position")

  await ensureFinished(liquidityPool.connect(signer).deposit(0, signer.address, toWei("1000")))
  console.log("deposit 1000 into MarginAccount")
  // 6. execute trade(): open position without automatically deposit.
  await ensureFinished(liquidityPool.connect(signer).trade(0, signer.address, toWei("1"), openTradePrice.toFixed(0), Math.floor(Date.now()/1000)+999999, NONE, 0))
  console.log("open position without automatically deposit")

  // 7. execute trade(): close position without automatically withdraw.
  await ensureFinished(liquidityPool.connect(signer).trade(0, signer.address, toWei("-1"), closeTradePrice.toFixed(0), Math.floor(Date.now()/1000)+999999, NONE, 0))
  console.log("close position without automatically withdraw")

  // 8. execute trade(): market price with 1x leverage
  await ensureFinished(liquidityPool.connect(signer).trade(0, signer.address, toWei("1"), openTradePrice.toFixed(0), Math.floor(Date.now()/1000)+999999, NONE, 0x40000000+12800))
  console.log("market price with 1x leverage")

  // 9. execute trade(): close only
  await ensureFinished(liquidityPool.connect(signer).trade(0, signer.address, toWei("-1"), closeTradePrice.toFixed(0), Math.floor(Date.now()/1000)+999999, NONE, 0x80000000+12800))
  console.log("close only")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
