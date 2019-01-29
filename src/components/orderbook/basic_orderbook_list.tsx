import { HttpClient } from '@0x/connect';
import { assetDataUtils } from '@0x/order-utils';
import { APIOrder, PaginatedCollection } from '@0x/types';
import { Table, Title } from 'bloomer';
import React from 'react';

import { DEFAULT_UI_UNIT_AMOUNT_DECIMALS, NETWORK_ID } from '../../common/constants';
import { getTokenDataBySymbol } from '../../common/tokens';
import { log } from '../../etc';
import { bignumberAmountAsUIString, getAssetAmountAsBignumber } from '../../lib/asset_utils';
import { getRelayerClient } from '../../lib/get_relayer_client';

import { OrderbookRow } from './basic_orderbook_row';

const logger = log.getLogger('BasicOrderBookList');

const DEFAULT_PAGINATED_COLLECTION: PaginatedCollection<APIOrder> = {
    total: 0,
    page: 0,
    perPage: 0,
    records: [],
};

interface IBasicOrderBookListProps {
    relayerClient?: HttpClient;
    baseTokenSymbol: string;
    quoteTokenSymbol: string;
}

interface IBasicOrderBookListState {
    relayerClient: HttpClient;
    asks: PaginatedCollection<APIOrder>;
    bids: PaginatedCollection<APIOrder>;
    loading: boolean;
}

class BasicOrderBookList extends React.Component<IBasicOrderBookListProps, IBasicOrderBookListState> {
    public state = {
        relayerClient: this.props.relayerClient || getRelayerClient(),
        asks: { ...DEFAULT_PAGINATED_COLLECTION },
        bids: { ...DEFAULT_PAGINATED_COLLECTION },
        loading: true,
    };

    public componentDidMount = () => {
        this._getOrderbook();
    };

    public render = () => {
        const { loading } = this.state;

        if (loading) {
            return this._renderLoading();
        }

        return (
            <React.Fragment>
                <Title isSize={2}>Orderbook</Title>
                {this._renderTable()}
            </React.Fragment>
        );
    };

    private _renderTable = () => {
        const { baseTokenSymbol, quoteTokenSymbol } = this.props;
        const { asks, bids } = this.state;
        const askRows = this._mapAPIOrderPaginatedCollectionToRows(asks, false);
        const bidsRows = this._mapAPIOrderPaginatedCollectionToRows(bids, true);
        const spreadRow = this._mapAskBidsToSpreadRow(asks, bids);
        return (
            <Table isStriped={true} className="text-monospace">
                <thead>
                    <tr>
                        <td>{baseTokenSymbol}</td>
                        <td>{quoteTokenSymbol}</td>
                        <td>
                            1 {baseTokenSymbol} = ? {quoteTokenSymbol}
                        </td>
                        <td>
                            1 {quoteTokenSymbol} = ? {baseTokenSymbol}
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {askRows}
                    {spreadRow}
                    {bidsRows}
                </tbody>
            </Table>
        );
    };

    private _mapAPIOrderPaginatedCollectionToRows = (collection: PaginatedCollection<APIOrder>, isBid: boolean) => {
        if (collection.records.length > 0) {
            return collection.records.map(order => (
                <OrderbookRow key={order.order.signature} order={order.order} isBid={isBid} />
            ));
        } else {
            return (
                <tr>
                    <td colSpan={4} key={isBid ? 'noBids' : 'noAsks'}>
                        No {isBid ? 'bids' : 'asks'}
                    </td>
                </tr>
            );
        }
    };

    private _mapAskBidsToSpreadRow = (asks: PaginatedCollection<APIOrder>, bids: PaginatedCollection<APIOrder>) => {
        const lastAskOrder = asks.records.length > 0 ? asks.records[asks.records.length - 1].order : null;
        const firstBidOrder = bids.records.length > 0 ? bids.records[0].order : null;

        let priceBaseDividedQuoteDifference = '----';
        let priceQuoteDividedBaseDifference = '----';

        // @TODO: asks & bids sorting. Also needs confirmation that the formula is ok
        if (lastAskOrder !== null && firstBidOrder !== null) {
            const bidMakerAssetAmount = getAssetAmountAsBignumber(
                firstBidOrder.makerAssetAmount,
                firstBidOrder.makerAssetData,
            );
            const bidTakerAssetAmount = getAssetAmountAsBignumber(
                firstBidOrder.takerAssetAmount,
                firstBidOrder.takerAssetData,
            );
            const bidMakerToTakerRatio = bidMakerAssetAmount.dividedBy(bidTakerAssetAmount);
            const bidTakerToMakerRatio = bidTakerAssetAmount.dividedBy(bidMakerAssetAmount);

            const askMakerAssetAmount = getAssetAmountAsBignumber(
                lastAskOrder.makerAssetAmount,
                lastAskOrder.makerAssetData,
            );
            const askTakerAssetAmount = getAssetAmountAsBignumber(
                lastAskOrder.takerAssetAmount,
                lastAskOrder.takerAssetData,
            );
            const askMakerToTakerRatio = askMakerAssetAmount.dividedBy(askTakerAssetAmount);
            const askTakerToMakerRatio = askTakerAssetAmount.dividedBy(askMakerAssetAmount);

            priceBaseDividedQuoteDifference = bignumberAmountAsUIString(
                bidMakerToTakerRatio.minus(askMakerToTakerRatio),
                DEFAULT_UI_UNIT_AMOUNT_DECIMALS,
            );
            priceQuoteDividedBaseDifference = bignumberAmountAsUIString(
                bidTakerToMakerRatio.minus(askTakerToMakerRatio),
                DEFAULT_UI_UNIT_AMOUNT_DECIMALS,
            );
        }

        return (
            <tr>
                <td colSpan={2}>Spread</td>
                <td>{priceBaseDividedQuoteDifference}</td>
                <td>{priceQuoteDividedBaseDifference}</td>
            </tr>
        );
    };

    private _renderLoading = () => {
        return <p>Loading...</p>;
    };

    private _getOrderbook = async () => {
        try {
            const { baseTokenSymbol, quoteTokenSymbol } = this.props;
            const { relayerClient } = this.state;

            // @TODO: refactor
            const baseTokenData = getTokenDataBySymbol(baseTokenSymbol);
            const baseAssetData: string = assetDataUtils.encodeERC20AssetData(baseTokenData.address);
            const quoteTokenData = getTokenDataBySymbol(quoteTokenSymbol);
            const quoteAssetData: string = assetDataUtils.encodeERC20AssetData(quoteTokenData.address);

            const response = await relayerClient.getOrderbookAsync(
                { baseAssetData, quoteAssetData },
                { networkId: NETWORK_ID },
            );
            logger.debug(response);
            const { asks, bids } = response;
            this.setState({ asks, bids, loading: false });
        } catch (error) {
            logger.error(error);
        }
    };
}

export { BasicOrderBookList };
