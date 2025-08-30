import { Chart as ChartJS, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js'
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix'
import { Chart } from 'react-chartjs-2'
import { formatHeatmapData } from '@/constants/sampleData'

ChartJS.register(LinearScale, CategoryScale, Tooltip, Legend, MatrixController, MatrixElement)

// ヒートマップ: 日付×primaryCategories別ログ件数
export default function HeatmapChart() {
  const heatmapResult = formatHeatmapData()
  const chartData = {
    datasets: heatmapResult.datasets,
  }

  // デバッグ用
  console.log('Heatmap data sample:', heatmapResult.datasets[0].data.slice(0, 5))
  console.log('Max value:', heatmapResult.maxValue)
  console.log('Dataset structure:', heatmapResult.datasets[0])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '日付別・カテゴリ別ログ件数ヒートマップ',
      },
      tooltip: {
        callbacks: {
          title: function (context) {
            const point = context[0]
            const dataItem = point.raw || point.dataset.data[point.dataIndex]
            const xIndex = dataItem.x
            const yIndex = dataItem.y
            const dateLabel = heatmapResult.labels.x[xIndex]
            const categoryLabel = heatmapResult.labels.y[yIndex]
            return `${categoryLabel} - ${dateLabel}`
          },
          label: function (context) {
            const dataItem = context.raw || context.dataset.data[context.dataIndex]
            const value = dataItem?.v !== undefined ? dataItem.v : 0
            return `ログ件数: ${value}件`
          },
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: '日付',
        },
        min: -0.5,
        max: heatmapResult.labels.x.length - 0.5,
        ticks: {
          stepSize: 1,
          callback: function (value) {
            const index = Math.round(value)
            if (index >= 0 && index < heatmapResult.labels.x.length) {
              const date = heatmapResult.labels.x[index]
              return date.substring(5) // MM-DD形式で表示
            }
            return ''
          },
        },
      },
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'カテゴリ',
        },
        min: -0.5,
        max: heatmapResult.labels.y.length - 0.5,
        ticks: {
          stepSize: 1,
          callback: function (value) {
            const index = Math.round(value)
            if (index >= 0 && index < heatmapResult.labels.y.length) {
              return heatmapResult.labels.y[index]
            }
            return ''
          },
        },
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <div style={{ height: '400px' }}>
        <Chart type="matrix" data={chartData} options={options} />
      </div>
    </div>
  )
}
