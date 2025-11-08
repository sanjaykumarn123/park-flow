import express from 'express'

const router = express.Router()

// Mock parking lots database
const parkingLots = [
  {
    id: 'lot-001',
    name: 'Smart Parking Hub A',
    location: 'Connaught Place, New Delhi',
    capacity: 150,
    occupied: 98,
    pricePerHour: 50,
    distance: 0.8,
    features: ['covered', 'security', 'evCharging'],
    coordinates: [28.6315, 77.2167]
  },
  {
    id: 'lot-002',
    name: 'Tech Park Parking',
    location: 'Cyber City, Gurgaon',
    capacity: 200,
    occupied: 120,
    pricePerHour: 45,
    distance: 2.3,
    features: ['covered', 'evCharging'],
    coordinates: [28.4950, 77.0826]
  },
  {
    id: 'lot-003',
    name: 'Metro Connect Parking',
    location: 'Rajiv Chowk, New Delhi',
    capacity: 100,
    occupied: 45,
    pricePerHour: 30,
    distance: 1.5,
    features: ['security'],
    coordinates: [28.6328, 77.2197]
  }
]

// Calculate distance between two coordinates (simplified)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Find best parking lot based on criteria
function findBestLot(location, eta, prefs, vehicleType) {
  // Filter lots based on preferences
  let availableLots = parkingLots.filter(lot => {
    const available = lot.capacity - lot.occupied
    if (available <= 0) return false
    
    // Check preferences
    if (prefs.covered && !lot.features.includes('covered')) return false
    if (prefs.evCharging && !lot.features.includes('evCharging')) return false
    if (prefs.security && !lot.features.includes('security')) return false
    
    return true
  })
  
  // If no lots match all preferences, relax constraints
  if (availableLots.length === 0) {
    availableLots = parkingLots.filter(lot => lot.capacity - lot.occupied > 0)
  }
  
  // Score lots based on multiple factors
  const scoredLots = availableLots.map(lot => {
    const available = lot.capacity - lot.occupied
    const occupancyRate = lot.occupied / lot.capacity
    
    // Scoring factors
    const availabilityScore = (available / lot.capacity) * 40 // 40% weight
    const priceScore = (1 - (lot.pricePerHour / 100)) * 30 // 30% weight (lower is better)
    const distanceScore = (1 - (lot.distance / 10)) * 20 // 20% weight (closer is better)
    const featureScore = (lot.features.length / 3) * 10 // 10% weight
    
    const totalScore = availabilityScore + priceScore + distanceScore + featureScore
    
    return {
      ...lot,
      score: totalScore,
      available: available
    }
  })
  
  // Sort by score (highest first)
  scoredLots.sort((a, b) => b.score - a.score)
  
  return scoredLots[0] || null
}

// POST /api/parking/find - Car-to-cloud parking search
router.post('/find', async (req, res) => {
  try {
    const { location, eta, prefs = {}, vehicleType = 'car' } = req.body
    
    if (!location || !eta) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['location', 'eta']
      })
    }
    
    // Find best parking lot
    const bestLot = findBestLot(location, eta, prefs, vehicleType)
    
    if (!bestLot) {
      return res.status(404).json({
        error: 'No available parking found',
        message: 'All parking lots are currently full. Please try again later.'
      })
    }
    
    // Generate slot number
    const slotNumber = `${bestLot.id.split('-')[1]}-${Math.floor(Math.random() * 100)}`
    
    // Calculate ETA
    const etaMinutes = Math.floor(bestLot.distance * 5) // ~5 min per km
    const arrivalTime = new Date(new Date(eta).getTime() + etaMinutes * 60000)
    
    // Create response
    const response = {
      success: true,
      lot: {
        id: bestLot.id,
        name: bestLot.name,
        location: bestLot.location,
        slotNumber: slotNumber,
        distance: `${bestLot.distance.toFixed(1)} km`,
        eta: arrivalTime.toISOString(),
        pricePerHour: bestLot.pricePerHour,
        features: bestLot.features,
        available: bestLot.available
      },
      cloudSync: {
        vehicleId: `VH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        syncTime: new Date().toISOString(),
        status: 'confirmed',
        protocol: 'V2X-Cloud'
      },
      navigation: {
        route: 'Optimal route calculated via GPS',
        trafficCondition: Math.random() > 0.5 ? 'Light traffic' : 'Moderate traffic',
        estimatedArrival: arrivalTime.toISOString(),
        distance: `${bestLot.distance.toFixed(1)} km`,
        duration: `${etaMinutes} minutes`,
        coordinates: bestLot.coordinates
      },
      booking: {
        preBooked: true,
        reservationId: `RES-${Date.now()}`,
        validUntil: new Date(Date.now() + 30 * 60000).toISOString(), // 30 min validity
        qrCode: `QR-${Date.now()}-${slotNumber}`
      }
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error finding parking:', error)
    res.status(500).json({ error: 'Failed to find parking' })
  }
})

// POST /api/parking/reserve - Reserve a specific slot
router.post('/reserve', async (req, res) => {
  try {
    const { lotId, vehicleId, duration = 2 } = req.body
    
    if (!lotId || !vehicleId) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['lotId', 'vehicleId']
      })
    }
    
    const lot = parkingLots.find(l => l.id === lotId)
    
    if (!lot) {
      return res.status(404).json({ error: 'Parking lot not found' })
    }
    
    if (lot.occupied >= lot.capacity) {
      return res.status(400).json({ error: 'Parking lot is full' })
    }
    
    const slotNumber = `${lotId.split('-')[1]}-${Math.floor(Math.random() * 100)}`
    
    res.json({
      success: true,
      reservation: {
        id: `RES-${Date.now()}`,
        lotId: lotId,
        lotName: lot.name,
        slotNumber: slotNumber,
        vehicleId: vehicleId,
        duration: duration,
        totalPrice: lot.pricePerHour * duration,
        validUntil: new Date(Date.now() + 30 * 60000).toISOString(),
        status: 'confirmed'
      }
    })
  } catch (error) {
    console.error('Error reserving parking:', error)
    res.status(500).json({ error: 'Failed to reserve parking' })
  }
})

// GET /api/parking/nearby - Get nearby parking lots
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query
    
    if (!lat || !lng) {
      return res.status(400).json({
        error: 'Missing coordinates',
        required: ['lat', 'lng']
      })
    }
    
    const userLat = parseFloat(lat)
    const userLng = parseFloat(lng)
    
    // Calculate distance for each lot
    const nearbyLots = parkingLots.map(lot => {
      const distance = calculateDistance(
        userLat, userLng,
        lot.coordinates[0], lot.coordinates[1]
      )
      
      return {
        ...lot,
        distance: parseFloat(distance.toFixed(2)),
        available: lot.capacity - lot.occupied
      }
    })
    .filter(lot => lot.distance <= parseFloat(radius))
    .sort((a, b) => a.distance - b.distance)
    
    res.json({
      count: nearbyLots.length,
      radius: `${radius} km`,
      lots: nearbyLots
    })
  } catch (error) {
    console.error('Error finding nearby parking:', error)
    res.status(500).json({ error: 'Failed to find nearby parking' })
  }
})

export default router
