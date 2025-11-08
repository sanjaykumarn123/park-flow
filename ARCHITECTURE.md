# 🏗️ ParkFlow Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        ParkFlow App                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Driver    │  │  Operator   │  │    City     │         │
│  │   Portal    │  │  Dashboard  │  │  Dashboard  │         │
│  │  /driver    │  │  /operator  │  │   /city     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                               │
│  ┌─────────────────────────────────────────────────┐        │
│  │           Future Car-to-Cloud                    │        │
│  │              /future                             │        │
│  └─────────────────────────────────────────────────┘        │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                    Shared Components                         │
│  Navbar | Sidebar | Notifications | Loading | Errors        │
├─────────────────────────────────────────────────────────────┤
│                    State Management (Zustand)                │
│  Driver State | Operator State | City State | Notifications │
├─────────────────────────────────────────────────────────────┤
│                    Custom Hooks Layer                        │
│         useFetch | usePost | useStore                       │
├─────────────────────────────────────────────────────────────┤
│                    API Integration Layer                     │
│  ${VITE_API_BASE}/api/* | Supabase (Optional)              │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App (Router)
│
├── Layout
│   ├── Navbar
│   ├── Sidebar
│   ├── NotificationPanel
│   └── Outlet (Page Content)
│       │
│       ├── DriverPage
│       │   ├── SearchBar
│       │   ├── ActiveBooking
│       │   │   └── ExtendBookingModal
│       │   ├── ParkingLotCard (multiple)
│       │   ├── ParkingMap
│       │   ├── BookingModal
│       │   └── RerouteModal
│       │
│       ├── OperatorPage
│       │   ├── StatsCards (4)
│       │   ├── TabNavigation
│       │   ├── BookingsTable
│       │   ├── DynamicPricing
│       │   │   └── PricingChart
│       │   └── Analytics
│       │       ├── RevenueChart
│       │       ├── UtilizationChart
│       │       └── VehicleTypeChart
│       │
│       ├── CityPage
│       │   ├── MetricsCards (4)
│       │   ├── EventModeToggle
│       │   ├── CityMap
│       │   ├── CongestionChart
│       │   ├── EmissionChart
│       │   └── InsightsCards
│       │
│       └── FuturePage
│           ├── BookingForm
│           │   ├── LocationInput
│           │   ├── ETAPicker
│           │   ├── VehicleTypeSelector
│           │   └── PreferencesCheckboxes
│           └── BookingResult
│               ├── SuccessCard
│               ├── ParkingDetails
│               ├── CloudSyncInfo
│               └── NavigationCard
```

## Data Flow

### Driver Booking Flow
```
User clicks "Book Now"
    ↓
BookingModal opens with lot data
    ↓
User fills form (time, vehicle, payment)
    ↓
useFetch POST /api/bookings
    ↓
Response received
    ↓
Store updates (addBooking)
    ↓
Notification shown (success)
    ↓
Modal closes
    ↓
ActiveBooking component renders
    ↓
20% chance: RerouteModal opens
```

### Operator Pricing Flow
```
Operator selects lot
    ↓
Current stats displayed
    ↓
Clicks "AI Suggest"
    ↓
usePost /api/ai-assistant
    ↓
AI suggestion received
    ↓
Price input populated
    ↓
Operator clicks "Update Price"
    ↓
usePost /api/pricing/update
    ↓
Store updates
    ↓
Notification shown
    ↓
Chart refreshes
```

### City Event Mode Flow
```
User toggles Event Mode
    ↓
Store updates (toggleEventMode)
    ↓
All components re-render
    ↓
Congestion data multiplied by 1.2
    ↓
Map markers update colors
    ↓
Charts show adjusted data
    ↓
Warning badge appears
```

## State Management (Zustand)

```javascript
useStore
├── Driver State
│   ├── selectedLot: object | null
│   ├── bookings: array
│   ├── currentBooking: object | null
│   ├── setSelectedLot(lot)
│   ├── addBooking(booking)
│   ├── updateBooking(id, updates)
│   └── cancelBooking(id)
│
├── Operator State
│   ├── operatorLots: array
│   ├── operatorBookings: array
│   ├── setOperatorLots(lots)
│   └── setOperatorBookings(bookings)
│
├── City State
│   ├── cityLots: array
│   ├── cityMetrics: object | null
│   ├── eventMode: boolean
│   ├── setCityLots(lots)
│   ├── setCityMetrics(metrics)
│   └── toggleEventMode()
│
└── Notifications
    ├── notifications: array
    ├── addNotification(notification)
    ├── removeNotification(id)
    └── clearNotifications()
```

## API Endpoints Map

```
Backend API (${VITE_API_BASE})
│
├── /api/slots
│   └── GET - List all parking lots with live data
│
├── /api/bookings
│   ├── POST - Create new booking
│   └── /:id
│       ├── GET - Get booking details
│       ├── /extend
│       │   └── POST - Extend booking duration
│       └── /cancel
│           └── POST - Cancel booking
│
├── /api/predict
│   └── POST - Get occupancy predictions
│
├── /api/operator
│   └── /dashboard
│       └── GET - Get operator dashboard data
│
├── /api/ai-assistant
│   └── POST - Get AI price suggestions
│
├── /api/pricing
│   └── /update
│       └── POST - Update lot pricing
│
├── /api/city
│   └── /overview
│       └── GET - Get city-wide metrics
│
├── /api/parking
│   └── /find
│       └── POST - Car-to-cloud parking search
│
└── /api/payments
    └── POST - Process payments
```

## Technology Stack Layers

```
┌─────────────────────────────────────────┐
│         Presentation Layer               │
│  React Components + Tailwind CSS        │
│  Framer Motion + Lucide Icons           │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         State Management Layer           │
│  Zustand Store + React Hooks            │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Business Logic Layer             │
│  Custom Hooks (useFetch, usePost)       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Data Layer                       │
│  REST API + Supabase (Optional)         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         External Services                │
│  Backend API + Database + Maps CDN      │
└─────────────────────────────────────────┘
```

## Routing Structure

```
/ (Root)
├── Redirect to /driver
│
├── /driver (DriverPage)
│   ├── Search & Filter
│   ├── List/Map Toggle
│   ├── Parking Lot Cards
│   └── Booking Flow
│
├── /operator (OperatorPage)
│   ├── Dashboard Stats
│   ├── Bookings Tab
│   ├── Pricing Tab
│   └── Analytics Tab
│
├── /city (CityPage)
│   ├── City Metrics
│   ├── Event Mode Toggle
│   ├── City Map
│   └── Charts
│
└── /future (FuturePage)
    ├── Booking Form
    └── Result Display
```

## Build & Deployment Pipeline

```
Development
    ↓
npm run dev (Vite Dev Server)
    ↓
Hot Module Replacement
    ↓
Code Changes
    ↓
npm run build
    ↓
Vite Build Process
    ↓
dist/ folder generated
    ↓
┌─────────────┬─────────────┐
│   Netlify   │   Vercel    │
└─────────────┴─────────────┘
    ↓              ↓
Production    Production
```

## Security Architecture

```
Frontend (Browser)
    ↓
Environment Variables (.env)
    ↓
API Calls (with CORS)
    ↓
Backend API (Replit/Custom)
    ↓
Database (Supabase/Custom)
```

**Security Measures:**
- ✅ No hardcoded secrets
- ✅ Environment variables for config
- ✅ CORS-ready architecture
- ✅ Input validation on forms
- ✅ Secure Supabase RLS (if used)

## Performance Optimization

```
Code Splitting
    ↓
React.lazy() for routes
    ↓
Smaller initial bundle
    ↓
Faster first paint

Memoization
    ↓
useMemo for expensive calculations
    ↓
Reduced re-renders
    ↓
Better performance

Zustand
    ↓
Selective subscriptions
    ↓
Only re-render what changed
    ↓
Optimized updates
```

## Responsive Design Breakpoints

```
Mobile First Approach

320px - 767px   → Mobile
    ↓
Single column layouts
Hamburger menu
Stacked cards

768px - 1023px  → Tablet
    ↓
2-column grids
Visible navbar
Side-by-side cards

1024px+         → Desktop
    ↓
3-4 column grids
Sidebar visible
Full-width charts
```

## Error Handling Flow

```
API Call
    ↓
Try/Catch Block
    ↓
Error Occurs?
    ├── Yes → Catch Block
    │         ↓
    │    Set error state
    │         ↓
    │    Show ErrorMessage component
    │         ↓
    │    Add error notification
    │         ↓
    │    Log to console
    │
    └── No → Success
              ↓
         Update store
              ↓
         Show success notification
              ↓
         Update UI
```

## Notification System

```
Action Triggered
    ↓
addNotification({
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string
})
    ↓
Store updates notifications array
    ↓
NotificationPanel re-renders
    ↓
Framer Motion animates entry
    ↓
Auto-dismiss after 5s (optional)
    ↓
User can manually dismiss
    ↓
Framer Motion animates exit
```

## Development Workflow

```
1. Create Component
    ↓
2. Add to appropriate folder
    ↓
3. Import in parent
    ↓
4. Add to route (if page)
    ↓
5. Connect to store (if needed)
    ↓
6. Add API calls (if needed)
    ↓
7. Style with Tailwind
    ↓
8. Add animations (if needed)
    ↓
9. Test in browser
    ↓
10. Commit changes
```

---

This architecture ensures:
- ✅ **Scalability** - Easy to add new features
- ✅ **Maintainability** - Clear separation of concerns
- ✅ **Performance** - Optimized rendering and loading
- ✅ **Developer Experience** - Hot reload, TypeScript-ready
- ✅ **User Experience** - Fast, responsive, beautiful UI
