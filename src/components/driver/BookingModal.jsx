import { useState } from 'react'
import { X, Calendar, Clock, Car, CreditCard, IndianRupee } from 'lucide-react'
import { motion } from 'framer-motion'
import { format, addHours } from 'date-fns'
import { usePost } from '../../hooks/useFetch'
import useStore from '../../store/useStore'

const BookingModal = ({ lot, onClose, onSuccess }) => {
  const [startTime, setStartTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
  const [duration, setDuration] = useState(2)
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('upi')
  
  const { post, loading } = usePost('/api/bookings')
  const { addBooking, addNotification } = useStore()

  const calculatePrice = () => {
    return lot.pricePerHour * duration
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const bookingData = {
        lotId: lot.id,
        lotName: lot.name,
        startTime,
        duration,
        vehicleNumber,
        paymentMethod,
        totalPrice: calculatePrice(),
      }

      const result = await post(bookingData)
      
      addBooking({
        ...result,
        ...bookingData,
        id: result.id || Date.now(),
        status: 'active',
        endTime: format(addHours(new Date(startTime), duration), "yyyy-MM-dd'T'HH:mm"),
      })

      addNotification({
        type: 'success',
        title: 'Booking Confirmed',
        message: `Your parking slot at ${lot.name} has been booked successfully!`,
      })

      onSuccess(result)
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Booking Failed',
        message: error.message || 'Failed to create booking. Please try again.',
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-dark-card border border-dark-border rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <div>
            <h2 className="text-xl font-bold text-gray-100">Book Parking Slot</h2>
            <p className="text-sm text-gray-400 mt-1">{lot.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Start Time */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              Start Time
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              required
              className="input-field w-full"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
              <Clock className="w-4 h-4 mr-2" />
              Duration (hours)
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="input-field w-full"
            >
              {[1, 2, 3, 4, 5, 6, 8, 12, 24].map((hours) => (
                <option key={hours} value={hours}>
                  {hours} {hours === 1 ? 'hour' : 'hours'}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Number */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
              <Car className="w-4 h-4 mr-2" />
              Vehicle Number
            </label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              placeholder="e.g., DL01AB1234"
              required
              className="input-field w-full"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
              <CreditCard className="w-4 h-4 mr-2" />
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['upi', 'card', 'wallet'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 px-4 rounded-lg font-medium capitalize transition-colors ${
                    paymentMethod === method
                      ? 'bg-primary text-white'
                      : 'bg-dark-hover text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-dark-hover rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Price per hour</span>
              <span className="text-gray-300 flex items-center">
                <IndianRupee className="w-3 h-3" />
                {lot.pricePerHour}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Duration</span>
              <span className="text-gray-300">{duration} hours</span>
            </div>
            <div className="border-t border-dark-border pt-2 flex items-center justify-between">
              <span className="font-semibold text-gray-100">Total Amount</span>
              <span className="text-xl font-bold text-primary flex items-center">
                <IndianRupee className="w-5 h-5" />
                {calculatePrice()}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default BookingModal
