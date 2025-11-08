/**
 * Advanced ML-based Prediction Engine
 * Implements multiple forecasting algorithms for parking demand prediction
 */

class PredictionEngine {
  constructor() {
    this.historicalData = new Map();
    this.models = {
      timeSeries: new TimeSeriesPredictor(),
      demandForecaster: new DemandForecaster(),
      anomalyDetector: new AnomalyDetector(),
      behaviorAnalyzer: new BehaviorAnalyzer()
    };
  }

  /**
   * Advanced time-series prediction using exponential smoothing
   */
  async predictOccupancy(lotId, hoursAhead = 2) {
    const historical = await this.getHistoricalData(lotId);
    const features = this.extractFeatures(historical);
    
    // Multiple model ensemble
    const predictions = await Promise.all([
      this.models.timeSeries.forecast(features, hoursAhead),
      this.models.demandForecaster.predict(features),
      this.applySeasonalDecomposition(features)
    ]);

    // Weighted ensemble
    const finalPrediction = this.ensemblePredictions(predictions);
    const confidence = this.calculateConfidence(predictions);

    return {
      prediction: finalPrediction,
      confidence,
      breakdown: {
        trend: predictions[0],
        demand: predictions[1],
        seasonal: predictions[2]
      },
      metadata: {
        hoursAhead,
        timestamp: new Date(),
        modelVersions: this.getModelVersions()
      }
    };
  }

  /**
   * Real-time anomaly detection
   */
  async detectAnomalies(lotId, currentMetrics) {
    const baseline = await this.getBaselineMetrics(lotId);
    const anomalies = [];

    // Statistical anomaly detection
    if (this.isStatisticalAnomaly(currentMetrics, baseline)) {
      anomalies.push({
        type: 'statistical',
        severity: this.calculateSeverity(currentMetrics, baseline),
        message: 'Occupancy deviates significantly from historical pattern'
      });
    }

    // Behavioral anomaly
    if (await this.models.anomalyDetector.detect(currentMetrics)) {
      anomalies.push({
        type: 'behavioral',
        severity: 'high',
        message: 'Unusual booking pattern detected'
      });
    }

    // Temporal anomaly
    const temporalScore = this.checkTemporalAnomaly(currentMetrics);
    if (temporalScore > 0.7) {
      anomalies.push({
        type: 'temporal',
        severity: 'medium',
        message: 'Unexpected demand for current time period',
        score: temporalScore
      });
    }

    return {
      hasAnomalies: anomalies.length > 0,
      anomalies,
      riskScore: this.calculateRiskScore(anomalies),
      recommendations: this.generateRecommendations(anomalies)
    };
  }

  /**
   * Dynamic pricing algorithm based on demand prediction
   */
  calculateDynamicPrice(basePrice, prediction, currentOccupancy, metadata = {}) {
    const { capacity, timeOfDay, isEvent, weatherCondition } = metadata;
    
    // Demand multiplier
    const occupancyRate = currentOccupancy / capacity;
    const demandMultiplier = this.getDemandMultiplier(occupancyRate);
    
    // Time-based pricing
    const timeMultiplier = this.getTimeMultiplier(timeOfDay);
    
    // Event surge pricing
    const eventMultiplier = isEvent ? 1.5 : 1.0;
    
    // Weather impact
    const weatherMultiplier = this.getWeatherMultiplier(weatherCondition);
    
    // Prediction-based adjustment
    const predictedOccupancyRate = prediction.prediction / capacity;
    const futureDemandMultiplier = this.getDemandMultiplier(predictedOccupancyRate) * 0.3;
    
    // Calculate final price
    let dynamicPrice = basePrice * 
      demandMultiplier * 
      timeMultiplier * 
      eventMultiplier * 
      weatherMultiplier * 
      (1 + futureDemandMultiplier);

    // Apply constraints
    dynamicPrice = Math.max(basePrice * 0.7, Math.min(dynamicPrice, basePrice * 3));

    return {
      price: Math.round(dynamicPrice),
      breakdown: {
        basePrice,
        demandMultiplier,
        timeMultiplier,
        eventMultiplier,
        weatherMultiplier,
        futureDemandMultiplier
      },
      priceChange: ((dynamicPrice - basePrice) / basePrice * 100).toFixed(1),
      confidence: prediction.confidence
    };
  }

  /**
   * Behavioral analytics and user profiling
   */
  async analyzeBehavior(userId, bookingHistory) {
    const patterns = {
      averageDuration: this.calculateAverageDuration(bookingHistory),
      overstayRate: this.calculateOverstayRate(bookingHistory),
      preferredTimes: this.identifyPreferredTimes(bookingHistory),
      preferredLocations: this.identifyPreferredLocations(bookingHistory),
      bookingFrequency: this.calculateBookingFrequency(bookingHistory),
      cancellationRate: this.calculateCancellationRate(bookingHistory)
    };

    // User segmentation
    const segment = this.segmentUser(patterns);
    
    // Churn prediction
    const churnProbability = this.predictChurn(patterns);
    
    // Lifetime value prediction
    const predictedLTV = this.predictLifetimeValue(patterns);

    return {
      userId,
      patterns,
      segment,
      churnProbability,
      predictedLTV,
      recommendations: this.generateUserRecommendations(patterns, segment),
      riskFlags: this.identifyRiskFlags(patterns)
    };
  }

  /**
   * Demand forecasting with external factors
   */
  async forecastDemand(lotId, dateRange, externalFactors = {}) {
    const { events, weather, holidays, trafficData } = externalFactors;
    
    const forecast = [];
    for (let date of dateRange) {
      const baselineDemand = await this.getBaselineDemand(lotId, date);
      
      // Event impact
      const eventImpact = this.calculateEventImpact(events, date);
      
      // Weather impact
      const weatherImpact = this.calculateWeatherImpact(weather, date);
      
      // Holiday impact
      const holidayImpact = holidays.includes(date) ? 0.6 : 1.0;
      
      // Traffic impact
      const trafficImpact = this.calculateTrafficImpact(trafficData, date);
      
      const adjustedDemand = baselineDemand * 
        eventImpact * 
        weatherImpact * 
        holidayImpact * 
        trafficImpact;

      forecast.push({
        date,
        predictedDemand: Math.round(adjustedDemand),
        confidence: this.calculateForecastConfidence(date),
        factors: {
          baseline: baselineDemand,
          eventImpact,
          weatherImpact,
          holidayImpact,
          trafficImpact
        }
      });
    }

    return {
      forecast,
      summary: this.generateForecastSummary(forecast),
      alerts: this.generateDemandAlerts(forecast)
    };
  }

  // Helper methods
  getDemandMultiplier(occupancyRate) {
    if (occupancyRate < 0.3) return 0.8;
    if (occupancyRate < 0.5) return 1.0;
    if (occupancyRate < 0.7) return 1.2;
    if (occupancyRate < 0.85) return 1.5;
    if (occupancyRate < 0.95) return 2.0;
    return 2.5;
  }

  getTimeMultiplier(hour) {
    // Peak hours: 8-10 AM, 5-7 PM
    if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19)) return 1.3;
    // Regular hours
    if (hour >= 6 && hour <= 22) return 1.0;
    // Off-peak
    return 0.8;
  }

  getWeatherMultiplier(condition) {
    const weatherImpact = {
      'rain': 1.2,
      'snow': 1.4,
      'storm': 1.5,
      'clear': 1.0,
      'cloudy': 1.0,
      'fog': 1.1
    };
    return weatherImpact[condition] || 1.0;
  }

  extractFeatures(historical) {
    return {
      occupancyTrend: this.calculateTrend(historical),
      seasonality: this.detectSeasonality(historical),
      volatility: this.calculateVolatility(historical),
      cyclePattern: this.detectCyclePattern(historical)
    };
  }

  ensemblePredictions(predictions) {
    // Weighted average (you can adjust weights based on model performance)
    const weights = [0.4, 0.4, 0.2];
    return predictions.reduce((acc, pred, idx) => acc + pred * weights[idx], 0);
  }

  calculateConfidence(predictions) {
    const variance = this.calculateVariance(predictions);
    return Math.max(0, 1 - variance / 100);
  }

  calculateVariance(values) {
    const mean = values.reduce((a, b) => a + b) / values.length;
    return values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
  }

  isStatisticalAnomaly(current, baseline) {
    const zScore = Math.abs((current - baseline.mean) / baseline.stdDev);
    return zScore > 2.5; // 99% confidence interval
  }

  calculateSeverity(current, baseline) {
    const deviation = Math.abs((current - baseline.mean) / baseline.mean);
    if (deviation > 0.5) return 'critical';
    if (deviation > 0.3) return 'high';
    if (deviation > 0.15) return 'medium';
    return 'low';
  }

  calculateRiskScore(anomalies) {
    const severityScores = { low: 1, medium: 2, high: 3, critical: 4 };
    const totalScore = anomalies.reduce((acc, a) => acc + severityScores[a.severity], 0);
    return Math.min(100, (totalScore / anomalies.length) * 25);
  }

  generateRecommendations(anomalies) {
    const recommendations = [];
    
    if (anomalies.some(a => a.severity === 'critical')) {
      recommendations.push('Immediate operator attention required');
      recommendations.push('Consider activating surge pricing');
    }
    
    if (anomalies.some(a => a.type === 'behavioral')) {
      recommendations.push('Monitor for potential system abuse');
    }
    
    return recommendations;
  }

  async getHistoricalData(lotId) {
    // Simulate historical data retrieval
    return Array.from({ length: 168 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000),
      occupancy: Math.random() * 100
    }));
  }

  async getBaselineMetrics(lotId) {
    // Calculate baseline from historical data
    const historical = await this.getHistoricalData(lotId);
    const values = historical.map(h => h.occupancy);
    
    return {
      mean: values.reduce((a, b) => a + b) / values.length,
      stdDev: Math.sqrt(this.calculateVariance(values)),
      median: this.calculateMedian(values)
    };
  }

  calculateMedian(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  getModelVersions() {
    return {
      timeSeries: '2.1.0',
      demandForecaster: '1.5.3',
      anomalyDetector: '3.0.1',
      behaviorAnalyzer: '1.2.0'
    };
  }
}

// Specialized predictor classes
class TimeSeriesPredictor {
  async forecast(features, hoursAhead) {
    // Implement exponential smoothing
    const alpha = 0.3;
    const trend = features.occupancyTrend;
    return trend * (1 + alpha * hoursAhead);
  }
}

class DemandForecaster {
  async predict(features) {
    // Simple demand prediction based on volatility and seasonality
    return features.occupancyTrend * (1 + features.seasonality * 0.1);
  }
}

class AnomalyDetector {
  async detect(metrics) {
    // Isolation forest-like logic (simplified)
    const anomalyScore = Math.random(); // Replace with actual algorithm
    return anomalyScore > 0.8;
  }
}

class BehaviorAnalyzer {
  analyze(userHistory) {
    // Analyze user patterns
    return {
      consistency: this.calculateConsistency(userHistory),
      predictability: this.calculatePredictability(userHistory)
    };
  }

  calculateConsistency(history) {
    return history.length > 10 ? 0.8 : 0.5;
  }

  calculatePredictability(history) {
    return Math.random() * 0.5 + 0.5;
  }
}

export default PredictionEngine;
