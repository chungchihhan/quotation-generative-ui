import { additionalServices } from '@/lib/data'
import type { Service } from '@/lib/types'

export function Services({ props: services }: { props: Service[] }) {
  const additionalServicesTotalAmount = additionalServices.reduce(
    (acc, service) => acc + service.price * service.quantity,
    0
  )

  const totalAmount = services.reduce(
    (acc, service) => acc + service.price * service.quantity,
    0
  )

  // Adding additionalServices total to the main services total
  const grandTotal = totalAmount + additionalServicesTotalAmount

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
          {additionalServices.map(service => (
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
              className="p-3 border border-black bg-gray-100 text-center"
              colSpan={4}
            >
              Total
            </td>
            <td className="p-3 border border-black bg-gray-100">
              {grandTotal}
            </td>
          </tr>
          <tr>
            <td
              className="p-3 border border-black bg-gray-200 text-center"
              colSpan={4}
            >
              Total + Tax(5%)
            </td>
            <td className="p-3 border border-black bg-gray-200">
              {grandTotal * 1.05}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
