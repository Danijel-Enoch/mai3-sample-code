import { JsonRpcProvider } from "@ethersproject/providers";
import { getReaderContract } from '@mcdex/mai3.js';
import * as dotenv from "dotenv";
import {ethers} from "ethers";
dotenv.config({ path: '~/.env' });

async function main() {
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
  const reader = await getReaderContract(provider)
  const account = await reader.callStatic.getAccountStorage(liquidityPoolAddress, 0, trader.address)
  console.log("account " + account)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
