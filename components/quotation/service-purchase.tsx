'use client'

import { useId, useState } from 'react'
import { useActions, useAIState, useUIState } from 'ai/rsc'
import { formatNumber } from '@/lib/utils'

import type { AI } from '@/lib/chat/actions'

import { nanoid } from 'nanoid'
import { UserMessage } from '@/components/stocks/message'

interface Purchase {
  numberOfServices?: number
  service_name: string
  price: number
  status: 'requires_action' | 'completed' | 'expired'
}

export function Purchase({
  props: { numberOfServices, service_name, price, status = 'requires_action' }
}: {
  props: Purchase
}) {
  const [value, setValue] = useState(numberOfServices || 100)
  const [purchasingUI, setPurchasingUI] = useState<null | React.ReactNode>(null)
  const [aiState, setAIState] = useAIState<typeof AI>()
  const [, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()

  // Unique identifier for this UI component.
  const id = useId()

  // Whenever the slider changes, we need to update the local value state and the history
  // so LLM also knows what's going on.
  function onSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = Number(e.target.value)
    setValue(newValue)

    // Insert a hidden history info to the list.
    const message = {
      role: 'system' as const,
      content: `[User has changed to purchase ${newValue} shares of ${service_name}. Total cost: $${(
        newValue * price
      ).toFixed(2)}]`,

      // Identifier of this UI component, so we don't insert it many times.
      id
    }

    // If last history state is already this info, update it. This is to avoid
    // adding every slider change to the history.
    if (aiState.messages[aiState.messages.length - 1]?.id === id) {
      setAIState({
        ...aiState,
        messages: [...aiState.messages.slice(0, -1), message]
      })

      return
    }

    // If it doesn't exist, append it to history.
    setAIState({ ...aiState, messages: [...aiState.messages, message] })
  }

  return (
    <div className="rounded-xl  bg-white p-10">
      <div className="text-4xl">{service_name}</div>
      <div className="text-lg font-bold">${price}</div>
      {purchasingUI ? (
        <div className="mt-4">{purchasingUI}</div>
      ) : status === 'requires_action' ? (
        <>
          <div className="relative mt-6 pb-6">
            <p>Services to purchase</p>
            <input
              id="labels-range-input"
              type="range"
              value={value}
              onChange={onSliderChange}
              min="1"
              max="100"
              className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-zinc-600 accent-zinc-500 dark:bg-zinc-700"
            />
            <span className="absolute bottom-1 start-0 text-xs text-zinc-700">
              1
            </span>
            <span className="absolute bottom-1 start-1/2 -translate-x-1/2 text-xs text-zinc-700 rtl:translate-x-1/2">
              50
            </span>
            <span className="absolute bottom-1 end-0 text-xs text-zinc-700 rtl:translate-x-1/2">
              100
            </span>
            {/* <span className="absolute bottom-1 start-2/3  text-xs text-zinc-700 rtl:translate-x-1/2">
              500
            </span>
            <span className="absolute bottom-1 end-0 text-xs text-zinc-700">
              1000
            </span> */}
          </div>

          <div className="mt-6">
            <p>Total cost</p>
            <div className="flex flex-wrap items-center text-xl font-bold sm:items-end sm:gap-2 sm:text-3xl">
              <div className="flex basis-1/3 flex-col tabular-nums sm:basis-auto sm:flex-row sm:items-center sm:gap-2">
                {value}
                <span className="mb-1 text-sm font-normal text-zinc-600 sm:mb-0 dark:text-zinc-400">
                  services
                </span>
              </div>
              <div className="basis-1/3 text-center sm:basis-auto">×</div>
              <span className="flex basis-1/3 flex-col tabular-nums sm:basis-auto sm:flex-row sm:items-center sm:gap-2">
                ${price}
                <span className="mb-1 ml-1 text-sm font-normal text-zinc-600 sm:mb-0 dark:text-zinc-400">
                  per service
                </span>
              </span>
              <div className="mt-2 basis-full border-t border-t-zinc-700 pt-2 text-center sm:mt-0 sm:basis-auto sm:border-0 sm:pt-0 sm:text-left">
                = <span>{formatNumber(value * price)}</span>
              </div>
            </div>
          </div>

          <button
            className="mt-6 w-full rounded-lg bg-zinc-300 px-4 py-2 font-bold text-zinc-900 hover:bg-zinc-400"
            onClick={async () => {
              // alert(
              //   `You have bought ${value} services, and it cost you $${(value * price).toFixed(2)}!`
              // )
              const response = await submitUserMessage(
                `The user has bought ${value} ${service_name}, and it cost them ${formatNumber(value * price)}, show the full price table`
              )
              setMessages((currentMessages: any[]) => [
                ...currentMessages,
                response
              ])
            }}
          >
            Show the full price table
          </button>
        </>
      ) : status === 'completed' ? (
        <p className="mb-2 text-white">
          You have successfully purchased {value} ${service_name}. Total cost:{' '}
          {formatNumber(value * price)}
        </p>
      ) : status === 'expired' ? (
        <p className="mb-2 text-white">Your checkout session has expired!</p>
      ) : null}
    </div>
  )
}
