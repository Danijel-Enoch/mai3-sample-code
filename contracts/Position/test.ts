// @ts-ignore
import {ethers} from "hardhat";
import {fromWei, NONE, toWei, USE_TARGET_LEVERAGE} from "../../utils/utils";

async function test() {
  const Contract = await ethers.getContractFactory("Position");
  const contract = await Contract.deploy();

  await contract.deployed();
  console.log("Greeter deployed to:", contract.address);
  await contract.setTargetLeverage("0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13", 0, toWei("5"))
  console.log("setTargetLeverage to 5")
  const { totalFee, cost }  = await contract.callStatic.queryTrade("0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13", 0, toWei("1"), NONE, USE_TARGET_LEVERAGE)
  console.log("totalFee", fromWei(totalFee.toString()))
  console.log("cost " + fromWei(cost.toString()) + " ~= (mark price / leverage) + Keeper Gas Reward")
  const {cash, position, availableMargin, margin, settleableMargin } = await contract.callStatic.getMarginAccountFirst("0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13", 0)
  console.log("cash: ", fromWei(cash.toString()))
  console.log("position: ", fromWei(position.toString()))
  console.log("availableMargin: ", fromWei(availableMargin.toString()))
  console.log("margin: ", fromWei(margin.toString()))
  console.log("settleableMargin: ", fromWei(settleableMargin.toString()))
  const {isInitialMarginSafe, isMaintenanceMarginSafe, isMarginSafe, targetLeverage} = await contract.callStatic.getMarginAccountSecond("0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13", 0)
  console.log("isInitialMarginSafe: ", isInitialMarginSafe)
  console.log("isMaintenanceMarginSafe: ", isMaintenanceMarginSafe)
  console.log("isMarginSafe: ", isMarginSafe)
  console.log("targetLeverage: ", fromWei(targetLeverage.toString()))
}

test().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});