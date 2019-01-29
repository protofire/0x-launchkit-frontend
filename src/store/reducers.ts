import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import * as actions from './actions';
import { IBlockchainState, IStoreState } from './types';

export type RootAction = ActionType<typeof actions>;

const initialState: IBlockchainState = {
    ethAccount: '',
    web3State: 'loading',
};

export function blockchain(state: IBlockchainState = initialState, action: RootAction): IBlockchainState {
    switch (action.type) {
        case getType(actions.setEthAccount):
            return { ...state, ethAccount: action.payload };
        case getType(actions.setWeb3State):
            return { ...state, web3State: action.payload };
    }
    return state;
}

export const createRootReducer = (history: History) =>
    combineReducers<IStoreState>({
        router: connectRouter(history),
        blockchain,
    });
