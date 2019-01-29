import { kovanTokenDataCollection } from './kovan_token_data_collection';

export interface ITokenData {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
}

export const tokenDataCollectionsByNetworkId: {
    [key: number]: ITokenData[];
} = {
    42: kovanTokenDataCollection,
};

export function getTokenDataBySymbol(symbol: string, networkId: number = 42): ITokenData {
    const result = tokenDataCollectionsByNetworkId[networkId].find(tokenData => tokenData.symbol === symbol);
    if (result) {
        return result;
    } else {
        throw new Error('Token data not found');
    }
}

export function getTokenDataByAddress(address: string, networkId: number = 42): ITokenData {
    const result = tokenDataCollectionsByNetworkId[networkId].find(tokenData => tokenData.address === address);
    if (result) {
        return result;
    } else {
        throw new Error('Token data not found');
    }
}
