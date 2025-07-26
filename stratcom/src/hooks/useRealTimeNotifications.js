import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { 
  playNewApplicationSound, 
  playStatusChangeSound, 
  showBrowserNotification,
  requestNotificationPermission 
} from '../utils/notificationSounds';

/**
 * Custom hook for real-time notifications in admin dashboard
 * 
 * Features:
 * - Polls for new notifications every 10 seconds
 * - Shows toast notifications for new applications and status changes  
 * - Tracks which notifications have been toasted to prevent duplicates
 * - Plays sounds and shows browser notifications
 * - Optimizes polling based on tab visibility
 * - Provides unread count and notification management
 */
export const useRealTimeNotifications = (sessionToken, isAuthenticated) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    declined: 0,
    today: 0
  });

  const lastCheckRef = useRef(new Date().toISOString());
  const intervalRef = useRef(null);
  const isActiveRef = useRef(true);
  
  // Generate a session ID for tracking delivered notifications
  const sessionIdRef = useRef(
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  
  // Track notifications that have already been toasted to prevent duplicates
  const toastedNotificationsRef = useRef(new Set());

  // API base URL
  const API_BASE = 'http://localhost:8000';

  /**
   * Fetch notifications from the backend
   */
  const fetchNotifications = useCallback(async (showToast = false) => {
    if (!isAuthenticated || !sessionToken) return;

    try {
      setLoading(true);
      
      const response = await fetch(
        `${API_BASE}/notifications/?last_check=${lastCheckRef.current}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`,
            'X-Session-ID': sessionIdRef.current,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();

      // Update state
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
      setStats(data.stats || {});

      // Update last check time
      lastCheckRef.current = data.server_time;

      // Show toast notifications for new unread items (only if not first load)
      if (showToast && data.notifications && data.notifications.length > 0) {
        const newNotifications = data.notifications.filter(n => 
          n.unread && !toastedNotificationsRef.current.has(n.id)
        );
        
        console.log('Processing notifications for toasts:', {
          totalNotifications: data.notifications.length,
          unreadNotifications: data.notifications.filter(n => n.unread).length,
          newNotificationsToToast: newNotifications.length,
          toastedIds: Array.from(toastedNotificationsRef.current)
        });
        
        newNotifications.forEach(notification => {
          // Mark as toasted to prevent duplicate toasts
          toastedNotificationsRef.current.add(notification.id);
          
          console.log('Showing toast for notification:', notification.id, notification.type);
          
          if (notification.type === 'new_application') {
            // Play sound for new applications
            playNewApplicationSound();
            
            // Show browser notification
            showBrowserNotification(
              '🎯 New Application Received',
              `${notification.data.applicant_name} applied for ${notification.data.course}`,
              notification.data
            );
            
            // Show toast
            toast.success(
              `🎯 New Application: ${notification.data.applicant_name}`,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              }
            );
          } else if (notification.type === 'status_change') {
            // Play sound for status changes
            playStatusChangeSound();
            
            // Show browser notification
            const emoji = notification.data.status === 'approved' ? '🎉' : '📋';
            showBrowserNotification(
              `${emoji} Application ${notification.data.status}`,
              `${notification.data.applicant_name}'s application has been ${notification.data.status}`,
              notification.data
            );
            
            // Show toast
            const statusEmoji = notification.data.status === 'approved' ? '🎉' : '📋';
            toast.info(
              `${statusEmoji} ${notification.data.applicant_name} - ${notification.data.status}`,
              {
                position: "top-right",
                autoClose: 4000,
              }
            );
          }
        });
        
        // The notifications will remain unread in the backend until user manually marks them as read
        // This is the correct behavior for a notification system
      }

    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Don't show error toast for polling failures to avoid spam
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, sessionToken]);

  /**
   * Mark specific notifications as read
   */
  const markNotificationsRead = useCallback(async (notificationIds = []) => {
    if (!isAuthenticated || !sessionToken) return;

    try {
      const response = await fetch(`${API_BASE}/notifications/mark-read/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
          'X-Session-ID': sessionIdRef.current,
        },
        body: JSON.stringify({
          notification_ids: notificationIds
        }),
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => 
            notificationIds.length === 0 || notificationIds.includes(notification.id)
              ? { ...notification, unread: false }
              : notification
          )
        );
        
        // Update unread count
        if (notificationIds.length === 0) {
          setUnreadCount(0);
          // Clear all toasted notifications when marking all as read
          toastedNotificationsRef.current.clear();
        } else {
          setUnreadCount(prev => Math.max(0, prev - notificationIds.length));
          // Remove specific notifications from toasted tracking
          notificationIds.forEach(id => toastedNotificationsRef.current.delete(id));
        }

        toast.success('Notifications marked as read');
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  }, [isAuthenticated, sessionToken]);

  /**
   * Mark all notifications as read
   */
  const markAllNotificationsRead = useCallback(() => {
    markNotificationsRead([]);
  }, [markNotificationsRead]);

  /**
   * Initialize notifications (request permissions)
   */
  const initializeNotifications = useCallback(async () => {
    await requestNotificationPermission();
  }, []);

  /**
   * Start/stop real-time polling
   */
  const startPolling = useCallback(() => {
    if (intervalRef.current) return; // Already polling

    // Initial fetch
    fetchNotifications(false);

    // Set up polling interval (every 10 seconds)
    intervalRef.current = setInterval(() => {
      if (isActiveRef.current && isAuthenticated && sessionToken) {
        fetchNotifications(true);
      }
    }, 10000); // 10 seconds
  }, [fetchNotifications, isAuthenticated, sessionToken]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Handle browser tab visibility to optimize polling
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      isActiveRef.current = !document.hidden;
      
      if (isActiveRef.current && isAuthenticated) {
        // Tab became active, fetch latest notifications
        fetchNotifications(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchNotifications, isAuthenticated]);

  /**
   * Start polling when authenticated
   */
  useEffect(() => {
    if (isAuthenticated && sessionToken) {
      // Reset toasted notifications tracking when starting a new session
      toastedNotificationsRef.current.clear();
      startPolling();
    } else {
      stopPolling();
      setNotifications([]);
      setUnreadCount(0);
      // Clear toasted notifications when logging out
      toastedNotificationsRef.current.clear();
    }

    return () => stopPolling();
  }, [isAuthenticated, sessionToken, startPolling, stopPolling]);

  /**
   * Periodic cleanup of old toasted notifications to prevent memory leaks
   */
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      // Keep only recent notifications in the toasted tracking (last 2 hours worth)
      const currentNotificationIds = new Set(
        notifications
          .filter(n => {
            const notificationTime = new Date(n.time);
            const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
            return notificationTime > twoHoursAgo;
          })
          .map(n => n.id)
      );
      
      // Remove old entries from toasted tracking
      const currentToasted = toastedNotificationsRef.current;
      for (const id of currentToasted) {
        if (!currentNotificationIds.has(id)) {
          currentToasted.delete(id);
        }
      }
    }, 5 * 60 * 1000); // Clean up every 5 minutes

    return () => clearInterval(cleanupInterval);
  }, [notifications]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    notifications,
    unreadCount,
    loading,
    stats,
    markNotificationsRead,
    markAllNotificationsRead,
    fetchNotifications: () => fetchNotifications(true),
    startPolling,
    stopPolling,
    initializeNotifications
  };
};
