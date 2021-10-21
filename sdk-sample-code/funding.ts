import {ensureFinished, fromWei, NONE, toWei, USE_TARGET_LEVERAGE} from "../utils/utils";
import { JsonRpcProvider } from "@ethersproject/providers";
import { LiquidityPoolFactory, getLiquidityPool, getReaderContract } from '@mcdex/mai3.js';
import * as dotenv from "dotenv";
dotenv.config({ path: '~/.env' });

async function main() {
  // Get contract ABI, LiquidityPoolAddress
  const liquidityPoolAddress = "0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13"
  const provider = new JsonRpcProvider('https://rinkeby.arbitrum.io/rpc')
  // @ts-ignore
  const reader = await getReaderContract(provider)
  const pool = await getLiquidityPool(reader, liquidityPoolAddress)

  // Take perpetualIndex 0 for example:
  const perpetual = pool.perpetuals.get(0)
  if (perpetual == undefined) {
    console.log("perpetual is undefined")
    return
  }
  console.log("fundingRate: " + perpetual.fundingRate.toString())
  const unitAccumulativeFunding = perpetual.unitAccumulativeFunding.toString()
  console.log("unitAccumulativeFunding: " + unitAccumulativeFunding)
  console.log("Funding payment = entryFunding - position(1) * unitAccumulativeFunding (" + unitAccumulativeFunding + "), entryFunding from MarginAccount of MAI3-graph")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
