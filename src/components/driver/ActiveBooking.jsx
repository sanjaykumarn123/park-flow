import { useState, useEffect } from 'react'
import { Clock, MapPin, Car, IndianRupee, X, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { differenceInMinutes, format } from 'date-fns'
import useStore from '../../store/useStore'
import ExtendBookingModal from './ExtendBookingModal'
import { usePost } from '../../hooks/useFetch'

const ActiveBooking = ({ booking }) => {
  const [timeRemaining, setTimeRemaining] = useState('')
  const [showExtendModal, setShowExtendModal] = useState(false)
  const { cancelBooking, updateBooking, addNotification } = useStore()
  const { post: cancelPost } = usePost(`/api/bookings/${booking.id}/cancel`)

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const end = new Date(booking.endTime)
      const minutes = differenceInMinutes(end, now)

      if (minutes <= 0) {
        setTimeRemaining('Expired')
      } else {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        setTimeRemaining(`${hours}h ${mins}m`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [booking.endTime])

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return

    try {
      await cancelPost({})
      cancelBooking(booking.id)
      addNotification({
        type: 'success',
        title: 'Booking Cancelled',
        message: 'Your booking has been cancelled. Refund will be processed shortly.',
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Cancellation Failed',
        message: error.message || 'Failed to cancel booking.',
      })
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="card bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse-slow" />
              <span className="text-sm font-semibold text-success">Active Booking</span>
            </div>
            <h3 className="text-xl font-bold text-gray-100">{booking.lotName}</h3>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-danger/20 rounded-lg transition-colors text-danger"
            title="Cancel Booking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-dark-card rounded-lg p-3">
            <div className="flex items-center text-gray-400 text-xs mb-1">
              <Clock className="w-3 h-3 mr-1" />
              <span>Time Left</span>
            </div>
            <p className="text-lg font-bold text-gray-100">{timeRemaining}</p>
          </div>

          <div className="bg-dark-card rounded-lg p-3">
            <div className="flex items-center text-gray-400 text-xs mb-1">
              <Car className="w-3 h-3 mr-1" />
              <span>Vehicle</span>
            </div>
            <p className="text-sm font-semibold text-gray-100">{booking.vehicleNumber}</p>
          </div>

          <div className="bg-dark-card rounded-lg p-3">
            <div className="flex items-center text-gray-400 text-xs mb-1">
              <IndianRupee className="w-3 h-3 mr-1" />
              <span>Total Paid</span>
            </div>
            <p className="text-lg font-bold text-gray-100">₹{booking.totalPrice}</p>
          </div>

          <div className="bg-dark-card rounded-lg p-3">
            <div className="flex items-center text-gray-400 text-xs mb-1">
              <MapPin className="w-3 h-3 mr-1" />
              <span>Slot</span>
            </div>
            <p className="text-sm font-semibold text-gray-100">
              {booking.slotNumber || 'A-12'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowExtendModal(true)}
            className="flex-1 btn-primary flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Extend Booking</span>
          </button>
          <div className="text-xs text-gray-400">
            <div>Start: {format(new Date(booking.startTime), 'MMM dd, HH:mm')}</div>
            <div>End: {format(new Date(booking.endTime), 'MMM dd, HH:mm')}</div>
          </div>
        </div>
      </motion.div>

      {showExtendModal && (
        <ExtendBookingModal
          booking={booking}
          onClose={() => setShowExtendModal(false)}
        />
      )}
    </>
  )
}

export default ActiveBooking
