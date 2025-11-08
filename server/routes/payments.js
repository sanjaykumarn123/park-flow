import express from 'express'
import { supabase, inMemoryStorage } from '../server.js'

const router = express.Router()

// Simulate payment processing delay
const simulatePaymentDelay = () => {
  return new Promise(resolve => {
    setTimeout(resolve, 1500 + Math.random() * 1000) // 1.5-2.5 seconds
  })
}

// POST /api/payments - Process payment
router.post('/', async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod = 'upi' } = req.body
    
    if (!bookingId || !amount) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['bookingId', 'amount']
      })
    }
    
    // Simulate payment processing
    await simulatePaymentDelay()
    
    // 95% success rate simulation
    const isSuccess = Math.random() > 0.05
    
    if (!isSuccess) {
      return res.status(400).json({
        status: 'failed',
        message: 'Payment failed. Please try again.',
        error: 'PAYMENT_GATEWAY_ERROR'
      })
    }
    
    const paymentData = {
      booking_id: bookingId,
      amount: amount,
      payment_method: paymentMethod,
      status: 'success',
      transaction_id: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
      processed_at: new Date().toISOString()
    }
    
    // Try to save to Supabase
    if (supabase) {
      const { data, error } = await supabase
        .from('payments')
        .insert([paymentData])
        .select()
        .single()
      
      if (data) {
        return res.json({
          ...data,
          message: 'Payment processed successfully'
        })
      }
    }
    
    // Fallback to in-memory storage
    const payment = {
      id: Date.now(),
      ...paymentData
    }
    inMemoryStorage.payments.push(payment)
    
    res.json({
      ...payment,
      message: 'Payment processed successfully'
    })
  } catch (error) {
    console.error('Error processing payment:', error)
    res.status(500).json({
      status: 'error',
      error: 'Failed to process payment'
    })
  }
})

// GET /api/payments/:bookingId - Get payment details for a booking
router.get('/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params
    
    // Try Supabase first
    if (supabase) {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('booking_id', bookingId)
        .order('processed_at', { ascending: false })
      
      if (data && data.length > 0) {
        return res.json(data)
      }
    }
    
    // Fallback to in-memory
    const payments = inMemoryStorage.payments.filter(p => p.booking_id == bookingId)
    
    if (payments.length > 0) {
      res.json(payments)
    } else {
      res.status(404).json({ error: 'No payments found for this booking' })
    }
  } catch (error) {
    console.error('Error fetching payment:', error)
    res.status(500).json({ error: 'Failed to fetch payment details' })
  }
})

// POST /api/payments/refund - Process refund
router.post('/refund', async (req, res) => {
  try {
    const { bookingId, amount, reason } = req.body
    
    if (!bookingId || !amount) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['bookingId', 'amount']
      })
    }
    
    // Simulate refund processing
    await simulatePaymentDelay()
    
    const refundData = {
      booking_id: bookingId,
      amount: amount,
      reason: reason || 'Booking cancelled',
      status: 'processing',
      refund_id: `RFD${Date.now()}${Math.floor(Math.random() * 1000)}`,
      initiated_at: new Date().toISOString(),
      estimated_completion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days
    }
    
    // Try to save to Supabase
    if (supabase) {
      const { data, error } = await supabase
        .from('refunds')
        .insert([refundData])
        .select()
        .single()
      
      if (data) {
        return res.json({
          ...data,
          message: 'Refund initiated successfully'
        })
      }
    }
    
    // Fallback response
    res.json({
      ...refundData,
      message: 'Refund initiated successfully',
      estimatedDays: '2-3 business days'
    })
  } catch (error) {
    console.error('Error processing refund:', error)
    res.status(500).json({ error: 'Failed to process refund' })
  }
})

export default router
