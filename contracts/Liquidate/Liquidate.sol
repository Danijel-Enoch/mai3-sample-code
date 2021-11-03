//SPDX-License-Identifier: Unlicense
pragma solidity >=0.7.4;

import "../interface/ILiquidityPoolFull.sol";

contract Liquidate {
  constructor() {}

  function liquidateByTrader(address liquidityPoolAddress, uint256 perpetualIndex, address liquidator,
    address trader, int256 amount, int256 limitPrice, uint256 deadline) public {
    ILiquidityPoolFull liquidityPool = ILiquidityPoolFull(liquidityPoolAddress);
    liquidityPool.liquidateByTrader(perpetualIndex, liquidator, trader, amount, limitPrice, deadline);
  }
}
