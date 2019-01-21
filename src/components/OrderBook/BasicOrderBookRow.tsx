import React from 'react'
import { BigNumber } from '0x.js'
import { SignedOrder } from '@0x/types'
import { DEFAULT_UI_UNIT_AMOUNT_DECIMALS } from '../../common/constants'
import { getAssetAmountAsBignumber, bignumberAmountAsUIString } from '../../lib/assetUtils'

interface IOrderBookRowProps {
  order: SignedOrder
  isBid?: boolean
}

const OrderBookRow: React.FunctionComponent<IOrderBookRowProps> = (props) => {
  const { order, isBid } = props

  const bnMakerAssetAmount = getAssetAmountAsBignumber(order.makerAssetAmount, order.makerAssetData)
  const bnTakerAssetAmount = getAssetAmountAsBignumber(order.takerAssetAmount, order.takerAssetData)
  const bnMakerToTakerRatio = bnMakerAssetAmount.dividedBy(bnTakerAssetAmount)
  const bnTakerToMakerRatio = bnTakerAssetAmount.dividedBy(bnMakerAssetAmount)

  const makerAssetAmount = bignumberAmountAsUIString(bnMakerAssetAmount, DEFAULT_UI_UNIT_AMOUNT_DECIMALS)
  const takerAssetAmount = bignumberAmountAsUIString(bnTakerAssetAmount, DEFAULT_UI_UNIT_AMOUNT_DECIMALS)
  const makerToTakerRatio = bignumberAmountAsUIString(bnMakerToTakerRatio, DEFAULT_UI_UNIT_AMOUNT_DECIMALS)
  const takerToMakerRatio = bignumberAmountAsUIString(bnTakerToMakerRatio, DEFAULT_UI_UNIT_AMOUNT_DECIMALS)
  return isBid ?
    (
      <tr>
        <td>{takerAssetAmount}</td>
        <td>{makerAssetAmount}</td>
        <td>{makerToTakerRatio}</td>
        <td>{takerToMakerRatio}</td>
      </tr>
    ) : (
      <tr>
        <td>{makerAssetAmount}</td>
        <td>{takerAssetAmount}</td>
        <td>{takerToMakerRatio}</td>
        <td>{makerToTakerRatio}</td>
      </tr>
    )
}

export { OrderBookRow }
