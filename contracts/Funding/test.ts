// @ts-ignore
import { ethers } from "hardhat";
import {fromWei} from "../../utils/utils";

async function test() {
  const Funding = await ethers.getContractFactory("Funding");
  const funding = await Funding.deploy();

  await funding.deployed();
  console.log("Greeter deployed to:", funding.address);
  const fundingRate = await funding.fundingRate("0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13", 0)
  console.log("fundingRate: ", fromWei(fundingRate.toString()))
  const unitAccumulativeFunding = await funding.unitAccumulativeFunding("0xc32a2dfee97e2babc90a2b5e6aef41e789ef2e13", 0)
  console.log("unitAccumulativeFunding: " + fromWei(unitAccumulativeFunding.toString()))
  console.log("Funding payment: entryFunding - position(1) * unitAccumulativeFunding (" + fromWei(unitAccumulativeFunding.toString()) + "), entryFunding from MarginAccount of MAI3-graph")
}

test().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});