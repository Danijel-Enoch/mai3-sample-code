import {fromWei} from "../utils";

const hre = require("hardhat")
const ethers = hre.ethers

async function main() {
  // Get contract ABI, LiquidityPoolAddress
  const liquidityPoolABI = require("../../abi/contracts/LiquidityPool.sol/LiquidityPool.json")
  const liquidityPoolAddress = "0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13"
  const liquidityPool = new ethers.Contract(liquidityPoolAddress, liquidityPoolABI.abi, ethers.provider)

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
