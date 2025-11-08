import express from 'express'
import AnalyticsEngine from '../services/analyticsEngine.js'
import PredictionEngine from '../services/predictionEngine.js'

const router = express.Router()
const analyticsEngine = new AnalyticsEngine()
const predictionEngine = new PredictionEngine()

// GET /api/analytics/system-health - System health monitoring
router.get('/system-health', async (req, res) => {
  try {
    const health = await analyticsEngine.getSystemHealth()
    res.json(health)
  } catch (error) {
    console.error('Error getting system health:', error)
    res.status(500).json({ error: 'Failed to get system health' })
  }
})

// POST /api/analytics/user-behavior - Analyze user behavior
router.post('/user-behavior', async (req, res) => {
  try {
    const { userId, timeframe = '30d' } = req.body
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' })
    }
    
    const behaviorAnalysis = await analyticsEngine.analyzeUserBehavior(userId, timeframe)
    
    // Also get prediction engine's behavioral insights
    const bookingHistory = [] // Would fetch from database
    const predictions = await predictionEngine.analyzeBehavior(userId, bookingHistory)
    
    res.json({
      ...behaviorAnalysis,
      predictions
    })
  } catch (error) {
    console.error('Error analyzing user behavior:', error)
    res.status(500).json({ error: 'Failed to analyze user behavior' })
  }
})

// GET /api/analytics/occupancy/:lotId - Occupancy pattern analysis
router.get('/occupancy/:lotId', async (req, res) => {
  try {
    const { lotId } = req.params
    const { duration = '24h' } = req.query
    
    const patterns = await analyticsEngine.analyzeOccupancyPatterns(lotId, duration)
    
    res.json(patterns)
  } catch (error) {
    console.error('Error analyzing occupancy patterns:', error)
    res.status(500).json({ error: 'Failed to analyze occupancy patterns' })
  }
})

// GET /api/analytics/revenue/:lotId - Revenue analytics
router.get('/revenue/:lotId', async (req, res) => {
  try {
    const { lotId } = req.params
    const { period = 'week' } = req.query
    
    const revenueAnalysis = await analyticsEngine.analyzeRevenue(lotId, period)
    
    res.json(revenueAnalysis)
  } catch (error) {
    console.error('Error analyzing revenue:', error)
    res.status(500).json({ error: 'Failed to analyze revenue' })
  }
})

// GET /api/analytics/queue-performance - Virtual queue analytics
router.get('/queue-performance', async (req, res) => {
  try {
    const queueAnalysis = await analyticsEngine.analyzeQueuePerformance()
    
    res.json(queueAnalysis)
  } catch (error) {
    console.error('Error analyzing queue performance:', error)
    res.status(500).json({ error: 'Failed to analyze queue performance' })
  }
})

// GET /api/analytics/alerts/:lotId - Predictive alerts
router.get('/alerts/:lotId', async (req, res) => {
  try {
    const { lotId } = req.params
    
    const alerts = await analyticsEngine.generatePredictiveAlerts(lotId)
    
    res.json(alerts)
  } catch (error) {
    console.error('Error generating alerts:', error)
    res.status(500).json({ error: 'Failed to generate alerts' })
  }
})

// GET /api/analytics/dashboard - Comprehensive analytics dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const { lotId, timeframe = '24h' } = req.query
    
    if (!lotId) {
      return res.status(400).json({ error: 'lotId is required' })
    }
    
    // Parallel data fetching
    const [
      systemHealth,
      occupancyPatterns,
      revenueAnalysis,
      queuePerformance,
      alerts
    ] = await Promise.all([
      analyticsEngine.getSystemHealth(),
      analyticsEngine.analyzeOccupancyPatterns(lotId, timeframe),
      analyticsEngine.analyzeRevenue(lotId, 'week'),
      analyticsEngine.analyzeQueuePerformance(),
      analyticsEngine.generatePredictiveAlerts(lotId)
    ])
    
    res.json({
      lotId,
      timeframe,
      timestamp: new Date(),
      systemHealth,
      occupancyPatterns,
      revenueAnalysis,
      queuePerformance,
      alerts,
      summary: {
        overallHealth: systemHealth.status,
        utilizationRate: occupancyPatterns.patterns.utilizationRate,
        weeklyRevenue: revenueAnalysis.analysis.total,
        activeAlerts: alerts.alerts.length
      }
    })
  } catch (error) {
    console.error('Error getting analytics dashboard:', error)
    res.status(500).json({ error: 'Failed to get analytics dashboard' })
  }
})

// POST /api/analytics/experiment - A/B testing analytics
router.post('/experiment', async (req, res) => {
  try {
    const { experimentId } = req.body
    
    if (!experimentId) {
      return res.status(400).json({ error: 'experimentId is required' })
    }
    
    const experimentResults = await analyticsEngine.analyzeExperiment(experimentId)
    
    res.json(experimentResults)
  } catch (error) {
    console.error('Error analyzing experiment:', error)
    res.status(500).json({ error: 'Failed to analyze experiment' })
  }
})

// GET /api/analytics/realtime/:lotId - Real-time metrics stream
router.get('/realtime/:lotId', async (req, res) => {
  try {
    const { lotId } = req.params
    
    // Set up SSE (Server-Sent Events) for real-time updates
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    
    // Send initial data
    const initialData = await analyticsEngine.analyzeOccupancyPatterns(lotId, '1h')
    res.write(`data: ${JSON.stringify(initialData)}\n\n`)
    
    // Set up interval for updates (every 30 seconds)
    const interval = setInterval(async () => {
      try {
        const updateData = await analyticsEngine.analyzeOccupancyPatterns(lotId, '1h')
        res.write(`data: ${JSON.stringify(updateData)}\n\n`)
      } catch (error) {
        console.error('Error in realtime stream:', error)
      }
    }, 30000)
    
    // Cleanup on client disconnect
    req.on('close', () => {
      clearInterval(interval)
      res.end()
    })
  } catch (error) {
    console.error('Error setting up realtime stream:', error)
    res.status(500).json({ error: 'Failed to set up realtime stream' })
  }
})

// POST /api/analytics/custom-report - Generate custom analytics report
router.post('/custom-report', async (req, res) => {
  try {
    const { 
      lotIds, 
      metrics, 
      startDate, 
      endDate, 
      groupBy = 'day' 
    } = req.body
    
    if (!lotIds || !metrics || !startDate || !endDate) {
      return res.status(400).json({ 
        error: 'lotIds, metrics, startDate, and endDate are required' 
      })
    }
    
    // Generate custom report based on requested metrics
    const report = {
      reportId: `report_${Date.now()}`,
      generatedAt: new Date(),
      period: { startDate, endDate },
      groupBy,
      lots: []
    }
    
    for (const lotId of lotIds) {
      const lotData = {
        lotId,
        metrics: {}
      }
      
      // Fetch requested metrics
      if (metrics.includes('occupancy')) {
        lotData.metrics.occupancy = await analyticsEngine.analyzeOccupancyPatterns(lotId, '7d')
      }
      
      if (metrics.includes('revenue')) {
        lotData.metrics.revenue = await analyticsEngine.analyzeRevenue(lotId, 'week')
      }
      
      if (metrics.includes('predictions')) {
        const prediction = await predictionEngine.predictOccupancy(lotId, 24)
        lotData.metrics.predictions = prediction
      }
      
      report.lots.push(lotData)
    }
    
    res.json(report)
  } catch (error) {
    console.error('Error generating custom report:', error)
    res.status(500).json({ error: 'Failed to generate custom report' })
  }
})

// GET /api/analytics/benchmarks - Industry benchmarks and comparisons
router.get('/benchmarks', async (req, res) => {
  try {
    const { lotId } = req.query
    
    const benchmarks = {
      industry: {
        avgUtilizationRate: 72,
        avgTurnoverRate: 3.5,
        avgRevenuePerSlot: 250,
        avgOccupancyRate: 68
      },
      regional: {
        avgUtilizationRate: 75,
        avgTurnoverRate: 3.8,
        avgRevenuePerSlot: 280,
        avgOccupancyRate: 71
      }
    }
    
    if (lotId) {
      const lotPerformance = await analyticsEngine.analyzeOccupancyPatterns(lotId, '30d')
      benchmarks.lotPerformance = lotPerformance
      benchmarks.comparison = {
        vsIndustry: calculateComparison(lotPerformance, benchmarks.industry),
        vsRegional: calculateComparison(lotPerformance, benchmarks.regional)
      }
    }
    
    res.json(benchmarks)
  } catch (error) {
    console.error('Error getting benchmarks:', error)
    res.status(500).json({ error: 'Failed to get benchmarks' })
  }
})

// Helper function
function calculateComparison(actual, benchmark) {
  return {
    utilizationDiff: parseFloat(actual.patterns.utilizationRate) - benchmark.avgUtilizationRate,
    turnoverDiff: parseFloat(actual.patterns.turnoverRate) - benchmark.avgTurnoverRate,
    performance: parseFloat(actual.patterns.utilizationRate) > benchmark.avgUtilizationRate ? 'above' : 'below'
  }
}

export default router
