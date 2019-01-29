import { assetDataUtils, BigNumber } from '0x.js';
import { HttpClient } from '@0x/connect';
import { APIOrder, ERC20AssetData, PaginatedCollection } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { Control, Select, Table, Title } from 'bloomer';
import React from 'react';

import { DEFAULT_UI_UNIT_AMOUNT_DECIMALS, NULL_ADDRESS } from '../../common/constants';
import { getTokenDataByAddress } from '../../common/tokens';
import { log } from '../../etc';
import { getRelayerClient } from '../../lib/get_relayer_client';

const logger = log.getLogger('AssetPairs');
const DEFAULT_PER_PAGE = 5;

interface IBasicMakerOrdersListProps {
    relayerClient?: HttpClient;
    perPage?: number;
    ethAccount: string;
}

interface IBasicMakerOrdersListState {
    loading: boolean;
    paginatedCollection: PaginatedCollection<APIOrder>;
    relayerClient: HttpClient;
}

class BasicMakerOrdersList extends React.Component<IBasicMakerOrdersListProps, IBasicMakerOrdersListState> {
    public state = {
        loading: true,
        paginatedCollection: {
            total: 0,
            page: 0,
            perPage: 0,
            records: [],
        },
        relayerClient: this.props.relayerClient || getRelayerClient(),
    };

    public componentDidUpdate = async (prevProps: IBasicMakerOrdersListProps) => {
        if (prevProps.ethAccount !== this.props.ethAccount) {
            this.getOrders();
        }
    };

    public getOrders = async (page: number = 0) => {
        try {
            const { ethAccount } = this.props;
            logger.debug(ethAccount);
            const { relayerClient } = this.state;
            const perPage = this.props.perPage || DEFAULT_PER_PAGE;
            const paginatedCollection: PaginatedCollection<APIOrder> = await relayerClient.getOrdersAsync({
                page,
                perPage,
                makerAddress: ethAccount.toLowerCase(),
                networkId: 42,
            });
            this.setState({
                loading: false,
                paginatedCollection,
            });
        } catch (error) {
            logger.error(error);
        }
    };

    public render = () => {
        const { loading, paginatedCollection } = this.state;

        if (loading || !paginatedCollection === null) {
            return this._renderLoading();
        }

        const content = paginatedCollection.records.length > 0 ? this._renderTable() : this._renderNoResults;
        return (
            <React.Fragment>
                <Title isSize={2}>My Orders</Title>
                {content}
            </React.Fragment>
        );
    };

    private _renderLoading = () => {
        return <p>Loading...</p>;
    };

    private _renderNoResults = () => {
        return <p>No asset pairs found.</p>;
    };

    private _renderTable = () => {
        const { paginatedCollection } = this.state;
        const nowDate = new Date();
        const orderRows = paginatedCollection.records.map((record: APIOrder) => {
            const { order } = record;
            const makerAssetData = assetDataUtils.decodeAssetDataOrThrow(order.makerAssetData) as ERC20AssetData;
            const takerAssetData = assetDataUtils.decodeAssetDataOrThrow(order.takerAssetData) as ERC20AssetData;
            const makerToken = getTokenDataByAddress(makerAssetData.tokenAddress);
            const takerToken = getTokenDataByAddress(takerAssetData.tokenAddress);
            const makerAssetAmount = Web3Wrapper.toUnitAmount(
                new BigNumber(order.makerAssetAmount),
                makerToken.decimals,
            ).toFixed(DEFAULT_UI_UNIT_AMOUNT_DECIMALS);
            const takerAssetAmount = Web3Wrapper.toUnitAmount(
                new BigNumber(order.takerAssetAmount),
                takerToken.decimals,
            ).toFixed(DEFAULT_UI_UNIT_AMOUNT_DECIMALS);
            const expirationDate = new Date(new BigNumber(order.expirationTimeSeconds).toNumber() * 1000);
            return (
                <tr key={order.salt.toString()}>
                    <td title={order.makerAddress}>
                        {order.makerAddress}
                        <br />
                        {makerToken.symbol}
                        <br />
                        {makerAssetAmount}
                    </td>
                    <td title={order.takerAddress}>
                        {order.takerAddress === NULL_ADDRESS ? 'Anyone' : order.takerAddress}
                        <br />
                        {takerToken.symbol}
                        <br />
                        {takerAssetAmount}
                    </td>
                    <td>
                        {`${expirationDate.toUTCString()} (UTC)`}
                        <br />
                        {expirationDate < nowDate ? 'EXPIRED' : ''}
                    </td>
                </tr>
            );
        });
        const table = (
            <Table isBordered={true} isStriped={true} isNarrow={true}>
                <thead>
                    <tr>
                        <td>
                            (Maker)
                            <br />
                            Address
                            <br />
                            Asset
                            <br />
                            Amount
                        </td>
                        <td>
                            (Taker)
                            <br />
                            Address
                            <br />
                            Asset
                            <br />
                            Amount
                        </td>
                        <td>Expiration</td>
                    </tr>
                </thead>
                <tbody>{orderRows}</tbody>
            </Table>
        );
        return (
            <React.Fragment>
                {this._renderTablePagination()}
                <br />
                {table}
            </React.Fragment>
        );
    };

    private _renderTablePagination = () => {
        const { paginatedCollection } = this.state;
        const pages = Math.ceil(paginatedCollection.total / paginatedCollection.perPage);
        if (pages <= 1) {
            return null;
        }
        const options = [];
        for (let i = 0; i < pages; i++) {
            options.push(
                <option key={i} value={i}>
                    Page {i + 1}
                </option>,
            );
        }

        return (
            <Control>
                <Select onChange={this._onTablePageSelect} value={paginatedCollection.page}>
                    {options}
                </Select>
            </Control>
        );
    };

    private _onTablePageSelect = (evt: React.BaseSyntheticEvent) => {
        this.getOrders(evt.target.options.selectedIndex);
    };
}

export { BasicMakerOrdersList };
