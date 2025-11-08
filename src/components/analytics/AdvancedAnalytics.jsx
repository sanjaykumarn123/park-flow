import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { TrendingUp, TrendingDown, AlertTriangle, Activity, DollarSign, Users, Clock, Zap } from 'lucide-react'

const AdvancedAnalytics = ({ lotId }) => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('24h')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [lotId, timeframe])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/analytics/dashboard?lotId=${lotId}&timeframe=${timeframe}`)
      const data = await response.json()
      setAnalytics(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!analytics) return null

  const { systemHealth, occupancyPatterns, revenueAnalysis, alerts, summary } = analytics

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Advanced Analytics</h2>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
        >
          <option value="1h">Last Hour</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>

      {/* System Health Alert */}
      {systemHealth.status !== 'healthy' && (
        <div className={`p-4 rounded-lg border ${
          systemHealth.status === 'critical' ? 'bg-red-500/10 border-red-500' : 'bg-yellow-500/10 border-yellow-500'
        }`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className={systemHealth.status === 'critical' ? 'text-red-500' : 'text-yellow-500'} />
            <span className="font-semibold">System Status: {systemHealth.status.toUpperCase()}</span>
          </div>
          {systemHealth.alerts?.length > 0 && (
            <ul className="mt-2 ml-6 space-y-1">
              {systemHealth.alerts.map((alert, idx) => (
                <li key={idx} className="text-sm text-gray-300">{alert.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Activity className="text-blue-500" />}
          title="Health Score"
          value={`${systemHealth.score.toFixed(1)}%`}
          trend={systemHealth.score > 90 ? 'up' : 'down'}
          trendValue={`${(systemHealth.score - 85).toFixed(1)}%`}
        />
        <MetricCard
          icon={<TrendingUp className="text-green-500" />}
          title="Utilization"
          value={`${summary.utilizationRate}%`}
          trend="up"
          trendValue="+5.2%"
        />
        <MetricCard
          icon={<DollarSign className="text-yellow-500" />}
          title="Weekly Revenue"
          value={`$${summary.weeklyRevenue}`}
          trend="up"
          trendValue="+12.3%"
        />
        <MetricCard
          icon={<AlertTriangle className="text-red-500" />}
          title="Active Alerts"
          value={summary.activeAlerts}
          trend={summary.activeAlerts > 0 ? 'down' : 'neutral'}
          trendValue={summary.activeAlerts > 0 ? 'Action Required' : 'All Clear'}
        />
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-700">
        {['overview', 'occupancy', 'revenue', 'predictions', 'alerts'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize ${
              activeTab === tab
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <OverviewTab 
            occupancyPatterns={occupancyPatterns} 
            revenueAnalysis={revenueAnalysis}
            systemHealth={systemHealth}
          />
        )}
        
        {activeTab === 'occupancy' && (
          <OccupancyTab patterns={occupancyPatterns} />
        )}
        
        {activeTab === 'revenue' && (
          <RevenueTab analysis={revenueAnalysis} />
        )}
        
        {activeTab === 'predictions' && (
          <PredictionsTab lotId={lotId} />
        )}
        
        {activeTab === 'alerts' && (
          <AlertsTab alerts={alerts} />
        )}
      </div>
    </div>
  )
}

// Metric Card Component
const MetricCard = ({ icon, title, value, trend, trendValue }) => (
  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
    <div className="flex items-center justify-between mb-4">
      {icon}
      {trend === 'up' && <TrendingUp className="text-green-500 w-4 h-4" />}
      {trend === 'down' && <TrendingDown className="text-red-500 w-4 h-4" />}
    </div>
    <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className={`text-sm mt-1 ${
      trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'
    }`}>
      {trendValue}
    </p>
  </div>
)

// Overview Tab
const OverviewTab = ({ occupancyPatterns, revenueAnalysis, systemHealth }) => {
  const performanceData = [
    { metric: 'Utilization', value: parseFloat(occupancyPatterns.patterns.utilizationRate) },
    { metric: 'Efficiency', value: occupancyPatterns.patterns.efficiencyScore },
    { metric: 'Turnover', value: parseFloat(occupancyPatterns.patterns.turnoverRate) * 20 },
    { metric: 'Revenue', value: revenueAnalysis.analysis.efficiency * 100 },
    { metric: 'System Health', value: systemHealth.score }
  ]

  const peakHoursData = occupancyPatterns.patterns.peakHours.map(ph => ({
    hour: `${ph.hour}:00`,
    occupancy: ph.occupancy
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Performance Radar */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={performanceData}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="metric" stroke="#9ca3af" />
            <PolarRadiusAxis stroke="#9ca3af" />
            <Radar name="Performance" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Peak Hours */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Peak Hours Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={peakHoursData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="hour" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="occupancy" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* System Metrics */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">System Performance</h3>
        <div className="space-y-4">
          <MetricRow 
            label="API Response Time" 
            value={`${systemHealth.metrics.api.responseTime.toFixed(0)}ms`}
            status={systemHealth.metrics.api.responseTime < 200 ? 'good' : 'warning'}
          />
          <MetricRow 
            label="Error Rate" 
            value={`${systemHealth.metrics.api.errorRate.toFixed(2)}%`}
            status={systemHealth.metrics.api.errorRate < 1 ? 'good' : 'error'}
          />
          <MetricRow 
            label="Cache Hit Rate" 
            value={`${(systemHealth.metrics.cache.hitRate * 100).toFixed(1)}%`}
            status={systemHealth.metrics.cache.hitRate > 0.8 ? 'good' : 'warning'}
          />
          <MetricRow 
            label="Active Connections" 
            value={systemHealth.metrics.api.activeConnections}
            status="good"
          />
        </div>
      </div>

      {/* Revenue Growth */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Revenue Insights</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Growth Rate</span>
              <span className="text-green-500 font-semibold">+{revenueAnalysis.analysis.growth.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${Math.min(revenueAnalysis.analysis.growth, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Efficiency Score</span>
              <span className="text-blue-500 font-semibold">{(revenueAnalysis.analysis.efficiency * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${revenueAnalysis.analysis.efficiency * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Occupancy Tab
const OccupancyTab = ({ patterns }) => {
  const demandCurveData = patterns.patterns.demandCurve || []
  
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">24-Hour Demand Curve</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={demandCurveData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="hour" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
              labelStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="demand" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h4 className="text-gray-400 text-sm mb-2">Utilization Rate</h4>
          <p className="text-3xl font-bold text-white">{patterns.patterns.utilizationRate}%</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h4 className="text-gray-400 text-sm mb-2">Turnover Rate</h4>
          <p className="text-3xl font-bold text-white">{patterns.patterns.turnoverRate}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h4 className="text-gray-400 text-sm mb-2">Efficiency Score</h4>
          <p className="text-3xl font-bold text-white">{patterns.patterns.efficiencyScore.toFixed(1)}</p>
        </div>
      </div>
    </div>
  )
}

// Revenue Tab
const RevenueTab = ({ analysis }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h4 className="text-gray-400 text-sm mb-2">Total Revenue</h4>
          <p className="text-3xl font-bold text-white">${analysis.analysis.total}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h4 className="text-gray-400 text-sm mb-2">Average Revenue</h4>
          <p className="text-3xl font-bold text-white">${analysis.analysis.average.toFixed(2)}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h4 className="text-gray-400 text-sm mb-2">Growth Rate</h4>
          <p className="text-3xl font-bold text-green-500">+{analysis.analysis.growth.toFixed(1)}%</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h4 className="text-gray-400 text-sm mb-2">Efficiency</h4>
          <p className="text-3xl font-bold text-blue-500">{(analysis.analysis.efficiency * 100).toFixed(0)}%</p>
        </div>
      </div>

      {analysis.analysis.opportunities?.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue Opportunities</h3>
          <ul className="space-y-2">
            {analysis.analysis.opportunities.map((opp, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Zap className="text-yellow-500 w-5 h-5 mt-0.5" />
                <span className="text-gray-300">{opp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Predictions Tab
const PredictionsTab = ({ lotId }) => {
  const [predictions, setPredictions] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPredictions()
  }, [lotId])

  const fetchPredictions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/predict/advanced`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lotId, hoursAhead: 8 })
      })
      const data = await response.json()
      setPredictions(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch predictions:', error)
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-8">Loading predictions...</div>
  if (!predictions) return null

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">ML-Based Prediction</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Predicted Occupancy</p>
            <p className="text-3xl font-bold text-white">{predictions.prediction.toFixed(0)}%</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Confidence</p>
            <p className="text-3xl font-bold text-green-500">{(predictions.confidence * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Model Version</p>
            <p className="text-lg font-semibold text-blue-500">{predictions.model}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 p-4 rounded">
            <p className="text-gray-400 text-sm mb-1">Trend Component</p>
            <p className="text-xl font-semibold text-white">{predictions.breakdown.trend.toFixed(1)}</p>
          </div>
          <div className="bg-gray-900 p-4 rounded">
            <p className="text-gray-400 text-sm mb-1">Demand Factor</p>
            <p className="text-xl font-semibold text-white">{predictions.breakdown.demand.toFixed(1)}</p>
          </div>
          <div className="bg-gray-900 p-4 rounded">
            <p className="text-gray-400 text-sm mb-1">Seasonal Factor</p>
            <p className="text-xl font-semibold text-white">{predictions.breakdown.seasonal.toFixed(1)}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Model Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(predictions.metadata.modelVersions).map(([model, version]) => (
            <div key={model} className="bg-gray-900 p-3 rounded">
              <p className="text-gray-400 text-xs capitalize">{model.replace(/([A-Z])/g, ' $1').trim()}</p>
              <p className="text-sm font-semibold text-blue-500">v{version}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Alerts Tab
const AlertsTab = ({ alerts }) => {
  if (!alerts.alerts || alerts.alerts.length === 0) {
    return (
      <div className="bg-gray-800 p-12 rounded-lg border border-gray-700 text-center">
        <Activity className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <p className="text-xl font-semibold text-white mb-2">All Systems Operational</p>
        <p className="text-gray-400">No active alerts at this time</p>
      </div>
    )
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-500/10'
      case 'high': return 'border-orange-500 bg-orange-500/10'
      case 'medium': return 'border-yellow-500 bg-yellow-500/10'
      default: return 'border-blue-500 bg-blue-500/10'
    }
  }

  return (
    <div className="space-y-4">
      {alerts.alerts.map((alert, idx) => (
        <div key={idx} className={`p-6 rounded-lg border ${getSeverityColor(alert.severity)}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold text-white capitalize">{alert.type}</span>
                <span className={`px-2 py-1 rounded text-xs uppercase ${
                  alert.severity === 'critical' ? 'bg-red-500' :
                  alert.severity === 'high' ? 'bg-orange-500' :
                  alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}>
                  {alert.severity}
                </span>
              </div>
              <p className="text-gray-300 mb-3">{alert.message}</p>
              {alert.action && (
                <div className="bg-gray-900 p-3 rounded">
                  <p className="text-sm text-gray-400 mb-1">Recommended Action:</p>
                  <p className="text-white">{alert.action}</p>
                </div>
              )}
              {alert.predictedImpact && (
                <p className="text-sm text-gray-400 mt-2">Impact: {alert.predictedImpact}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Helper Component
const MetricRow = ({ label, value, status }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-400">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-white font-semibold">{value}</span>
      <div className={`w-2 h-2 rounded-full ${
        status === 'good' ? 'bg-green-500' :
        status === 'warning' ? 'bg-yellow-500' :
        status === 'error' ? 'bg-red-500' : 'bg-gray-500'
      }`} />
    </div>
  </div>
)

export default AdvancedAnalytics
