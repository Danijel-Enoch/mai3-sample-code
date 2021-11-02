//SPDX-License-Identifier: Unlicense
pragma solidity >=0.7.4;

import "../interface/ILiquidityPoolFull.sol";

contract Account {
  constructor() {

  }

  function getAccount(address liquidityPoolAddress, uint256 perpetualIndex, address trader) public returns (
    int256 cash, int256 position, int256 availableMargin, int256 margin, int256 settleableMargin, bool isInitialMarginSafe,
    bool isMaintenanceMarginSafe, bool isMarginSafe, int256 targetLeverage
  ) {
    ILiquidityPoolFull liquidityPool = ILiquidityPoolFull(liquidityPoolAddress);
    // WARN: Stack too deep, try split the returns values
    (cash, position, availableMargin, margin, settleableMargin, isInitialMarginSafe,
     isMaintenanceMarginSafe, isMarginSafe, targetLeverage) = liquidityPool.getMarginAccount(
      perpetualIndex, trader);
  }
}
