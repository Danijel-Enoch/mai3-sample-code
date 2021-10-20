//SPDX-License-Identifier: Unlicense
pragma solidity >=0.7.4;

import "../interface/ILiquidityPoolFull.sol";

contract Remargin {
  constructor() {}

  function deposit(address liquidityPoolAddress, uint256 index, int256 depositAmount) public {
    ILiquidityPoolFull liquidityPool = ILiquidityPoolFull(liquidityPoolAddress);
    liquidityPool.deposit(index, address(this), depositAmount);
  }

  function withdraw(address liquidityPoolAddress, uint256 index, int256 withdrawAmount) public {
    ILiquidityPoolFull liquidityPool = ILiquidityPoolFull(liquidityPoolAddress);
    liquidityPool.withdraw(index, address(this), withdrawAmount);
  }
}
