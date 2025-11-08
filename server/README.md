# ParkFlow Backend API

Express.js backend server for ParkFlow smart parking management system with Supabase integration.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment
Create a `.env` file in the `server` directory:

```env
PORT=5000
NODE_ENV=development

# Supabase Configuration (Optional)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

**Note:** The server works without Supabase using in-memory storage.

### 3. Start Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start at `http://localhost:5000`

## 📡 API Endpoints

### Parking Slots
- `GET /api/slots` - Get all parking lots with live data
- `GET /api/slots/:id` - Get specific parking lot details

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings (operator)
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings/:id/extend` - Extend booking duration
- `POST /api/bookings/:id/cancel` - Cancel booking

### Predictions
- `POST /api/predict` - Get occupancy prediction for a lot
- `POST /api/predict/batch` - Get predictions for multiple lots

### Payments
- `POST /api/payments` - Process payment
- `GET /api/payments/:bookingId` - Get payment details
- `POST /api/payments/refund` - Process refund

### City Dashboard
- `GET /api/city/overview` - Get city-wide metrics
- `GET /api/city/revenue` - Get revenue chart data
- `GET /api/city/congestion` - Get congestion data
- `GET /api/city/emissions` - Get emission reduction data
- `GET /api/city/stats` - Get detailed city statistics

### Parking Search (Car-to-Cloud)
- `POST /api/parking/find` - Find best parking lot
- `POST /api/parking/reserve` - Reserve specific slot
- `GET /api/parking/nearby` - Get nearby parking lots

### AI Assistant
- `POST /api/ai-assistant` - Get AI recommendations
- `POST /api/ai-assistant/analyze` - Analyze parking data
- `GET /api/ai-assistant/suggestions` - Get quick suggestions

### Operator Dashboard
- `GET /api/operator/dashboard` - Get operator dashboard data
- `POST /api/pricing/update` - Update lot pricing
- `GET /api/operator/analytics` - Get detailed analytics
- `GET /api/operator/alerts` - Get system alerts

### Health Check
- `GET /health` - Server health status
- `GET /` - API information

## 📊 Database Setup (Supabase)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key

### 2. Run Database Schema
1. Open Supabase SQL Editor
2. Copy contents from `database/schema.sql`
3. Execute the SQL script

This creates:
- `users` - User accounts
- `parking_lots` - Parking lot information
- `bookings` - Booking records
- `payments` - Payment transactions
- `refunds` - Refund records
- `predictions` - AI predictions
- `daily_revenue` - Revenue analytics

### 3. Configure Environment
Update your `.env` file with Supabase credentials:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key
```

## 🔧 API Examples

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

### Get Prediction
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "lotId": "lot-001",
    "currentOccupancy": 98,
    "capacity": 150
  }'
```

### Find Parking (Car-to-Cloud)
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

### AI Price Suggestion
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

## 🗂️ Project Structure

```
server/
├── routes/
│   ├── slots.js          # Parking slots endpoints
│   ├── bookings.js       # Booking management
│   ├── predict.js        # AI predictions
│   ├── payments.js       # Payment processing
│   ├── city.js           # City dashboard
│   ├── parking.js        # Parking search
│   ├── ai.js             # AI assistant
│   └── operator.js       # Operator dashboard
├── database/
│   └── schema.sql        # Supabase database schema
├── server.js             # Main server file
├── package.json          # Dependencies
├── .env.example          # Environment template
└── README.md             # This file
```

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Input Validation** - Request body validation
- **Error Handling** - Centralized error handling
- **Environment Variables** - Secure configuration

## 🧪 Testing

### Test Health Endpoint
```bash
curl http://localhost:5000/health
```

### Test API Root
```bash
curl http://localhost:5000/
```

### Test Slots Endpoint
```bash
curl http://localhost:5000/api/slots
```

## 📈 Monitoring

The server logs all requests using Morgan middleware. In development mode, you'll see:
- HTTP method and path
- Response status code
- Response time
- Request timestamp

## 🚀 Deployment

### Deploy to Replit
1. Create new Repl
2. Import from GitHub
3. Add environment variables in Secrets
4. Run `npm install`
5. Run `npm start`

### Deploy to Railway
1. Connect GitHub repository
2. Add environment variables
3. Railway auto-detects Node.js
4. Deploy automatically

### Deploy to Render
1. Create new Web Service
2. Connect repository
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables

## 🔄 In-Memory Storage

When Supabase is not configured, the server uses in-memory storage:

```javascript
{
  bookings: [],      // All bookings
  payments: [],      // All payments
  bookingIdCounter: 1000  // Auto-increment ID
}
```

**Note:** In-memory data is lost when server restarts.

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change PORT in .env file
PORT=5001
```

### Supabase Connection Error
- Verify SUPABASE_URL and SUPABASE_KEY
- Check Supabase project is active
- Ensure database schema is created
- Server will fallback to in-memory storage

### CORS Errors
- Update FRONTEND_URL in .env
- Ensure frontend URL matches exactly
- Check browser console for details

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📝 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| PORT | No | 5000 | Server port |
| NODE_ENV | No | development | Environment mode |
| SUPABASE_URL | No | - | Supabase project URL |
| SUPABASE_KEY | No | - | Supabase anon key |
| FRONTEND_URL | No | http://localhost:3000 | Frontend URL for CORS |

## 🔗 Integration with Frontend

Update frontend `.env`:
```env
VITE_API_BASE=http://localhost:5000
```

All frontend API calls will automatically use this base URL.

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for ParkFlow Smart Parking System**
