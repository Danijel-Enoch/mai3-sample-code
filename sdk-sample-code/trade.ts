import { JsonRpcProvider } from "@ethersproject/providers";
import { LiquidityPoolFactory } from '@mcdex/mai3.js';
import { ethers } from 'ethers';
import * as dotenv from "dotenv";
dotenv.config({ path: '~/.env' });
import {
  toWei,
  fromWei,
  NONE,
  ensureFinished,
} from "../utils/utils"

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

  // 1. use queryTrade() to know totalFee, cost before executing trade().
  let { tradePrice, totalFee, cost } = await liquidityPool.connect(signer).callStatic.queryTrade(0, signer.address, toWei("1"), NONE, 12800)
  console.log("tradePrice " + fromWei(tradePrice.toString()))
  console.log("totalFee " + fromWei(totalFee.toString()))
  console.log("cost " + fromWei(cost.toString()) + " ~= (mark price / leverage) + Keeper Gas Reward")

  // 2. execute trade(): open position with 1 leverage
  await ensureFinished(liquidityPool.connect(signer).trade(0, signer.address, toWei("1"), toWei("4500"), Math.floor(Date.now()/1000)+999999, NONE, 12800))
  console.log("open position with 1 leverage")

  // 3. execute trade(): close position with 1 leverage
  await ensureFinished(liquidityPool.connect(signer).trade(0, signer.address, toWei("-1"), toWei("3000"), Math.floor(Date.now()/1000)+999999, NONE, 12800))
  console.log("close position with 1 leverage")

  // 4. execute trade(): open position with 2 leverage
  await ensureFinished(liquidityPool.connect(signer).trade(0, signer.address, toWei("1"), toWei("4500"), Math.floor(Date.now()/1000)+999999, NONE, 25600))
  console.log("open position with 2 leverage")

  // 5. execute trade(): close position with 2 leverage
  await ensureFinished(liquidityPool.connect(signer).trade(0, signer.address, toWei("-1"), toWei("3000"), Math.floor(Date.now()/1000)+999999, NONE, 25600))
  console.log("close position with 2 leverage")

  await ensureFinished(liquidityPool.connect(signer).deposit(0, signer.address, toWei("1000")))
  console.log("deposit 1000 into MarginAccount")
  // 6. execute trade(): open position without automatically deposit.
  await ensureFinished(liquidityPool.connect(signer).trade(0, signer.address, toWei("1"), toWei("4500"), Math.floor(Date.now()/1000)+999999, NONE, 0))
  console.log("open position without automatically deposit")

  // 7. execute trade(): close position without automatically withdraw.
  await ensureFinished(liquidityPool.connect(signer).trade(0, signer.address, toWei("-1"), toWei("3000"), Math.floor(Date.now()/1000)+999999, NONE, 0))
  console.log("close position without automatically withdraw")

  // 8. execute trade(): market price with 1 leverage
  await ensureFinished(liquidityPool.connect(signer).trade(0, signer.address, toWei("1"), toWei("3000"), Math.floor(Date.now()/1000)+999999, NONE, 0x40000000+12800))
  console.log("market price with 1 leverage")

  // 9. execute trade(): close only
  await ensureFinished(liquidityPool.connect(signer).trade(0, signer.address, toWei("-1"), toWei("3000"), Math.floor(Date.now()/1000)+999999, NONE, 0x80000000+12800))
  console.log("close only")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
