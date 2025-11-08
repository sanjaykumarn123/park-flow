import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { MapPin, IndianRupee } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const ParkingMap = ({ lots, onSelectLot }) => {
  const defaultCenter = [
    parseFloat(import.meta.env.VITE_MAP_CENTER_LAT) || 28.6139,
    parseFloat(import.meta.env.VITE_MAP_CENTER_LNG) || 77.2090
  ]

  const createCustomIcon = (occupancyPercent) => {
    const color = occupancyPercent >= 90 ? '#ef4444' : occupancyPercent >= 70 ? '#f59e0b' : '#10b981'
    
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    })
  }

  return (
    <div className="card p-0 overflow-hidden h-[600px]">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        className="h-full w-full"
        style={{ background: '#1a1a1a' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {lots.map((lot) => {
          const occupancyPercent = (lot.occupied / lot.capacity) * 100
          const position = lot.coordinates || [
            defaultCenter[0] + (Math.random() - 0.5) * 0.1,
            defaultCenter[1] + (Math.random() - 0.5) * 0.1
          ]

          return (
            <Marker
              key={lot.id}
              position={position}
              icon={createCustomIcon(occupancyPercent)}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-gray-900 mb-2">{lot.name}</h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <div className="flex items-center justify-between">
                      <span>Available:</span>
                      <span className="font-semibold">{lot.capacity - lot.occupied}/{lot.capacity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Price:</span>
                      <span className="font-semibold flex items-center">
                        <IndianRupee className="w-3 h-3" />
                        {lot.pricePerHour}/hr
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Distance:</span>
                      <span className="font-semibold">{lot.distance} km</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectLot(lot)}
                    className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}

export default ParkingMap
