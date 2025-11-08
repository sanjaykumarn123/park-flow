# 🚀 ParkFlow Backend Setup Guide

## ✅ Backend Complete!

A full-featured Express.js backend has been created with all requested endpoints and Supabase integration.

## 📁 What Was Built

### Core Files
- ✅ `server/server.js` - Main Express server with middleware
- ✅ `server/package.json` - Dependencies configuration
- ✅ `server/.env.example` - Environment template

### API Routes (7 files)
- ✅ `server/routes/slots.js` - Parking slots endpoints
- ✅ `server/routes/bookings.js` - Booking management (create, extend, cancel)
- ✅ `server/routes/predict.js` - AI predictions with simulation
- ✅ `server/routes/payments.js` - Payment processing with delays
- ✅ `server/routes/city.js` - City dashboard metrics
- ✅ `server/routes/parking.js` - Car-to-cloud parking search
- ✅ `server/routes/ai.js` - AI assistant recommendations
- ✅ `server/routes/operator.js` - Operator dashboard & pricing

### Database
- ✅ `server/database/schema.sql` - Complete Supabase schema

### Documentation
- ✅ `server/README.md` - Full API documentation

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
cd server
npm install
```

### Step 2: Create Environment File
Create `server/.env` file:
```env
PORT=5000
NODE_ENV=development

# Optional: Add Supabase credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key

FRONTEND_URL=http://localhost:3000
```

**Note:** Server works without Supabase using in-memory storage!

### Step 3: Start Server
```bash
npm start
```

Server runs at: **http://localhost:5000**

## 📡 API Endpoints Summary

### Parking Slots
```
GET  /api/slots          - List all parking lots
GET  /api/slots/:id      - Get specific lot
```

### Bookings
```
POST /api/bookings           - Create booking
GET  /api/bookings           - List all bookings
GET  /api/bookings/:id       - Get booking details
POST /api/bookings/:id/extend - Extend booking
POST /api/bookings/:id/cancel - Cancel booking
```

### Predictions
```
POST /api/predict            - Get occupancy prediction
POST /api/predict/batch      - Batch predictions
```

### Payments
```
POST /api/payments           - Process payment (1.5-2.5s delay)
GET  /api/payments/:bookingId - Get payment details
POST /api/payments/refund    - Process refund
```

### City Dashboard
```
GET /api/city/overview       - City metrics + lots
GET /api/city/revenue        - Revenue chart data
GET /api/city/congestion     - Congestion data
GET /api/city/emissions      - Emission reduction
GET /api/city/stats          - Detailed statistics
```

### Parking Search (Car-to-Cloud)
```
POST /api/parking/find       - Find best parking lot
POST /api/parking/reserve    - Reserve specific slot
GET  /api/parking/nearby     - Get nearby lots
```

### AI Assistant
```
POST /api/ai-assistant           - Get AI recommendations
POST /api/ai-assistant/analyze   - Analyze parking data
GET  /api/ai-assistant/suggestions - Quick suggestions
```

### Operator Dashboard
```
GET  /api/operator/dashboard  - Dashboard data
POST /api/pricing/update      - Update lot pricing
GET  /api/operator/analytics  - Detailed analytics
GET  /api/operator/alerts     - System alerts
```

### Health Check
```
GET /health                   - Server health status
GET /                         - API information
```

## 🧪 Test the API

### Test Health
```bash
curl http://localhost:5000/health
```

### Get Parking Slots
```bash
curl http://localhost:5000/api/slots
```

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
    "totalPrice": 100
  }'
```

### Get AI Suggestion
```bash
curl -X POST http://localhost:5000/api/ai-assistant \
  -H "Content-Type: application/json" \
  -d '{"query": "Suggest price for tomorrow"}'
```

## 🗄️ Database Setup (Optional)

### Without Supabase
- Server uses **in-memory storage**
- Works immediately, no setup needed
- Data lost on restart

### With Supabase
1. Create project at [supabase.com](https://supabase.com)
2. Copy project URL and anon key
3. Open Supabase SQL Editor
4. Run `server/database/schema.sql`
5. Update `server/.env` with credentials

## 🔧 Features Implemented

### ✅ All Requested Endpoints
- GET /api/slots with predictions
- POST /api/bookings with in-memory/Supabase
- POST /api/predict with simulation
- POST /api/payments with delay
- GET /api/city/overview with aggregation
- GET /api/city/revenue with chart data
- POST /api/parking/find with car-to-cloud
- POST /api/ai-assistant with recommendations

### ✅ Additional Features
- Booking extension and cancellation
- Payment refund processing
- Batch predictions
- Nearby parking search
- Operator analytics
- System alerts
- Error handling
- CORS support
- Security headers (Helmet)
- Request logging (Morgan)

### ✅ Smart Prediction Algorithm
```javascript
prediction_sim(lot_id):
  - Analyzes time of day
  - Considers current occupancy
  - Factors in peak hours (8-10 AM, 5-8 PM)
  - Generates confidence scores (60-95%)
  - Returns predicted availability
```

### ✅ Dual Storage Support
- **Supabase** - Production database
- **In-Memory** - Development fallback
- Automatic fallback on Supabase errors

## 📊 Mock Data Included

### 5 Parking Lots
1. Central Plaza Parking (150 capacity, ₹50/hr)
2. Mall Road Parking Hub (200 capacity, ₹40/hr)
3. Metro Station Parking (100 capacity, ₹30/hr)
4. Business District Parking (180 capacity, ₹60/hr)
5. Airport Express Parking (250 capacity, ₹45/hr)

### Sample Bookings
- Active, completed, and cancelled bookings
- Various vehicle numbers and durations
- Different payment methods

### Analytics Data
- 7-day revenue chart
- 24-hour utilization data
- Vehicle type distribution
- Peak hours analysis

## 🔗 Connect Frontend

Update frontend `.env`:
```env
VITE_API_BASE=http://localhost:5000
```

Frontend will automatically connect to backend!

## 🚀 Start Full Stack

### Option 1: Separate Terminals
```bash
# Terminal 1 - Backend
cd server
npm install
npm start

# Terminal 2 - Frontend
npm install
npm run dev
```

### Option 2: Use Batch File (Windows)
Double-click `start-fullstack.bat` in project root

## 📝 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| PORT | No | 5000 | Server port |
| NODE_ENV | No | development | Environment |
| SUPABASE_URL | No | - | Supabase URL |
| SUPABASE_KEY | No | - | Supabase key |
| FRONTEND_URL | No | http://localhost:3000 | CORS origin |

## 🐛 Troubleshooting

### Port 5000 in use
Change PORT in `.env`:
```env
PORT=5001
```

### Module not found
```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

### Supabase errors
- Check credentials in `.env`
- Verify database schema is created
- Server will fallback to in-memory storage

### CORS errors
- Verify FRONTEND_URL matches exactly
- Check browser console for details
- Ensure frontend is running on correct port

## 📚 API Response Examples

### GET /api/slots
```json
[
  {
    "id": "lot-001",
    "name": "Central Plaza Parking",
    "location": "Connaught Place, New Delhi",
    "capacity": 150,
    "occupied": 98,
    "pricePerHour": 50,
    "distance": 0.8,
    "prediction": {
      "message": "Free for next 45 min",
      "confidence": 87
    }
  }
]
```

### POST /api/bookings
```json
{
  "id": 1001,
  "lotId": "lot-001",
  "vehicleNumber": "DL01AB1234",
  "status": "active",
  "totalPrice": 100,
  "message": "Booking created successfully"
}
```

### POST /api/predict
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

### POST /api/parking/find
```json
{
  "success": true,
  "lot": {
    "name": "Smart Parking Hub A",
    "slotNumber": "001-42",
    "distance": "0.8 km"
  },
  "cloudSync": {
    "vehicleId": "VH-ABC123",
    "status": "confirmed"
  },
  "navigation": {
    "route": "Optimal route calculated",
    "trafficCondition": "Light traffic"
  }
}
```

## 🎯 Next Steps

1. ✅ Backend is ready to use
2. ✅ Test endpoints with curl or Postman
3. ✅ Connect frontend to backend
4. ⬜ (Optional) Set up Supabase database
5. ⬜ (Optional) Deploy to Replit/Railway/Render

## 📖 Full Documentation

See `server/README.md` for:
- Detailed API documentation
- Request/response examples
- Database schema details
- Deployment guides
- Security features

---

**Backend Status: ✅ 100% Complete and Ready!**

All requested endpoints implemented with:
- Supabase integration
- In-memory fallback
- AI predictions
- Payment simulation
- Car-to-cloud search
- Operator dashboard
- City analytics

Start the server and begin testing! 🚀
