import { useState, useEffect } from 'react'
import { Calendar, TrendingUp, MapPin } from 'lucide-react'

const DemandHeatmap = ({ lotId }) => {
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    fetchDemandForecast()
  }, [lotId])

  const fetchDemandForecast = async () => {
    try {
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + 7)

      const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/predict/demand-forecast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lotId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          externalFactors: {
            events: [],
            weather: {},
            holidays: [],
            trafficData: {}
          }
        })
      })
      const data = await response.json()
      setForecast(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch demand forecast:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (!forecast) return null

  const getDemandColor = (demand, maxDemand) => {
    const ratio = demand / maxDemand
    if (ratio >= 0.9) return 'bg-red-500'
    if (ratio >= 0.7) return 'bg-orange-500'
    if (ratio >= 0.5) return 'bg-yellow-500'
    if (ratio >= 0.3) return 'bg-green-500'
    return 'bg-blue-500'
  }

  const maxDemand = Math.max(...forecast.forecast.map(f => f.predictedDemand))

  // Group by day of week
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="text-blue-500 w-6 h-6" />
          <h3 className="text-xl font-bold text-white">7-Day Demand Forecast Heatmap</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <MapPin className="w-4 h-4" />
          <span>Lot ID: {lotId}</span>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day Headers */}
          <div className="grid grid-cols-8 gap-2 mb-4">
            <div className="text-sm font-semibold text-gray-400">Hour</div>
            {forecast.forecast.slice(0, 7).map((day, idx) => (
              <div key={idx} className="text-center">
                <div className="text-sm font-semibold text-white">
                  {dayLabels[new Date(day.date).getDay()]}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>

          {/* Heatmap Grid - Simulated hourly data */}
          {hours.map(hour => (
            <div key={hour} className="grid grid-cols-8 gap-2 mb-2">
              <div className="text-sm text-gray-400 flex items-center">
                {hour.toString().padStart(2, '0')}:00
              </div>
              {forecast.forecast.slice(0, 7).map((day, dayIdx) => {
                // Simulate hourly variation
                const baselineDemand = day.predictedDemand
                const hourlyVariation = Math.sin((hour - 12) * Math.PI / 12) * 0.3
                const hourlyDemand = baselineDemand * (1 + hourlyVariation)
                const isPeak = hour >= 8 && hour <= 10 || hour >= 17 && hour <= 19
                const finalDemand = isPeak ? hourlyDemand * 1.3 : hourlyDemand

                return (
                  <div
                    key={dayIdx}
                    className={`h-8 rounded cursor-pointer transition-all hover:opacity-80 hover:scale-105 ${getDemandColor(finalDemand, maxDemand * 1.3)}`}
                    onClick={() => setSelectedDate({ day: day.date, hour, demand: finalDemand })}
                    title={`${Math.round(finalDemand)}% demand`}
                  />
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-6">
          <span className="text-sm text-gray-400">Low</span>
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded bg-blue-500"></div>
            <div className="w-6 h-6 rounded bg-green-500"></div>
            <div className="w-6 h-6 rounded bg-yellow-500"></div>
            <div className="w-6 h-6 rounded bg-orange-500"></div>
            <div className="w-6 h-6 rounded bg-red-500"></div>
          </div>
          <span className="text-sm text-gray-400">High</span>
        </div>
      </div>

      {/* Selected Cell Details */}
      {selectedDate && (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">Demand Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Date & Time</p>
              <p className="text-white font-semibold">
                {new Date(selectedDate.day).toLocaleDateString()} at {selectedDate.hour}:00
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Predicted Demand</p>
              <p className="text-white font-semibold">{Math.round(selectedDate.demand)}%</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Confidence</p>
              <p className="text-green-500 font-semibold">85%</p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-400 text-sm">Peak Demand Day</h4>
            <TrendingUp className="text-red-500 w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-white">
            {dayLabels[new Date(forecast.forecast[0].date).getDay()]}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {Math.max(...forecast.forecast.map(f => f.predictedDemand))}% occupancy
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h4 className="text-gray-400 text-sm mb-2">Average Weekly Demand</h4>
          <p className="text-2xl font-bold text-white">
            {Math.round(forecast.forecast.reduce((acc, f) => acc + f.predictedDemand, 0) / forecast.forecast.length)}%
          </p>
          <p className="text-sm text-green-500 mt-1">+8% vs last week</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h4 className="text-gray-400 text-sm mb-2">Forecast Confidence</h4>
          <p className="text-2xl font-bold text-white">
            {Math.round(forecast.forecast.reduce((acc, f) => acc + f.confidence, 0) / forecast.forecast.length * 100)}%
          </p>
          <p className="text-sm text-gray-400 mt-1">Based on historical patterns</p>
        </div>
      </div>

      {/* Alerts from Summary */}
      {forecast.alerts && forecast.alerts.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-yellow-500 mb-3">Demand Alerts</h4>
          <ul className="space-y-2">
            {forecast.alerts.map((alert, idx) => (
              <li key={idx} className="text-gray-300 flex items-start gap-2">
                <span className="text-yellow-500 mt-1">•</span>
                <span>{alert}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Insights */}
      {forecast.summary && (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">AI Insights</h4>
          <div className="space-y-3">
            <p className="text-gray-300">{forecast.summary}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-900 p-4 rounded">
                <p className="text-gray-400 text-sm mb-1">Best booking times</p>
                <p className="text-white font-semibold">Early mornings (6-8 AM)</p>
              </div>
              <div className="bg-gray-900 p-4 rounded">
                <p className="text-gray-400 text-sm mb-1">Avoid peak hours</p>
                <p className="text-white font-semibold">Evenings (5-7 PM)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DemandHeatmap
