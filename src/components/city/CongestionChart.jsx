import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const CongestionChart = ({ eventMode }) => {
  const baseData = [
    { time: '00:00', rate: 15 },
    { time: '04:00', rate: 10 },
    { time: '08:00', rate: 65 },
    { time: '12:00', rate: 55 },
    { time: '16:00', rate: 75 },
    { time: '20:00', rate: 45 },
    { time: '23:00', rate: 25 },
  ]

  const data = eventMode
    ? baseData.map(d => ({ ...d, rate: Math.min(100, d.rate * 1.2) }))
    : baseData

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-100">
          Congestion Trend (24h)
        </h3>
        {eventMode && (
          <span className="badge-warning">Event Mode Active</span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis dataKey="time" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
            }}
          />
          <Line
            type="monotone"
            dataKey="rate"
            stroke={eventMode ? '#f59e0b' : '#3b82f6'}
            strokeWidth={3}
            dot={{ fill: eventMode ? '#f59e0b' : '#3b82f6', r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Peak Hour</p>
          <p className="text-sm font-semibold text-gray-100">16:00 - 18:00</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Avg. Congestion</p>
          <p className="text-sm font-semibold text-gray-100">
            {eventMode ? '48%' : '40%'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Low Traffic</p>
          <p className="text-sm font-semibold text-gray-100">02:00 - 06:00</p>
        </div>
      </div>
    </div>
  )
}

export default CongestionChart
