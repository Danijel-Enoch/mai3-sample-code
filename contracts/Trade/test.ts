// @ts-ignore
import {ethers} from "hardhat";
import {fromWei, NONE, toWei } from "../../utils/utils";

async function test() {
  const Contract = await ethers.getContractFactory("Trade");
  const contract = await Contract.deploy();

  await contract.deployed();
  console.log("Greeter deployed to:", contract.address);
  const { totalFee, cost }  = await contract.callStatic.queryTrade("0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13", 0, toWei("1"), NONE, 12800)
  console.log("totalFee", fromWei(totalFee.toString()))
  console.log("cost " + fromWei(cost.toString()) + " ~= (mark price / leverage) + Keeper Gas Reward")
}

test().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});