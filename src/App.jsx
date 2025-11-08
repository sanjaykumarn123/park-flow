import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import ImprovedNavigation from './components/ImprovedNavigation'
import ConnectionStatus from './components/ConnectionStatus'
import DriverPage from './pages/DriverPage'
import OperatorPage from './pages/OperatorPage'
import CityPage from './pages/CityPage'
import FuturePage from './pages/FuturePage'
import AdvancedAnalyticsPage from './pages/AdvancedAnalyticsPage'
import useWebSocket from './hooks/useWebSocket'

function App() {
  const WS_URL = `ws://localhost:5000/ws`
  const [showConnectionStatus, setShowConnectionStatus] = useState(true)

  // WebSocket connection
  const {
    isConnected,
    connectionStatus,
    reconnect,
    reconnectAttempts,
    lastMessage
  } = useWebSocket(WS_URL, {
    onMessage: (data) => {
      // Handle global WebSocket messages
      console.log('WebSocket message:', data)
      
      // Show notifications for important events
      if (data.type === 'alert') {
        // Show notification (you can integrate with a toast library)
        console.log('Alert:', data.message)
      }
    },
    onOpen: () => {
      console.log('✅ Global WebSocket connected')
      // Hide connection status after 3 seconds when connected
      setTimeout(() => setShowConnectionStatus(false), 3000)
    },
    onClose: () => {
      console.log('❌ Global WebSocket disconnected')
      setShowConnectionStatus(true)
    },
    onError: (error) => {
      console.error('WebSocket error:', error)
      setShowConnectionStatus(true)
    }
  })

  // Show connection status when there are issues
  useEffect(() => {
    if (connectionStatus !== 'connected') {
      setShowConnectionStatus(true)
    }
  }, [connectionStatus])

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <ImprovedNavigation connectionStatus={connectionStatus} />
          
          <main className="relative">
            <Routes>
              <Route index element={<Navigate to="/driver" replace />} />
              <Route path="driver" element={<DriverPage wsConnection={{ isConnected, lastMessage }} />} />
              <Route path="operator" element={<OperatorPage wsConnection={{ isConnected, lastMessage }} />} />
              <Route path="city" element={<CityPage wsConnection={{ isConnected, lastMessage }} />} />
              <Route path="advanced-analytics" element={<AdvancedAnalyticsPage wsConnection={{ isConnected, lastMessage }} />} />
              <Route path="future" element={<FuturePage wsConnection={{ isConnected, lastMessage }} />} />
              <Route path="*" element={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">404 - Page Not Found</h1>
                    <p className="text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
                    <Navigate to="/driver" replace />
                  </div>
                </div>
              } />
            </Routes>
          </main>

          {/* Connection Status Indicator */}
          {showConnectionStatus && connectionStatus !== 'connected' && (
            <ConnectionStatus
              status={connectionStatus}
              reconnectAttempts={reconnectAttempts}
              onReconnect={reconnect}
            />
          )}
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
