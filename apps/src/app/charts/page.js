'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ChartA from '@/components/ChartA'
import ChartB from '@/components/ChartB'

export default function ChartsPage() {
  const [isClient, setIsClient] = useState(false)

  // クライアントサイドでのハイドレーション後にグラフを表示
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">ログデータ分析グラフ</h1>

      {/* ナビゲーション */}
      <div className="mb-6 text-center">
        <Link
          href="/hello"
          className="inline-block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
        >
          ← データ表示ページに戻る
        </Link>
      </div>

      {!isClient ? (
        // サーバーサイドレンダリング時とハイドレーション前はローディング表示
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-500">グラフを読み込み中...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* グラフA: 日別ログ件数の縦棒グラフ */}
          <div>
            <h2 className="text-xl font-semibold mb-4">グラフA: 日別ログ発生件数</h2>
            <ChartA />
          </div>

          {/* グラフB: secondaryCategories別割合の円グラフ */}
          <div>
            <h2 className="text-xl font-semibold mb-4">グラフB: セカンダリカテゴリ別割合</h2>
            <ChartB />
          </div>
        </div>
      )}
    </div>
  )
}
