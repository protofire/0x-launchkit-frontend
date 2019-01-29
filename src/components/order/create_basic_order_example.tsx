import React from 'react';

import { CreateBasicOrder } from './create_basic_order';

const CreateBasicOrderWithWeb3 = CreateBasicOrder;

const CreateBasicOrderExample = () => {
    return <CreateBasicOrderWithWeb3 makerAssetSymbol="WETH" takerAssetSymbol="ZRX" />;
};

export { CreateBasicOrderExample };
