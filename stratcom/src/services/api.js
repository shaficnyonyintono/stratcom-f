// Centralized API service layer
import { useState, useEffect } from 'react'

class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:8000/api'
    this.timeout = 10000
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      timeout: this.timeout,
      ...options,
    }

    // Add CSRF token if available
    const csrfToken = this.getCsrfToken()
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  getCsrfToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]')?.value
  }

  // Application endpoints
  async submitApplication(data) {
    return this.request('/registration/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getApplications(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/registration/?${queryString}`)
  }

  async updateApplicationStatus(id, status) {
    return this.request(`/registration/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }

  // OTP endpoints
  async sendOTP(phoneNumber) {
    return this.request('/registration/otp/send/', {
      method: 'POST',
      body: JSON.stringify({ phone_number: phoneNumber }),
    })
  }

  async verifyOTP(phoneNumber, code) {
    return this.request('/registration/otp/verify/', {
      method: 'POST',
      body: JSON.stringify({ phone_number: phoneNumber, code }),
    })
  }

  // Analytics endpoints
  async getAnalytics(dateRange) {
    return this.request(`/analytics/?${new URLSearchParams(dateRange)}`)
  }
}

export const apiService = new ApiService()

// React Query hooks for better data fetching
export const useApplications = (params) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const result = await apiService.getApplications(params)
        setData(result)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params])

  return { data, loading, error }
}
