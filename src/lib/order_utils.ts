import {
  assetDataUtils,
  generatePseudoRandomSalt,
  Order,
  orderHashUtils,
  signatureUtils,
  SignedOrder,
} from '@0x/order-utils';
import { MetamaskSubprovider, Provider } from '@0x/subproviders';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';

import { DEFAULT_EXPIRATION_TIME_SECS, EXCHANGE_ADDRESS, NULL_ADDRESS } from '../common/constants';
import { ITokenData } from '../common/tokens';
import { log } from '../etc';

const ZERO_AMOUNT = new BigNumber(0);
const EXPIRATION_TIME = new BigNumber(DEFAULT_EXPIRATION_TIME_SECS);

const logger = log.getLogger('orderUtils');

export interface IBasicOrderArgs {
    makerAddress: string;
    makerAssetAmount: BigNumber;
    makerAssetTokenData: ITokenData;
    takerAssetAmount: BigNumber;
    takerAssetTokenData: ITokenData;
    provider: Provider;
}

export const createBasicSignedOrder = async (args: IBasicOrderArgs): Promise<SignedOrder> => {
    const {
        makerAddress,
        makerAssetAmount,
        makerAssetTokenData,
        takerAssetAmount,
        takerAssetTokenData,
        provider,
    } = args;
    const order: Order = {
        makerAssetAmount: Web3Wrapper.toBaseUnitAmount(makerAssetAmount, makerAssetTokenData.decimals),
        takerAssetAmount: Web3Wrapper.toBaseUnitAmount(takerAssetAmount, takerAssetTokenData.decimals),
        makerAddress: makerAddress.toLowerCase(),
        makerAssetData: assetDataUtils.encodeERC20AssetData(makerAssetTokenData.address),
        takerAssetData: assetDataUtils.encodeERC20AssetData(takerAssetTokenData.address),
        salt: generatePseudoRandomSalt(),
        exchangeAddress: EXCHANGE_ADDRESS,
        expirationTimeSeconds: new BigNumber(Math.floor(Date.now() / 1000)).add(EXPIRATION_TIME),
        takerAddress: NULL_ADDRESS,
        senderAddress: NULL_ADDRESS,
        feeRecipientAddress: NULL_ADDRESS,
        makerFee: ZERO_AMOUNT,
        takerFee: ZERO_AMOUNT,
    };
    const orderHashHex = orderHashUtils.getOrderHashHex(order);
    logger.info('orderHashHex', orderHashHex);
    const signature = await signatureUtils.ecSignHashAsync(
        new MetamaskSubprovider(provider),
        orderHashHex,
        makerAddress,
    );
    return { ...order, signature };
};
