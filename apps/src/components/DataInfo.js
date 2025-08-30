import PropTypes from 'prop-types'

// データ情報表示コンポーネント
export default function DataInfo({ totalCount, currentPage, totalPages, startIndex, endIndex }) {
  return (
    <div className="mb-4 text-gray-600">
      <p>総件数: {totalCount}件</p>
      <p>
        ページ {currentPage} / {totalPages} （{startIndex + 1}-{Math.min(endIndex, totalCount)}
        件目を表示）
      </p>
    </div>
  )
}

DataInfo.propTypes = {
  totalCount: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  startIndex: PropTypes.number.isRequired,
  endIndex: PropTypes.number.isRequired,
}
