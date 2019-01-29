import BigNumber from 'bignumber.js';
import { Button, Control, Field, Input, Label } from 'bloomer';
import React from 'react';

interface BasicOrderFormProps {
    makerAssetLabel: string;
    takerAssetLabel: string;
    onSubmit: (args: { makerAssetAmount: BigNumber; takerAssetAmount: BigNumber }) => any;
}

interface BasicOrderFormState {
    makerAmount: number;
    takerAmount: number;
    isLoading: boolean;
}

const DEFAULT_STATE: BasicOrderFormState = {
    makerAmount: 0,
    takerAmount: 0,
    isLoading: false,
};

/**
 * Basic order form (no validations) that allows to specify maker & taker asset
 * labels and callback function with the corresponding amounts (already converted) to BigNumber.
 */
class BasicOrderForm extends React.Component<BasicOrderFormProps, BasicOrderFormState> {
    public state = { ...DEFAULT_STATE};

    public onMakerAmountChange = (evt: React.BaseSyntheticEvent) => {
        this.setState({ makerAmount: evt.target.value });
    };

    public onTakerAmountChange = (evt: React.BaseSyntheticEvent) => {
        this.setState({ takerAmount: evt.target.value });
    };

    public onSubmit = async (evt: React.FormEvent) => {
        evt.preventDefault();
        const { makerAmount, takerAmount } = this.state;
        const { onSubmit } = this.props;

        this.setState({ isLoading: true });
        await onSubmit({
            makerAssetAmount: new BigNumber(makerAmount && makerAmount > 0 ? makerAmount.toString() : '0'),
            takerAssetAmount: new BigNumber(takerAmount && takerAmount > 0 ? takerAmount.toString() : '0'),
        });
        this.setState(DEFAULT_STATE);
    };

    public render = () => {
        const { makerAssetLabel, takerAssetLabel } = this.props;
        const { makerAmount, takerAmount, isLoading } = this.state;

        return (
            <form onSubmit={this.onSubmit} noValidate={true}>
                <Field>
                    <Label>{makerAssetLabel}</Label>
                    <Control>
                        <Input
                            type="number"
                            placeholder="0"
                            min="0"
                            name="makerAssetAmount"
                            value={makerAmount}
                            onChange={this.onMakerAmountChange}
                            disabled={isLoading}
                        />
                    </Control>
                </Field>
                <Field>
                    <Label>{takerAssetLabel}</Label>
                    <Control>
                        <Input
                            type="number"
                            placeholder="0"
                            min="0"
                            name="takerAssetAmount"
                            value={takerAmount}
                            onChange={this.onTakerAmountChange}
                            disabled={isLoading}
                        />
                    </Control>
                </Field>
                <Field>
                    <Control>
                        <Button isColor="primary" type="submit" disabled={isLoading}>
                            Submit
                        </Button>
                    </Control>
                </Field>
            </form>
        );
    };
}

export { BasicOrderForm };
