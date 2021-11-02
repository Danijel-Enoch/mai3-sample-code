//SPDX-License-Identifier: Unlicense
pragma solidity >=0.7.4;

import "../interface/ILiquidityPoolFull.sol";

contract Pool {
  constructor() {}

  function getPool(address liquidityPoolAddress) public returns (bool isRunning, bool isFastCreationEnabled,
    address[7] memory addresses, int256[5] memory intNums, uint256[6] memory uintNums) {
    ILiquidityPoolFull liquidityPool = ILiquidityPoolFull(liquidityPoolAddress);
    (isRunning, isFastCreationEnabled, addresses, intNums, uintNums) = liquidityPool.getLiquidityPoolInfo();
  }
}
