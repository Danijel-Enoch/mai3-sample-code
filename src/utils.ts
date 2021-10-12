import BigNumber from "bignumber.js";

const { ethers } = require("hardhat");

export function toWei(n: string) { return ethers.utils.parseEther(n) };
export function fromWei(n: string) { return ethers.utils.formatEther(n); }

const NONE = "0x0000000000000000000000000000000000000000";
const USE_TARGET_LEVERAGE = 0x8000000;

export {
  NONE,
  USE_TARGET_LEVERAGE,
}
