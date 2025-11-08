import express from 'express'
import { supabase, inMemoryStorage } from '../server.js'

const router = express.Router()

// Mock operator dashboard data
function generateOperatorData() {
  return {
    stats: {
      totalBookings: 342 + Math.floor(Math.random() * 50),
      occupancyRate: 65 + Math.floor(Math.random() * 20),
      todayRevenue: 35000 + Math.floor(Math.random() * 15000),
      activeAlerts: Math.floor(Math.random() * 5)
    },
    bookings: [
      {
        id: 1001,
        vehicleNumber: 'DL01AB1234',
        lotName: 'Central Plaza Parking',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        duration: 3,
        totalPrice: 150,
        status: 'active'
      },
      {
        id: 1002,
        vehicleNumber: 'DL02CD5678',
        lotName: 'Mall Road Parking Hub',
        startTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        duration: 2,
        totalPrice: 80,
        status: 'active'
      },
      {
        id: 1003,
        vehicleNumber: 'DL03EF9012',
        lotName: 'Metro Station Parking',
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        duration: 2,
        totalPrice: 60,
        status: 'completed'
      },
      {
        id: 1004,
        vehicleNumber: 'DL04GH3456',
        lotName: 'Business District Parking',
        startTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        duration: 4,
        totalPrice: 240,
        status: 'active'
      },
      {
        id: 1005,
        vehicleNumber: 'DL05IJ7890',
        lotName: 'Airport Express Parking',
        startTime: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        duration: 3,
        totalPrice: 135,
        status: 'cancelled'
      }
    ],
    lots: [
      {
        id: 'lot-001',
        name: 'Central Plaza Parking',
        capacity: 150,
        occupied: 98,
        pricePerHour: 50
      },
      {
        id: 'lot-002',
        name: 'Mall Road Parking Hub',
        capacity: 200,
        occupied: 145,
        pricePerHour: 40
      },
      {
        id: 'lot-003',
        name: 'Metro Station Parking',
        capacity: 100,
        occupied: 45,
        pricePerHour: 30
      },
      {
        id: 'lot-004',
        name: 'Business District Parking',
        capacity: 180,
        occupied: 162,
        pricePerHour: 60
      },
      {
        id: 'lot-005',
        name: 'Airport Express Parking',
        capacity: 250,
        occupied: 120,
        pricePerHour: 45
      }
    ],
    analytics: {
      revenueData: [
        { day: 'Mon', revenue: 4500 },
        { day: 'Tue', revenue: 5200 },
        { day: 'Wed', revenue: 4800 },
        { day: 'Thu', revenue: 6100 },
        { day: 'Fri', revenue: 7200 },
        { day: 'Sat', revenue: 8500 },
        { day: 'Sun', revenue: 7800 }
      ],
      utilizationData: [
        { hour: '00:00', rate: 20 },
        { hour: '04:00', rate: 15 },
        { hour: '08:00', rate: 65 },
        { hour: '12:00', rate: 85 },
        { hour: '16:00', rate: 90 },
        { hour: '20:00', rate: 70 },
        { hour: '23:00', rate: 45 }
      ]
    }
  }
}

// GET /api/operator/dashboard - Get operator dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    // Try to fetch from Supabase if configured
    if (supabase) {
      // Fetch bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      
      // Fetch parking lots
      const { data: lots, error: lotsError } = await supabase
        .from('parking_lots')
        .select('*')
      
      if (bookings && lots) {
        // Calculate stats
        const activeBookings = bookings.filter(b => b.status === 'active')
        const todayBookings = bookings.filter(b => {
          const bookingDate = new Date(b.created_at)
          const today = new Date()
          return bookingDate.toDateString() === today.toDateString()
        })
        
        const totalCapacity = lots.reduce((sum, lot) => sum + lot.capacity, 0)
        const totalOccupied = lots.reduce((sum, lot) => sum + (lot.current_occupancy || 0), 0)
        const occupancyRate = Math.round((totalOccupied / totalCapacity) * 100)
        
        const todayRevenue = todayBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
        
        return res.json({
          stats: {
            totalBookings: bookings.length,
            occupancyRate: occupancyRate,
            todayRevenue: todayRevenue,
            activeAlerts: 0
          },
          bookings: bookings.slice(0, 20),
          lots: lots,
          analytics: generateOperatorData().analytics
        })
      }
    }
    
    // Fallback to mock data
    const data = generateOperatorData()
    
    // Add in-memory bookings if any
    if (inMemoryStorage.bookings.length > 0) {
      data.bookings = [...inMemoryStorage.bookings, ...data.bookings].slice(0, 20)
      data.stats.totalBookings = inMemoryStorage.bookings.length + data.stats.totalBookings
    }
    
    res.json(data)
  } catch (error) {
    console.error('Error fetching operator dashboard:', error)
    res.status(500).json({ error: 'Failed to fetch operator dashboard' })
  }
})

// POST /api/pricing/update - Update lot pricing
router.post('/update', async (req, res) => {
  try {
    const { lotId, newPrice } = req.body
    
    if (!lotId || !newPrice) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['lotId', 'newPrice']
      })
    }
    
    if (newPrice < 0 || newPrice > 200) {
      return res.status(400).json({
        error: 'Invalid price',
        message: 'Price must be between ₹0 and ₹200'
      })
    }
    
    // Try to update in Supabase
    if (supabase) {
      const { data, error } = await supabase
        .from('parking_lots')
        .update({
          price_per_hour: newPrice,
          updated_at: new Date().toISOString()
        })
        .eq('id', lotId)
        .select()
        .single()
      
      if (data) {
        return res.json({
          success: true,
          message: `Price updated to ₹${newPrice}/hr`,
          lot: data
        })
      }
    }
    
    // Fallback response
    res.json({
      success: true,
      message: `Price updated to ₹${newPrice}/hr for lot ${lotId}`,
      lotId: lotId,
      newPrice: newPrice,
      previousPrice: 50, // Mock previous price
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating pricing:', error)
    res.status(500).json({ error: 'Failed to update pricing' })
  }
})

// GET /api/operator/analytics - Get detailed analytics
router.get('/analytics', async (req, res) => {
  try {
    const { period = '7d' } = req.query
    
    res.json({
      period: period,
      summary: {
        totalRevenue: 44100,
        totalBookings: 342,
        avgDuration: 2.4,
        avgOccupancy: 68
      },
      charts: {
        revenue: [
          { day: 'Mon', revenue: 4500 },
          { day: 'Tue', revenue: 5200 },
          { day: 'Wed', revenue: 4800 },
          { day: 'Thu', revenue: 6100 },
          { day: 'Fri', revenue: 7200 },
          { day: 'Sat', revenue: 8500 },
          { day: 'Sun', revenue: 7800 }
        ],
        utilization: [
          { hour: '00:00', rate: 20 },
          { hour: '04:00', rate: 15 },
          { hour: '08:00', rate: 65 },
          { hour: '12:00', rate: 85 },
          { hour: '16:00', rate: 90 },
          { hour: '20:00', rate: 70 },
          { hour: '23:00', rate: 45 }
        ],
        vehicleTypes: [
          { type: 'Car', count: 220 },
          { type: 'Bike', count: 85 },
          { type: 'SUV', count: 37 }
        ]
      }
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    res.status(500).json({ error: 'Failed to fetch analytics' })
  }
})

// GET /api/operator/alerts - Get system alerts
router.get('/alerts', async (req, res) => {
  try {
    const alerts = [
      {
        id: 1,
        type: 'warning',
        title: 'High Occupancy',
        message: 'Business District Parking is at 90% capacity',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        lotId: 'lot-004'
      },
      {
        id: 2,
        type: 'info',
        title: 'Price Update',
        message: 'Central Plaza pricing adjusted for peak hours',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        lotId: 'lot-001'
      }
    ]
    
    res.json({ alerts })
  } catch (error) {
    console.error('Error fetching alerts:', error)
    res.status(500).json({ error: 'Failed to fetch alerts' })
  }
})

export default router
