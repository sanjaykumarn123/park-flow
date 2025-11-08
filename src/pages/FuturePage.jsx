import { useState } from 'react'
import { MapPin, Clock, Car, Sparkles, CheckCircle, Navigation } from 'lucide-react'
import { motion } from 'framer-motion'
import { usePost } from '../hooks/useFetch'
import useStore from '../store/useStore'

const FuturePage = () => {
  const [formData, setFormData] = useState({
    location: '',
    eta: '',
    vehicleType: 'car',
    preferences: {
      covered: false,
      evCharging: false,
      security: false,
    },
  })
  const [result, setResult] = useState(null)
  
  const { post, loading } = usePost('/api/parking/find')
  const { addNotification } = useStore()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await post(formData)
      
      // Mock car-to-cloud response
      const mockResult = {
        success: true,
        bookingId: `FTR-${Date.now()}`,
        lot: response.lot || {
          name: 'Smart Parking Hub A',
          location: formData.location,
          slotNumber: 'A-' + Math.floor(Math.random() * 100),
          distance: '2.3 km',
          eta: formData.eta,
        },
        cloudSync: {
          vehicleId: 'VH-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          syncTime: new Date().toISOString(),
          status: 'confirmed',
        },
        navigation: {
          route: 'Optimal route calculated',
          trafficCondition: 'Light traffic',
          estimatedArrival: formData.eta,
        },
      }

      setResult(mockResult)
      
      addNotification({
        type: 'success',
        title: 'Car-to-Cloud Booking Successful',
        message: `Slot ${mockResult.lot.slotNumber} reserved at ${mockResult.lot.name}`,
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Booking Failed',
        message: error.message || 'Could not complete car-to-cloud booking',
      })
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [name]: checked,
        },
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-2xl mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">
          Future Car-to-Cloud Booking
        </h1>
        <p className="text-gray-400">
          Seamless parking reservation through vehicle connectivity
        </p>
      </div>

      {!result ? (
        /* Booking Form */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                Destination
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Connaught Place, New Delhi"
                required
                className="input-field w-full"
              />
            </div>

            {/* ETA */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                <Clock className="w-4 h-4 mr-2" />
                Estimated Time of Arrival
              </label>
              <input
                type="datetime-local"
                name="eta"
                value={formData.eta}
                onChange={handleChange}
                required
                className="input-field w-full"
              />
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                <Car className="w-4 h-4 mr-2" />
                Vehicle Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['car', 'suv', 'bike'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, vehicleType: type }))}
                    className={`py-3 rounded-lg font-medium capitalize transition-colors ${
                      formData.vehicleType === type
                        ? 'bg-primary text-white'
                        : 'bg-dark-hover text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Preferences
              </label>
              <div className="space-y-2">
                {[
                  { name: 'covered', label: 'Covered Parking' },
                  { name: 'evCharging', label: 'EV Charging Station' },
                  { name: 'security', label: '24/7 Security' },
                ].map((pref) => (
                  <label
                    key={pref.name}
                    className="flex items-center space-x-3 p-3 bg-dark-hover rounded-lg cursor-pointer hover:bg-dark-border transition-colors"
                  >
                    <input
                      type="checkbox"
                      name={pref.name}
                      checked={formData.preferences[pref.name]}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary bg-dark-card border-dark-border rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-300">{pref.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>{loading ? 'Finding Parking...' : 'Find & Reserve Parking'}</span>
            </button>
          </form>
        </motion.div>
      ) : (
        /* Booking Result */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Success Card */}
          <div className="card bg-gradient-to-r from-success/10 to-success/5 border-success/30">
            <div className="flex items-start space-x-4">
              <div className="bg-success/20 p-3 rounded-lg">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-100 mb-2">
                  Booking Confirmed!
                </h2>
                <p className="text-gray-300 mb-4">
                  Your parking slot has been reserved and synced with your vehicle
                </p>
                <div className="inline-flex items-center space-x-2 bg-dark-card px-4 py-2 rounded-lg">
                  <span className="text-sm text-gray-400">Booking ID:</span>
                  <span className="text-sm font-mono font-semibold text-primary">
                    {result.bookingId}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Parking Details */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Parking Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-dark-hover rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Location</p>
                <p className="text-base font-semibold text-gray-100">
                  {result.lot.name}
                </p>
                <p className="text-sm text-gray-400 mt-1">{result.lot.location}</p>
              </div>
              <div className="bg-dark-hover rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Slot Number</p>
                <p className="text-2xl font-bold text-primary">{result.lot.slotNumber}</p>
              </div>
              <div className="bg-dark-hover rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Distance</p>
                <p className="text-base font-semibold text-gray-100">
                  {result.lot.distance}
                </p>
              </div>
              <div className="bg-dark-hover rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">ETA</p>
                <p className="text-base font-semibold text-gray-100">
                  {new Date(result.lot.eta).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          {/* Cloud Sync Info */}
          <div className="card bg-primary/5 border-primary/30">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Vehicle Cloud Sync
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Vehicle ID</span>
                <span className="text-sm font-mono font-semibold text-gray-100">
                  {result.cloudSync.vehicleId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Sync Status</span>
                <span className="badge-success capitalize">{result.cloudSync.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Sync Time</span>
                <span className="text-sm text-gray-100">
                  {new Date(result.cloudSync.syncTime).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-100">Navigation</h3>
              <Navigation className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-300">
                <span className="font-semibold">Route:</span> {result.navigation.route}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-semibold">Traffic:</span> {result.navigation.trafficCondition}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-semibold">Arrival:</span>{' '}
                {new Date(result.navigation.estimatedArrival).toLocaleTimeString()}
              </p>
            </div>
            <button className="w-full mt-4 btn-primary flex items-center justify-center space-x-2">
              <Navigation className="w-4 h-4" />
              <span>Start Navigation</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={() => setResult(null)}
              className="flex-1 btn-secondary"
            >
              Book Another
            </button>
            <button className="flex-1 btn-primary">
              View in App
            </button>
          </div>
        </motion.div>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-semibold text-gray-100 mb-2">AI-Powered</h4>
          <p className="text-sm text-gray-400">
            Smart algorithms find the best parking spot for you
          </p>
        </div>
        <div className="card text-center">
          <div className="bg-success/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Car className="w-6 h-6 text-success" />
          </div>
          <h4 className="font-semibold text-gray-100 mb-2">Vehicle Sync</h4>
          <p className="text-sm text-gray-400">
            Seamless integration with your connected vehicle
          </p>
        </div>
        <div className="card text-center">
          <div className="bg-warning/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Navigation className="w-6 h-6 text-warning" />
          </div>
          <h4 className="font-semibold text-gray-100 mb-2">Auto Navigation</h4>
          <p className="text-sm text-gray-400">
            Automatic route guidance to your reserved spot
          </p>
        </div>
      </div>
    </div>
  )
}

export default FuturePage
