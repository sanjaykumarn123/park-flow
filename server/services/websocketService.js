/**
 * WebSocket Service for Real-Time Updates
 * Handles bi-directional real-time communication with clients
 */

import { WebSocketServer } from 'ws'

class WebSocketService {
  constructor() {
    this.wss = null
    this.clients = new Map()
    this.subscriptions = new Map()
    this.heartbeatInterval = null
  }

  initialize(server) {
    this.wss = new WebSocketServer({ server, path: '/ws' })
    
    this.wss.on('connection', (ws, req) => {
      const clientId = this.generateClientId()
      console.log(`✅ WebSocket client connected: ${clientId}`)
      
      // Store client info
      this.clients.set(clientId, {
        ws,
        subscriptions: new Set(),
        lastHeartbeat: Date.now(),
        metadata: {
          ip: req.socket.remoteAddress,
          connectedAt: new Date()
        }
      })

      // Set up message handler
      ws.on('message', (message) => {
        this.handleMessage(clientId, message)
      })

      // Handle disconnection
      ws.on('close', () => {
        console.log(`❌ WebSocket client disconnected: ${clientId}`)
        this.removeClient(clientId)
      })

      // Handle errors
      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error)
        this.removeClient(clientId)
      })

      // Send welcome message
      this.sendToClient(clientId, {
        type: 'connected',
        clientId,
        timestamp: new Date(),
        message: 'Connected to ParkFlow real-time service'
      })
    })

    // Start heartbeat to detect dead connections
    this.startHeartbeat()

    console.log('✅ WebSocket service initialized on /ws')
  }

  handleMessage(clientId, rawMessage) {
    try {
      const message = JSON.parse(rawMessage)
      
      switch (message.type) {
        case 'ping':
          this.handlePing(clientId)
          break
          
        case 'subscribe':
          this.subscribe(clientId, message.channel, message.filters)
          break
          
        case 'unsubscribe':
          this.unsubscribe(clientId, message.channel)
          break
          
        case 'request':
          this.handleRequest(clientId, message)
          break
          
        default:
          this.sendToClient(clientId, {
            type: 'error',
            message: `Unknown message type: ${message.type}`
          })
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error)
      this.sendToClient(clientId, {
        type: 'error',
        message: 'Invalid message format'
      })
    }
  }

  handlePing(clientId) {
    const client = this.clients.get(clientId)
    if (client) {
      client.lastHeartbeat = Date.now()
      this.sendToClient(clientId, { type: 'pong', timestamp: Date.now() })
    }
  }

  subscribe(clientId, channel, filters = {}) {
    const client = this.clients.get(clientId)
    if (!client) return

    // Add to client's subscriptions
    client.subscriptions.add(channel)

    // Add to channel subscribers
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Map())
    }
    this.subscriptions.get(channel).set(clientId, filters)

    console.log(`📡 Client ${clientId} subscribed to ${channel}`)
    
    this.sendToClient(clientId, {
      type: 'subscribed',
      channel,
      timestamp: new Date()
    })

    // Send initial data for the channel
    this.sendInitialData(clientId, channel, filters)
  }

  unsubscribe(clientId, channel) {
    const client = this.clients.get(clientId)
    if (client) {
      client.subscriptions.delete(channel)
    }

    if (this.subscriptions.has(channel)) {
      this.subscriptions.get(channel).delete(clientId)
    }

    this.sendToClient(clientId, {
      type: 'unsubscribed',
      channel,
      timestamp: new Date()
    })
  }

  async sendInitialData(clientId, channel, filters) {
    // Send initial data based on channel type
    try {
      let data = null

      switch (channel) {
        case 'occupancy':
          data = await this.getOccupancyData(filters.lotId)
          break
        case 'bookings':
          data = await this.getBookingsData(filters)
          break
        case 'analytics':
          data = await this.getAnalyticsData(filters.lotId)
          break
        case 'alerts':
          data = await this.getAlertsData(filters.lotId)
          break
      }

      if (data) {
        this.sendToClient(clientId, {
          type: 'initial_data',
          channel,
          data,
          timestamp: new Date()
        })
      }
    } catch (error) {
      console.error(`Error sending initial data for ${channel}:`, error)
    }
  }

  handleRequest(clientId, message) {
    // Handle one-time data requests
    const { requestId, action, params } = message

    // Process request and send response
    this.sendToClient(clientId, {
      type: 'response',
      requestId,
      data: { status: 'processed' },
      timestamp: new Date()
    })
  }

  // Broadcast to all clients subscribed to a channel
  broadcast(channel, data) {
    if (!this.subscriptions.has(channel)) return

    const subscribers = this.subscriptions.get(channel)
    let sentCount = 0

    subscribers.forEach((filters, clientId) => {
      // Apply filters before sending
      if (this.matchesFilters(data, filters)) {
        this.sendToClient(clientId, {
          type: 'update',
          channel,
          data,
          timestamp: new Date()
        })
        sentCount++
      }
    })

    console.log(`📡 Broadcasted to ${sentCount} clients on ${channel}`)
  }

  // Send to specific client
  sendToClient(clientId, data) {
    const client = this.clients.get(clientId)
    if (!client || client.ws.readyState !== 1) return // 1 = OPEN

    try {
      client.ws.send(JSON.stringify(data))
    } catch (error) {
      console.error(`Error sending to client ${clientId}:`, error)
      this.removeClient(clientId)
    }
  }

  // Broadcast to all connected clients
  broadcastToAll(data) {
    this.clients.forEach((client, clientId) => {
      this.sendToClient(clientId, data)
    })
  }

  matchesFilters(data, filters) {
    if (!filters || Object.keys(filters).length === 0) return true

    for (const [key, value] of Object.entries(filters)) {
      if (data[key] !== value) return false
    }

    return true
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      const now = Date.now()
      const timeout = 60000 // 60 seconds

      this.clients.forEach((client, clientId) => {
        if (now - client.lastHeartbeat > timeout) {
          console.log(`💀 Client ${clientId} timeout - removing`)
          this.removeClient(clientId)
        }
      })
    }, 30000) // Check every 30 seconds
  }

  removeClient(clientId) {
    const client = this.clients.get(clientId)
    if (!client) return

    // Remove from all subscriptions
    client.subscriptions.forEach(channel => {
      if (this.subscriptions.has(channel)) {
        this.subscriptions.get(channel).delete(clientId)
      }
    })

    // Close connection
    try {
      client.ws.close()
    } catch (error) {
      // Already closed
    }

    this.clients.delete(clientId)
  }

  generateClientId() {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Data fetch methods (integrate with your actual data layer)
  async getOccupancyData(lotId) {
    // Simulate occupancy data - replace with actual DB query
    return {
      lotId,
      occupancy: Math.floor(Math.random() * 100),
      capacity: 150,
      available: 50,
      trend: 'increasing',
      lastUpdate: new Date()
    }
  }

  async getBookingsData(filters) {
    // Simulate bookings data
    return {
      total: 45,
      active: 23,
      pending: 5,
      completed: 17
    }
  }

  async getAnalyticsData(lotId) {
    return {
      lotId,
      metrics: {
        revenueToday: 2340,
        utilizationRate: 75,
        avgDuration: 2.5
      }
    }
  }

  async getAlertsData(lotId) {
    return {
      lotId,
      alerts: [],
      warningCount: 0
    }
  }

  // Public methods to trigger updates
  notifyOccupancyChange(lotId, occupancyData) {
    this.broadcast('occupancy', {
      lotId,
      ...occupancyData
    })
  }

  notifyNewBooking(bookingData) {
    this.broadcast('bookings', {
      type: 'new_booking',
      booking: bookingData
    })
  }

  notifyAlert(alertData) {
    this.broadcast('alerts', alertData)
  }

  notifyAnalyticsUpdate(analyticsData) {
    this.broadcast('analytics', analyticsData)
  }

  getStats() {
    return {
      connectedClients: this.clients.size,
      activeChannels: this.subscriptions.size,
      subscriptionDetails: Array.from(this.subscriptions.entries()).map(([channel, subs]) => ({
        channel,
        subscribers: subs.size
      }))
    }
  }

  shutdown() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }

    this.clients.forEach((client, clientId) => {
      this.sendToClient(clientId, {
        type: 'server_shutdown',
        message: 'Server is shutting down'
      })
      client.ws.close()
    })

    this.clients.clear()
    this.subscriptions.clear()

    if (this.wss) {
      this.wss.close()
    }

    console.log('WebSocket service shut down')
  }
}

export default new WebSocketService()
