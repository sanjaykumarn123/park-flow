import express from 'express'
import { supabase, inMemoryStorage } from '../server.js'

const router = express.Router()

// POST /api/bookings - Create new booking
router.post('/', async (req, res) => {
  try {
    const { lotId, lotName, startTime, duration, vehicleNumber, paymentMethod, totalPrice } = req.body
    
    // Validate required fields
    if (!lotId || !startTime || !duration || !vehicleNumber) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['lotId', 'startTime', 'duration', 'vehicleNumber']
      })
    }
    
    const bookingData = {
      lot_id: lotId,
      lot_name: lotName,
      start_time: startTime,
      duration: duration,
      vehicle_number: vehicleNumber,
      payment_method: paymentMethod || 'upi',
      total_price: totalPrice,
      status: 'active',
      created_at: new Date().toISOString()
    }
    
    // Try to save to Supabase
    if (supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single()
      
      if (error) {
        console.log('Supabase error, using in-memory:', error.message)
      } else if (data) {
        return res.status(201).json({
          id: data.id,
          ...bookingData,
          message: 'Booking created successfully'
        })
      }
    }
    
    // Fallback to in-memory storage
    const booking = {
      id: inMemoryStorage.bookingIdCounter++,
      ...bookingData
    }
    inMemoryStorage.bookings.push(booking)
    
    res.status(201).json({
      ...booking,
      message: 'Booking created successfully'
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    res.status(500).json({ error: 'Failed to create booking' })
  }
})

// GET /api/bookings/:id - Get booking details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    // Try Supabase first
    if (supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single()
      
      if (data) {
        return res.json(data)
      }
    }
    
    // Fallback to in-memory
    const booking = inMemoryStorage.bookings.find(b => b.id == id)
    if (booking) {
      res.json(booking)
    } else {
      res.status(404).json({ error: 'Booking not found' })
    }
  } catch (error) {
    console.error('Error fetching booking:', error)
    res.status(500).json({ error: 'Failed to fetch booking' })
  }
})

// POST /api/bookings/:id/extend - Extend booking
router.post('/:id/extend', async (req, res) => {
  try {
    const { id } = req.params
    const { additionalHours } = req.body
    
    if (!additionalHours || additionalHours < 1) {
      return res.status(400).json({ error: 'Invalid additional hours' })
    }
    
    // Try Supabase first
    if (supabase) {
      const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single()
      
      if (booking) {
        const newDuration = booking.duration + additionalHours
        const newTotalPrice = booking.total_price + (booking.total_price / booking.duration * additionalHours)
        
        const { data, error } = await supabase
          .from('bookings')
          .update({
            duration: newDuration,
            total_price: newTotalPrice,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single()
        
        if (data) {
          return res.json({
            ...data,
            message: `Booking extended by ${additionalHours} hour(s)`
          })
        }
      }
    }
    
    // Fallback to in-memory
    const bookingIndex = inMemoryStorage.bookings.findIndex(b => b.id == id)
    if (bookingIndex !== -1) {
      const booking = inMemoryStorage.bookings[bookingIndex]
      booking.duration += additionalHours
      booking.total_price += (booking.total_price / (booking.duration - additionalHours)) * additionalHours
      booking.updated_at = new Date().toISOString()
      
      res.json({
        ...booking,
        message: `Booking extended by ${additionalHours} hour(s)`
      })
    } else {
      res.status(404).json({ error: 'Booking not found' })
    }
  } catch (error) {
    console.error('Error extending booking:', error)
    res.status(500).json({ error: 'Failed to extend booking' })
  }
})

// POST /api/bookings/:id/cancel - Cancel booking
router.post('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params
    
    // Try Supabase first
    if (supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
      
      if (data) {
        return res.json({
          ...data,
          message: 'Booking cancelled successfully',
          refund: {
            amount: data.total_price,
            status: 'processing',
            estimatedDays: '2-3 business days'
          }
        })
      }
    }
    
    // Fallback to in-memory
    const bookingIndex = inMemoryStorage.bookings.findIndex(b => b.id == id)
    if (bookingIndex !== -1) {
      const booking = inMemoryStorage.bookings[bookingIndex]
      booking.status = 'cancelled'
      booking.cancelled_at = new Date().toISOString()
      
      res.json({
        ...booking,
        message: 'Booking cancelled successfully',
        refund: {
          amount: booking.total_price,
          status: 'processing',
          estimatedDays: '2-3 business days'
        }
      })
    } else {
      res.status(404).json({ error: 'Booking not found' })
    }
  } catch (error) {
    console.error('Error cancelling booking:', error)
    res.status(500).json({ error: 'Failed to cancel booking' })
  }
})

// GET /api/bookings - Get all bookings (for operator)
router.get('/', async (req, res) => {
  try {
    const { status, limit = 100 } = req.query
    
    // Try Supabase first
    if (supabase) {
      let query = supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (status) {
        query = query.eq('status', status)
      }
      
      const { data, error } = await query
      
      if (data) {
        return res.json(data)
      }
    }
    
    // Fallback to in-memory
    let bookings = [...inMemoryStorage.bookings]
    if (status) {
      bookings = bookings.filter(b => b.status === status)
    }
    bookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    
    res.json(bookings.slice(0, limit))
  } catch (error) {
    console.error('Error fetching bookings:', error)
    res.status(500).json({ error: 'Failed to fetch bookings' })
  }
})

export default router
