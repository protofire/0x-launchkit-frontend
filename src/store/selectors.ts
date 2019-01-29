import { IStoreState } from './types';

export const getEthAccount = (state: IStoreState) => state.blockchain.ethAccount;
