# Installation Instructions - Updated Features

## 🚀 Quick Installation

### Step 1: Install Backend Dependencies

The WebSocket package needs to be installed on the backend.

```bash
# Navigate to server folder
cd "c:\Users\Sanjay Kumar N\Downloads\Imobilothon 5.0\Imobilothon 5.0\server"

# Install dependencies (includes new 'ws' package)
npm install
```

### Step 2: Verify Frontend Dependencies

Frontend dependencies should already be installed, but if not:

```bash
# Navigate back to project root
cd ..

# Install frontend dependencies
npm install
```

### Step 3: Start the Application

**Option A: Using Batch File (Recommended)**
```bash
# From project root
.\start-fullstack.bat
```

**Option B: Manual Start**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend (new terminal)
cd "c:\Users\Sanjay Kumar N\Downloads\Imobilothon 5.0\Imobilothon 5.0"
npm run dev
```

### Step 4: Verify Installation

1. **Check Backend:**
   - Open http://localhost:5000/health
   - Should see: `{"status":"healthy",...}`
   - Look for in server console: `✅ WebSocket service initialized on /ws`

2. **Check Frontend:**
   - Open http://localhost:3000
   - Should see improved navigation bar
   - Bottom-right corner shows "Connected" (green)
   - Connection status auto-hides after 3 seconds

3. **Check WebSocket:**
   - Open browser console (F12)
   - Should see: `✅ Global WebSocket connected`
   - Should see: `✅ WebSocket client connected: client_xxx`

---

## ✨ What Changed?

### New Files Created:

**Backend:**
```
server/
├── services/
│   └── websocketService.js        ⭐ NEW - Real-time WebSocket server
└── package.json                   ✏️ UPDATED - Added 'ws' package
```

**Frontend:**
```
src/
├── components/
│   ├── ImprovedNavigation.jsx     ⭐ NEW - Better navigation
│   ├── ConnectionStatus.jsx       ⭐ NEW - Connection indicator
│   └── ErrorBoundary.jsx          ⭐ NEW - Error handling
├── hooks/
│   └── useWebSocket.js            ⭐ NEW - WebSocket React hook
└── App.jsx                        ✏️ UPDATED - Integrated new components
```

**Documentation:**
```
├── REALTIME_FEATURES_GUIDE.md     ⭐ NEW
└── INSTALLATION_INSTRUCTIONS.md   ⭐ NEW (this file)
```

---

## 🔍 Troubleshooting

### Issue 1: "Cannot find module 'ws'"

**Cause:** WebSocket package not installed  
**Solution:**
```bash
cd server
npm install ws@8.14.2
npm run dev
```

### Issue 2: WebSocket connection fails

**Symptom:** Red "Connection Failed" indicator  
**Solutions:**

1. **Check backend is running:**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Check port 5000 is available:**
   ```bash
   netstat -ano | findstr :5000
   ```

3. **Restart backend:**
   ```bash
   # Stop backend (Ctrl+C)
   cd server
   npm run dev
   ```

### Issue 3: Navigation not showing

**Cause:** Frontend not updated  
**Solution:**
```bash
# Stop frontend (Ctrl+C)
npm install
npm run dev
```

### Issue 4: "Module not found: Error: Can't resolve '../hooks/useWebSocket'"

**Cause:** File not created properly  
**Solution:**
```bash
# Verify file exists
dir src\hooks\useWebSocket.js

# If not, copy from the code provided
```

---

## 📦 Package Versions

### Backend (server/package.json):
```json
{
  "dependencies": {
    "ws": "^8.14.2",           // ⭐ NEW
    "@supabase/supabase-js": "^2.39.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0"
  }
}
```

### Frontend (package.json):
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "zustand": "^4.4.7",
    "lucide-react": "^0.294.0",
    "recharts": "^2.10.3",
    // ... (no new packages required)
  }
}
```

---

## 🎯 Testing Your Installation

### Test 1: Basic Functionality
```bash
# 1. Start both servers
.\start-fullstack.bat

# 2. Open browser
# http://localhost:3000

# 3. Check for:
✅ New navigation bar at top
✅ Green "Connected" indicator (bottom-right, auto-hides)
✅ Smooth navigation between pages
```

### Test 2: WebSocket Connection
```bash
# 1. Open browser console (F12)
# 2. Check for logs:
✅ WebSocket connected
✅ WebSocket client connected: client_xxx

# 3. Stop backend server (Ctrl+C in server terminal)
# 4. Should see:
🟠 "Reconnecting" indicator appears
🟠 Console: WebSocket disconnected

# 5. Restart backend
npm run dev

# 6. Should see:
✅ Connection restores automatically
✅ "Connected" appears briefly
```

### Test 3: Error Boundary
```javascript
// 1. Open browser console (F12)
// 2. Type and press Enter:
throw new Error('Test error')

// 3. Should see:
✅ Error boundary UI with "Oops! Something went wrong"
✅ Three buttons: Try Again, Reload Page, Go Home
✅ Error details in development mode

// 4. Click "Try Again" to recover
```

### Test 4: Mobile Navigation
```bash
# 1. Open browser at http://localhost:3000
# 2. Resize window to mobile size (< 768px width)
# 3. Check for:
✅ Hamburger menu icon appears
✅ Click opens full menu
✅ Menu shows all pages with descriptions
✅ Connection status visible in menu
```

---

## 🔄 Updating Existing Installation

If you already have ParkFlow installed:

### 1. Backup Current Code
```bash
# Create backup folder
mkdir backup
xcopy /E /I "Imobilothon 5.0" "backup\Imobilothon 5.0"
```

### 2. Apply Updates

**Manual Method:**
1. Copy new files from the enhanced version
2. Update modified files (App.jsx, server.js, package.json)
3. Run npm install in both root and server

**OR use the batch file restart:**
```bash
# Stop all servers
# Run fresh install
cd server
npm install
cd ..
npm install
.\start-fullstack.bat
```

---

## 🌐 Production Deployment

### Changes for Production:

**1. Update WebSocket URL:**
```javascript
// src/App.jsx
const WS_URL = process.env.NODE_ENV === 'production'
  ? 'wss://your-domain.com/ws'  // Use WSS (secure)
  : 'ws://localhost:5000/ws'
```

**2. Environment Variables:**
```env
# .env.production
VITE_API_BASE=https://your-api.com
VITE_WS_URL=wss://your-api.com/ws
```

**3. Build:**
```bash
# Frontend
npm run build

# Deploy 'dist' folder to hosting
```

**4. Backend:**
```bash
# Server
cd server
npm install --production
node server.js
```

---

## ✅ Verification Checklist

After installation, verify:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] WebSocket connected (check console)
- [ ] Green "Connected" indicator visible
- [ ] Navigation bar shows all pages
- [ ] Mobile menu works (resize window)
- [ ] Error boundary catches errors (test with `throw new Error()`)
- [ ] Auto-reconnect works (stop/start backend)
- [ ] All pages load without errors
- [ ] Analytics page shows ML predictions

---

## 📞 Need Help?

### Common Solutions:

**Port Already in Use:**
```bash
# Find process using port
netstat -ano | findstr :5000
# Kill process by PID
taskkill /PID <PID> /F
```

**Dependencies Not Installing:**
```bash
# Clear cache
npm cache clean --force
# Delete node_modules
rm -rf node_modules package-lock.json
# Reinstall
npm install
```

**WebSocket Not Working:**
```bash
# Check Windows Firewall
# Allow Node.js through firewall
# Or temporarily disable firewall for testing
```

---

## 🎉 Success!

If you see:
- ✅ Improved navigation with icons
- ✅ Green "Connected" status
- ✅ WebSocket logs in console
- ✅ No errors in browser console

**You're all set! Your ParkFlow app now has real-time capabilities! 🚀**

---

## 📚 Next Steps

1. **Read:** [REALTIME_FEATURES_GUIDE.md](./REALTIME_FEATURES_GUIDE.md)
2. **Explore:** Navigate through all pages
3. **Test:** Try the auto-reconnect feature
4. **Customize:** Adjust colors and timeouts
5. **Deploy:** Follow production deployment guide

---

**Questions or Issues?**
- Check browser console (F12) for errors
- Check server logs for WebSocket messages
- Review REALTIME_FEATURES_GUIDE.md for details
- Ensure Node.js version 18+ is installed

**Happy coding! 🎊**
