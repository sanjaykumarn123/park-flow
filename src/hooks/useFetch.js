import { useState, useEffect, useCallback, useRef } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export const useFetch = (endpoint, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const optionsRef = useRef(options)
  const hasFetchedRef = useRef(false)

  // Update options ref without causing re-renders
  useEffect(() => {
    optionsRef.current = options
  }, [options])

  const fetchData = useCallback(async (customOptions = {}) => {
    setLoading(true)
    setError(null)

    try {
      const url = `${API_BASE}${endpoint}`
      const fetchOptions = {
        headers: {
          'Content-Type': 'application/json',
          ...optionsRef.current.headers,
          ...customOptions.headers,
        },
        ...optionsRef.current,
        ...customOptions,
      }

      const response = await fetch(url, fetchOptions)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
      return result
    } catch (err) {
      setError(err.message)
      console.error('Fetch error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  useEffect(() => {
    // Only fetch once on mount, not on every render
    if (options.autoFetch !== false && !hasFetchedRef.current) {
      hasFetchedRef.current = true
      fetchData()
    }
  }, [fetchData, options.autoFetch])

  const refetch = useCallback((customOptions) => {
    return fetchData(customOptions)
  }, [fetchData])

  return { data, loading, error, refetch }
}

export const usePost = (endpoint) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const post = useCallback(async (body) => {
    setLoading(true)
    setError(null)

    try {
      const url = `${API_BASE}${endpoint}`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (err) {
      setError(err.message)
      console.error('Post error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  return { post, loading, error }
}

export default useFetch
