import { JsonRpcProvider } from "@ethersproject/providers";
import { LiquidityPoolFactory } from '@mcdex/mai3.js';
import { ethers } from 'ethers';
import * as dotenv from "dotenv";
dotenv.config({ path: '~/.env' });

import {
  fromWei,
  toWei,
  NONE,
  USE_TARGET_LEVERAGE,
  ensureFinished,
} from "./utils";

async function setupPosition(liquidityPool: any, trader: any) {
  // setTargetLeverage if leverage is not 5.
  let marginAccount = await liquidityPool.getMarginAccount(0, trader.address)
  let targetLeverage = fromWei(marginAccount.targetLeverage.toString())
  if (targetLeverage != '5.0') {
    await ensureFinished(liquidityPool.connect(trader).setTargetLeverage(0, trader.address, toWei("5")))
    console.log("Set leverage to 5");
  }

  // execute trade(): open position
  await ensureFinished(liquidityPool.connect(trader).trade(0, trader.address, toWei("1"), toWei("4000"), Math.floor(Date.now()/1000)+999999, NONE, USE_TARGET_LEVERAGE))
  console.log("open position")
}

async function remarginFrom5To2(liquidityPool: any, trader: any) {
  // If we want to set leverage from 5 to 2, 30 USDC is Keeper Gas Reward.
  // we already opened a position 1 with 5x leverage.
  let marginAccount = await liquidityPool.getMarginAccount(0, trader.address)
  let position = fromWei(marginAccount.position.toString())
  let margin = fromWei(marginAccount.margin.toString())
  let targetLeverage = fromWei(marginAccount.targetLeverage.toString())
  console.log("should be 1 = ", position)
  console.log("should be 5 = ", targetLeverage)
  console.log("Margin", margin)

  let depositAmount = (Number(margin) - 30) * 5 / 2 - Number(margin)
  await ensureFinished(liquidityPool.connect(trader).deposit(0, trader.address, toWei(depositAmount.toString())))
  console.log("from leverage 5 to 2, depositAmount", depositAmount)

  marginAccount = await liquidityPool.getMarginAccount(0, trader.address)
  position = fromWei(marginAccount.position.toString())
  margin = fromWei(marginAccount.margin.toString())
  targetLeverage = fromWei(marginAccount.targetLeverage.toString())
  console.log("should be 1 = ", position)
  console.log("should be 5 = ", targetLeverage)
  console.log("Margin", margin)

  // then we can set leverage to 2
  await ensureFinished(liquidityPool.connect(trader).setTargetLeverage(0, trader.address, toWei("2")))
  console.log("Set leverage to 2");
}

async function remarginFrom2To10(liquidityPool: any, trader: any) {
  // If we want to set leverage from 2 to 10, 30 USDC is Keeper Gas Reward.
  let marginAccount = await liquidityPool.getMarginAccount(0, trader.address)
  let position = fromWei(marginAccount.position.toString())
  let margin = fromWei(marginAccount.margin.toString())
  let targetLeverage = fromWei(marginAccount.targetLeverage.toString())
  console.log("should be 1 = ", position)
  console.log("should be 2 = ", targetLeverage)
  console.log("Margin", margin)

  let withdrawAmount = Number(margin) - (Number(margin) - 30) * 2 / 10
  await ensureFinished(liquidityPool.connect(trader).withdraw(0, trader.address, toWei(withdrawAmount.toString())))
  console.log("from leverage 2 to 10, withdrawAmount", withdrawAmount)

  marginAccount = await liquidityPool.getMarginAccount(0, trader.address)
  position = fromWei(marginAccount.position.toString())
  margin = fromWei(marginAccount.margin.toString())
  targetLeverage = fromWei(marginAccount.targetLeverage.toString())
  console.log("should be 1 = ", position)
  console.log("should be 2 = ", targetLeverage)
  console.log("Margin", margin)

  // then we can set leverage to 10
  await ensureFinished(liquidityPool.connect(trader).setTargetLeverage(0, trader.address, toWei("10")))
  console.log("Set leverage to 10");
}

async function teardown(liquidityPool: any, trader: any) {
  // execute trade(): close position
  await ensureFinished(liquidityPool.connect(trader).trade(0, trader.address, toWei("-1"), toWei("3000"), Math.floor(Date.now()/1000)+999999, NONE, USE_TARGET_LEVERAGE))
  console.log("close position")
}

async function main() {
  // Get contract ABI, LiquidityPoolAddress
  const liquidityPoolAddress = "0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13"
  const provider = new JsonRpcProvider('https://rinkeby.arbitrum.io/rpc')
  const pk = process.env.PRIVATE_KEY
  if (pk == undefined) {
    console.log("PRIVATE_KEY is undefined")
    return
  }
  // @ts-ignore
  const trader = new ethers.Wallet(pk, provider)
  // @ts-ignore
  const liquidityPool = LiquidityPoolFactory.connect(liquidityPoolAddress, provider)

  await setupPosition(liquidityPool, trader)
  await remarginFrom5To2(liquidityPool, trader)
  await remarginFrom2To10(liquidityPool, trader)
  await teardown(liquidityPool, trader)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
