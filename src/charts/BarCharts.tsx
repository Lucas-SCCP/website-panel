import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const data = [
  { name: 'Página inicial', visitas: 400 },
  { name: 'Sobre', visitas: 300 },
  { name: 'Lojas', visitas: 500 },
  { name: 'Serviços', visitas: 200 },
  { name: 'Contato', visitas: 350 }
]

const BarCharts = () => {
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

export default BarCharts
