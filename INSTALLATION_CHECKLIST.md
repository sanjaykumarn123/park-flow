# ✅ ParkFlow Installation Checklist

## Pre-Installation Requirements

- [ ] Node.js 18+ installed
  ```bash
  node --version  # Should show v18.x.x or higher
  ```

- [ ] npm installed
  ```bash
  npm --version  # Should show 9.x.x or higher
  ```

- [ ] Git installed (optional, for version control)
  ```bash
  git --version
  ```

## Installation Steps

### 1. Navigate to Project Directory
```bash
cd "c:\Users\PRAMI\Documents\SIH LOS NOBLES\Imobilothon 5.0"
```
- [ ] Confirmed in correct directory

### 2. Install Dependencies
```bash
npm install
```
- [ ] Installation completed without errors
- [ ] `node_modules` folder created
- [ ] `package-lock.json` generated

**Expected packages (verify in terminal output):**
- [ ] react@18.2.0
- [ ] react-router-dom@6.20.0
- [ ] zustand@4.4.7
- [ ] tailwindcss@3.3.6
- [ ] vite@5.0.8
- [ ] lucide-react@0.294.0
- [ ] recharts@2.10.3
- [ ] leaflet@1.9.4
- [ ] framer-motion@10.16.16

### 3. Environment Configuration
- [ ] `.env` file exists
- [ ] `VITE_API_BASE` is set (or left as localhost:5000)
- [ ] Map coordinates configured (optional)

```env
VITE_API_BASE=http://localhost:5000
VITE_MAP_CENTER_LAT=28.6139
VITE_MAP_CENTER_LNG=77.2090
```

### 4. Verify File Structure
- [ ] `src/` folder exists
- [ ] `public/` folder exists
- [ ] `index.html` exists
- [ ] `package.json` exists
- [ ] `vite.config.js` exists
- [ ] `tailwind.config.js` exists

### 5. Start Development Server
```bash
npm run dev
```
- [ ] Server starts without errors
- [ ] Terminal shows: "Local: http://localhost:3000"
- [ ] Browser opens automatically (or manually navigate)

**Alternative:** Double-click `start-parkflow.bat`
- [ ] Batch file runs successfully

## Post-Installation Verification

### Browser Checks

#### 1. Application Loads
- [ ] Page loads at http://localhost:3000
- [ ] No console errors (F12 → Console tab)
- [ ] Dark theme applied correctly

#### 2. Navigation Works
- [ ] Navbar visible at top
- [ ] Sidebar visible on desktop (left side)
- [ ] Can click on "Driver" link
- [ ] Can click on "Operator" link
- [ ] Can click on "City" link
- [ ] Can click on "Future" link
- [ ] URL changes when navigating

#### 3. Driver Page (`/driver`)
- [ ] Page title: "Find Parking"
- [ ] Search bar visible
- [ ] List/Map toggle buttons visible
- [ ] Parking lot cards display (or loading spinner)
- [ ] Can switch between List and Map views
- [ ] Map loads (if in Map view)
- [ ] Can click "Book Now" on a card
- [ ] Booking modal opens

#### 4. Operator Page (`/operator`)
- [ ] Page title: "Operator Dashboard"
- [ ] 4 stat cards visible (Bookings, Occupancy, Revenue, Alerts)
- [ ] Tab navigation visible (Bookings, Pricing, Analytics)
- [ ] Can switch between tabs
- [ ] Bookings table displays
- [ ] Charts render correctly

#### 5. City Page (`/city`)
- [ ] Page title: "City Dashboard"
- [ ] 4 metric cards visible
- [ ] Event Mode toggle visible
- [ ] Map loads with markers
- [ ] Congestion chart displays
- [ ] Emission chart displays
- [ ] Can toggle Event Mode

#### 6. Future Page (`/future`)
- [ ] Page title: "Future Car-to-Cloud Booking"
- [ ] Booking form visible
- [ ] All input fields present
- [ ] Can fill out form
- [ ] Can submit form
- [ ] Result displays after submission

### Component Checks

#### Shared Components
- [ ] Navbar displays on all pages
- [ ] Sidebar displays on desktop
- [ ] Mobile menu works (hamburger icon)
- [ ] Notifications can be triggered
- [ ] Loading spinners work
- [ ] Error messages display properly

#### Styling Checks
- [ ] Dark theme applied (black background)
- [ ] Primary blue color (#3b82f6) visible
- [ ] Cards have proper borders and shadows
- [ ] Buttons have hover effects
- [ ] Text is readable (good contrast)
- [ ] Icons display correctly (Lucide icons)

#### Responsive Checks
- [ ] Mobile view (resize to 375px width)
  - [ ] Sidebar hidden
  - [ ] Hamburger menu appears
  - [ ] Cards stack vertically
  - [ ] Text remains readable
  
- [ ] Tablet view (resize to 768px width)
  - [ ] 2-column grid for cards
  - [ ] Navbar remains visible
  
- [ ] Desktop view (1024px+ width)
  - [ ] Sidebar visible
  - [ ] 3-4 column grids
  - [ ] Full layout

### Functionality Checks

#### Driver Features
- [ ] Can search parking lots
- [ ] Search filters results
- [ ] Can open booking modal
- [ ] Can fill booking form
- [ ] Form validation works
- [ ] Can select payment method
- [ ] Price calculation correct
- [ ] Can submit booking (shows notification)

#### Operator Features
- [ ] Can view bookings table
- [ ] Can search bookings
- [ ] Can filter by status
- [ ] Can select parking lot in pricing tab
- [ ] Charts display data
- [ ] Can click "AI Suggest" button
- [ ] Can update price

#### City Features
- [ ] Can toggle Event Mode
- [ ] Congestion rate updates
- [ ] Map markers change color
- [ ] Can click on map markers
- [ ] Popups display information
- [ ] Charts update with data

#### Future Features
- [ ] Can enter location
- [ ] Can select ETA
- [ ] Can choose vehicle type
- [ ] Can toggle preferences
- [ ] Can submit form
- [ ] Result displays correctly
- [ ] Can book another

### Performance Checks
- [ ] Page loads in < 3 seconds
- [ ] Navigation is instant
- [ ] No lag when typing
- [ ] Smooth animations
- [ ] Charts render quickly
- [ ] Map loads without delay

### Browser Compatibility
Test in multiple browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Safari (if on Mac)

## Troubleshooting

### Issue: Dependencies won't install
**Solution:**
```bash
# Clear cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Port 3000 already in use
**Solution:**
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in vite.config.js
server: { port: 3001 }
```

### Issue: Map not loading
**Solution:**
- Check internet connection
- Verify Leaflet CSS in index.html
- Check browser console for errors

### Issue: API calls failing
**Solution:**
- Check `.env` file has correct `VITE_API_BASE`
- Verify backend is running
- Check browser console for CORS errors
- Try with default localhost:5000

### Issue: Styles not applying
**Solution:**
```bash
# Restart dev server
# Press Ctrl+C, then run:
npm run dev
```

### Issue: Console errors
**Solution:**
- Read error message carefully
- Check component imports
- Verify all dependencies installed
- Check for typos in code

## Build Verification (Optional)

### Production Build
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] `dist/` folder created
- [ ] Files in dist/ folder:
  - [ ] index.html
  - [ ] assets/ folder with JS and CSS

### Preview Production Build
```bash
npm run preview
```
- [ ] Preview server starts
- [ ] App works in production mode
- [ ] No console errors

## Final Checklist

- [ ] All dependencies installed
- [ ] Development server runs
- [ ] All 4 pages accessible
- [ ] All components render
- [ ] No console errors
- [ ] Responsive design works
- [ ] Forms are functional
- [ ] Notifications work
- [ ] Maps load correctly
- [ ] Charts display data
- [ ] Navigation works smoothly
- [ ] Styling looks correct
- [ ] Performance is good

## Success Criteria

✅ **Installation Successful** if:
1. `npm install` completes without errors
2. `npm run dev` starts the server
3. Browser opens to http://localhost:3000
4. All 4 pages load without errors
5. No critical console errors
6. Basic functionality works (navigation, forms, etc.)

## Next Steps After Successful Installation

1. **Configure Backend**
   - Update `.env` with your backend URL
   - Test API connections

2. **Customize**
   - Update colors in `tailwind.config.js`
   - Modify content as needed
   - Add your branding

3. **Deploy**
   - Build for production: `npm run build`
   - Deploy to Netlify or Vercel
   - Configure environment variables

4. **Develop**
   - Add new features
   - Connect to real backend
   - Implement authentication

---

**Installation Date:** _________________

**Installed By:** _________________

**Status:** ⬜ Pending | ⬜ In Progress | ⬜ Complete | ⬜ Failed

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________
