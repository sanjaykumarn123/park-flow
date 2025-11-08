import express from 'express'

const router = express.Router()

// AI Assistant responses based on query type
function generateAIResponse(query, context = {}) {
  const queryLower = query.toLowerCase()
  
  // Price suggestion queries
  if (queryLower.includes('price') || queryLower.includes('pricing') || queryLower.includes('suggest')) {
    const { occupancyRate = 70, currentPrice = 50, timeOfDay = new Date().getHours() } = context
    
    let suggestedPrice = currentPrice
    let reasoning = []
    
    // Adjust based on occupancy
    if (occupancyRate > 85) {
      suggestedPrice = Math.floor(currentPrice * 1.3)
      reasoning.push('High occupancy (>85%) detected')
    } else if (occupancyRate < 50) {
      suggestedPrice = Math.floor(currentPrice * 0.8)
      reasoning.push('Low occupancy (<50%) detected')
    }
    
    // Adjust based on time of day
    if ((timeOfDay >= 8 && timeOfDay <= 10) || (timeOfDay >= 17 && timeOfDay <= 20)) {
      suggestedPrice = Math.floor(suggestedPrice * 1.15)
      reasoning.push('Peak hours pricing')
    } else if (timeOfDay >= 22 || timeOfDay <= 6) {
      suggestedPrice = Math.floor(suggestedPrice * 0.85)
      reasoning.push('Off-peak hours discount')
    }
    
    return {
      type: 'price_suggestion',
      message: `Suggest ₹${suggestedPrice}/hr for optimal revenue`,
      suggestedPrice: suggestedPrice,
      currentPrice: currentPrice,
      change: suggestedPrice - currentPrice,
      changePercent: Math.round(((suggestedPrice - currentPrice) / currentPrice) * 100),
      reasoning: reasoning,
      confidence: 85 + Math.floor(Math.random() * 10),
      expectedImpact: {
        revenue: suggestedPrice > currentPrice ? '+15-20%' : 'Increased bookings',
        occupancy: suggestedPrice > currentPrice ? '-5%' : '+10-15%'
      }
    }
  }
  
  // Demand prediction queries
  if (queryLower.includes('demand') || queryLower.includes('predict') || queryLower.includes('forecast')) {
    const hour = new Date().getHours()
    let prediction = ''
    
    if (hour >= 8 && hour <= 10) {
      prediction = 'High demand expected in next 2 hours (morning rush)'
    } else if (hour >= 17 && hour <= 20) {
      prediction = 'Peak demand expected (evening rush hour)'
    } else if (hour >= 12 && hour <= 14) {
      prediction = 'Moderate demand expected (lunch hours)'
    } else {
      prediction = 'Low to moderate demand expected'
    }
    
    return {
      type: 'demand_prediction',
      message: prediction,
      timeWindow: '2 hours',
      confidence: 82 + Math.floor(Math.random() * 10),
      factors: ['Historical patterns', 'Time of day', 'Day of week']
    }
  }
  
  // Optimization queries
  if (queryLower.includes('optimize') || queryLower.includes('improve') || queryLower.includes('increase')) {
    return {
      type: 'optimization',
      message: 'Here are optimization suggestions for your parking operations',
      suggestions: [
        {
          title: 'Dynamic Pricing',
          description: 'Implement time-based pricing to balance demand',
          impact: 'High',
          effort: 'Medium'
        },
        {
          title: 'Pre-booking Incentives',
          description: 'Offer 10% discount for advance bookings',
          impact: 'Medium',
          effort: 'Low'
        },
        {
          title: 'Peak Hour Management',
          description: 'Increase prices during 5-8 PM by 20%',
          impact: 'High',
          effort: 'Low'
        }
      ]
    }
  }
  
  // Revenue queries
  if (queryLower.includes('revenue') || queryLower.includes('earning') || queryLower.includes('profit')) {
    return {
      type: 'revenue_analysis',
      message: 'Revenue insights and recommendations',
      currentTrend: 'Upward',
      projectedGrowth: '+12% this month',
      recommendations: [
        'Increase weekend pricing by 15%',
        'Introduce loyalty program for frequent users',
        'Optimize pricing during events'
      ]
    }
  }
  
  // General query
  return {
    type: 'general',
    message: 'I can help with pricing suggestions, demand predictions, and optimization strategies. Try asking about "price suggestions" or "demand forecast".',
    capabilities: [
      'Dynamic pricing recommendations',
      'Demand forecasting',
      'Revenue optimization',
      'Occupancy predictions',
      'Operational insights'
    ]
  }
}

// POST /api/ai-assistant - AI Assistant endpoint
router.post('/', async (req, res) => {
  try {
    const { query, context } = req.body
    
    if (!query) {
      return res.status(400).json({
        error: 'Query is required',
        example: { query: 'Suggest price for tomorrow' }
      })
    }
    
    // Generate AI response
    const response = generateAIResponse(query, context)
    
    res.json({
      query: query,
      ...response,
      timestamp: new Date().toISOString(),
      model: 'ParkFlow AI v1.0'
    })
  } catch (error) {
    console.error('Error processing AI query:', error)
    res.status(500).json({ error: 'Failed to process AI query' })
  }
})

// POST /api/ai-assistant/analyze - Analyze parking data
router.post('/analyze', async (req, res) => {
  try {
    const { lotId, timeRange = '24h' } = req.body
    
    res.json({
      lotId: lotId,
      timeRange: timeRange,
      analysis: {
        peakHours: ['08:00-10:00', '17:00-20:00'],
        avgOccupancy: 68,
        revenueOpportunity: '₹12,500/week',
        recommendations: [
          'Increase price by ₹10 during peak hours',
          'Offer early bird discount before 8 AM',
          'Implement surge pricing on weekends'
        ]
      },
      insights: [
        {
          type: 'warning',
          message: 'Occupancy drops below 40% after 10 PM',
          suggestion: 'Consider night-time discount pricing'
        },
        {
          type: 'success',
          message: 'Strong demand during lunch hours (12-2 PM)',
          suggestion: 'Maintain current pricing strategy'
        }
      ]
    })
  } catch (error) {
    console.error('Error analyzing data:', error)
    res.status(500).json({ error: 'Failed to analyze data' })
  }
})

// GET /api/ai-assistant/suggestions - Get quick suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const hour = new Date().getHours()
    
    const suggestions = [
      {
        id: 1,
        title: 'Optimize Peak Hour Pricing',
        description: 'Increase prices by 20% during 5-8 PM',
        impact: 'High',
        category: 'pricing'
      },
      {
        id: 2,
        title: 'Early Bird Discount',
        description: 'Offer 15% off for bookings before 8 AM',
        impact: 'Medium',
        category: 'promotion'
      },
      {
        id: 3,
        title: 'Weekend Surge Pricing',
        description: 'Implement dynamic pricing on Saturdays',
        impact: 'High',
        category: 'pricing'
      }
    ]
    
    res.json({ suggestions })
  } catch (error) {
    console.error('Error fetching suggestions:', error)
    res.status(500).json({ error: 'Failed to fetch suggestions' })
  }
})

export default router
