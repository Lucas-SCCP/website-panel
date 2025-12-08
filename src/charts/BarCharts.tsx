import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export function BarCharts() {
  const data = [
    { name: '01/11', visitas: 10 },
    { name: '02/11', visitas: 30 },
    { name: '03/11', visitas: 50 },
    { name: '04/11', visitas: 20 },
    { name: '05/11', visitas: 25 },
    { name: '06/11', visitas: 30 },
    { name: '07/11', visitas: 32 }
  ]

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="visitas" fill="#46a8cb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
