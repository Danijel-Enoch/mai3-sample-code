import {fromWei} from "../utils";

import { JsonRpcProvider } from '@ethersproject/providers'
import { LiquidityPoolFactory } from '@mcdex/mai3.js'

async function main() {
  // Get contract ABI, LiquidityPoolAddress
  const liquidityPoolAddress = "0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13"
  const provider = new JsonRpcProvider('https://rinkeby.arbitrum.io/rpc')
  const liquidityPool = LiquidityPoolFactory.connect(liquidityPoolAddress, provider)

  // Take perpetualIndex 0 for example: index 3 of perpetualInfo is fundingRate
  const {nums} = await liquidityPool.getPerpetualInfo(0)
  console.log("fundingRate " + fromWei(nums[3].toString()))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
