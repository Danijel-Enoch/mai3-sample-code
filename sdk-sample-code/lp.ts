import BigNumber from "bignumber.js"
import { ethers } from "ethers"
import {
  getReaderContract,
  getLiquidityPool,
  getAccountStorage,
  Reader,
} from "@mcdex/mai3.js"

const erc20ABI = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
]

async function getLPExposure(
  reader: Reader,
  liquidityPool: string,
  lp: string
) {
  // since one pool may has multi-perps, lp may has a group of positions
  const result: Array<BigNumber> = []

  const pool = await getLiquidityPool(reader, liquidityPool)
  const shareToken = new ethers.Contract(
    pool.shareToken,
    erc20ABI,
    reader.provider
  )

  // get shares of the LP
  const lpBalance = new BigNumber(
    ((await shareToken.balanceOf(lp)) as ethers.BigNumber).toString()
  )
  const totalLP = new BigNumber(
    ((await shareToken.totalSupply()) as ethers.BigNumber).toString()
  )
  const shares = lpBalance.div(totalLP)

  for (let i = 0; i < pool.perpetuals.size; i++) {
    // read AMM positions, AMM is a reader with the address of liquidity pool
    const account = await getAccountStorage(
      reader,
      liquidityPool,
      i,
      liquidityPool
    )
    const ammPosition = account.positionAmount

    // lp shares the position
    const lpPosition = ammPosition.times(shares)
    result.push(lpPosition)
  }

  return result
}

async function main() {
  // The BSUD pool on BSC
  const liquidityPool = "0xdb282bbace4e375ff2901b84aceb33016d0d663d"
  // The address of liquidity provider
  const lpAddress = "0x41229d33fda2d96300ccdc2cbb1782d749e4a2f7"

  const provider = new ethers.providers.JsonRpcProvider(
    "https://bsc-dataseed.binance.org/"
  )
  const reader = await getReaderContract(provider)

  const lpExposure = await getLPExposure(reader, liquidityPool, lpAddress)

  lpExposure.forEach((value: BigNumber, index: number) =>
    console.log(`LP position of perpetual ${index}: ` + value.toFixed(5))
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
