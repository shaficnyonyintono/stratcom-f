/**
 * Notification sound utilities for admin dashboard
 */

// Create audio context for notification sounds
let audioContext = null;

// Initialize audio context (needs user interaction first)
export const initializeAudio = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
};

// Play notification sound for new applications
export const playNewApplicationSound = () => {
  try {
    if (!audioContext) initializeAudio();
    
    // Create a short, pleasant notification tone
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Create a pleasant notification sound (C major chord)
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
    
    // Fade in and out
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
  } catch (error) {
    console.log('Audio notification not available:', error);
  }
};

// Play status change sound (more subtle)
export const playStatusChangeSound = () => {
  try {
    if (!audioContext) initializeAudio();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Single tone notification
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
    
  } catch (error) {
    console.log('Audio notification not available:', error);
  }
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

// Show browser notification for new applications
export const showBrowserNotification = (title, message, data = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body: message,
      icon: '/favicon.ico', // You can add a custom icon
      badge: '/favicon.ico',
      tag: 'stratcom-notification',
      data: data,
      requireInteraction: true, // Keep notification visible until user interacts
    });
    
    // Auto-close after 10 seconds
    setTimeout(() => {
      notification.close();
    }, 10000);
    
    return notification;
  }
  return null;
};
