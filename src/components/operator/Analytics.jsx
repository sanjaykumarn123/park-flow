import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, DollarSign, Clock, Users } from 'lucide-react'

const Analytics = ({ data }) => {
  // Mock data for charts
  const revenueData = [
    { day: 'Mon', revenue: 4500 },
    { day: 'Tue', revenue: 5200 },
    { day: 'Wed', revenue: 4800 },
    { day: 'Thu', revenue: 6100 },
    { day: 'Fri', revenue: 7200 },
    { day: 'Sat', revenue: 8500 },
    { day: 'Sun', revenue: 7800 },
  ]

  const utilizationData = [
    { hour: '00:00', rate: 20 },
    { hour: '04:00', rate: 15 },
    { hour: '08:00', rate: 65 },
    { hour: '12:00', rate: 85 },
    { hour: '16:00', rate: 90 },
    { hour: '20:00', rate: 70 },
    { hour: '23:00', rate: 45 },
  ]

  const vehicleTypeData = [
    { name: 'Car', value: 65, color: '#3b82f6' },
    { name: 'Bike', value: 25, color: '#10b981' },
    { name: 'SUV', value: 10, color: '#f59e0b' },
  ]

  const peakHoursData = [
    { hour: '08-10 AM', bookings: 45 },
    { hour: '12-02 PM', bookings: 52 },
    { hour: '05-07 PM', bookings: 68 },
    { hour: '08-10 PM', bookings: 38 },
  ]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-dark-hover rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Weekly Revenue</p>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-gray-100">₹44,100</p>
          <p className="text-xs text-success mt-1">↑ 12% from last week</p>
        </div>

        <div className="bg-dark-hover rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Avg. Utilization</p>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-bold text-gray-100">68%</p>
          <p className="text-xs text-success mt-1">↑ 5% from last week</p>
        </div>

        <div className="bg-dark-hover rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Total Bookings</p>
            <Users className="w-4 h-4 text-warning" />
          </div>
          <p className="text-2xl font-bold text-gray-100">342</p>
          <p className="text-xs text-success mt-1">↑ 8% from last week</p>
        </div>

        <div className="bg-dark-hover rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Avg. Duration</p>
            <Clock className="w-4 h-4 text-danger" />
          </div>
          <p className="text-2xl font-bold text-gray-100">2.4h</p>
          <p className="text-xs text-gray-400 mt-1">Same as last week</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-dark-hover rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Daily Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="day" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Utilization & Vehicle Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilization Chart */}
        <div className="bg-dark-hover rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">
            Hourly Utilization Rate
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={utilizationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="hour" stroke="#6b7280" />
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
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Vehicle Type Distribution */}
        <div className="bg-dark-hover rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">
            Vehicle Type Distribution
          </h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={vehicleTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vehicleTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Peak Hours */}
      <div className="bg-dark-hover rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Peak Booking Hours</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={peakHoursData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis type="number" stroke="#6b7280" />
            <YAxis dataKey="hour" type="category" stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="bookings" fill="#f59e0b" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Analytics
