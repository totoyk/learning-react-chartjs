import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { formatForChartJS, aggregateByDateAndPrimaryCategory } from '@/constants/sampleData'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// グラフA: 日別ログ件数の縦棒グラフ（primaryCategories別詳細をツールチップで表示）
export default function ChartA() {
  const chartData = formatForChartJS.dailyCountBarChart()
  const dateAndCategoryData = aggregateByDateAndPrimaryCategory()

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '日別ログ発生件数',
      },
      tooltip: {
        callbacks: {
          afterBody: function (context) {
            const dataIndex = context[0].dataIndex
            const date = chartData.labels[dataIndex]
            const categoryDetails = dateAndCategoryData[date]

            if (!categoryDetails) return []

            const details = []
            Object.entries(categoryDetails).forEach(([category, count]) => {
              details.push(`${category}: ${count}件`)
            })

            return details.length > 0 ? ['', '分類別詳細:', ...details] : []
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '件数',
        },
      },
      x: {
        title: {
          display: true,
          text: '日付',
        },
      },
    },
    maintainAspectRatio: false,
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div style={{ height: '400px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}
