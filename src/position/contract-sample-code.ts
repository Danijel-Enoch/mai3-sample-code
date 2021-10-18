const hre = require("hardhat")
const ethers = hre.ethers
import {
  toWei,
  fromWei,
  NONE,
  USE_TARGET_LEVERAGE
} from "../utils"

// Take Arb-Rinkeby LiquidityPool (0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13) for example.
async function main() {
  const accounts = await ethers.getSigners()
  const trader = accounts[0]
  // 1. Get contract ABI, LiquidityPoolAddress
  const liquidityPoolABI = require("../../abi/contracts/LiquidityPool.sol/LiquidityPool.json")
  const liquidityPoolAddress = "0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13"
  const liquidityPool = new ethers.Contract(liquidityPoolAddress, liquidityPoolABI.abi, ethers.provider)

  // take perpetualIndex 0 (ETH-USD) for example:
  // 2. setTargetLeverage if you didn't set. 5x Leverage.
  let marginAccount = await liquidityPool.getMarginAccount(0, trader.address)
  let targetLeverage = fromWei(marginAccount.targetLeverage.toString())
  if (targetLeverage != 5) {
    await liquidityPool.connect(trader).setTargetLeverage(0, trader.address, toWei("5"))
    console.log("Set leverage to 5");
  }

  // 3. use queryTrade() to know totalFee, cost before executing trade().
  // POSITION = 1
  let { _, totalFee, cost } = await liquidityPool.connect(trader).callStatic.queryTrade(0, trader.address, toWei("1"), NONE, USE_TARGET_LEVERAGE)
  console.log("totalFee", fromWei(totalFee.toString()))
  console.log("cost", fromWei(cost.toString()))

  // 4. execute trade(): open position
  await liquidityPool.connect(trader).trade(0, trader.address, toWei("1"), toWei("4000"), Math.floor(Date.now()/1000)+999999, NONE, USE_TARGET_LEVERAGE)

  // 5. execute trade(): close position
  await liquidityPool.connect(trader).trade(0, trader.address, toWei("-1"), toWei("3500"), Math.floor(Date.now()/1000)+999999, NONE, USE_TARGET_LEVERAGE)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
