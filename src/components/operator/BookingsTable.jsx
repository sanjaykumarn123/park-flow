import { useState } from 'react'
import { Search, Filter, Calendar, Car, MapPin, IndianRupee } from 'lucide-react'
import { format } from 'date-fns'

const BookingsTable = ({ bookings }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.vehicleNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.lotName?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status) => {
    const badges = {
      active: 'badge-success',
      completed: 'badge bg-gray-600 text-gray-200',
      cancelled: 'badge-danger',
    }
    return badges[status] || 'badge'
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center bg-dark-hover rounded-lg px-4 py-2">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by vehicle or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-gray-100 placeholder-gray-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-dark-hover border border-dark-border text-gray-100 rounded-lg px-4 py-2"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                Booking ID
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                Vehicle
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                Location
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                Time
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                Duration
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                Amount
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr
                key={booking.id}
                className="border-b border-dark-border hover:bg-dark-hover transition-colors"
              >
                <td className="py-3 px-4 text-sm text-gray-300 font-mono">
                  #{booking.id?.toString().slice(0, 8)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <Car className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300 font-semibold">
                      {booking.vehicleNumber}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{booking.lotName}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">
                      {format(new Date(booking.startTime), 'MMM dd, HH:mm')}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-300">
                  {booking.duration}h
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center text-sm font-semibold text-gray-100">
                    <IndianRupee className="w-3 h-3" />
                    <span>{booking.totalPrice}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`${getStatusBadge(booking.status)} capitalize`}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No bookings found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingsTable
