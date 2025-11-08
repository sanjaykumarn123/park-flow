import express from 'express'
import { supabase } from '../server.js'

const router = express.Router()

// Mock city data generator
function generateCityData() {
  const activeLots = 5
  const totalCapacity = 880
  const totalOccupied = Math.floor(totalCapacity * (0.5 + Math.random() * 0.3))
  const avgOccupancy = Math.round((totalOccupied / totalCapacity) * 100)
  const congestionIndex = Math.round(avgOccupancy * 0.8 + Math.random() * 20)
  
  return {
    active_lots: activeLots,
    total_capacity: totalCapacity,
    total_occupied: totalOccupied,
    avg_occupancy: avgOccupancy,
    total_revenue: Math.floor(35000 + Math.random() * 15000),
    congestion_index: congestionIndex,
    emission_reduction: Math.floor(150 + Math.random() * 50),
    timestamp: new Date().toISOString()
  }
}

// Generate revenue data for charts
function generateRevenueData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map(day => ({
    day,
    revenue: Math.floor(4000 + Math.random() * 4000)
  }))
}

// Generate congestion data
function generateCongestionData() {
  const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:00']
  return hours.map(hour => ({
    hour,
    rate: Math.floor(10 + Math.random() * 80)
  }))
}

// GET /api/city/overview - Get city-wide overview
router.get('/overview', async (req, res) => {
  try {
    // Try to fetch from Supabase if configured
    if (supabase) {
      const { data: lots, error } = await supabase
        .from('parking_lots')
        .select('*')
      
      if (lots && lots.length > 0) {
        const totalCapacity = lots.reduce((sum, lot) => sum + lot.capacity, 0)
        const totalOccupied = lots.reduce((sum, lot) => sum + (lot.current_occupancy || 0), 0)
        const avgOccupancy = Math.round((totalOccupied / totalCapacity) * 100)
        
        return res.json({
          metrics: {
            activeLots: lots.length,
            congestionRate: Math.round(avgOccupancy * 0.8),
            dailyRevenue: Math.floor(35000 + Math.random() * 15000),
            emissionReduction: Math.floor(150 + Math.random() * 50)
          },
          lots: lots.map(lot => ({
            id: lot.id,
            name: lot.name,
            location: lot.location,
            capacity: lot.capacity,
            occupied: lot.current_occupancy || 0,
            pricePerHour: lot.price_per_hour,
            coordinates: lot.coordinates || [28.6139 + (Math.random() - 0.5) * 0.1, 77.2090 + (Math.random() - 0.5) * 0.1]
          }))
        })
      }
    }
    
    // Fallback to mock data
    const cityData = generateCityData()
    
    res.json({
      metrics: {
        activeLots: cityData.active_lots,
        congestionRate: cityData.congestion_index,
        dailyRevenue: cityData.total_revenue,
        emissionReduction: cityData.emission_reduction
      },
      lots: [
        {
          id: 'lot-001',
          name: 'Central Plaza Parking',
          location: 'Connaught Place',
          capacity: 150,
          occupied: 98,
          pricePerHour: 50,
          coordinates: [28.6315, 77.2167]
        },
        {
          id: 'lot-002',
          name: 'Mall Road Parking Hub',
          location: 'Saket',
          capacity: 200,
          occupied: 145,
          pricePerHour: 40,
          coordinates: [28.5244, 77.2066]
        },
        {
          id: 'lot-003',
          name: 'Metro Station Parking',
          location: 'Rajiv Chowk',
          capacity: 100,
          occupied: 45,
          pricePerHour: 30,
          coordinates: [28.6328, 77.2197]
        },
        {
          id: 'lot-004',
          name: 'Business District Parking',
          location: 'Nehru Place',
          capacity: 180,
          occupied: 162,
          pricePerHour: 60,
          coordinates: [28.5494, 77.2501]
        },
        {
          id: 'lot-005',
          name: 'Airport Express Parking',
          location: 'Aerocity',
          capacity: 250,
          occupied: 120,
          pricePerHour: 45,
          coordinates: [28.5562, 77.0999]
        }
      ]
    })
  } catch (error) {
    console.error('Error fetching city overview:', error)
    res.status(500).json({ error: 'Failed to fetch city overview' })
  }
})

// GET /api/city/revenue - Get revenue chart data
router.get('/revenue', async (req, res) => {
  try {
    const { days = 7 } = req.query
    
    // Try to fetch from Supabase
    if (supabase) {
      const { data, error } = await supabase
        .from('daily_revenue')
        .select('*')
        .order('date', { ascending: false })
        .limit(days)
      
      if (data && data.length > 0) {
        return res.json(data.reverse())
      }
    }
    
    // Fallback to mock data
    res.json(generateRevenueData())
  } catch (error) {
    console.error('Error fetching revenue data:', error)
    res.status(500).json({ error: 'Failed to fetch revenue data' })
  }
})

// GET /api/city/congestion - Get congestion data
router.get('/congestion', async (req, res) => {
  try {
    res.json(generateCongestionData())
  } catch (error) {
    console.error('Error fetching congestion data:', error)
    res.status(500).json({ error: 'Failed to fetch congestion data' })
  }
})

// GET /api/city/emissions - Get emission reduction data
router.get('/emissions', async (req, res) => {
  try {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const emissionData = days.map(day => ({
      day,
      reduction: Math.floor(140 + Math.random() * 60)
    }))
    
    res.json(emissionData)
  } catch (error) {
    console.error('Error fetching emission data:', error)
    res.status(500).json({ error: 'Failed to fetch emission data' })
  }
})

// GET /api/city/stats - Get detailed city statistics
router.get('/stats', async (req, res) => {
  try {
    const cityData = generateCityData()
    
    res.json({
      ...cityData,
      breakdown: {
        peak_hours: '17:00 - 20:00',
        avg_parking_duration: '2.4 hours',
        most_used_payment: 'UPI (65%)',
        customer_satisfaction: '4.5/5'
      }
    })
  } catch (error) {
    console.error('Error fetching city stats:', error)
    res.status(500).json({ error: 'Failed to fetch city statistics' })
  }
})

export default router
