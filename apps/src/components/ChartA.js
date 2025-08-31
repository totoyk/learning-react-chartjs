import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { Bar } from 'react-chartjs-2'
import { formatForChartJS, aggregateByDateAndPrimaryCategory } from '@/constants/sampleData'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin)

// グラフA: 日別ログ件数の縦棒グラフ（基準線付き、primaryCategories別詳細をツールチップで表示）
export default function ChartA() {
  const threshold = 10 // 基準線の値
  const chartData = formatForChartJS.dailyCountBarChartWithThreshold(threshold)
  const dateAndCategoryData = aggregateByDateAndPrimaryCategory()

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `日別ログ発生件数（基準線: ${threshold}件）`,
      },
      tooltip: {
        callbacks: {
          afterBody: function (context) {
            const dataIndex = context[0].dataIndex
            const date = chartData.labels[dataIndex]
            const categoryDetails = dateAndCategoryData[date]
            const currentValue = context[0].parsed.y

            let details = []
            
            // 基準線との比較情報を追加
            if (currentValue >= threshold) {
              details.push(`基準線を${currentValue - threshold}件超過`)
            } else {
              details.push(`基準線まであと${threshold - currentValue}件`)
            }

            if (categoryDetails) {
              details.push('') // 空行
              details.push('分類別詳細:')
              Object.entries(categoryDetails).forEach(([category, count]) => {
                details.push(`${category}: ${count}件`)
              })
            }

            return details
          },
        },
      },
      annotation: {
        annotations: {
          threshold: {
            type: 'line',
            yMin: threshold,
            yMax: threshold,
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              display: true,
              content: `基準線 (${threshold}件)`,
              position: 'end',
              backgroundColor: 'rgba(255, 99, 132, 0.8)',
              color: 'white',
              padding: 4,
            },
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
