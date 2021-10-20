// @ts-ignore
import {ethers} from "hardhat";

async function test() {
  const Contract = await ethers.getContractFactory("Remargin");
  const contract = await Contract.deploy();

  await contract.deployed();
  console.log("Greeter deployed to:", contract.address);
}

test().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})