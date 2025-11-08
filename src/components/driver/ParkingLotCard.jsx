import { MapPin, Clock, IndianRupee, TrendingUp, Car } from 'lucide-react'
import { motion } from 'framer-motion'

const ParkingLotCard = ({ lot, onBook }) => {
  const occupancyPercent = (lot.occupied / lot.capacity) * 100
  const availableSlots = lot.capacity - lot.occupied

  const getOccupancyColor = () => {
    if (occupancyPercent >= 90) return 'text-danger'
    if (occupancyPercent >= 70) return 'text-warning'
    return 'text-success'
  }

  const getOccupancyBg = () => {
    if (occupancyPercent >= 90) return 'bg-danger'
    if (occupancyPercent >= 70) return 'bg-warning'
    return 'bg-success'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="card hover:border-primary/50 transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-100 group-hover:text-primary transition-colors">
            {lot.name}
          </h3>
          <div className="flex items-center text-sm text-gray-400 mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{lot.location}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center text-lg font-bold text-gray-100">
            <IndianRupee className="w-4 h-4" />
            <span>{lot.pricePerHour}</span>
          </div>
          <span className="text-xs text-gray-400">per hour</span>
        </div>
      </div>

      {/* Occupancy Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-400">Occupancy</span>
          <span className={`font-semibold ${getOccupancyColor()}`}>
            {occupancyPercent.toFixed(0)}%
          </span>
        </div>
        <div className="h-2 bg-dark-hover rounded-full overflow-hidden">
          <div
            className={`h-full ${getOccupancyBg()} transition-all duration-500`}
            style={{ width: `${occupancyPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
          <span>{lot.occupied} occupied</span>
          <span>{availableSlots} available</span>
        </div>
      </div>

      {/* Prediction */}
      {lot.prediction && (
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 mb-4">
          <div className="flex items-start space-x-2">
            <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-300">
                {lot.prediction.message}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Confidence: {lot.prediction.confidence}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-dark-hover rounded-lg p-3">
          <div className="flex items-center text-gray-400 text-xs mb-1">
            <Car className="w-3 h-3 mr-1" />
            <span>Distance</span>
          </div>
          <p className="text-sm font-semibold text-gray-100">{lot.distance} km</p>
        </div>
        <div className="bg-dark-hover rounded-lg p-3">
          <div className="flex items-center text-gray-400 text-xs mb-1">
            <Clock className="w-3 h-3 mr-1" />
            <span>ETA</span>
          </div>
          <p className="text-sm font-semibold text-gray-100">{lot.eta || '5 min'}</p>
        </div>
      </div>

      {/* Book Button */}
      <button
        onClick={() => onBook(lot)}
        disabled={availableSlots === 0}
        className="w-full btn-primary"
      >
        {availableSlots === 0 ? 'Fully Booked' : 'Book Now'}
      </button>
    </motion.div>
  )
}

export default ParkingLotCard
