'use client'

import { useState, useEffect } from 'react'
import { sampleLogData } from '@/constants/sampleData'
import DataTable from '@/components/DataTable'
import Pagination from '@/components/Pagination'
import DataInfo from '@/components/DataInfo'
import ChartA from '@/components/ChartA'
import ChartB from '@/components/ChartB'
import HeatmapChart from '@/components/HeatmapChart'
import StackedAreaChart from '@/components/StackedAreaChart'

export default function HelloPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isClient, setIsClient] = useState(false)
  const itemsPerPage = 30

  // クライアントサイドでのハイドレーション後にデータを表示
  useEffect(() => {
    setIsClient(true)
  }, [])

  // ページネーションの計算
  const totalPages = Math.ceil(sampleLogData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = sampleLogData.slice(startIndex, endIndex)

  // ページ変更関数
  const handlePageChange = page => {
    setCurrentPage(page)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">サンプルページ</h1>

      {!isClient ? (
        // サーバーサイドレンダリング時とハイドレーション前はローディング表示
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-500">データを読み込み中...</p>
        </div>
      ) : (
        <>
          {/* Chart.jsグラフ */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6 text-center">データ分析グラフ</h2>

            {/* ヒートマップ */}
            <HeatmapChart />

            {/* 積み上げエリアチャート */}
            <StackedAreaChart />

            {/* グラフA・グラフBを横並びに配置 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* グラフA: 日別ログ件数の縦棒グラフ */}
              <div>
                <h3 className="text-lg font-medium mb-4">グラフA: 日別ログ発生件数</h3>
                <ChartA />
              </div>

              {/* グラフB: secondaryCategories別割合の円グラフ */}
              <div>
                <h3 className="text-lg font-medium mb-4">グラフB: セカンダリカテゴリ別割合</h3>
                <ChartB />
              </div>
            </div>
          </div>{' '}
          {/* データテーブル */}
          <div>
            <h2 className="text-xl font-semibold mb-4">データ一覧</h2>

            {/* データ件数とページ情報 */}
            <DataInfo
              totalCount={sampleLogData.length}
              currentPage={currentPage}
              totalPages={totalPages}
              startIndex={startIndex}
              endIndex={endIndex}
            />

            {/* テーブル */}
            <DataTable data={currentData} />

            {/* ページネーション */}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        </>
      )}
    </div>
  )
}
