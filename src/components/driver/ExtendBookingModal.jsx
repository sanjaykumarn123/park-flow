import { useState } from 'react'
import { X, Clock, IndianRupee } from 'lucide-react'
import { motion } from 'framer-motion'
import { addHours, format } from 'date-fns'
import { usePost } from '../../hooks/useFetch'
import useStore from '../../store/useStore'

const ExtendBookingModal = ({ booking, onClose }) => {
  const [additionalHours, setAdditionalHours] = useState(1)
  const { post, loading } = usePost(`/api/bookings/${booking.id}/extend`)
  const { updateBooking, addNotification } = useStore()

  const pricePerHour = booking.totalPrice / booking.duration
  const additionalCost = pricePerHour * additionalHours
  const newEndTime = addHours(new Date(booking.endTime), additionalHours)

  const handleExtend = async () => {
    try {
      await post({ additionalHours })
      
      updateBooking(booking.id, {
        endTime: newEndTime.toISOString(),
        duration: booking.duration + additionalHours,
        totalPrice: booking.totalPrice + additionalCost,
      })

      addNotification({
        type: 'success',
        title: 'Booking Extended',
        message: `Your booking has been extended by ${additionalHours} hour(s).`,
      })

      onClose()
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Extension Failed',
        message: error.message || 'Failed to extend booking.',
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-dark-card border border-dark-border rounded-xl max-w-md w-full"
      >
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <h2 className="text-xl font-bold text-gray-100">Extend Booking</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-300 mb-3">
              <Clock className="w-4 h-4 mr-2" />
              Additional Hours
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((hours) => (
                <button
                  key={hours}
                  onClick={() => setAdditionalHours(hours)}
                  className={`py-3 rounded-lg font-semibold transition-colors ${
                    additionalHours === hours
                      ? 'bg-primary text-white'
                      : 'bg-dark-hover text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {hours}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-dark-hover rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Current end time</span>
              <span className="text-gray-300">
                {format(new Date(booking.endTime), 'MMM dd, HH:mm')}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">New end time</span>
              <span className="text-gray-300">
                {format(newEndTime, 'MMM dd, HH:mm')}
              </span>
            </div>
            <div className="border-t border-dark-border pt-2 flex items-center justify-between">
              <span className="font-semibold text-gray-100">Additional Cost</span>
              <span className="text-xl font-bold text-primary flex items-center">
                <IndianRupee className="w-5 h-5" />
                {additionalCost}
              </span>
            </div>
          </div>

          <button
            onClick={handleExtend}
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Processing...' : `Extend by ${additionalHours}h`}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default ExtendBookingModal
