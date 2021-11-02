// @ts-ignore
import {ethers} from "hardhat";

async function test() {
  const Contract = await ethers.getContractFactory("Perpetual");
  const contract = await Contract.deploy();

  await contract.deployed();
  console.log("Greeter deployed to:", contract.address);
  const {state, oracle, nums } = await contract.callStatic.getPerpetual(
    "0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13", 0)
  console.log("state " + state)
  console.log("oracle " + oracle)
  console.log("nums " + nums)
}

test().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})