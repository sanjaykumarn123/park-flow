import { useState } from 'react'
import { X, AlertTriangle, MapPin, IndianRupee, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import useStore from '../../store/useStore'

const RerouteModal = ({ onClose, alternativeLots }) => {
  const [selectedOption, setSelectedOption] = useState(null)
  const [queuePosition] = useState(Math.floor(Math.random() * 5) + 1)
  const { addNotification } = useStore()

  const handleJoinQueue = () => {
    addNotification({
      type: 'info',
      title: 'Joined Virtual Queue',
      message: `You are #${queuePosition} in the queue. We'll notify you when a slot becomes available.`,
    })
    onClose()
  }

  const handleSelectAlternative = (lot) => {
    setSelectedOption(lot.id)
    addNotification({
      type: 'success',
      title: 'Rerouted Successfully',
      message: `Redirecting you to ${lot.name}. Refund processed for original booking.`,
    })
    setTimeout(onClose, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-dark-card border border-danger/50 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-danger/10 border-b border-danger/30 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="bg-danger/20 p-2 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-danger" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-100">Slot Unavailable</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Your reserved slot has been occupied. We apologize for the inconvenience.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Refund Notice */}
          <div className="bg-success/10 border border-success/30 rounded-lg p-4">
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-success">Full refund processed.</span> Your
              payment will be credited back within 2-3 business days.
            </p>
          </div>

          {/* Virtual Queue Option */}
          <div className="card bg-primary/5 border-primary/30">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">
                  Join Virtual Queue
                </h3>
                <p className="text-sm text-gray-400">
                  Wait for the next available slot at the same location
                </p>
              </div>
              <div className="bg-primary/20 px-3 py-1 rounded-full">
                <div className="flex items-center text-primary text-sm font-semibold">
                  <Users className="w-4 h-4 mr-1" />
                  <span>#{queuePosition}</span>
                </div>
              </div>
            </div>
            <button onClick={handleJoinQueue} className="w-full btn-primary">
              Join Queue (Position #{queuePosition})
            </button>
          </div>

          {/* Alternative Lots */}
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Alternative Parking Lots
            </h3>
            <div className="space-y-3">
              {alternativeLots.map((lot) => {
                const available = lot.capacity - lot.occupied
                return (
                  <motion.div
                    key={lot.id}
                    whileHover={{ scale: 1.02 }}
                    className={`card cursor-pointer transition-all ${
                      selectedOption === lot.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-gray-600'
                    }`}
                    onClick={() => handleSelectAlternative(lot)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-100 mb-1">{lot.name}</h4>
                        <div className="flex items-center text-sm text-gray-400 space-x-4">
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>{lot.distance} km away</span>
                          </div>
                          <div className="flex items-center">
                            <IndianRupee className="w-3 h-3 mr-1" />
                            <span>{lot.pricePerHour}/hr</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-success">{available}</div>
                        <div className="text-xs text-gray-400">available</div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          <button onClick={onClose} className="w-full btn-secondary">
            Cancel & Search Again
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default RerouteModal
