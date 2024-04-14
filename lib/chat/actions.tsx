import 'server-only'

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  render,
  createStreamableValue
} from 'ai/rsc'
import OpenAI from 'openai'

import {
  spinner,
  BotCard,
  BotMessage,
  SystemMessage
  // Stock,
} from '@/components/stocks'

import { Purchase } from '@/components/quotation/service-purchase'

import { z } from 'zod'

import {
  formatNumber,
  runAsyncFnWithoutBlocking,
  sleep,
  nanoid
} from '@/lib/utils'
import { saveChat } from '@/app/actions'
import { SpinnerMessage, UserMessage } from '@/components/stocks/message'
import { Chat } from '@/lib/types'
import { auth } from '@/auth'
// import { json } from 'body-parser'
import { Services } from '@/components/quotation/services'
import { ServicesSkeleton } from '@/components/quotation/services-skeleton'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

async function confirmPurchase(
  service_name: string,
  price: number,
  amount: number
) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  const purchasing = createStreamableUI(
    <div className="inline-flex items-start gap-1 md:items-center">
      {spinner}
      <p className="mb-2">
        Purchasing {amount} ${service_name}...
      </p>
    </div>
  )

  const systemMessage = createStreamableUI(null)

  runAsyncFnWithoutBlocking(async () => {
    await sleep(1000)

    purchasing.update(
      <div className="inline-flex items-start gap-1 md:items-center">
        {spinner}
        <p className="mb-2">
          Purchasing {amount} ${service_name}... working on it...
        </p>
      </div>
    )

    await sleep(1000)

    purchasing.done(
      <div>
        <p className="mb-2">
          You have successfully purchased {amount} {service_name} at ${price}.
          Total cost = {formatNumber(amount * price)}
        </p>
      </div>
    )

    systemMessage.done(
      <SystemMessage>
        You have purchased {amount} {service_name} at ${price}. Total cost ={' '}
        {formatNumber(amount * price)}.
      </SystemMessage>
    )

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages.slice(0, -1),
        {
          id: nanoid(),
          role: 'function',
          name: 'showStockPurchase',
          content: JSON.stringify({
            service_name,
            price,
            defaultAmount: amount,
            status: 'completed'
          })
        },
        {
          id: nanoid(),
          role: 'system',
          content: `[User has purchased ${amount} ${service_name} at ${price}. Total cost = ${
            amount * price
          }]`
        }
      ]
    })
  })

  return {
    purchasingUI: purchasing.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value
    }
  }
}

async function submitUserMessage(content: string) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content
      }
    ]
  })

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode

  const ui = render({
    model: 'gpt-3.5-turbo',
    provider: openai,
    initial: <SpinnerMessage />,
    messages: [
      {
        role: 'system',
        content: `\
        You are a quotation system conversation bot and you can help users write quotations and the details of the service, step by step.
        You and the user can discuss prices and the details of the service and the user can adjust the amount of service.
        The details of the service should be like a description from the service name, not a bullet point list.

        Messages inside [] means that it's a UI element or a user event. For example:
        - "[Price of LLM service = 100]" means that an interface of the price of LLM service is shown to the user.
        - "[User has changed the amount of LLM service to 10]" means that the user has changed the amount of LLM service to 10 in the UI.

        If you want to show a full table of prices, call \`showFullPriceTable\`.
        If the user want to buy a service, call \`showServicePurchase\`.

        Besides that, you can also chat with users and do some calculations if needed.`
      },
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name
      }))
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('')
        textNode = <BotMessage content={textStream.value} />
      }

      if (done) {
        textStream.done()
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content
            }
          ]
        })
      } else {
        textStream.update(delta)
      }

      return textNode
    },
    functions: {
      showFullPriceTable: {
        description:
          'List some related services and costs. Describe the service and the price.',
        parameters: z.object({
          services: z.array(
            z.object({
              service_name: z.string().describe('The name of the service'),
              service_details: z
                .string()
                .describe('The details of the service'),
              price: z.number().describe('The price of the service.'),
              quantity: z.number().describe('The quantity of the service.')
            })
          )
        }),
        render: async function* ({ services }) {
          yield (
            <BotCard>
              <ServicesSkeleton />
            </BotCard>
          )

          await sleep(2000)

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: 'showFullStockPrice',
                content: JSON.stringify({
                  services
                })
              }
            ]
          })

          return (
            <BotCard>
              <Services props={services} />
            </BotCard>
          )
        }
      },
      showServicePurchase: {
        description:
          'Show price and the UI to purchase a service. Use this if the user wants to purchase a service.',
        parameters: z.object({
          service_name: z.string().describe('The name of the service.'),
          price: z.number().describe('The price of the service.'),
          numberOfServices: z
            .number()
            .describe(
              'The **quantity** for a service to purchase. Can be optional if the user did not specify it.'
            )
        }),
        render: async function* ({
          service_name,
          price,
          numberOfServices = 10
        }) {
          if (numberOfServices <= 0 || numberOfServices > 100) {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'system',
                  content: `[User has selected an invalid amount]`
                }
              ]
            })

            return <BotMessage content={'Invalid amount'} />
          }

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: 'showServicePurchase',
                content: JSON.stringify({
                  service_name,
                  price,
                  numberOfServices
                })
              }
            ]
          })

          return (
            <BotCard>
              <Purchase
                props={{
                  numberOfServices,
                  service_name,
                  price: +price,
                  status: 'requires_action'
                }}
              />
            </BotCard>
          )
        }
      }
    }
  })

  return {
    id: nanoid(),
    display: ui
  }
}

export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  id: string
  name?: string
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    confirmPurchase,
    submitUserMessage
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  unstable_onGetUIState: async () => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const aiState = getAIState()

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
  unstable_onSetAIState: async ({ state, done }) => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const { chatId, messages } = state

      const createdAt = new Date()
      const userId = session.user.id as string
      const path = `/chat/${chatId}`
      const title = messages[0].content.substring(0, 100)

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path
      }

      await saveChat(chat)
    } else {
      return
    }
  }
})

//  * GetUIStateFromAIState is designed to transform a AI state into a UI state that us suitable for rendering in a React-based user interface
export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'function' ? (
          message.name === 'showFullPriceTable' ? (
            <BotCard>
              <Services props={JSON.parse(message.content)} />
            </BotCard>
          ) : message.name === 'showServicePurchase' ? (
            <BotCard>
              <Purchase props={JSON.parse(message.content)} />
            </BotCard>
          ) : null
        ) : message.role === 'user' ? (
          <UserMessage>{message.content}</UserMessage>
        ) : (
          <BotMessage content={message.content} />
        )
    }))
}
