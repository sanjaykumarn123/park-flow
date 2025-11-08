import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Car, Building2, Map, Sparkles, BarChart3, Menu, X, Wifi, WifiOff,
  Bell, Settings, HelpCircle, User, LogOut
} from 'lucide-react'

const ImprovedNavigation = ({ connectionStatus }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()

  const navItems = [
    {
      path: '/driver',
      label: 'Driver',
      icon: <Car className="w-5 h-5" />,
      description: 'Find and book parking'
    },
    {
      path: '/operator',
      label: 'Operator',
      icon: <Building2 className="w-5 h-5" />,
      description: 'Manage bookings'
    },
    {
      path: '/city',
      label: 'City View',
      icon: <Map className="w-5 h-5" />,
      description: 'City-wide analytics'
    },
    {
      path: '/advanced-analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'ML & Predictions',
      badge: 'NEW'
    },
    {
      path: '/future',
      label: 'Future',
      icon: <Sparkles className="w-5 h-5" />,
      description: 'Car-to-Cloud'
    }
  ]

  const isActive = (path) => location.pathname === path

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500'
      case 'connecting': return 'bg-yellow-500 animate-pulse'
      case 'reconnecting': return 'bg-orange-500 animate-pulse'
      case 'error':
      case 'failed': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getConnectionIcon = () => {
    return connectionStatus === 'connected' ? 
      <Wifi className="w-4 h-4" /> : 
      <WifiOff className="w-4 h-4" />
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/driver" className="flex items-center space-x-3 group">
              <div className="bg-blue-500 p-2 rounded-lg group-hover:bg-blue-600 transition-colors">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div className="hidden md:block">
                <span className="text-xl font-bold text-white">ParkFlow</span>
                <span className="text-xs text-gray-400 block">Smart Parking 2.0</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
              {getConnectionIcon()}
              <span className="capitalize">{connectionStatus || 'offline'}</span>
              <div className={`w-2 h-2 rounded-full ${getConnectionColor()}`} />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2">
                  <Link
                    to="/settings"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  <Link
                    to="/help"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Help</span>
                  </Link>
                  <div className="border-t border-gray-700 my-2" />
                  <button className="flex items-center space-x-2 px-4 py-2 text-red-400 hover:bg-gray-700 w-full">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 py-3 space-y-2">
            {/* Connection Status on Mobile */}
            <div className="flex items-center justify-between py-2 px-3 bg-gray-900 rounded-lg mb-2">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                {getConnectionIcon()}
                <span className="capitalize">{connectionStatus || 'offline'}</span>
              </div>
              <div className={`w-3 h-3 rounded-full ${getConnectionColor()}`} />
            </div>

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-400">{item.description}</div>
                  </div>
                </div>
                {item.badge && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export default ImprovedNavigation
