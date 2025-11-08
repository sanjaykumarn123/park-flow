import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import { IndianRupee } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const CityMap = ({ lots, eventMode }) => {
  const defaultCenter = [
    parseFloat(import.meta.env.VITE_MAP_CENTER_LAT) || 28.6139,
    parseFloat(import.meta.env.VITE_MAP_CENTER_LNG) || 77.2090
  ]

  const createCustomIcon = (occupancyPercent) => {
    let color = '#10b981' // green
    if (occupancyPercent >= 90) color = '#ef4444' // red
    else if (occupancyPercent >= 70) color = '#f59e0b' // yellow

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          font-size: 12px;
        ">${occupancyPercent.toFixed(0)}%</div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    })
  }

  const getCircleColor = (occupancyPercent) => {
    if (occupancyPercent >= 90) return '#ef4444'
    if (occupancyPercent >= 70) return '#f59e0b'
    return '#10b981'
  }

  return (
    <div className="card p-0 overflow-hidden h-[600px]">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        className="h-full w-full"
        style={{ background: '#1a1a1a' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {lots.map((lot, index) => {
          const occupancyPercent = (lot.occupied / lot.capacity) * 100
          const position = lot.coordinates || [
            defaultCenter[0] + (Math.random() - 0.5) * 0.15,
            defaultCenter[1] + (Math.random() - 0.5) * 0.15
          ]

          return (
            <div key={lot.id}>
              {/* Marker */}
              <Marker
                position={position}
                icon={createCustomIcon(occupancyPercent)}
              >
                <Popup>
                  <div className="p-2 min-w-[220px]">
                    <h3 className="font-bold text-gray-900 mb-2">{lot.name}</h3>
                    <div className="space-y-1 text-sm text-gray-700">
                      <div className="flex items-center justify-between">
                        <span>Capacity:</span>
                        <span className="font-semibold">{lot.capacity} slots</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Occupied:</span>
                        <span className="font-semibold">{lot.occupied}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Available:</span>
                        <span className="font-semibold text-green-600">
                          {lot.capacity - lot.occupied}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Price:</span>
                        <span className="font-semibold flex items-center">
                          <IndianRupee className="w-3 h-3" />
                          {lot.pricePerHour}/hr
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Occupancy:</span>
                        <span className={`font-semibold ${
                          occupancyPercent >= 90 ? 'text-red-600' :
                          occupancyPercent >= 70 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {occupancyPercent.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    {eventMode && (
                      <div className="mt-2 bg-yellow-100 border border-yellow-300 rounded p-2">
                        <p className="text-xs text-yellow-800 font-semibold">
                          Event Mode Active: +20% demand
                        </p>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>

              {/* Coverage Circle */}
              <Circle
                center={position}
                radius={500}
                pathOptions={{
                  color: getCircleColor(occupancyPercent),
                  fillColor: getCircleColor(occupancyPercent),
                  fillOpacity: 0.1,
                  weight: 2,
                }}
              />
            </div>
          )
        })}
      </MapContainer>
    </div>
  )
}

export default CityMap
