import { JsonRpcProvider } from "@ethersproject/providers";
import { getLiquidityPool, getReaderContract } from '@mcdex/mai3.js';
import * as dotenv from "dotenv";
dotenv.config({ path: '~/.env' });

async function main() {
  const liquidityPoolAddress = "0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13"
  const provider = new JsonRpcProvider('https://rinkeby.arbitrum.io/rpc')

  // @ts-ignore
  const reader = await getReaderContract(provider)
  const pool = await getLiquidityPool(reader, liquidityPoolAddress)

  // Take perpetualIndex 0 for example:
  const perpetual = pool.perpetuals.get(0)
  console.log("perpetual ", perpetual)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
