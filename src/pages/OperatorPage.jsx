import { useState } from 'react'
import { TrendingUp, DollarSign, AlertCircle, Users } from 'lucide-react'
import useFetch from '../hooks/useFetch'
import BookingsTable from '../components/operator/BookingsTable'
import DynamicPricing from '../components/operator/DynamicPricing'
import Analytics from '../components/operator/Analytics'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const OperatorPage = () => {
  const [activeTab, setActiveTab] = useState('bookings') // 'bookings', 'pricing', 'analytics'
  
  const { data: dashboardData, loading, error, refetch } = useFetch('/api/operator/dashboard')

  const stats = dashboardData?.stats || {
    totalBookings: 0,
    occupancyRate: 0,
    todayRevenue: 0,
    activeAlerts: 0,
  }

  const tabs = [
    { id: 'bookings', label: 'Bookings', icon: Users },
    { id: 'pricing', label: 'Dynamic Pricing', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Operator Dashboard</h1>
        <p className="text-gray-400 mt-1">Manage bookings, pricing, and analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-400 mb-1">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-100">{stats.totalBookings}</p>
          </div>
          <div className="bg-primary/20 p-3 rounded-lg">
            <Users className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-400 mb-1">Occupancy Rate</p>
            <p className="text-2xl font-bold text-gray-100">{stats.occupancyRate}%</p>
          </div>
          <div className="bg-success/20 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-success" />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-400 mb-1">Today's Revenue</p>
            <p className="text-2xl font-bold text-gray-100">₹{stats.todayRevenue}</p>
          </div>
          <div className="bg-warning/20 p-3 rounded-lg">
            <DollarSign className="w-6 h-6 text-warning" />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-400 mb-1">Active Alerts</p>
            <p className="text-2xl font-bold text-gray-100">{stats.activeAlerts}</p>
          </div>
          <div className="bg-danger/20 p-3 rounded-lg">
            <AlertCircle className="w-6 h-6 text-danger" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex space-x-1 border-b border-dark-border pb-4 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-dark-hover'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} onRetry={refetch} />}
        
        {!loading && !error && (
          <>
            {activeTab === 'bookings' && (
              <BookingsTable bookings={dashboardData?.bookings || []} />
            )}
            {activeTab === 'pricing' && (
              <DynamicPricing lots={dashboardData?.lots || []} />
            )}
            {activeTab === 'analytics' && (
              <Analytics data={dashboardData?.analytics || {}} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default OperatorPage
