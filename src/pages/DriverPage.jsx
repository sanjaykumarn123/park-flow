import { useState, useEffect } from 'react'
import { Search, MapPin, Filter } from 'lucide-react'
import useFetch from '../hooks/useFetch'
import useStore from '../store/useStore'
import ParkingLotCard from '../components/driver/ParkingLotCard'
import ParkingMap from '../components/driver/ParkingMap'
import BookingModal from '../components/driver/BookingModal'
import ActiveBooking from '../components/driver/ActiveBooking'
import RerouteModal from '../components/driver/RerouteModal'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const DriverPage = () => {
  const [viewMode, setViewMode] = useState('list') // 'list' or 'map'
  const [searchQuery, setSearchQuery] = useState('')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showRerouteModal, setShowRerouteModal] = useState(false)
  
  const { selectedLot, setSelectedLot, currentBooking } = useStore()
  const { data: lots, loading, error, refetch } = useFetch('/api/slots')

  const filteredLots = lots?.filter(lot =>
    lot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lot.location.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const handleBookSlot = (lot) => {
    setSelectedLot(lot)
    setShowBookingModal(true)
  }

  const handleBookingSuccess = (booking) => {
    setShowBookingModal(false)
    
    // Simulate 20% chance of reroute
    if (Math.random() < 0.2) {
      setTimeout(() => setShowRerouteModal(true), 2000)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Find Parking</h1>
          <p className="text-gray-400 mt-1">Search and book nearby parking lots</p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2 bg-dark-card border border-dark-border rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              viewMode === 'map'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Map
          </button>
        </div>
      </div>

      {/* Active Booking */}
      {currentBooking && <ActiveBooking booking={currentBooking} />}

      {/* Search Bar */}
      <div className="card">
        <div className="flex items-center space-x-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-gray-100 placeholder-gray-500"
          />
          <button className="p-2 hover:bg-dark-hover rounded-lg transition-colors">
            <Filter className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading && <LoadingSpinner text="Loading parking lots..." />}
      
      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {!loading && !error && (
        <>
          {viewMode === 'list' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLots.map((lot) => (
                <ParkingLotCard
                  key={lot.id}
                  lot={lot}
                  onBook={handleBookSlot}
                />
              ))}
            </div>
          ) : (
            <ParkingMap lots={filteredLots} onSelectLot={handleBookSlot} />
          )}

          {filteredLots.length === 0 && (
            <div className="card text-center py-12">
              <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                No parking lots found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showBookingModal && selectedLot && (
        <BookingModal
          lot={selectedLot}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {showRerouteModal && (
        <RerouteModal
          onClose={() => setShowRerouteModal(false)}
          alternativeLots={filteredLots.slice(0, 3)}
        />
      )}
    </div>
  )
}

export default DriverPage
