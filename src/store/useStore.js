import { create } from 'zustand'

const useStore = create((set, get) => ({
  // Driver state
  selectedLot: null,
  bookings: [],
  currentBooking: null,
  
  setSelectedLot: (lot) => set({ selectedLot: lot }),
  
  addBooking: (booking) => set((state) => ({
    bookings: [...state.bookings, booking],
    currentBooking: booking
  })),
  
  updateBooking: (bookingId, updates) => set((state) => ({
    bookings: state.bookings.map(b => 
      b.id === bookingId ? { ...b, ...updates } : b
    ),
    currentBooking: state.currentBooking?.id === bookingId 
      ? { ...state.currentBooking, ...updates } 
      : state.currentBooking
  })),
  
  cancelBooking: (bookingId) => set((state) => ({
    bookings: state.bookings.filter(b => b.id !== bookingId),
    currentBooking: state.currentBooking?.id === bookingId ? null : state.currentBooking
  })),

  // Operator state
  operatorLots: [],
  operatorBookings: [],
  
  setOperatorLots: (lots) => set({ operatorLots: lots }),
  setOperatorBookings: (bookings) => set({ operatorBookings: bookings }),

  // City state
  cityLots: [],
  cityMetrics: null,
  eventMode: false,
  
  setCityLots: (lots) => set({ cityLots: lots }),
  setCityMetrics: (metrics) => set({ cityMetrics: metrics }),
  toggleEventMode: () => set((state) => ({ eventMode: !state.eventMode })),

  // Notifications
  notifications: [],
  
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, {
      id: Date.now(),
      timestamp: new Date(),
      ...notification
    }]
  })),
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  clearNotifications: () => set({ notifications: [] }),
}))

export default useStore
