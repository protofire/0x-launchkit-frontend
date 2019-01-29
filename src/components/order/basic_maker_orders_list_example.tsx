import { connect } from 'react-redux';

import { getEthAccount } from '../../store/selectors';
import { StoreState } from '../../store/types';

import { BasicMakerOrdersList } from './basic_maker_order_list';

interface PropsFromState {
    ethAccount: string;
}

const mapStateToProps = (state: StoreState): PropsFromState => {
    return {
        ethAccount: getEthAccount(state),
    };
};

const BasicMakerOrdersListExample = connect(mapStateToProps)(BasicMakerOrdersList);

export { BasicMakerOrdersListExample };
