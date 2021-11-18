import { JsonRpcProvider } from "@ethersproject/providers";
import { ethers } from 'ethers';
import * as dotenv from "dotenv";
dotenv.config({ path: '~/.env' });

import {
  toWei,
  NONE,
  fromWei,
} from "../utils/utils"
import {getLiquidityPool, getReaderContract, LiquidityPoolFactory} from "@mcdex/mai3.js";
import BigNumber from "bignumber.js";
BigNumber.config({ DECIMAL_PLACES: 4 });

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
  const pool = await getLiquidityPool(reader, liquidityPoolAddress)
  const perpetual = pool.perpetuals.get(0)
  if (perpetual == undefined) {
    return
  }

  let markPrice = perpetual.markPrice
  let collateral = new BigNumber(3500)
  let leverage = new BigNumber(5)
  let rPos: BigNumber = (collateral.div(markPrice)).times(leverage.plus(1)) // plus 1 to expand upper bound
  let lPos: BigNumber = collateral.div(markPrice)

  async function searchPos(lPos: BigNumber, rPos: BigNumber, collateral: BigNumber, iteration: number): Promise<string> {
    while (iteration > 0) {
      // l + (r-l)/2 for preventing over flow, instead of (l+r)/2
      let pos = lPos.plus(((rPos.minus(lPos)).div(2)))
      console.log("rPos " + rPos)
      console.log("lPos " + lPos)
      console.log("pos " + pos)
      let res = await liquidityPool.connect(signer).callStatic.queryTrade(0, signer.address, toWei(pos.toString()), NONE, 12800)
      let costBigNumber = new BigNumber(fromWei(res.cost.toString()))
      console.log("costBigNumber " + costBigNumber)

      if (costBigNumber.eq(collateral)) {
        return pos.toString()
      } else if (costBigNumber.gt(collateral)) {
        // means pos too much
        rPos = pos
      } else if (costBigNumber.lt(collateral)) {
        // means pos too small
        lPos = pos
      }
      iteration = iteration - 1
    }
    return lPos.plus(((rPos.minus(lPos)).div(2))).toString()
  }
  let pos = await searchPos(lPos, rPos, collateral, 10)
  console.log("final pos", pos.toString())
}



main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
