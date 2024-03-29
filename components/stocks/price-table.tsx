'use client'

// import { useState, useRef, useEffect, useId } from 'react'
// import { scaleLinear } from 'd3-scale'
// import { subMonths, format } from 'date-fns'
// import { useResizeObserver } from 'usehooks-ts'
// import { useAIState } from 'ai/rsc'

interface Stock {
  symbol: string
  price: number
  delta: number
}

export function PriceTable({
  props: { symbol, price, delta }
}: {
  props: Stock
}) {
  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50">
            <div className="grid grid-cols-6 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <p>項次</p>
              <p>項目</p>
              <p>內容</p>
              <p>單價</p>
              <p>數量</p>
              <p>小計(新台幣,未稅)</p>
            </div>
          </div>
          <div className="bg-white">
            <div className="grid grid-cols-6 px-6 py-4">
              <p>1</p>
              <p>{symbol}</p>
              <p>
                1.儲值服務文件處理
                <br />
                2.線下兌換及參數設定
                <br />
                3.線索回饋分析
                <br />
                4.測用服務後端管理
              </p>
              <p>1</p>
              <p />
              <p />
            </div>
            <div className="grid grid-cols-6 px-6 py-4">
              <p>2</p>
              <p>應用服務費(APP)</p>
              <p>
                1.應用 APP SERVER 建立
                <br />
                2.應用 APP 中接 RAG 係統
                <br />
                3.應用 APP 文字處理
                <br />
                4.應用 APP 建立 MR 資閱器(Android)
              </p>
              <p>1</p>
              <p />
              <p />
            </div>
            <div className="grid grid-cols-6 px-6 py-4">
              <p>3</p>
              <p>小計(未稅)</p>
              <p>
                備註：
                <br />
                1.資費標準為參及使用手冊。
                <br />
                2.客戶端自備 Android
                手機，我方不負責客戶端自備硬體之作業系統、網路環境、硬體設備等相關支援或故障處理問題。
                <br />
                3.計算單位為門，免費試用。
              </p>
              <p>營業稅(5%)</p>
              <p />
              <p>{price}</p>
            </div>
            <div className="grid grid-cols-6 px-6 py-4">
              <p />
              <p />
              <p />
              <p>總額</p>
              <p />
              <p>2,000,000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
