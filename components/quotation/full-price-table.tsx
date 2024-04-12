interface Service {
  name: string
  details: string
  price: number
  quantity: number
}

export const FullPriceTable = ({ props: services }: { props: Service[] }) => {
  return (
    <div className="">
      <table className="w-full">
        <thead>
          <tr>
            <th className="border">Service Name</th>
            <th className="border">Service Details</th>
            <th className="border">Price</th>
            <th className="border">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service.name}>
              <td className="border">{service.name}</td>
              <td className="border">{service.details}</td>
              <td className="border">{service.price}</td>
              <td className="border">{service.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
