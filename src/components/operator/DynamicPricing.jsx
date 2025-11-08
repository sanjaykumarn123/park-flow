import { useState } from 'react'
import { TrendingUp, Sparkles, IndianRupee, Save } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { usePost } from '../../hooks/useFetch'
import useStore from '../../store/useStore'

const DynamicPricing = ({ lots }) => {
  const [selectedLot, setSelectedLot] = useState(lots[0]?.id)
  const [customPrice, setCustomPrice] = useState('')
  const { post: suggestPrice, loading: suggesting } = usePost('/api/ai-assistant')
  const { post: updatePrice, loading: updating } = usePost('/api/pricing/update')
  const { addNotification } = useStore()

  const lot = lots.find((l) => l.id === selectedLot) || lots[0]

  // Mock pricing history data
  const pricingHistory = [
    { time: '00:00', price: 30 },
    { time: '04:00', price: 25 },
    { time: '08:00', price: 45 },
    { time: '12:00', price: 50 },
    { time: '16:00', price: 55 },
    { time: '20:00', price: 40 },
    { time: '23:59', price: 35 },
  ]

  const handleAISuggest = async () => {
    try {
      const result = await suggestPrice({
        lotId: selectedLot,
        occupancyRate: (lot.occupied / lot.capacity) * 100,
        currentPrice: lot.pricePerHour,
        timeOfDay: new Date().getHours(),
      })

      setCustomPrice(result.suggestedPrice || lot.pricePerHour + 10)
      
      addNotification({
        type: 'info',
        title: 'AI Price Suggestion',
        message: `Suggested price: ₹${result.suggestedPrice}/hr based on current demand`,
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Suggestion Failed',
        message: 'Could not generate price suggestion',
      })
    }
  }

  const handleUpdatePrice = async () => {
    if (!customPrice) return

    try {
      await updatePrice({
        lotId: selectedLot,
        newPrice: parseFloat(customPrice),
      })

      addNotification({
        type: 'success',
        title: 'Price Updated',
        message: `Price for ${lot.name} updated to ₹${customPrice}/hr`,
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not update pricing',
      })
    }
  }

  const occupancyPercent = lot ? (lot.occupied / lot.capacity) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Lot Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Parking Lot
        </label>
        <select
          value={selectedLot}
          onChange={(e) => setSelectedLot(e.target.value)}
          className="input-field w-full md:w-auto"
        >
          {lots.map((lot) => (
            <option key={lot.id} value={lot.id}>
              {lot.name}
            </option>
          ))}
        </select>
      </div>

      {lot && (
        <>
          {/* Current Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-dark-hover rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Current Price</p>
              <p className="text-2xl font-bold text-gray-100 flex items-center">
                <IndianRupee className="w-5 h-5" />
                {lot.pricePerHour}
                <span className="text-sm text-gray-400 ml-1">/hr</span>
              </p>
            </div>
            <div className="bg-dark-hover rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-100">
                {occupancyPercent.toFixed(0)}%
              </p>
            </div>
            <div className="bg-dark-hover rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Available Slots</p>
              <p className="text-2xl font-bold text-gray-100">
                {lot.capacity - lot.occupied}/{lot.capacity}
              </p>
            </div>
          </div>

          {/* Pricing Chart */}
          <div className="bg-dark-hover rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              24-Hour Pricing Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={pricingHistory}>
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
                  dataKey="price"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* AI Pricing Control */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">
                  AI-Powered Pricing
                </h3>
                <p className="text-sm text-gray-400">
                  Get intelligent price suggestions based on demand, occupancy, and time
                </p>
              </div>
              <div className="bg-primary/20 p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Set Custom Price (₹/hour)
                </label>
                <input
                  type="number"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  placeholder={lot.pricePerHour.toString()}
                  className="input-field w-full"
                  min="0"
                  step="5"
                />
              </div>
              <div className="flex items-end space-x-2">
                <button
                  onClick={handleAISuggest}
                  disabled={suggesting}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>{suggesting ? 'Analyzing...' : 'AI Suggest'}</span>
                </button>
                <button
                  onClick={handleUpdatePrice}
                  disabled={updating || !customPrice}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{updating ? 'Updating...' : 'Update Price'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card bg-success/5 border-success/30">
              <h4 className="text-sm font-semibold text-success mb-2">Low Demand</h4>
              <p className="text-2xl font-bold text-gray-100 flex items-center mb-1">
                <IndianRupee className="w-5 h-5" />
                {Math.floor(lot.pricePerHour * 0.8)}
              </p>
              <p className="text-xs text-gray-400">When occupancy &lt; 50%</p>
            </div>
            <div className="card bg-warning/5 border-warning/30">
              <h4 className="text-sm font-semibold text-warning mb-2">Medium Demand</h4>
              <p className="text-2xl font-bold text-gray-100 flex items-center mb-1">
                <IndianRupee className="w-5 h-5" />
                {lot.pricePerHour}
              </p>
              <p className="text-xs text-gray-400">When occupancy 50-80%</p>
            </div>
            <div className="card bg-danger/5 border-danger/30">
              <h4 className="text-sm font-semibold text-danger mb-2">High Demand</h4>
              <p className="text-2xl font-bold text-gray-100 flex items-center mb-1">
                <IndianRupee className="w-5 h-5" />
                {Math.floor(lot.pricePerHour * 1.3)}
              </p>
              <p className="text-xs text-gray-400">When occupancy &gt; 80%</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DynamicPricing
