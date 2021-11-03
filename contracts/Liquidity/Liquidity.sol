//SPDX-License-Identifier: Unlicense
pragma solidity >=0.7.4;

import "../interface/ILiquidityPoolFull.sol";

contract Liquidity {
  constructor() {}

  function addLiquidity(address liquidityPoolAddress, int256 cashToAdd) public {
    ILiquidityPoolFull liquidityPool = ILiquidityPoolFull(liquidityPoolAddress);
    liquidityPool.addLiquidity(amount);
  }

  function removeLiquidity(address liquidityPoolAddress, int256 shareToRemove, int256 cashToReturn) public {
    ILiquidityPoolFull liquidityPool = ILiquidityPoolFull(liquidityPoolAddress);
    liquidityPool.removeLiquidity(shareToRemove, cashToReturn);
  }
}
