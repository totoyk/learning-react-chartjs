import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Chart } from 'react-chartjs-2'
import { formatForChartJS, aggregateByDateAndPrimaryCategory } from '@/constants/sampleData'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend)

// グラフA: 日別ログ件数の縦棒グラフ + primaryCategories別の折れ線グラフ（複合グラフ）
export default function ChartA() {
  const chartData = formatForChartJS.combinedDailyChart()
  const dateAndCategoryData = aggregateByDateAndPrimaryCategory()

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '日別ログ発生件数（総数と分類別）',
      },
      tooltip: {
        callbacks: {
          afterBody: function (context) {
            // 棒グラフ（総件数）のツールチップでのみ詳細を表示
            const barDataIndex = context.findIndex(item => item.dataset.type === 'bar')
            if (barDataIndex === -1) return []

            const dataIndex = context[barDataIndex].dataIndex
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
      x: {
        title: {
          display: true,
          text: '日付',
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        title: {
          display: true,
          text: '総件数',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        title: {
          display: true,
          text: '分類別件数',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    maintainAspectRatio: false,
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div style={{ height: '400px' }}>
        <Chart type="bar" data={chartData} options={options} />
      </div>
    </div>
  )
}
