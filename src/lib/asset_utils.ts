import { assetDataUtils, BigNumber } from '0x.js';
import { ERC20AssetData } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';

import { getTokenDataByAddress } from '../common/tokens';

const getAssetAmountAsBignumber = (assetAmount: BigNumber, assetData: string): BigNumber => {
    const makerAssetData = assetDataUtils.decodeAssetDataOrThrow(assetData) as ERC20AssetData;
    const tokenData = getTokenDataByAddress(makerAssetData.tokenAddress);
    const bnAssetAmount = new BigNumber(assetAmount);
    return Web3Wrapper.toUnitAmount(bnAssetAmount, tokenData.decimals);
};

const bignumberAmountAsUIString = (amount: BigNumber, fixed: number): string => {
    return amount.toFixed(fixed).toString();
};

export { getAssetAmountAsBignumber, bignumberAmountAsUIString };
