// chart.js用のサンプルデータ
// 発生ログデータ：ID、第一分類、第二分類、日時

// シード付き疑似ランダム関数（Linear Congruential Generator）
function seededRandom(seed) {
  let value = seed
  return function () {
    value = (value * 1103515245 + 12345) & 0x7fffffff
    return value / 0x7fffffff
  }
}

// サンプルデータを生成する関数
function generateSampleData() {
  const primaryCategories = ['分類A', '分類B', '分類C', '分類D']
  const secondaryCategories = ['朝', '昼', '晩']

  // 固定シードでランダム関数を初期化
  const random = seededRandom(12345)

  const data = []
  let idCounter = 1

  // 30日分のデータを生成（より多様な日付を作成）
  for (let day = 0; day < 30; day++) {
    const baseDate = new Date('2024-01-01') // 固定の基準日
    baseDate.setDate(baseDate.getDate() + day)

    // 1日あたり3件から15件のランダムな件数（合計件数を調整）
    const dailyCount = Math.floor(random() * 13) + 3 // 3-15件

    for (let i = 0; i < dailyCount; i++) {
      // ランダムな時刻を生成
      const randomHour = Math.floor(random() * 24)
      const randomMinute = Math.floor(random() * 60)
      const randomSecond = Math.floor(random() * 60)

      const logDate = new Date(baseDate)
      logDate.setHours(randomHour, randomMinute, randomSecond, 0)

      // ランダムな分類を選択
      const primaryCategory = primaryCategories[Math.floor(random() * primaryCategories.length)]
      const secondaryCategory = secondaryCategories[Math.floor(random() * secondaryCategories.length)]

      data.push({
        id: idCounter++,
        primaryCategory: primaryCategory,
        secondaryCategory: secondaryCategory,
        datetime: logDate.toISOString(),
        // 日付文字列（YYYY-MM-DD形式）も追加
        date: logDate.toISOString().split('T')[0],
      })
    }
  }

  // 日時順でソート（古い順）
  return data.sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
}

// サンプルデータを生成
export const sampleLogData = generateSampleData()

// 日別集計用のヘルパー関数
export const aggregateByDate = (data = sampleLogData) => {
  const dateCount = {}

  data.forEach(log => {
    const date = log.date
    dateCount[date] = (dateCount[date] || 0) + 1
  })

  return Object.keys(dateCount)
    .sort((a, b) => a.localeCompare(b))
    .map(date => ({
      date,
      count: dateCount[date],
    }))
}

// 第一分類別集計用のヘルパー関数
export const aggregateByPrimaryCategory = (data = sampleLogData) => {
  const categoryCount = {}

  data.forEach(log => {
    const category = log.primaryCategory
    categoryCount[category] = (categoryCount[category] || 0) + 1
  })

  return Object.keys(categoryCount).map(category => ({
    category,
    count: categoryCount[category],
  }))
}

// 第二分類別集計用のヘルパー関数
export const aggregateBySecondaryCategory = (data = sampleLogData) => {
  const categoryCount = {}

  data.forEach(log => {
    const category = log.secondaryCategory
    categoryCount[category] = (categoryCount[category] || 0) + 1
  })

  return Object.keys(categoryCount).map(category => ({
    category,
    count: categoryCount[category],
  }))
}

// 日別×第一分類のクロス集計用のヘルパー関数
export const aggregateByDateAndPrimaryCategory = (data = sampleLogData) => {
  const result = {}

  data.forEach(log => {
    const date = log.date
    const category = log.primaryCategory

    if (!result[date]) {
      result[date] = {}
    }

    result[date][category] = (result[date][category] || 0) + 1
  })

  return result
}

// ヒートマップ用のデータ処理関数
export const formatHeatmapData = (data = sampleLogData) => {
  const primaryCategories = ['分類A', '分類B', '分類C', '分類D']
  const dateAndCategoryData = aggregateByDateAndPrimaryCategory(data)
  const dates = Object.keys(dateAndCategoryData).sort((a, b) => a.localeCompare(b))

  const heatmapData = []
  let maxValue = 0

  dates.forEach((date, dateIndex) => {
    primaryCategories.forEach((category, categoryIndex) => {
      const count = dateAndCategoryData[date]?.[category] || 0
      maxValue = Math.max(maxValue, count)
      heatmapData.push({
        x: dateIndex,
        y: categoryIndex,
        v: count,
      })
    })
  })

  return {
    labels: {
      x: dates,
      y: primaryCategories,
    },
    datasets: [
      {
        label: 'ログ件数',
        data: heatmapData,
        backgroundColor: function (context) {
          // context.rawまたはdataIndexから値を取得
          const dataItem = context.raw || context.dataset.data[context.dataIndex]
          const value = dataItem?.v
          if (value === undefined || value === null || value === 0) {
            return 'rgba(240, 240, 240, 0.8)'
          }
          // 最大値を5として固定（サンプルデータの特性を考慮）
          const normalizedValue = Math.min(value / 5, 1)
          return `rgba(54, 162, 235, ${0.2 + normalizedValue * 0.8})`
        },
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1,
        width: ({ chart }) => chart.chartArea?.width / dates.length - 1,
        height: ({ chart }) => chart.chartArea?.height / primaryCategories.length - 1,
      },
    ],
    maxValue,
  }
}

// chart.js用のデータ形式に変換するヘルパー関数
export const formatForChartJS = {
  // 日別件数用（棒グラフ）- グラフA用
  dailyCountBarChart: () => {
    const aggregated = aggregateByDate()
    const dateAndCategoryData = aggregateByDateAndPrimaryCategory()

    return {
      labels: aggregated.map(item => item.date),
      datasets: [
        {
          label: '総発生件数',
          data: aggregated.map(item => item.count),
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          // カスタムデータとしてprimaryCategory別の詳細を追加
          primaryCategoryDetails: aggregated.map(item => {
            const date = item.date
            return dateAndCategoryData[date] || {}
          }),
        },
      ],
    }
  },

  // 日別件数用
  dailyCount: () => {
    const aggregated = aggregateByDate()
    return {
      labels: aggregated.map(item => item.date),
      datasets: [
        {
          label: '発生件数',
          data: aggregated.map(item => item.count),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
        },
      ],
    }
  },

  // 第一分類別件数用
  primaryCategoryCount: () => {
    const aggregated = aggregateByPrimaryCategory()
    return {
      labels: aggregated.map(item => item.category),
      datasets: [
        {
          label: '発生件数',
          data: aggregated.map(item => item.count),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
          ],
        },
      ],
    }
  },

  // 第二分類別件数用
  secondaryCategoryCount: () => {
    const aggregated = aggregateBySecondaryCategory()
    return {
      labels: aggregated.map(item => item.category),
      datasets: [
        {
          label: '発生件数',
          data: aggregated.map(item => item.count),
          backgroundColor: ['rgba(255, 159, 64, 0.8)', 'rgba(153, 102, 255, 0.8)', 'rgba(255, 99, 132, 0.8)'],
        },
      ],
    }
  },
}

// 使用例をコメントで記載
/*
使用例：

// 基本データ
import { sampleLogData } from './constants/sampleData.js';
console.log(sampleLogData);

// 日別集計
import { aggregateByDate } from './constants/sampleData.js';
const dailyData = aggregateByDate();

// chart.js用データ
import { formatForChartJS } from './constants/sampleData.js';
const chartData = formatForChartJS.dailyCount();

// Chart.jsでの利用例
const config = {
  type: 'line',
  data: formatForChartJS.dailyCount(),
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: '日別発生件数'
      }
    }
  }
};
*/
