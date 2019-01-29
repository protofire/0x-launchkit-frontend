import { connect } from 'react-redux';

import { getEthAccount } from '../../store/selectors';
import { IStoreState } from '../../store/types';

import { BasicMakerOrdersList } from './basic_maker_order_list';

interface IPropsFromState {
    ethAccount: string;
}

const mapStateToProps = (state: IStoreState): IPropsFromState => {
    return {
        ethAccount: getEthAccount(state),
    };
};

const BasicMakerOrdersListExample = connect(mapStateToProps)(BasicMakerOrdersList);

export { BasicMakerOrdersListExample };
