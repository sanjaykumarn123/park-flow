import express from 'express'
import PredictionEngine from '../services/predictionEngine.js'

const router = express.Router()
const predictionEngine = new PredictionEngine()

// Prediction simulation function
function predictionSim(lotId, currentOccupancy, capacity) {
  const occupancyRate = (currentOccupancy / capacity) * 100
  const timeOfDay = new Date().getHours()
  
  // Base prediction on current occupancy
  let predictedOccupancy = currentOccupancy
  let confidence = 75
  
  // Peak hours (8-10 AM, 5-8 PM) - increase occupancy
  if ((timeOfDay >= 8 && timeOfDay <= 10) || (timeOfDay >= 17 && timeOfDay <= 20)) {
    predictedOccupancy = Math.min(capacity, currentOccupancy + Math.floor(capacity * 0.15))
    confidence = 85
  }
  // Off-peak hours (11 PM - 6 AM) - decrease occupancy
  else if (timeOfDay >= 23 || timeOfDay <= 6) {
    predictedOccupancy = Math.max(0, currentOccupancy - Math.floor(capacity * 0.20))
    confidence = 80
  }
  // Normal hours - slight variation
  else {
    const variation = Math.floor(Math.random() * 10) - 5
    predictedOccupancy = Math.max(0, Math.min(capacity, currentOccupancy + variation))
    confidence = 75
  }
  
  // Add some randomness to confidence
  confidence += Math.floor(Math.random() * 10) - 5
  confidence = Math.max(60, Math.min(95, confidence))
  
  // Generate message
  const availableSlots = capacity - predictedOccupancy
  let message = ''
  
  if (availableSlots <= 5) {
    message = `Almost full - only ${availableSlots} slots predicted`
  } else if (availableSlots <= 20) {
    message = `Limited availability - ${availableSlots} slots predicted`
  } else if (availableSlots <= 50) {
    message = `Moderate availability - ${availableSlots} slots predicted`
  } else {
    message = `Good availability - ${availableSlots} slots predicted`
  }
  
  // Time-based message
  const minutesAhead = 60
  if (occupancyRate < 50) {
    message = `Free for next ${minutesAhead + Math.floor(Math.random() * 60)} min`
  } else if (occupancyRate >= 90) {
    message = 'High demand - book now'
  }
  
  return {
    predicted_occupancy: predictedOccupancy,
    predicted_available: availableSlots,
    confidence: confidence,
    message: message,
    timestamp: new Date().toISOString(),
    factors: {
      timeOfDay: timeOfDay,
      currentOccupancyRate: Math.round(occupancyRate),
      trend: predictedOccupancy > currentOccupancy ? 'increasing' : 'decreasing'
    }
  }
}

// POST /api/predict - Get occupancy prediction
router.post('/', async (req, res) => {
  try {
    const { lotId, currentOccupancy, capacity } = req.body
    
    if (!lotId) {
      return res.status(400).json({ error: 'lot_id is required' })
    }
    
    // Use provided values or defaults
    const occupancy = currentOccupancy || Math.floor(Math.random() * 100)
    const lotCapacity = capacity || 150
    
    // Run prediction simulation
    const prediction = predictionSim(lotId, occupancy, lotCapacity)
    
    res.json({
      lot_id: lotId,
      ...prediction
    })
  } catch (error) {
    console.error('Error generating prediction:', error)
    res.status(500).json({ error: 'Failed to generate prediction' })
  }
})

// POST /api/predict/batch - Get predictions for multiple lots
router.post('/batch', async (req, res) => {
  try {
    const { lots } = req.body
    
    if (!Array.isArray(lots)) {
      return res.status(400).json({ error: 'lots must be an array' })
    }
    
    const predictions = lots.map(lot => ({
      lot_id: lot.id,
      ...predictionSim(lot.id, lot.occupied || 0, lot.capacity || 150)
    }))
    
    res.json({ predictions })
  } catch (error) {
    console.error('Error generating batch predictions:', error)
    res.status(500).json({ error: 'Failed to generate predictions' })
  }
})

// POST /api/predict/advanced - Advanced ML-based prediction
router.post('/advanced', async (req, res) => {
  try {
    const { lotId, hoursAhead = 2 } = req.body
    
    if (!lotId) {
      return res.status(400).json({ error: 'lotId is required' })
    }
    
    const prediction = await predictionEngine.predictOccupancy(lotId, hoursAhead)
    
    res.json({
      lotId,
      ...prediction,
      apiVersion: '2.0',
      model: 'ensemble'
    })
  } catch (error) {
    console.error('Error in advanced prediction:', error)
    res.status(500).json({ error: 'Failed to generate advanced prediction' })
  }
})

// POST /api/predict/anomaly - Detect anomalies
router.post('/anomaly', async (req, res) => {
  try {
    const { lotId, currentOccupancy, capacity } = req.body
    
    if (!lotId) {
      return res.status(400).json({ error: 'lotId is required' })
    }
    
    const anomalyReport = await predictionEngine.detectAnomalies(lotId, {
      occupancy: currentOccupancy,
      capacity,
      timestamp: new Date()
    })
    
    res.json({
      lotId,
      ...anomalyReport
    })
  } catch (error) {
    console.error('Error in anomaly detection:', error)
    res.status(500).json({ error: 'Failed to detect anomalies' })
  }
})

// POST /api/predict/dynamic-price - Calculate dynamic pricing
router.post('/dynamic-price', async (req, res) => {
  try {
    const { 
      lotId, 
      basePrice, 
      currentOccupancy, 
      capacity,
      timeOfDay,
      isEvent = false,
      weatherCondition = 'clear'
    } = req.body
    
    if (!lotId || !basePrice || !capacity) {
      return res.status(400).json({ error: 'lotId, basePrice, and capacity are required' })
    }
    
    // Get prediction first
    const prediction = await predictionEngine.predictOccupancy(lotId, 1)
    
    // Calculate dynamic price
    const pricing = predictionEngine.calculateDynamicPrice(
      basePrice,
      prediction,
      currentOccupancy,
      { capacity, timeOfDay, isEvent, weatherCondition }
    )
    
    res.json({
      lotId,
      ...pricing,
      prediction: prediction.prediction,
      timestamp: new Date()
    })
  } catch (error) {
    console.error('Error calculating dynamic price:', error)
    res.status(500).json({ error: 'Failed to calculate dynamic price' })
  }
})

// POST /api/predict/demand-forecast - Forecast demand for date range
router.post('/demand-forecast', async (req, res) => {
  try {
    const { lotId, startDate, endDate, externalFactors = {} } = req.body
    
    if (!lotId || !startDate || !endDate) {
      return res.status(400).json({ error: 'lotId, startDate, and endDate are required' })
    }
    
    // Generate date range
    const dateRange = generateDateRange(new Date(startDate), new Date(endDate))
    
    const forecast = await predictionEngine.forecastDemand(lotId, dateRange, externalFactors)
    
    res.json({
      lotId,
      ...forecast,
      period: { startDate, endDate }
    })
  } catch (error) {
    console.error('Error in demand forecasting:', error)
    res.status(500).json({ error: 'Failed to generate demand forecast' })
  }
})

// GET /api/predict/health - Prediction engine health check
router.get('/health', (req, res) => {
  res.json({
    status: 'operational',
    models: {
      timeSeries: 'active',
      demandForecaster: 'active',
      anomalyDetector: 'active',
      behaviorAnalyzer: 'active'
    },
    versions: predictionEngine.getModelVersions(),
    uptime: process.uptime(),
    timestamp: new Date()
  })
})

// Helper function
function generateDateRange(start, end) {
  const dates = []
  const current = new Date(start)
  
  while (current <= end) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  
  return dates
}

export default router
