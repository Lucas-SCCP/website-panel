import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const data = [
  {
    name: '01/2025',
    'Página inicial': 4000,
    Sobre: 2400,
    Lojas: 3400,
    Serviços: 1400,
    Contato: 2700
  },
  {
    name: '02/2025',
    'Página inicial': 3000,
    Sobre: 1398,
    Lojas: 2210,
    Serviços: 3100,
    Contato: 1100
  },
  {
    name: '03/2025',
    'Página inicial': 2000,
    Sobre: 9800,
    Lojas: 5290,
    Serviços: 6000,
    Contato: 4200
  },
  {
    name: '04/2025',
    'Página inicial': 2780,
    Sobre: 3908,
    Lojas: 5200,
    Serviços: 1200,
    Contato: 3500
  },
  {
    name: '05/2025',
    'Página inicial': 1890,
    Sobre: 4800,
    Lojas: 2181,
    Serviços: 1300,
    Contato: 2500
  },
  {
    name: '06/2025',
    'Página inicial': 2390,
    Sobre: 3800,
    Lojas: 4500,
    Serviços: 2900,
    Contato: 1200
  }
]

const AreaCharts = () => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="Página inicial" stackId="1" stroke="#8884d8" fill="#8884d8" />
          <Area type="monotone" dataKey="Sobre" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
          <Area type="monotone" dataKey="Lojas" stackId="1" stroke="#ffc658" fill="#ffc658" />
          <Area type="monotone" dataKey="Serviços" stackId="1" stroke="#2d67d3ff" fill="#2d67d3ff" />
          <Area type="monotone" dataKey="Contato" stackId="1" stroke="#df211bff" fill="#df211bff" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AreaCharts
