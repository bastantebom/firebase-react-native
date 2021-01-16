import React from 'react'
import { AppText } from '@/components'

const PriceDisplay = props => {
  const { price } = props

  const handlePrice = p => {
    return Number(p).toLocaleString()
  }

  return <AppText {...props}>₱{handlePrice(price)}</AppText>
}

export default PriceDisplay
