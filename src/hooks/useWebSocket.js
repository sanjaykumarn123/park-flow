import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Custom hook for WebSocket connection with auto-reconnect
 * and comprehensive error handling
 */
export const useWebSocket = (url, options = {}) => {
  const {
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    onOpen,
    onClose,
    onError,
    onMessage
  } = options

  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [lastMessage, setLastMessage] = useState(null)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)

  const wsRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)
  const pingIntervalRef = useRef(null)

  const connect = useCallback(() => {
    try {
      setConnectionStatus('connecting')
      
      const ws = new WebSocket(url)

      ws.onopen = () => {
        console.log('✅ WebSocket connected')
        setIsConnected(true)
        setConnectionStatus('connected')
        setReconnectAttempts(0)
        
        // Start ping interval
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }))
          }
        }, 30000) // Ping every 30 seconds
        
        if (onOpen) onOpen()
      }

      ws.onclose = (event) => {
        console.log('❌ WebSocket disconnected:', event.code, event.reason)
        setIsConnected(false)
        setConnectionStatus('disconnected')
        
        // Clear ping interval
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current)
        }
        
        // Attempt reconnect if not intentional close
        if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
          setConnectionStatus('reconnecting')
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1)
            connect()
          }, reconnectInterval)
        } else if (reconnectAttempts >= maxReconnectAttempts) {
          setConnectionStatus('failed')
        }
        
        if (onClose) onClose(event)
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setConnectionStatus('error')
        if (onError) onError(error)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setLastMessage(data)
          if (onMessage) onMessage(data)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      wsRef.current = ws
    } catch (error) {
      console.error('Error creating WebSocket:', error)
      setConnectionStatus('error')
    }
  }, [url, reconnectAttempts, maxReconnectAttempts, reconnectInterval, onOpen, onClose, onError, onMessage])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current)
    }
    if (wsRef.current) {
      wsRef.current.close(1000, 'Client disconnect')
      wsRef.current = null
    }
    setIsConnected(false)
    setConnectionStatus('disconnected')
  }, [])

  const sendMessage = useCallback((message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
      return true
    } else {
      console.warn('WebSocket is not connected')
      return false
    }
  }, [])

  const subscribe = useCallback((channel, filters = {}) => {
    return sendMessage({ type: 'subscribe', channel, filters })
  }, [sendMessage])

  const unsubscribe = useCallback((channel) => {
    return sendMessage({ type: 'unsubscribe', channel })
  }, [sendMessage])

  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, []) // Only connect once on mount

  return {
    isConnected,
    connectionStatus,
    lastMessage,
    sendMessage,
    subscribe,
    unsubscribe,
    reconnect: connect,
    disconnect,
    reconnectAttempts
  }
}

/**
 * Hook for subscribing to a specific channel with automatic cleanup
 */
export const useWebSocketChannel = (url, channel, filters = {}, messageHandler) => {
  const [messages, setMessages] = useState([])
  const [latestData, setLatestData] = useState(null)

  const handleMessage = useCallback((data) => {
    if (data.channel === channel || data.type === 'initial_data') {
      setMessages(prev => [...prev.slice(-99), data]) // Keep last 100 messages
      if (data.data) {
        setLatestData(data.data)
      }
      if (messageHandler) {
        messageHandler(data)
      }
    }
  }, [channel, messageHandler])

  const ws = useWebSocket(url, {
    onMessage: handleMessage,
    onOpen: () => {
      console.log(`📡 Subscribing to channel: ${channel}`)
    }
  })

  useEffect(() => {
    if (ws.isConnected) {
      ws.subscribe(channel, filters)
    }

    return () => {
      if (ws.isConnected) {
        ws.unsubscribe(channel)
      }
    }
  }, [ws.isConnected, channel, filters])

  return {
    ...ws,
    messages,
    latestData,
    clearMessages: () => setMessages([])
  }
}

export default useWebSocket
