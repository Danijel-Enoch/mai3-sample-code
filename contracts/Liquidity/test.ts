// @ts-ignore
import { ethers } from "hardhat";
import { toWei } from "../../utils/utils";

async function test() {
  const Contract = await ethers.getContractFactory("Funding");
  const contract = await Contract.deploy();

  await contract.deployed();
  console.log("Greeter deployed to:", contract.address);
  await contract.addLiquidity(toWei("100"))
  await contract.removeLiquidity(0, toWei("100"))
}

test().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});