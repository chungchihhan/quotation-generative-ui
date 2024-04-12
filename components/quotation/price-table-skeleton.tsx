export const PriceTableSkeleton = () => {
  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="min-w-full divide-y divide-gray-200 animate-pulse">
          <div className="bg-gray-50">
            <div className="grid grid-cols-6 px-6 py-3 text-xs font-medium text-gray-800 uppercase tracking-wider">
              <p>-</p>
              <p>-</p>
              <p>-</p>
              <p>-</p>
              <p>-</p>
              <p>-</p>
            </div>
          </div>
          <div className="bg-white">
            {/* Table rows go here */}
            {/* Example row */}
            <div className="grid grid-cols-6 px-6 py-4">
              <p>-</p>
              <p>-</p>
              <p>-</p>
              <p>-</p>
              <p>-</p>
              <p>-</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
