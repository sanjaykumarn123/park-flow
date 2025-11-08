import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import useStore from '../store/useStore'

const NotificationPanel = () => {
  const { notifications, removeNotification } = useStore()

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-danger" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />
      default:
        return <Info className="w-5 h-5 text-primary" />
    }
  }

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-success/10 border-success/30'
      case 'error':
        return 'bg-danger/10 border-danger/30'
      case 'warning':
        return 'bg-warning/10 border-warning/30'
      default:
        return 'bg-primary/10 border-primary/30'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`${getBackgroundColor(notification.type)} border rounded-lg p-4 shadow-lg backdrop-blur-sm`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                {notification.title && (
                  <h4 className="text-sm font-semibold text-gray-100 mb-1">
                    {notification.title}
                  </h4>
                )}
                <p className="text-sm text-gray-300">{notification.message}</p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default NotificationPanel
