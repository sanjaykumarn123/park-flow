# 🚀 ParkFlow Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## 1️⃣ Installation (First Time Only)

```bash
# Navigate to project directory
cd "Imobilothon 5.0"

# Install dependencies
npm install
```

## 2️⃣ Configuration

Edit the `.env` file with your backend URL:

```env
VITE_API_BASE=https://your-backend-url.replit.dev
```

**Note**: The app will work without a backend, but API calls will fail gracefully.

## 3️⃣ Start Development Server

### Option A: Using the batch file (Windows)
Double-click `start-parkflow.bat`

### Option B: Using npm
```bash
npm run dev
```

The app will automatically open at `http://localhost:3000`

## 📱 Pages Overview

### Driver Portal - `/driver`
- Search and book parking slots
- View live occupancy and predictions
- Manage active bookings
- Extend or cancel reservations

### Operator Dashboard - `/operator`
- View all bookings in a table
- Monitor live occupancy and revenue
- Set dynamic pricing with AI suggestions
- Analyze revenue and utilization trends

### City Dashboard - `/city`
- City-wide parking lot map
- Congestion monitoring
- Environmental impact tracking
- Event mode simulation (+20% demand)

### Future Booking - `/future`
- Car-to-cloud booking interface
- AI-powered parking search
- Vehicle sync and navigation

## 🎨 Features

✅ **Dark Theme** - Modern, eye-friendly design
✅ **Responsive** - Works on mobile, tablet, and desktop
✅ **Real-time Updates** - Live occupancy tracking
✅ **Interactive Maps** - Leaflet-powered maps with markers
✅ **Animations** - Smooth Framer Motion transitions
✅ **Charts** - Recharts data visualizations
✅ **State Management** - Zustand for global state
✅ **Notifications** - Toast-style notifications
✅ **Loading States** - Proper loading and error handling

## 🔧 Development

### Build for Production
```bash
npm run build
```

Output will be in the `dist` folder.

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## 🚀 Deployment

### Netlify
1. Run `npm run build`
2. Drag `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Vercel
1. Import project from Git
2. Vercel auto-detects Vite
3. Set environment variables in Vercel dashboard

## 🔌 Backend Integration

The app expects these API endpoints:

**Driver APIs:**
- `GET /api/slots` - List parking lots
- `POST /api/bookings` - Create booking
- `POST /api/bookings/:id/extend` - Extend booking
- `POST /api/bookings/:id/cancel` - Cancel booking
- `POST /api/predict` - Get predictions

**Operator APIs:**
- `GET /api/operator/dashboard` - Dashboard data
- `POST /api/ai-assistant` - AI price suggestions
- `POST /api/pricing/update` - Update pricing

**City APIs:**
- `GET /api/city/overview` - City metrics

**Future APIs:**
- `POST /api/parking/find` - Car-to-cloud search

## 🆘 Troubleshooting

### Port 3000 already in use
Change port in `vite.config.js`:
```js
server: {
  port: 3001, // Change to any available port
}
```

### API calls failing
1. Check `.env` file has correct `VITE_API_BASE`
2. Ensure backend is running
3. Check browser console for CORS errors

### Map not loading
1. Check internet connection (maps need CDN)
2. Verify Leaflet CSS is loading in `index.html`

### Dependencies not installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Leaflet](https://react-leaflet.js.org/)

## 💡 Tips

1. **Hot Reload**: Changes auto-refresh in dev mode
2. **Component Structure**: Follow existing patterns for consistency
3. **State Management**: Use Zustand store for global state
4. **API Calls**: Use `useFetch` or `usePost` hooks
5. **Styling**: Use Tailwind classes and custom CSS classes

---

Happy coding! 🎉
