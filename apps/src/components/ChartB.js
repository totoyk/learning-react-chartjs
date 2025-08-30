import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { formatForChartJS } from '@/constants/sampleData'

ChartJS.register(ArcElement, Tooltip, Legend)

// グラフB: secondaryCategories別割合の円グラフ
export default function ChartB() {
  const chartData = formatForChartJS.secondaryCategoryCount()

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        align: 'center',
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'セカンダリカテゴリ別割合',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((sum, value) => sum + value, 0)
            const percentage = ((context.parsed / total) * 100).toFixed(1)
            return `${context.label}: ${context.parsed}件 (${percentage}%)`
          },
        },
      },
    },
    maintainAspectRatio: false,
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div style={{ height: '400px' }}>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  )
}
