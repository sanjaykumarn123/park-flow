import { Link, useLocation } from 'react-router-dom'
import { Car, Building2, MapPin, Sparkles } from 'lucide-react'

const Sidebar = () => {
  const location = useLocation()

  const sidebarItems = [
    { path: '/driver', icon: Car, label: 'Driver', color: 'text-blue-400' },
    { path: '/operator', icon: Building2, label: 'Operator', color: 'text-green-400' },
    { path: '/city', icon: MapPin, label: 'City', color: 'text-purple-400' },
    { path: '/future', icon: Sparkles, label: 'Future', color: 'text-yellow-400' },
  ]

  return (
    <aside className="hidden lg:flex flex-col w-20 bg-dark-card border-r border-dark-border">
      <div className="flex-1 flex flex-col items-center py-8 space-y-8">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/50'
                  : 'text-gray-400 hover:bg-dark-hover hover:text-gray-200'
              }`}
              title={item.label}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'text-white' : item.color}`} />
              
              {/* Tooltip */}
              <div className="absolute left-full ml-4 px-3 py-2 bg-dark-card border border-dark-border rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}

export default Sidebar
