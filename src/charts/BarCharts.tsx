import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const data = [
  { name: 'Jan', visitas: 400 },
  { name: 'Fev', visitas: 300 },
  { name: 'Mar', visitas: 500 },
  { name: 'Abr', visitas: 200 },
  { name: 'Mai', visitas: 350 },
];

const BarCharts = () => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="visitas" fill="#AAA" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarCharts;