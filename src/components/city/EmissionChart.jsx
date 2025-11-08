import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Leaf } from 'lucide-react'

const EmissionChart = () => {
  const data = [
    { day: 'Mon', reduction: 145 },
    { day: 'Tue', reduction: 168 },
    { day: 'Wed', reduction: 152 },
    { day: 'Thu', reduction: 189 },
    { day: 'Fri', reduction: 201 },
    { day: 'Sat', reduction: 178 },
    { day: 'Sun', reduction: 165 },
  ]

  const totalReduction = data.reduce((sum, d) => sum + d.reduction, 0)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-100">
          CO₂ Emission Reduction
        </h3>
        <div className="flex items-center space-x-2">
          <Leaf className="w-5 h-5 text-success" />
          <span className="text-sm font-semibold text-success">
            {totalReduction}kg this week
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis dataKey="day" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
            }}
            formatter={(value) => [`${value} kg`, 'CO₂ Reduced']}
          />
          <Bar dataKey="reduction" fill="#10b981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 bg-success/10 border border-success/30 rounded-lg p-4">
        <p className="text-sm text-gray-300">
          <span className="font-semibold text-success">Environmental Impact:</span> Smart
          parking reduced unnecessary driving by approximately 2,500 km this week,
          equivalent to planting 8 trees.
        </p>
      </div>
    </div>
  )
}

export default EmissionChart
