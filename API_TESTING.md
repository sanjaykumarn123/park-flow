# 🧪 ParkFlow API Testing Guide

Complete guide to test all backend endpoints with curl commands and expected responses.

## 🚀 Prerequisites

1. Backend server running at `http://localhost:5000`
2. curl installed (or use Postman/Thunder Client)

Start server:
```bash
cd server
npm start
```

---

## 1️⃣ Health Check

### Test Server Health
```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "supabase": "not configured",
  "uptime": 123.456
}
```

### Get API Info
```bash
curl http://localhost:5000/
```

---

## 2️⃣ Parking Slots

### Get All Slots
```bash
curl http://localhost:5000/api/slots
```

**Expected:** Array of 5 parking lots with occupancy and predictions

### Get Specific Slot
```bash
curl http://localhost:5000/api/slots/lot-001
```

---

## 3️⃣ Bookings

### Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "lotId": "lot-001",
    "lotName": "Central Plaza Parking",
    "startTime": "2024-01-15T10:00:00Z",
    "duration": 2,
    "vehicleNumber": "DL01AB1234",
    "paymentMethod": "upi",
    "totalPrice": 100
  }'
```

**Expected Response:**
```json
{
  "id": 1000,
  "lot_id": "lot-001",
  "vehicle_number": "DL01AB1234",
  "status": "active",
  "total_price": 100,
  "message": "Booking created successfully"
}
```

**Save the booking ID for next tests!**

### Get All Bookings
```bash
curl http://localhost:5000/api/bookings
```

### Get Specific Booking
```bash
curl http://localhost:5000/api/bookings/1000
```

### Extend Booking
```bash
curl -X POST http://localhost:5000/api/bookings/1000/extend \
  -H "Content-Type: application/json" \
  -d '{"additionalHours": 2}'
```

### Cancel Booking
```bash
curl -X POST http://localhost:5000/api/bookings/1000/cancel \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected:** Booking cancelled with refund details

---

## 4️⃣ Predictions

### Get Single Prediction
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "lotId": "lot-001",
    "currentOccupancy": 98,
    "capacity": 150
  }'
```

**Expected Response:**
```json
{
  "lot_id": "lot-001",
  "predicted_occupancy": 105,
  "predicted_available": 45,
  "confidence": 87,
  "message": "Moderate availability - 45 slots predicted",
  "factors": {
    "timeOfDay": 18,
    "currentOccupancyRate": 65,
    "trend": "increasing"
  }
}
```

### Batch Predictions
```bash
curl -X POST http://localhost:5000/api/predict/batch \
  -H "Content-Type: application/json" \
  -d '{
    "lots": [
      {"id": "lot-001", "occupied": 98, "capacity": 150},
      {"id": "lot-002", "occupied": 145, "capacity": 200}
    ]
  }'
```

---

## 5️⃣ Payments

### Process Payment
```bash
curl -X POST http://localhost:5000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": 1000,
    "amount": 100,
    "paymentMethod": "upi"
  }'
```

**Note:** Takes 1.5-2.5 seconds (simulated delay)

**Expected Response:**
```json
{
  "id": 1,
  "booking_id": 1000,
  "amount": 100,
  "status": "success",
  "transaction_id": "TXN1705315200123",
  "message": "Payment processed successfully"
}
```

### Get Payment Details
```bash
curl http://localhost:5000/api/payments/1000
```

### Process Refund
```bash
curl -X POST http://localhost:5000/api/payments/refund \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": 1000,
    "amount": 100,
    "reason": "Booking cancelled"
  }'
```

---

## 6️⃣ City Dashboard

### Get City Overview
```bash
curl http://localhost:5000/api/city/overview
```

**Expected Response:**
```json
{
  "metrics": {
    "activeLots": 5,
    "congestionRate": 68,
    "dailyRevenue": 42500,
    "emissionReduction": 185
  },
  "lots": [...]
}
```

### Get Revenue Data
```bash
curl http://localhost:5000/api/city/revenue
```

**Expected:** 7-day revenue chart data

### Get Congestion Data
```bash
curl http://localhost:5000/api/city/congestion
```

### Get Emission Data
```bash
curl http://localhost:5000/api/city/emissions
```

### Get City Stats
```bash
curl http://localhost:5000/api/city/stats
```

---

## 7️⃣ Parking Search (Car-to-Cloud)

### Find Best Parking
```bash
curl -X POST http://localhost:5000/api/parking/find \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Connaught Place",
    "eta": "2024-01-15T10:30:00Z",
    "prefs": {
      "covered": true,
      "evCharging": false,
      "security": true
    },
    "vehicleType": "car"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "lot": {
    "name": "Smart Parking Hub A",
    "slotNumber": "001-42",
    "distance": "0.8 km",
    "features": ["covered", "security"]
  },
  "cloudSync": {
    "vehicleId": "VH-ABC123DEF",
    "syncTime": "2024-01-15T10:00:00Z",
    "status": "confirmed"
  },
  "navigation": {
    "route": "Optimal route calculated via GPS",
    "trafficCondition": "Light traffic",
    "duration": "4 minutes"
  }
}
```

### Reserve Specific Slot
```bash
curl -X POST http://localhost:5000/api/parking/reserve \
  -H "Content-Type: application/json" \
  -d '{
    "lotId": "lot-001",
    "vehicleId": "VH-ABC123",
    "duration": 2
  }'
```

### Get Nearby Parking
```bash
curl "http://localhost:5000/api/parking/nearby?lat=28.6139&lng=77.2090&radius=5"
```

---

## 8️⃣ AI Assistant

### Get Price Suggestion
```bash
curl -X POST http://localhost:5000/api/ai-assistant \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Suggest price for tomorrow",
    "context": {
      "occupancyRate": 75,
      "currentPrice": 50,
      "timeOfDay": 18
    }
  }'
```

**Expected Response:**
```json
{
  "type": "price_suggestion",
  "message": "Suggest ₹58/hr for optimal revenue",
  "suggestedPrice": 58,
  "currentPrice": 50,
  "change": 8,
  "changePercent": 16,
  "reasoning": [
    "High occupancy (>85%) detected",
    "Peak hours pricing"
  ],
  "confidence": 89
}
```

### Get Demand Prediction
```bash
curl -X POST http://localhost:5000/api/ai-assistant \
  -H "Content-Type: application/json" \
  -d '{"query": "predict demand for next 2 hours"}'
```

### Analyze Parking Data
```bash
curl -X POST http://localhost:5000/api/ai-assistant/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "lotId": "lot-001",
    "timeRange": "24h"
  }'
```

### Get Quick Suggestions
```bash
curl http://localhost:5000/api/ai-assistant/suggestions
```

---

## 9️⃣ Operator Dashboard

### Get Dashboard Data
```bash
curl http://localhost:5000/api/operator/dashboard
```

**Expected Response:**
```json
{
  "stats": {
    "totalBookings": 342,
    "occupancyRate": 68,
    "todayRevenue": 42500,
    "activeAlerts": 2
  },
  "bookings": [...],
  "lots": [...],
  "analytics": {...}
}
```

### Update Lot Pricing
```bash
curl -X POST http://localhost:5000/api/pricing/update \
  -H "Content-Type: application/json" \
  -d '{
    "lotId": "lot-001",
    "newPrice": 55
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Price updated to ₹55/hr for lot lot-001",
  "lotId": "lot-001",
  "newPrice": 55
}
```

### Get Analytics
```bash
curl http://localhost:5000/api/operator/analytics
```

### Get Alerts
```bash
curl http://localhost:5000/api/operator/alerts
```

---

## 🔟 Error Testing

### Invalid Booking (Missing Fields)
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"lotId": "lot-001"}'
```

**Expected:** 400 Bad Request with error message

### Non-existent Slot
```bash
curl http://localhost:5000/api/slots/lot-999
```

**Expected:** 404 Not Found

### Invalid Route
```bash
curl http://localhost:5000/api/invalid
```

**Expected:** 404 with available endpoints list

---

## 📊 Testing Checklist

### Basic Functionality
- [ ] Server starts without errors
- [ ] Health endpoint returns 200
- [ ] Root endpoint shows API info

### Parking Slots
- [ ] Get all slots returns 5 lots
- [ ] Each lot has predictions
- [ ] Get specific slot works
- [ ] Invalid slot returns 404

### Bookings
- [ ] Create booking returns booking ID
- [ ] Get booking details works
- [ ] Extend booking increases duration
- [ ] Cancel booking changes status
- [ ] List all bookings works

### Predictions
- [ ] Single prediction returns confidence
- [ ] Batch predictions work for multiple lots
- [ ] Predictions vary by time of day

### Payments
- [ ] Payment takes 1.5-2.5 seconds
- [ ] Payment returns transaction ID
- [ ] Refund processing works
- [ ] Get payment details works

### City Dashboard
- [ ] Overview returns metrics
- [ ] Revenue data has 7 days
- [ ] Congestion data available
- [ ] Emission data available

### Parking Search
- [ ] Find parking returns best lot
- [ ] Preferences are respected
- [ ] Cloud sync info included
- [ ] Navigation details provided

### AI Assistant
- [ ] Price suggestions work
- [ ] Demand predictions work
- [ ] Analysis endpoint works
- [ ] Suggestions endpoint works

### Operator
- [ ] Dashboard returns all data
- [ ] Pricing update works
- [ ] Analytics available
- [ ] Alerts available

---

## 🐛 Common Issues

### Connection Refused
- Check server is running: `curl http://localhost:5000/health`
- Verify port 5000 is not blocked

### 404 Errors
- Check endpoint spelling
- Ensure route is correct
- Verify HTTP method (GET vs POST)

### 400 Bad Request
- Check JSON syntax
- Verify required fields
- Ensure Content-Type header

### Slow Responses
- Payment endpoint has intentional 1.5-2.5s delay
- Other endpoints should be < 100ms

---

## 📝 Testing with Postman

1. Import collection from `server/postman_collection.json` (if available)
2. Set base URL: `http://localhost:5000`
3. Run collection tests
4. Check all tests pass

---

## ✅ Success Criteria

All endpoints should:
- ✅ Return valid JSON
- ✅ Have appropriate status codes
- ✅ Include error messages when failing
- ✅ Handle missing fields gracefully
- ✅ Work without Supabase (in-memory)
- ✅ Work with Supabase (if configured)

---

**Happy Testing! 🧪**

All endpoints are fully functional and ready for integration with the frontend.
