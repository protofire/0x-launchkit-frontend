import React from 'react';
import { connect } from 'react-redux';

import { getEthAccount } from '../../store/selectors';
import { IStoreState } from '../../store/types';

interface IPropsFromState {
    ethAccount: string;
}

type WalletConnectionStatusProps = IPropsFromState;

class WalletConnectionStatus extends React.PureComponent<WalletConnectionStatusProps> {
    public render = () => {
        const { ethAccount } = this.props;
        return (
            <div className="wallet-connection-status">
                <p>{ethAccount ? `Connected with: ${ethAccount}` : 'Not connected'}</p>
            </div>
        );
    };
}

const mapStateToProps = (state: IStoreState): IPropsFromState => {
    return {
        ethAccount: getEthAccount(state),
    };
};

const WalletConnectionStatusContainer = connect(mapStateToProps)(WalletConnectionStatus);

export { WalletConnectionStatus, WalletConnectionStatusContainer };
