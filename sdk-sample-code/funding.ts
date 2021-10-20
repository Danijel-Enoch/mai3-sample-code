import {ensureFinished, fromWei, NONE, toWei, USE_TARGET_LEVERAGE} from "./utils";
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
  // @ts-ignore
  const liquidityPool = LiquidityPoolFactory.connect(liquidityPoolAddress, provider)

  // Take perpetualIndex 0 for example: index 3 of perpetualInfo is fundingRate
  const {nums} = await liquidityPool.getPerpetualInfo(0)
  console.log("fundingRate " + fromWei(nums[3].toString()))

  let unitAccumulativeFunding = fromWei(nums[4].toString())
  console.log("unitAccumulativeFunding " + unitAccumulativeFunding)
  console.log("Funding payment = entryFunding - position(1) * unitAccumulativeFunding (" + Number(unitAccumulativeFunding) + "), entryFunding from MarginAccount of MAI3-graph")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
