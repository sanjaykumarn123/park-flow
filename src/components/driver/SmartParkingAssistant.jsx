import { useState, useEffect } from 'react'
import { Navigation, Zap, MapPin, Clock, DollarSign, TrendingUp, Star, Award, Brain, Target, CheckCircle, AlertCircle, Camera, X } from 'lucide-react'

const SmartParkingAssistant = () => {
  const [aiRecommendation, setAiRecommendation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showARPreview, setShowARPreview] = useState(false)
  const [userLocation, setUserLocation] = useState({ lat: 28.6139, lng: 77.2090 }) // Delhi

  useEffect(() => {
    // Simulate AI recommendation
    setTimeout(() => {
      setAiRecommendation({
        bestSpot: {
          name: 'Central Plaza Parking',
          distance: '0.3 km',
          walkTime: '4 mins',
          price: '₹40/hr',
          availability: 12,
          confidence: 98,
          savings: '₹25',
          arrivalPrediction: '2 mins',
          spotNumber: 'A-24'
        },
        alternatives: [
          {
            name: 'Mall Road Hub',
            distance: '0.8 km',
            price: '₹35/hr',
            availability: 8,
            confidence: 95
          },
          {
            name: 'Metro Station',
            distance: '1.2 km',
            price: '₹30/hr',
            availability: 15,
            confidence: 92
          }
        ],
        insights: {
          peakTimeWarning: false,
          priceOptimal: true,
          weatherGood: true,
          trafficLight: 'green'
        }
      })
      setLoading(false)
    }, 1500)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Brain className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
          <p className="text-white font-semibold">AI is finding the perfect spot for you...</p>
          <p className="text-gray-400 text-sm mt-2">Analyzing 50+ factors in real-time</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* AI Recommendation Hero - Professional Dark Theme */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-2xl p-6 text-white relative overflow-hidden border border-slate-700/50 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500/20 p-3 rounded-xl backdrop-blur-sm border border-blue-400/30">
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI-Powered Smart Recommendation</h2>
              <p className="text-slate-300">Your perfect parking spot is ready!</p>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-600/50">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold mb-1">{aiRecommendation.bestSpot.name}</h3>
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>Spot {aiRecommendation.bestSpot.spotNumber}</span>
                  <span className="mx-2 text-slate-600">•</span>
                  <span>{aiRecommendation.bestSpot.distance} away</span>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg shadow-emerald-500/30">
                  {aiRecommendation.bestSpot.confidence}% Match
                </div>
                <p className="text-xs text-slate-400 mt-1">AI Confidence</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
                <Clock className="w-5 h-5 mb-1 text-blue-400" />
                <p className="text-sm text-slate-400">Arrival</p>
                <p className="text-xl font-bold">{aiRecommendation.bestSpot.arrivalPrediction}</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
                <DollarSign className="w-5 h-5 mb-1 text-emerald-400" />
                <p className="text-sm text-slate-400">Price</p>
                <p className="text-xl font-bold">{aiRecommendation.bestSpot.price}</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
                <Target className="w-5 h-5 mb-1 text-amber-400" />
                <p className="text-sm text-slate-400">Available</p>
                <p className="text-xl font-bold">{aiRecommendation.bestSpot.availability} spots</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
                <Award className="w-5 h-5 mb-1 text-purple-400" />
                <p className="text-sm text-slate-400">You Save</p>
                <p className="text-xl font-bold">{aiRecommendation.bestSpot.savings}</p>
              </div>
            </div>

            <button 
              onClick={() => setShowARPreview(true)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
            >
              <Camera className="w-5 h-5" />
              Start AR Navigation
            </button>
          </div>
        </div>
      </div>

      {/* Why This Spot? */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-400" />
          Why AI Chose This Spot
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <p className="text-white font-semibold">Closest to Your Destination</p>
              <p className="text-sm text-gray-400">Only 4 mins walk - saves you time</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <p className="text-white font-semibold">Best Price-Value Ratio</p>
              <p className="text-sm text-gray-400">₹25 cheaper than nearby alternatives</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <p className="text-white font-semibold">High Availability Confidence</p>
              <p className="text-sm text-gray-400">98% chance spot will be free on arrival</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
            <div>
              <p className="text-white font-semibold">Low Traffic Route</p>
              <p className="text-sm text-gray-400">Fastest route with minimal congestion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Insights - Professional Colors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-emerald-500/30 hover:border-emerald-500/50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 font-semibold">Optimal Timing</span>
          </div>
          <p className="text-slate-300 text-sm">Current time is perfect - avoid peak hours surge pricing</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-blue-500/30 hover:border-blue-500/50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-semibold">Price Prediction</span>
          </div>
          <p className="text-slate-300 text-sm">Prices expected to rise 15% in next hour - book now!</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-amber-500/30 hover:border-amber-500/50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 font-semibold">User Rating</span>
          </div>
          <p className="text-slate-300 text-sm">4.8/5 stars - Well-lit, secure, easy access</p>
        </div>
      </div>

      {/* Alternative Options */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Alternative Options</h3>
        <div className="space-y-3">
          {aiRecommendation.alternatives.map((alt, idx) => (
            <div key={idx} className="bg-gray-900 rounded-lg p-4 flex items-center justify-between hover:bg-gray-750 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="bg-gray-800 rounded-lg p-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">{alt.name}</p>
                  <p className="text-sm text-gray-400">{alt.distance} • {alt.availability} spots available</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{alt.price}</p>
                <p className="text-xs text-gray-400">{alt.confidence}% match</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AR Preview Modal */}
      {showARPreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-700 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 relative">
              <button 
                onClick={() => setShowARPreview(false)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center gap-3">
                <Camera className="w-8 h-8 text-white" />
                <div>
                  <h3 className="text-2xl font-bold text-white">AR Navigation Preview</h3>
                  <p className="text-blue-100">Live view of your parking spot</p>
                </div>
              </div>
            </div>

            {/* AR View Simulation */}
            <div className="relative bg-slate-800 aspect-video">
              {/* Simulated Camera View */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-700 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="relative inline-block">
                    {/* Parking Spot Marker */}
                    <div className="w-32 h-32 border-4 border-blue-500 rounded-lg animate-pulse shadow-lg shadow-blue-500/50">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                          <p className="text-white font-bold text-xl">A-24</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Distance Indicator */}
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full font-bold whitespace-nowrap">
                      0.3 km away
                    </div>
                  </div>
                </div>

                {/* AR Overlay Elements */}
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold">Live AR Mode</span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <p className="text-white text-sm font-semibold">98% Confidence</p>
                  <p className="text-emerald-400 text-xs">Spot Available</p>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">Central Plaza Parking</p>
                      <p className="text-slate-300 text-sm">Spot A-24 • 4 mins walk</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold">₹40/hr</p>
                      <p className="text-slate-400 text-xs">Save ₹25</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 bg-slate-900 border-t border-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowARPreview(false)}
                  className="bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Close Preview
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                  <Navigation className="w-5 h-5" />
                  Start Navigation
                </button>
              </div>
              <p className="text-slate-400 text-xs text-center mt-3">
                💡 Tip: Point your camera at the parking area for live AR guidance
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SmartParkingAssistant
