import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';

/**
 * Custom hook for real-time application updates
 * Provides efficient polling and state management for the admin panel
 */
const useRealTimeApplications = (sessionToken, authStep, userSettings) => {
  const [lastCheckTime, setLastCheckTime] = useState(new Date().toISOString());
  const [applicationCount, setApplicationCount] = useState(0);
  const [isPolling, setIsPolling] = useState(false);
  const [newApplicationsCount, setNewApplicationsCount] = useState(0);
  const [recentApplications, setRecentApplications] = useState([]);
  
  const pollingIntervalRef = useRef(null);
  const countIntervalRef = useRef(null);
  const lastNotificationTimeRef = useRef(0);

  // Get current application count using main endpoint
  const getApplicationCount = useCallback(async () => {
    if (authStep !== 'authenticated' || !sessionToken) {
      return null;
    }

    try {
      const response = await fetch('http://localhost:8000/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get applications');
      }

      const data = await response.json();
      const applications = data.results || data;
      const currentCount = Array.isArray(applications) ? applications.length : 0;
      
      // Check if count has increased
      if (currentCount > applicationCount && applicationCount > 0) {
        const newApps = currentCount - applicationCount;
        console.log(`📈 Application count increased by ${newApps}: ${applicationCount} → ${currentCount}`);
        setNewApplicationsCount(prev => prev + newApps);
        
        // Show notification for count increase
        if (userSettings?.notifications?.applicationUpdates !== false) {
          toast.info(`📊 ${newApps} new application${newApps > 1 ? 's' : ''} detected!`);
        }
      }
      
      setApplicationCount(currentCount);
      return { total_count: currentCount, timestamp: new Date().toISOString() };

    } catch (error) {
      console.error('Error getting application count:', error);
      return null;
    }
  }, [authStep, sessionToken, applicationCount, userSettings]);

  // Check for new applications since last check
  const checkForUpdates = useCallback(async () => {
    if (authStep !== 'authenticated' || !sessionToken) {
      return { hasUpdates: false, newCount: 0 };
    }

    try {
      console.log('🔍 Checking for updates...');
      
      // Use count-based detection as primary method
      const countResult = await getApplicationCount();
      if (countResult && newApplicationsCount > 0) {
        setLastCheckTime(new Date().toISOString());
        return { hasUpdates: true, newCount: newApplicationsCount };
      }

      return { hasUpdates: false, newCount: 0 };

    } catch (error) {
      console.error('Error checking for updates:', error);
      return { hasUpdates: false, newCount: 0, error: error.message };
    }
  }, [authStep, sessionToken, getApplicationCount, newApplicationsCount]);

  // Start real-time polling
  const startPolling = useCallback(() => {
    if (isPolling || authStep !== 'authenticated') {
      return;
    }

    setIsPolling(true);
    
    // Primary polling for new applications - more frequent for better real-time experience
    const pollInterval = (userSettings?.system?.refreshInterval || 15) * 1000; // Default to 15 seconds
    pollingIntervalRef.current = setInterval(checkForUpdates, pollInterval);
    
    // Light polling for count changes (more frequent)
    const countInterval = Math.min(pollInterval / 2, 10000); // Max every 10 seconds
    countIntervalRef.current = setInterval(getApplicationCount, countInterval);
    
    console.log(`🔄 Real-time polling started - Updates every ${pollInterval/1000}s, Count every ${countInterval/1000}s`);
  }, [isPolling, authStep, userSettings, checkForUpdates, getApplicationCount]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    
    if (countIntervalRef.current) {
      clearInterval(countIntervalRef.current);
      countIntervalRef.current = null;
    }
    
    setIsPolling(false);
    console.log('⏹️ Real-time polling stopped');
  }, []);

  // Reset new applications counter
  const markAsViewed = useCallback(() => {
    setNewApplicationsCount(0);
    setRecentApplications([]);
  }, []);

  // Effect to manage polling based on authentication - always start when authenticated
  useEffect(() => {
    if (authStep === 'authenticated') {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [authStep, startPolling, stopPolling]);

  // Adjust polling speed based on settings
  useEffect(() => {
    if (authStep === 'authenticated' && isPolling) {
      // Restart polling with new settings
      stopPolling();
      setTimeout(() => startPolling(), 100); // Small delay to ensure cleanup
    }
  }, [userSettings?.system?.refreshInterval, authStep, isPolling, startPolling, stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  // Update last check time when settings change
  useEffect(() => {
    if (authStep === 'authenticated') {
      setLastCheckTime(new Date().toISOString());
    }
  }, [authStep]);

  return {
    // State
    isPolling,
    newApplicationsCount,
    recentApplications,
    applicationCount,
    lastCheckTime,
    
    // Actions
    checkForUpdates,
    getApplicationCount,
    startPolling,
    stopPolling,
    markAsViewed,
    
    // Manual trigger for immediate refresh
    forceCheck: checkForUpdates
  };
};

export default useRealTimeApplications;
