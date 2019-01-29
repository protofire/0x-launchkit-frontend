import { RouterState } from 'connected-react-router';

export interface IBlockchainState {
    readonly ethAccount: string;
    readonly web3State: string;
}

export interface IStoreState {
    readonly router: RouterState;
    readonly blockchain: IBlockchainState;
}
