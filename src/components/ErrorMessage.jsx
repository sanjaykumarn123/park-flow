import { AlertCircle } from 'lucide-react'

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="bg-danger/10 border border-danger/30 rounded-lg p-6 max-w-md">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-danger flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Error</h3>
            <p className="text-gray-300 text-sm mb-4">{message}</p>
            {onRetry && (
              <button onClick={onRetry} className="btn-primary">
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage
