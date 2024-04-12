'use client'

import dynamic from 'next/dynamic'
import { PriceTableSkeleton } from '../quotation/price-table-skeleton'

export { spinner } from './spinner'
export { BotCard, BotMessage, SystemMessage } from './message'

const PriceTable = dynamic(
  () => import('../quotation/price-table').then(mod => mod.PriceTable),
  {
    ssr: false,
    loading: () => <PriceTableSkeleton />
  }
)

export { PriceTable }
