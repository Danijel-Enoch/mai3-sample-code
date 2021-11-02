//SPDX-License-Identifier: Unlicense
pragma solidity >=0.7.4;

import "../interface/ILiquidityPoolFull.sol";
import "../Type.sol";

contract Perpetual {
  constructor() {

  }

  function getPerpetual(address liquidityPoolAddress, uint256 perpetualIndex) public returns (PerpetualState state, address oracle, int256[42] memory nums) {
    ILiquidityPoolFull liquidityPool = ILiquidityPoolFull(liquidityPoolAddress);
    (state, oracle, nums) = liquidityPool.getPerpetualInfo(perpetualIndex);
  }
}
