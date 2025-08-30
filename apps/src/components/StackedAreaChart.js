import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { formatForChartJS } from '@/constants/sampleData'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

// 積み上げエリアチャート: primaryCategories別の日別ログ件数
export default function StackedAreaChart() {
  const chartData = formatForChartJS.stackedAreaChart()

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
        text: 'primaryCategories別の日別ログ件数（積み上げエリア）',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          footer: function (context) {
            // 全分類の合計を計算して表示
            let total = 0
            context.forEach(item => {
              total += item.parsed.y
            })
            return `合計: ${total}件`
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
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: '件数',
        },
      },
    },
    elements: {
      line: {
        tension: 0.1,
      },
      point: {
        radius: 3,
        hoverRadius: 5,
      },
    },
    maintainAspectRatio: false,
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <div style={{ height: '400px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}
