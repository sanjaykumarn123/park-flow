import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }))

    // Log to error reporting service (e.g., Sentry)
    if (window.errorReporter) {
      window.errorReporter.captureException(error, {
        extra: errorInfo
      })
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/driver'
  }

  render() {
    if (this.state.hasError) {
      const isDevelopment = import.meta.env.DEV

      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            {/* Error Card */}
            <div className="bg-gray-800 rounded-lg border border-red-500/30 shadow-xl">
              {/* Header */}
              <div className="bg-red-500/10 border-b border-red-500/30 p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-red-500 p-3 rounded-full">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      Oops! Something went wrong
                    </h1>
                    <p className="text-gray-400 mt-1">
                      We encountered an unexpected error
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Details */}
              <div className="p-6 space-y-4">
                {/* User-friendly message */}
                <div className="bg-gray-900 p-4 rounded-lg">
                  <p className="text-gray-300">
                    Don't worry! This error has been logged and our team will look into it.
                    You can try the following actions:
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={this.handleReset}
                    className="flex flex-col items-center space-y-2 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-6 h-6" />
                    <span className="font-semibold">Try Again</span>
                    <span className="text-xs text-blue-100">Reset this component</span>
                  </button>

                  <button
                    onClick={this.handleReload}
                    className="flex flex-col items-center space-y-2 p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-6 h-6" />
                    <span className="font-semibold">Reload Page</span>
                    <span className="text-xs text-green-100">Fresh start</span>
                  </button>

                  <button
                    onClick={this.handleGoHome}
                    className="flex flex-col items-center space-y-2 p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                  >
                    <Home className="w-6 h-6" />
                    <span className="font-semibold">Go Home</span>
                    <span className="text-xs text-purple-100">Back to safety</span>
                  </button>
                </div>

                {/* Error Count Warning */}
                {this.state.errorCount > 2 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
                    <p className="text-yellow-500 text-sm">
                      ⚠️ This error has occurred {this.state.errorCount} times. 
                      Consider reloading the page or clearing your browser cache.
                    </p>
                  </div>
                )}

                {/* Technical Details (Development Only) */}
                {isDevelopment && this.state.error && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-gray-400 hover:text-white font-semibold mb-2">
                      🔧 Technical Details (Development Mode)
                    </summary>
                    <div className="bg-gray-900 p-4 rounded-lg space-y-4 overflow-auto max-h-96">
                      <div>
                        <h3 className="text-red-400 font-semibold mb-2">Error Message:</h3>
                        <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                          {this.state.error.toString()}
                        </pre>
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <h3 className="text-red-400 font-semibold mb-2">Component Stack:</h3>
                          <pre className="text-xs text-gray-400 whitespace-pre-wrap">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                      {this.state.error.stack && (
                        <div>
                          <h3 className="text-red-400 font-semibold mb-2">Stack Trace:</h3>
                          <pre className="text-xs text-gray-400 whitespace-pre-wrap">
                            {this.state.error.stack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}

                {/* Help Text */}
                <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-700">
                  <p>Need help? Contact support or check our documentation</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>Error ID: {Date.now()}</p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
