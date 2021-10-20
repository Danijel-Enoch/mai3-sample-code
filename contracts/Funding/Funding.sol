//SPDX-License-Identifier: Unlicense
pragma solidity >=0.7.4;

import "../interface/ILiquidityPoolGetter.sol";

contract Funding {
  ILiquidityPoolGetter liquidityPool;
  uint256 perpetualIndex;
  constructor(address liquidityPoolAddress, uint256 index) {
    liquidityPool = ILiquidityPoolGetter(liquidityPoolAddress);
    perpetualIndex = index;
  }

  function fundingRate() external view returns (int256) {
    int256[42] memory nums;
    (, , nums) = liquidityPool.getPerpetualInfo(perpetualIndex);
    return nums[3];
  }

  function unitAccumulativeFunding() external view returns (int256) {
    int256[42] memory nums;
    (, , nums) = liquidityPool.getPerpetualInfo(perpetualIndex);
    return nums[4];
  }
}
