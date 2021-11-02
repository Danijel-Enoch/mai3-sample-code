// @ts-ignore
import {ethers} from "hardhat";

async function test() {
  const Contract = await ethers.getContractFactory("Account");
  const contract = await Contract.deploy();

  await contract.deployed();
  console.log("Greeter deployed to:", contract.address);
  const {cash, position, availableMargin, margin, settleableMargin, isInitialMarginSafe,
    isMaintenanceMarginSafe, isMarginSafe, targetLeverage} = await contract.callStatic.getAccount(
    "0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13", 0, "0xB4386dfF9838D026Ba28E71B4B5Fa91adf896299")
  console.log("cash " + cash)
  console.log("position " + position)
  console.log("availableMargin " + availableMargin)
  console.log("margin " + margin)
  console.log("settleableMargin " + settleableMargin)
  console.log("isInitialMarginSafe " + isInitialMarginSafe)
  console.log("isMaintenanceMarginSafe " + isMaintenanceMarginSafe)
  console.log("isMarginSafe " + isMarginSafe)
  console.log("targetLeverage " + targetLeverage)
}

test().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})