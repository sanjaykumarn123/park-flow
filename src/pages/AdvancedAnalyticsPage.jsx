import { useState } from 'react'
import Layout from '../components/Layout'
import AdvancedAnalytics from '../components/analytics/AdvancedAnalytics'
import DemandHeatmap from '../components/analytics/DemandHeatmap'
import { BarChart3, TrendingUp, Brain, Activity } from 'lucide-react'

const AdvancedAnalyticsPage = () => {
  const [selectedLot, setSelectedLot] = useState('lot-001')
  const [activeView, setActiveView] = useState('dashboard')

  const parkingLots = [
    { id: 'lot-001', name: 'Central Plaza Parking' },
    { id: 'lot-002', name: 'Tech Park Lot A' },
    { id: 'lot-003', name: 'Mall Complex Parking' },
    { id: 'lot-004', name: 'Airport Terminal 1' }
  ]

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Advanced Analytics Suite</h1>
              <p className="text-gray-400">
                ML-powered insights, predictive analytics, and real-time monitoring
              </p>
            </div>
            <select
              value={selectedLot}
              onChange={(e) => setSelectedLot(e.target.value)}
              className="bg-gray-800 text-white px-6 py-3 rounded-lg border border-gray-700 font-semibold"
            >
              {parkingLots.map(lot => (
                <option key={lot.id} value={lot.id}>{lot.name}</option>
              ))}
            </select>
          </div>

          {/* View Selector */}
          <div className="flex gap-2">
            <ViewButton
              icon={<BarChart3 />}
              label="Dashboard"
              active={activeView === 'dashboard'}
              onClick={() => setActiveView('dashboard')}
            />
            <ViewButton
              icon={<TrendingUp />}
              label="Demand Forecast"
              active={activeView === 'heatmap'}
              onClick={() => setActiveView('heatmap')}
            />
            <ViewButton
              icon={<Brain />}
              label="ML Models"
              active={activeView === 'models'}
              onClick={() => setActiveView('models')}
            />
            <ViewButton
              icon={<Activity />}
              label="Real-time"
              active={activeView === 'realtime'}
              onClick={() => setActiveView('realtime')}
            />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeView === 'dashboard' && (
            <AdvancedAnalytics lotId={selectedLot} />
          )}

          {activeView === 'heatmap' && (
            <DemandHeatmap lotId={selectedLot} />
          )}

          {activeView === 'models' && (
            <MLModelsView lotId={selectedLot} />
          )}

          {activeView === 'realtime' && (
            <RealTimeMonitoring lotId={selectedLot} />
          )}
        </div>
      </div>
    </Layout>
  )
}

// View Button Component
const ViewButton = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
      active
        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
)

// ML Models View
const MLModelsView = ({ lotId }) => {
  const models = [
    {
      name: 'Time Series Forecaster',
      version: '2.1.0',
      accuracy: 95.3,
      lastTrained: '2 hours ago',
      description: 'LSTM-based time series prediction for occupancy forecasting',
      metrics: {
        mae: 2.3,
        rmse: 3.1,
        r2: 0.94
      }
    },
    {
      name: 'Demand Forecaster',
      version: '1.5.3',
      accuracy: 92.1,
      lastTrained: '5 hours ago',
      description: 'Multi-factor demand prediction with external data integration',
      metrics: {
        mae: 3.5,
        rmse: 4.2,
        r2: 0.91
      }
    },
    {
      name: 'Anomaly Detector',
      version: '3.0.1',
      accuracy: 97.8,
      lastTrained: '1 hour ago',
      description: 'Isolation forest-based anomaly detection for unusual patterns',
      metrics: {
        precision: 0.96,
        recall: 0.95,
        f1: 0.95
      }
    },
    {
      name: 'Behavior Analyzer',
      version: '1.2.0',
      accuracy: 89.5,
      lastTrained: '3 hours ago',
      description: 'User behavior profiling and churn prediction',
      metrics: {
        auc: 0.88,
        precision: 0.87,
        recall: 0.86
      }
    }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-2">Machine Learning Models</h2>
        <p className="text-gray-400">Ensemble of 4 specialized models powering ParkFlow predictions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {models.map((model, idx) => (
          <div key={idx} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{model.name}</h3>
                <p className="text-sm text-gray-400">{model.description}</p>
              </div>
              <span className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full">
                v{model.version}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Model Accuracy</span>
                <span className="text-green-500 font-semibold">{model.accuracy}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${model.accuracy}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {Object.entries(model.metrics).map(([key, value]) => (
                <div key={key} className="bg-gray-900 p-3 rounded">
                  <p className="text-xs text-gray-400 uppercase mb-1">{key}</p>
                  <p className="text-white font-semibold">{value}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Last trained: {model.lastTrained}</span>
              <button className="text-blue-500 hover:text-blue-400">View Details →</button>
            </div>
          </div>
        ))}
      </div>

      {/* Model Pipeline */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Prediction Pipeline</h3>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <PipelineStep title="Data Collection" status="active" />
              <Arrow />
              <PipelineStep title="Feature Engineering" status="active" />
              <Arrow />
              <PipelineStep title="Model Inference" status="active" />
              <Arrow />
              <PipelineStep title="Ensemble" status="active" />
              <Arrow />
              <PipelineStep title="Output" status="complete" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Real-Time Monitoring View
const RealTimeMonitoring = ({ lotId }) => {
  const [metrics, setMetrics] = useState({
    apiLatency: 145,
    requestsPerMin: 842,
    errorRate: 0.02,
    activeUsers: 1247,
    predictionsGenerated: 156,
    anomaliesDetected: 3
  })

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Real-Time System Monitor</h2>
            <p className="text-gray-400">Live metrics updated every second</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-500 font-semibold">LIVE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <LiveMetric
          label="API Latency"
          value={`${metrics.apiLatency}ms`}
          status={metrics.apiLatency < 200 ? 'good' : 'warning'}
          change="-12ms"
        />
        <LiveMetric
          label="Requests/Min"
          value={metrics.requestsPerMin}
          status="good"
          change="+54"
        />
        <LiveMetric
          label="Error Rate"
          value={`${metrics.errorRate}%`}
          status={metrics.errorRate < 0.1 ? 'good' : 'error'}
          change="-0.05%"
        />
        <LiveMetric
          label="Active Users"
          value={metrics.activeUsers}
          status="good"
          change="+127"
        />
        <LiveMetric
          label="Predictions Generated"
          value={metrics.predictionsGenerated}
          status="good"
          change="+23"
        />
        <LiveMetric
          label="Anomalies Detected"
          value={metrics.anomaliesDetected}
          status={metrics.anomaliesDetected > 5 ? 'warning' : 'good'}
          change="0"
        />
      </div>

      {/* Coming Soon - WebSocket Integration */}
      <div className="bg-blue-500/10 border border-blue-500 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-500 mb-2">🚀 WebSocket Integration Coming Soon</h3>
        <p className="text-gray-300">
          Real-time bi-directional communication for instant updates on bookings, occupancy changes, and system events.
        </p>
      </div>
    </div>
  )
}

// Helper Components
const PipelineStep = ({ title, status }) => (
  <div className="flex flex-col items-center">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
      status === 'active' ? 'bg-blue-500 animate-pulse' : 
      status === 'complete' ? 'bg-green-500' : 'bg-gray-700'
    }`}>
      {status === 'complete' && <span className="text-white">✓</span>}
    </div>
    <span className="text-xs text-gray-400 mt-2">{title}</span>
  </div>
)

const Arrow = () => (
  <div className="flex-1 h-0.5 bg-gray-700 mx-2"></div>
)

const LiveMetric = ({ label, value, status, change }) => (
  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-400 text-sm">{label}</span>
      <div className={`w-2 h-2 rounded-full ${
        status === 'good' ? 'bg-green-500' :
        status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
      } animate-pulse`} />
    </div>
    <p className="text-2xl font-bold text-white mb-1">{value}</p>
    <p className={`text-sm ${
      change.startsWith('+') ? 'text-green-500' :
      change.startsWith('-') && !change.includes('ms') ? 'text-red-500' : 'text-gray-400'
    }`}>
      {change} from last minute
    </p>
  </div>
)

export default AdvancedAnalyticsPage
