import PropTypes from 'prop-types'

// データテーブルコンポーネント
export default function DataTable({ data }) {
  // 時刻のみを表示
  const formatTime = datetime => {
    const date = new Date(datetime)
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  // 日付のみを表示
  const formatDate = datetime => {
    const date = new Date(datetime)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  return (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">ID</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">第一分類</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">第二分類</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">日付</th>
            <th className="px-4 py-2 border-b text-left text-sm font-medium text-gray-900">時刻</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b text-sm text-gray-900">{item.id}</td>
              <td className="px-4 py-2 border-b text-sm text-gray-900">{item.primaryCategory}</td>
              <td className="px-4 py-2 border-b text-sm text-gray-900">{item.secondaryCategory}</td>
              <td className="px-4 py-2 border-b text-sm text-gray-900">{formatDate(item.datetime)}</td>
              <td className="px-4 py-2 border-b text-sm text-gray-900">{formatTime(item.datetime)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

DataTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      primaryCategory: PropTypes.string.isRequired,
      secondaryCategory: PropTypes.string.isRequired,
      datetime: PropTypes.string.isRequired,
    })
  ).isRequired,
}
