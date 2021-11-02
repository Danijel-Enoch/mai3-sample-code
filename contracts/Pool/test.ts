// @ts-ignore
import {ethers} from "hardhat";

async function test() {
  const Contract = await ethers.getContractFactory("Pool");
  const contract = await Contract.deploy();

  await contract.deployed();
  console.log("Greeter deployed to:", contract.address);
  const {isRunning, isFastCreationEnabled, addresses, intNums, uintNums} = await contract.callStatic.getPool(
    "0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13")
  console.log("isRunning: " + isRunning)
  console.log("isFastCreationEnabled " + isFastCreationEnabled)
  console.log("addresses " + addresses)
  console.log("intNums " + intNums)
  console.log("uintNums " + uintNums)
}

test().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})