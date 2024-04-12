export function ServicesSkeleton() {
  return (
    <div className="w-full">
      <table className="w-full">
        <thead className="">
          <tr>
            <th className="p-3 bg-gray-100 h-12"></th>
            {/* <th className="p-3  bg-gray-100">--</th>
            <th className="p-3  bg-gray-100">--</th>
            <th className="p-3  bg-gray-100">--</th> */}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3 bg-white h-12"></td>
            {/* <td className="p-3  bg-white">--</td>
            <td className="p-3  bg-white">--</td>
            <td className="p-3  bg-white">--</td> */}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
