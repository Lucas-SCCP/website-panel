import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function LineCharts() {
  const data = [
    {
      name: '01/11',
      Visitas: 24
    },
    {
      name: '02/11',
      Visitas: 13
    },
    {
      name: '03/11',
      Visitas: 25
    },
    {
      name: '04/11',
      Visitas: 28
    },
    {
      name: '05/11',
      Visitas: 10
    },
    {
      name: '06/11',
      Visitas: 17
    },
    {
      name: '07/11',
      Visitas: 26
    },
  ]

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          style={{ width: '100%', height: '100%', maxHeight: '70vh', aspectRatio: 1.618 }}
          data={data}
          >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis width="auto" />
          <Tooltip />
          <Line type="monotone" dataKey="Visitas" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
