//SPDX-License-Identifier: Unlicense
pragma solidity >=0.7.4;

import "../interface/ILiquidityPoolGetter.sol";

contract Funding {
  constructor() {}

  function markPrice(address liquidityPoolAddress, uint256 index) public view returns (int256) {
    int256[42] memory nums;
    ILiquidityPoolGetter liquidityPool = ILiquidityPoolGetter(liquidityPoolAddress);
    (, , nums) = liquidityPool.getPerpetualInfo(index);
    return nums[1];
  }

  function indexPrice(address liquidityPoolAddress, uint256 index) public view returns (int256) {
    int256[42] memory nums;
    ILiquidityPoolGetter liquidityPool = ILiquidityPoolGetter(liquidityPoolAddress);
    (, , nums) = liquidityPool.getPerpetualInfo(index);
    return nums[2];
  }

  function fundingRate(address liquidityPoolAddress, uint256 index) public view returns (int256) {
    int256[42] memory nums;
    ILiquidityPoolGetter liquidityPool = ILiquidityPoolGetter(liquidityPoolAddress);
    (, , nums) = liquidityPool.getPerpetualInfo(index);
    return nums[3];
  }

  function unitAccumulativeFunding(address liquidityPoolAddress, uint256 index) public view returns (int256) {
    int256[42] memory nums;
    ILiquidityPoolGetter liquidityPool = ILiquidityPoolGetter(liquidityPoolAddress);
    (, , nums) = liquidityPool.getPerpetualInfo(index);
    return nums[4];
  }
}
