// Performance optimizations for AdminPanel
import React, { useState, useEffect, useCallback } from 'react'

// Custom hook for debounced search
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Custom hook for optimized API calls
const useOptimizedAPI = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchWithCache = useCallback(async (url, cacheKey) => {
    // Check cache first
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) {
      try {
        return JSON.parse(cached)
      } catch {
        // Invalid cache, continue with fetch
      }
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      const data = await response.json()
      
      // Cache the result for 5 minutes
      sessionStorage.setItem(cacheKey, JSON.stringify(data))
      setTimeout(() => sessionStorage.removeItem(cacheKey), 5 * 60 * 1000)
      
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { fetchWithCache, loading, error }
}

// Memoized table row component
const ApplicationRow = React.memo(({ application, onStatusUpdate }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
      {application.name}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
      {application.email}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
      {application.course}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        application.status === 'approved' ? 'bg-green-100 text-green-800' :
        application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {application.status}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
      {new Date(application.register_date).toLocaleDateString()}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <select 
        value={application.status}
        onChange={(e) => onStatusUpdate(application.id, e.target.value)}
        className="border rounded px-2 py-1 text-sm"
      >
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="declined">Declined</option>
      </select>
    </td>
  </tr>
))

// Virtual scrolling component for large datasets
const VirtualizedApplicationList = ({ applications, onStatusUpdate }) => {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight] = useState(400)
  const itemHeight = 60
  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(startIndex + visibleCount, applications.length)

  const visibleApplications = applications.slice(startIndex, endIndex)

  return (
    <div 
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: applications.length * itemHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${startIndex * itemHeight}px)` }}>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
              {visibleApplications.map((app) => (
                <ApplicationRow 
                  key={app.id} 
                  application={app} 
                  onStatusUpdate={onStatusUpdate}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export { useDebounce, useOptimizedAPI, ApplicationRow, VirtualizedApplicationList }
