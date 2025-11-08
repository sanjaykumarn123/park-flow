import express from 'express'
import { supabase } from '../server.js'

const router = express.Router()

// Mock parking lots data
const mockParkingLots = [
  {
    id: 'lot-001',
    name: 'Central Plaza Parking',
    location: 'Connaught Place, New Delhi',
    capacity: 150,
    occupied: 98,
    pricePerHour: 50,
    distance: 0.8,
    eta: '5 min',
    coordinates: [28.6315, 77.2167],
    prediction: {
      message: 'Free for next 45 min',
      confidence: 87
    }
  },
  {
    id: 'lot-002',
    name: 'Mall Road Parking Hub',
    location: 'Saket, New Delhi',
    capacity: 200,
    occupied: 145,
    pricePerHour: 40,
    distance: 2.3,
    eta: '12 min',
    coordinates: [28.5244, 77.2066],
    prediction: {
      message: 'High demand - book now',
      confidence: 92
    }
  },
  {
    id: 'lot-003',
    name: 'Metro Station Parking',
    location: 'Rajiv Chowk, New Delhi',
    capacity: 100,
    occupied: 45,
    pricePerHour: 30,
    distance: 1.5,
    eta: '8 min',
    coordinates: [28.6328, 77.2197],
    prediction: {
      message: 'Free for next 2 hours',
      confidence: 78
    }
  },
  {
    id: 'lot-004',
    name: 'Business District Parking',
    location: 'Nehru Place, New Delhi',
    capacity: 180,
    occupied: 162,
    pricePerHour: 60,
    distance: 3.5,
    eta: '18 min',
    coordinates: [28.5494, 77.2501],
    prediction: {
      message: 'Almost full - 18 slots left',
      confidence: 95
    }
  },
  {
    id: 'lot-005',
    name: 'Airport Express Parking',
    location: 'Aerocity, New Delhi',
    capacity: 250,
    occupied: 120,
    pricePerHour: 45,
    distance: 5.2,
    eta: '25 min',
    coordinates: [28.5562, 77.0999],
    prediction: {
      message: 'Free for next 3 hours',
      confidence: 85
    }
  }
]

// GET /api/slots - Get all parking lots
router.get('/', async (req, res) => {
  try {
    // Try to fetch from Supabase if configured
    if (supabase) {
      const { data, error } = await supabase
        .from('parking_lots')
        .select('*')
      
      if (error) {
        console.log('Supabase error, using mock data:', error.message)
        return res.json(mockParkingLots)
      }
      
      if (data && data.length > 0) {
        // Transform Supabase data to match frontend format
        const transformedData = data.map(lot => ({
          id: lot.id,
          name: lot.name,
          location: lot.location,
          capacity: lot.capacity,
          occupied: lot.current_occupancy || 0,
          pricePerHour: lot.price_per_hour,
          distance: lot.distance || Math.random() * 5,
          eta: `${Math.floor(Math.random() * 20) + 5} min`,
          coordinates: lot.coordinates || [28.6139 + (Math.random() - 0.5) * 0.1, 77.2090 + (Math.random() - 0.5) * 0.1],
          prediction: {
            message: lot.predicted_occupancy > 90 ? 'Almost full' : 'Free for next hour',
            confidence: lot.confidence || 80
          }
        }))
        return res.json(transformedData)
      }
    }
    
    // Return mock data if Supabase not configured or no data
    res.json(mockParkingLots)
  } catch (error) {
    console.error('Error fetching slots:', error)
    res.status(500).json({ error: 'Failed to fetch parking slots' })
  }
})

// GET /api/slots/:id - Get specific parking lot
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    if (supabase) {
      const { data, error } = await supabase
        .from('parking_lots')
        .select('*')
        .eq('id', id)
        .single()
      
      if (data) {
        return res.json({
          id: data.id,
          name: data.name,
          location: data.location,
          capacity: data.capacity,
          occupied: data.current_occupancy || 0,
          pricePerHour: data.price_per_hour,
          distance: data.distance,
          coordinates: data.coordinates,
          prediction: {
            message: data.predicted_occupancy > 90 ? 'Almost full' : 'Free for next hour',
            confidence: data.confidence || 80
          }
        })
      }
    }
    
    // Fallback to mock data
    const lot = mockParkingLots.find(l => l.id === id)
    if (lot) {
      res.json(lot)
    } else {
      res.status(404).json({ error: 'Parking lot not found' })
    }
  } catch (error) {
    console.error('Error fetching slot:', error)
    res.status(500).json({ error: 'Failed to fetch parking slot' })
  }
})

export default router
