const hre = require("hardhat")
const ethers = hre.ethers
import {
  fromWei,
  toWei,
  NONE,
  USE_TARGET_LEVERAGE
} from "../utils";

async function setupPosition(liquidityPool: any, trader: any) {
  // setTargetLeverage if you didn't set. 5x Leverage.
  let marginAccount = await liquidityPool.getMarginAccount(0, trader.address)
  let targetLeverage = fromWei(marginAccount.targetLeverage.toString())
  if (targetLeverage != 5) {
    await liquidityPool.connect(trader).setTargetLeverage(0, trader.address, toWei("5"))
    console.log("Set leverage to 5");
  }

  // execute trade(): open position
  await liquidityPool.connect(trader).trade(0, trader.address, toWei("1"), toWei("4000"), Math.floor(Date.now()/1000)+999999, NONE, USE_TARGET_LEVERAGE)
}

async function remarginFrom5To2(liquidityPool: any, trader: any) {
  // If we want to set leverage from 5 to 2, 30 USDC is Keeper Gas Reward.
  // we already opened a position 1 with 5x leverage.
  let marginAccount = await liquidityPool.getMarginAccount(0, trader.address)
  let position = fromWei(marginAccount.position.toString())
  let margin = fromWei(marginAccount.margin.toString())
  let targetLeverage = fromWei(marginAccount.targetLeverage.toString())
  console.log("should be 1 = ", position)
  console.log("should be 5 = ", targetLeverage)
  console.log("Margin", margin)

  let depositAmount = (margin - 30) * 5 / 2 - margin
  console.log("depositAmount", depositAmount)

  await liquidityPool.connect(trader).deposit(0, trader.address, toWei(depositAmount.toString()))
  marginAccount = await liquidityPool.getMarginAccount(0, trader.address)
  position = fromWei(marginAccount.position.toString())
  margin = fromWei(marginAccount.margin.toString())
  targetLeverage = fromWei(marginAccount.targetLeverage.toString())
  console.log("should be 1 = ", position)
  console.log("should be 5 = ", targetLeverage)
  console.log("Margin", margin)

  // then we can set leverage to 2
  await liquidityPool.connect(trader).setTargetLeverage(0, trader.address, toWei("2"))
}

async function remarginFrom2To10(liquidityPool: any, trader: any) {
  // If we want to set leverage from 5 to 2, 30 USDC is Keeper Gas Reward.
  let marginAccount = await liquidityPool.getMarginAccount(0, trader.address)
  let position = fromWei(marginAccount.position.toString())
  let margin = fromWei(marginAccount.margin.toString())
  let targetLeverage = fromWei(marginAccount.targetLeverage.toString())
  console.log("should be 1 = ", position)
  console.log("should be 2 = ", targetLeverage)
  console.log("Margin", margin)

  let depositAmount = margin - (margin - 30) * 2 / 10
  await liquidityPool.connect(trader).withdraw(0, trader.address, toWei(depositAmount.toString()))

  marginAccount = await liquidityPool.getMarginAccount(0, trader.address)
  position = fromWei(marginAccount.position.toString())
  margin = fromWei(marginAccount.margin.toString())
  targetLeverage = fromWei(marginAccount.targetLeverage.toString())
  console.log("should be 1 = ", position)
  console.log("should be 2 = ", targetLeverage)
  console.log("Margin", margin)

  // then we can set leverage to 10
  await liquidityPool.connect(trader).setTargetLeverage(0, trader.address, toWei("10"))
}

async function main() {
  const accounts = await ethers.getSigners()
  const trader = accounts[0]
  // Get contract ABI, LiquidityPoolAddress
  const liquidityPoolABI = require("../../abi/contracts/LiquidityPool.sol/LiquidityPool.json")
  const liquidityPoolAddress = "0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13"
  const liquidityPool = new ethers.Contract(liquidityPoolAddress, liquidityPoolABI.abi, ethers.provider)

  await setupPosition(liquidityPool, trader)
  await remarginFrom5To2(liquidityPool, trader)
  await remarginFrom2To10(liquidityPool, trader)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
