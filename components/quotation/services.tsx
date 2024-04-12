interface Service {
  service_name: string
  service_details: string
  price: number
  quantity: number
}

export function Services({ props: services }: { props: Service[] }) {
  const totalAmount = services.reduce(
    (acc, service) => acc + service.price * service.quantity,
    0
  )

  return (
    <div className="flex">
      <table className="border border-black">
        <thead className="">
          <tr>
            <th className="p-3 border border-black bg-gray-100">
              Service Name
            </th>
            <th className="p-3 border border-black bg-gray-100">
              Service Details
            </th>
            <th className="p-3 border border-black bg-gray-100">Quantity</th>
            <th className="p-3 border border-black bg-gray-100">Price</th>
            <th className="p-3 border border-black bg-gray-100">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service.service_name}>
              <td className="p-3 border border-black bg-white">
                {service.service_name}
              </td>
              <td className="p-3 border border-black bg-white">
                {service.service_details}
              </td>
              <td className="p-3 border border-black bg-white">
                {service.quantity}
              </td>
              <td className="p-3 border border-black bg-white">
                {service.price}
              </td>
              <td className="p-3 border border-black bg-white">
                {service.price * service.quantity}
              </td>
            </tr>
          ))}
          <tr>
            <td
              className="p-3 border border-black bg-white text-center"
              colSpan={4}
            >
              Total
            </td>
            <td className="p-3 border border-black bg-gray-100">
              {totalAmount}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
