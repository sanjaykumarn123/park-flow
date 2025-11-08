import { Wifi, WifiOff, AlertTriangle, RefreshCw } from 'lucide-react'

const ConnectionStatus = ({ status, reconnectAttempts, onReconnect }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: <Wifi className="w-5 h-5" />,
          text: 'Connected',
          bgColor: 'bg-green-500/10',
          textColor: 'text-green-500',
          borderColor: 'border-green-500/30',
          showReconnect: false
        }
      case 'connecting':
        return {
          icon: <RefreshCw className="w-5 h-5 animate-spin" />,
          text: 'Connecting...',
          bgColor: 'bg-yellow-500/10',
          textColor: 'text-yellow-500',
          borderColor: 'border-yellow-500/30',
          showReconnect: false
        }
      case 'reconnecting':
        return {
          icon: <RefreshCw className="w-5 h-5 animate-spin" />,
          text: `Reconnecting... (${reconnectAttempts}/5)`,
          bgColor: 'bg-orange-500/10',
          textColor: 'text-orange-500',
          borderColor: 'border-orange-500/30',
          showReconnect: true
        }
      case 'error':
      case 'failed':
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          text: 'Connection Failed',
          bgColor: 'bg-red-500/10',
          textColor: 'text-red-500',
          borderColor: 'border-red-500/30',
          showReconnect: true
        }
      default:
        return {
          icon: <WifiOff className="w-5 h-5" />,
          text: 'Disconnected',
          bgColor: 'bg-gray-500/10',
          textColor: 'text-gray-500',
          borderColor: 'border-gray-500/30',
          showReconnect: true
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className={`fixed bottom-4 right-4 ${config.bgColor} border ${config.borderColor} rounded-lg p-4 shadow-lg backdrop-blur-sm z-50 max-w-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={config.textColor}>
            {config.icon}
          </div>
          <div>
            <p className={`font-semibold ${config.textColor}`}>
              {config.text}
            </p>
            {status === 'connected' && (
              <p className="text-xs text-gray-400">Real-time updates active</p>
            )}
            {status === 'failed' && (
              <p className="text-xs text-gray-400">
                Max reconnect attempts reached
              </p>
            )}
          </div>
        </div>
        
        {config.showReconnect && onReconnect && (
          <button
            onClick={onReconnect}
            className={`ml-4 p-2 rounded-lg ${config.textColor} hover:bg-white/10 transition-colors`}
            title="Retry connection"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default ConnectionStatus
