import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import websocketService from './services/websocketService.js'

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 5000

// Initialize Supabase client
let supabase = null
if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  console.log('✅ Supabase connected')
} else {
  console.log('⚠️  Supabase not configured - using in-memory storage')
}

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(morgan('dev'))

// In-memory storage (fallback when Supabase not configured)
const inMemoryStorage = {
  bookings: [],
  payments: [],
  bookingIdCounter: 1000
}

// Import routes
import slotsRoutes from './routes/slots.js'
import bookingsRoutes from './routes/bookings.js'
import predictRoutes from './routes/predict.js'
import paymentsRoutes from './routes/payments.js'
import cityRoutes from './routes/city.js'
import parkingRoutes from './routes/parking.js'
import aiRoutes from './routes/ai.js'
import operatorRoutes from './routes/operator.js'
import analyticsRoutes from './routes/analytics.js'

// Mount routes
app.use('/api/slots', slotsRoutes)
app.use('/api/bookings', bookingsRoutes)
app.use('/api/predict', predictRoutes)
app.use('/api/payments', paymentsRoutes)
app.use('/api/city', cityRoutes)
app.use('/api/parking', parkingRoutes)
app.use('/api/ai-assistant', aiRoutes)
app.use('/api/operator', operatorRoutes)
app.use('/api/pricing', operatorRoutes)
app.use('/api/analytics', analyticsRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    supabase: supabase ? 'connected' : 'not configured',
    uptime: process.uptime()
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'ParkFlow API Server',
    version: '1.0.0',
    endpoints: {
      slots: 'GET /api/slots',
      bookings: 'POST /api/bookings',
      predict: 'POST /api/predict',
      payments: 'POST /api/payments',
      cityOverview: 'GET /api/city/overview',
      cityRevenue: 'GET /api/city/revenue',
      parkingFind: 'POST /api/parking/find',
      aiAssistant: 'POST /api/ai-assistant',
      operatorDashboard: 'GET /api/operator/dashboard',
      health: 'GET /health'
    }
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableEndpoints: [
      'GET /api/slots',
      'POST /api/bookings',
      'POST /api/predict',
      'POST /api/payments',
      'GET /api/city/overview',
      'GET /api/city/revenue',
      'POST /api/parking/find',
      'POST /api/ai-assistant',
      'GET /api/operator/dashboard'
    ]
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// Start server with WebSocket support
const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║      ParkFlow API Server Running          ║
╠═══════════════════════════════════════════╣
║  Port:        ${PORT}                        ║
║  Environment: ${process.env.NODE_ENV || 'development'}              ║
║  Supabase:    ${supabase ? 'Connected' : 'Not configured'}       ║
║  Frontend:    ${process.env.FRONTEND_URL || 'http://localhost:3000'}  ║
║  WebSocket:   ws://localhost:${PORT}/ws    ║
╚═══════════════════════════════════════════╝
  `)
  
  // Initialize WebSocket
  websocketService.initialize(server)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...')
  websocketService.shutdown()
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

// Export for testing
export { app, supabase, inMemoryStorage, websocketService }
