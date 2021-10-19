import {ensureFinished, fromWei, NONE, toWei, USE_TARGET_LEVERAGE} from "../utils";
import { JsonRpcProvider } from "@ethersproject/providers";
import { LiquidityPoolFactory } from '@mcdex/mai3.js';
import { ethers } from 'ethers';
import * as dotenv from "dotenv";
dotenv.config({ path: '~/.env' });

async function main() {
  // Get contract ABI, LiquidityPoolAddress
  const liquidityPoolAddress = "0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13"
  const provider = new JsonRpcProvider('https://rinkeby.arbitrum.io/rpc')
  const pk = process.env.PRIVATE_KEY
  if (pk == undefined) {
    console.log("PRIVATE_KEY is undefined")
    return
  }
  const trader = new ethers.Wallet(pk, provider)
  const liquidityPool = LiquidityPoolFactory.connect(liquidityPoolAddress, provider)

  // Take perpetualIndex 0 for example: index 3 of perpetualInfo is fundingRate
  const {nums} = await liquidityPool.getPerpetualInfo(0)
  console.log("fundingRate " + fromWei(nums[3].toString()))

  // execute trade(): open position
  await ensureFinished(liquidityPool.connect(trader).trade(0, trader.address, toWei("1"), toWei("4000"), Math.floor(Date.now()/1000)+999999, NONE, USE_TARGET_LEVERAGE))
  console.log("open position")

  let marginAccount = await liquidityPool.getMarginAccount(0, trader.address)
  let position = fromWei(marginAccount.position.toString())
  console.log("should be 1 = ", position)
  let unitAccumulativeFunding = fromWei(nums[4].toString())
  console.log("unitAccumulativeFunding " + unitAccumulativeFunding)
  console.log("Funding payment = entryFunding - position * unitAccumulativeFunding (" + Number(position)*Number(unitAccumulativeFunding) + "), entryFunding from MarginAccount of MAI3-graph")
  // execute trade(): close position
  await ensureFinished(liquidityPool.connect(trader).trade(0, trader.address, toWei("-1"), toWei("3000"), Math.floor(Date.now()/1000)+999999, NONE, USE_TARGET_LEVERAGE))
  console.log("close position")

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
