import { useState } from 'react'
import { MapPin, TrendingUp, DollarSign, Activity, Leaf } from 'lucide-react'
import useFetch from '../hooks/useFetch'
import useStore from '../store/useStore'
import CityMap from '../components/city/CityMap'
import CongestionChart from '../components/city/CongestionChart'
import EmissionChart from '../components/city/EmissionChart'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const CityPage = () => {
  const { eventMode, toggleEventMode } = useStore()
  const { data: cityData, loading, error, refetch } = useFetch('/api/city/overview')

  const metrics = cityData?.metrics || {
    activeLots: 0,
    congestionRate: 0,
    dailyRevenue: 0,
    emissionReduction: 0,
  }

  const lots = cityData?.lots || []

  // Apply event mode multiplier to congestion
  const displayCongestion = eventMode
    ? Math.min(100, metrics.congestionRate * 1.2)
    : metrics.congestionRate

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">City Dashboard</h1>
          <p className="text-gray-400 mt-1">Monitor city-wide parking and traffic metrics</p>
        </div>

        {/* Event Mode Toggle */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-400">Event Mode</span>
          <button
            onClick={toggleEventMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              eventMode ? 'bg-primary' : 'bg-dark-border'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                eventMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          {eventMode && (
            <span className="text-xs text-warning font-semibold">
              +20% Demand Prediction
            </span>
          )}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-400 mb-1">Active Parking Lots</p>
            <p className="text-2xl font-bold text-gray-100">{metrics.activeLots}</p>
          </div>
          <div className="bg-primary/20 p-3 rounded-lg">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-400 mb-1">Congestion Rate</p>
            <p className="text-2xl font-bold text-gray-100">
              {displayCongestion.toFixed(1)}%
            </p>
          </div>
          <div className={`${
            displayCongestion >= 70 ? 'bg-danger/20' : 'bg-success/20'
          } p-3 rounded-lg`}>
            <Activity className={`w-6 h-6 ${
              displayCongestion >= 70 ? 'text-danger' : 'text-success'
            }`} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-400 mb-1">Daily Revenue</p>
            <p className="text-2xl font-bold text-gray-100">₹{metrics.dailyRevenue}</p>
          </div>
          <div className="bg-warning/20 p-3 rounded-lg">
            <DollarSign className="w-6 h-6 text-warning" />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <p className="text-sm text-gray-400 mb-1">CO₂ Reduction</p>
            <p className="text-2xl font-bold text-gray-100">{metrics.emissionReduction}kg</p>
          </div>
          <div className="bg-success/20 p-3 rounded-lg">
            <Leaf className="w-6 h-6 text-success" />
          </div>
        </div>
      </div>

      {/* Map */}
      {loading && <LoadingSpinner text="Loading city data..." />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}
      
      {!loading && !error && (
        <>
          <CityMap lots={lots} eventMode={eventMode} />

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CongestionChart eventMode={eventMode} />
            <EmissionChart />
          </div>

          {/* Insights */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              City Insights
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-dark-hover rounded-lg">
                <TrendingUp className="w-5 h-5 text-success mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-100">
                    Peak Hour Optimization
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Congestion reduced by 15% during evening rush hours through dynamic pricing
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-dark-hover rounded-lg">
                <Leaf className="w-5 h-5 text-success mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-100">
                    Environmental Impact
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Smart parking reduced unnecessary driving by 2,500 km this week
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-dark-hover rounded-lg">
                <Activity className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-100">
                    Real-time Monitoring
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    All {metrics.activeLots} parking lots are connected and reporting live data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CityPage
