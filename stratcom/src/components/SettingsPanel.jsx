import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { applyTheme, saveTheme } from '../utils/themeUtils';

const SettingsPanel = ({ onClose, phoneNumber, email, onSettingsChange }) => {
  // Settings state
  const [activeSection, setActiveSection] = useState('profile');
  const [settings, setSettings] = useState({
    // Profile settings
    profile: {
      displayName: 'Admin User',
      phone: phoneNumber,
      email: email || '',
      timezone: 'Africa/Kampala',
      language: 'en'
    },
    // Notification settings
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      applicationUpdates: true,
      systemAlerts: true,
      weeklyReports: false
    },
    // Security settings
    security: {
      twoFactorAuth: true,
      sessionTimeout: 120, // minutes
      loginAlerts: true,
      deviceTracking: true
    },
    // System preferences
    system: {
      theme: 'light',
      itemsPerPage: 10,
      dateFormat: 'DD/MM/YYYY',
      autoRefresh: true,
      refreshInterval: 30, // seconds
      autoRefreshOnUpdates: true, // Auto refresh list when new applications detected
      realTimeNotifications: true // Show real-time notifications
    }
  });

  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({
          ...prev,
          ...parsedSettings,
          profile: {
            ...prev.profile,
            ...parsedSettings.profile,
            phone: phoneNumber, // Always use current phone
            email: email || parsedSettings.profile?.email || '' // Use current email if available
          }
        }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, [phoneNumber, email]);

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    
    // Notify parent component of settings changes
    if (onSettingsChange) {
      onSettingsChange(settings);
    }
  }, [settings, onSettingsChange]);

  // Validate profile fields
  const validateProfile = (field, value) => {
    const errors = { ...validationErrors };
    
    switch (field) {
      case 'displayName': {
        if (!value.trim()) {
          errors.displayName = 'Display name is required';
        } else if (value.length < 2) {
          errors.displayName = 'Display name must be at least 2 characters';
        } else {
          delete errors.displayName;
        }
        break;
      }
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      }
      case 'phone': {
        const phoneRegex = /^\+?[\d\s\-()]+$/;
        if (!value.trim()) {
          errors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(value)) {
          errors.phone = 'Please enter a valid phone number';
        } else {
          delete errors.phone;
        }
        break;
      }
      default:
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle settings update
  const handleSettingsUpdate = async (section, key, value) => {
    // Validate profile fields
    if (section === 'profile') {
      const isValid = validateProfile(key, value);
      if (!isValid && key !== 'timezone' && key !== 'language') {
        return; // Don't update if validation fails
      }
    }

    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));

    // Show different success messages based on the setting
    const messages = {
      profile: 'Profile updated successfully',
      notifications: 'Notification preferences updated',
      system: 'System preferences updated'
    };

    // Simulate API call
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      toast.success(messages[section] || 'Settings updated successfully');
    } catch {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  // Test notification functionality
  const testNotification = (type) => {
    const messages = {
      email: 'Test email notification sent! Check your inbox.',
      sms: 'Test SMS notification sent! Check your phone.',
      push: 'This is a test push notification!',
      system: 'System alert: This is a test system notification.'
    };

    toast.info(messages[type] || 'Test notification sent!');
  };

  // Apply theme changes using the utility function
  const handleThemeChange = (theme) => {
    console.log('🎛️ SettingsPanel: Changing theme to:', theme);
    
    // Apply theme immediately
    applyTheme(theme);
    
    // Save to localStorage
    saveTheme(theme);
    
    // Update settings state
    setSettings(prev => ({
      ...prev,
      system: {
        ...prev.system,
        theme: theme
      }
    }));
    
    // Call the parent callback if it exists
    if (onSettingsChange) {
      const newSettings = {
        ...settings,
        system: {
          ...settings.system,
          theme: theme
        }
      };
      onSettingsChange(newSettings);
    }
    
    // Show success message with verification
    const messages = {
      dark: '🌙 Dark theme applied successfully!',
      light: '☀️ Light theme applied successfully!', 
      auto: '🔄 Auto theme applied (follows system preference)'
    };
    
    // Show immediate feedback
    toast.success(messages[theme] || 'Theme updated');
    
    // Verify after a short delay
    setTimeout(() => {
      const root = document.documentElement;
      const isThemeActive = theme === 'dark' ? root.classList.contains('dark') : 
                           theme === 'light' ? root.classList.contains('light') : true;
      
      if (isThemeActive) {
        console.log('✅ Theme verification: SUCCESS');
      } else {
        console.log('❌ Theme verification: FAILED');
        toast.warning('Theme may not have applied correctly. Try the debug button.');
      }
    }, 200);
  };

  // Format date according to user preference
  const formatDate = (date, format) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();

    switch (format) {
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'DD/MM/YYYY':
      default:
        return `${day}/${month}/${year}`;
    }
  };

  // Reset settings
  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        profile: {
          displayName: 'Admin User',
          phone: phoneNumber,
          email: email || '',
          timezone: 'Africa/Kampala',
          language: 'en'
        },
        notifications: {
          emailNotifications: true,
          smsNotifications: true,
          pushNotifications: true,
          applicationUpdates: true,
          systemAlerts: true,
          weeklyReports: false
        },
        security: {
          twoFactorAuth: true,
          sessionTimeout: 120,
          loginAlerts: true,
          deviceTracking: true
        },
        system: {
          theme: 'light',
          itemsPerPage: 10,
          dateFormat: 'DD/MM/YYYY',
          autoRefresh: true,
          refreshInterval: 30
        }
      });
      toast.success('Settings reset to default');
    }
  };

  const sections = [
    { id: 'profile', name: 'Profile', icon: 'fas fa-user' },
    { id: 'notifications', name: 'Notifications', icon: 'fas fa-bell' },
    { id: 'security', name: 'Security', icon: 'fas fa-shield-alt' },
    { id: 'system', name: 'System', icon: 'fas fa-cog' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <i className="fas fa-cog text-xl"></i>
              </div>
              <div>
                <h2 className="text-xl font-bold">Settings</h2>
                <p className="text-blue-100 text-sm">Manage your admin preferences</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Sidebar */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 p-4">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <i className={`${section.icon} w-5`}></i>
                  <span className="font-medium">{section.name}</span>
                </button>
              ))}
            </nav>

            {/* Reset Button */}
            <div className="mt-8 pt-4 border-t border-slate-200">
              <button
                onClick={handleResetSettings}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
              >
                <i className="fas fa-undo w-5"></i>
                <span className="font-medium">Reset Settings</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Profile Settings */}
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Profile Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Display Name</label>
                      <input
                        type="text"
                        value={settings.profile.displayName}
                        onChange={(e) => handleSettingsUpdate('profile', 'displayName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          validationErrors.displayName ? 'border-red-300 bg-red-50' : 'border-slate-200'
                        }`}
                      />
                      {validationErrors.displayName && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.displayName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={settings.profile.phone}
                        onChange={(e) => handleSettingsUpdate('profile', 'phone', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          validationErrors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200'
                        }`}
                      />
                      {validationErrors.phone && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => handleSettingsUpdate('profile', 'email', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          validationErrors.email ? 'border-red-300 bg-red-50' : 'border-slate-200'
                        }`}
                      />
                      {validationErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                      <select
                        value={settings.profile.timezone}
                        onChange={(e) => handleSettingsUpdate('profile', 'timezone', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="Africa/Kampala">Africa/Kampala (UTC+3)</option>
                        <option value="UTC">UTC (UTC+0)</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                        <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                        <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                      <select
                        value={settings.profile.language}
                        onChange={(e) => handleSettingsUpdate('profile', 'language', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="sw">Kiswahili</option>
                        <option value="lg">Luganda</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Profile Actions */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                    <h4 className="font-medium text-slate-800 mb-3">Profile Actions</h4>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(settings.profile, null, 2));
                          toast.success('Profile data copied to clipboard');
                        }}
                        className="px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium"
                      >
                        <i className="fas fa-copy mr-2"></i>Export Profile
                      </button>
                      <button
                        onClick={() => {
                          const currentTime = formatDate(new Date(), settings.system.dateFormat);
                          toast.info(`Current date format: ${currentTime}`);
                        }}
                        className="px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium"
                      >
                        <i className="fas fa-calendar mr-2"></i>Preview Date Format
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Notification Preferences</h3>
                  
                  <div className="space-y-4">
                    {Object.entries(settings.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-800 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <p className="text-sm text-slate-500">
                            {key === 'emailNotifications' && 'Receive notifications via email'}
                            {key === 'smsNotifications' && 'Receive notifications via SMS'}
                            {key === 'pushNotifications' && 'Browser push notifications'}
                            {key === 'applicationUpdates' && 'Updates about new applications'}
                            {key === 'systemAlerts' && 'System maintenance and alerts'}
                            {key === 'weeklyReports' && 'Weekly summary reports'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          {/* Test button for main notification types */}
                          {(key === 'emailNotifications' || key === 'smsNotifications' || key === 'pushNotifications') && (
                            <button
                              onClick={() => testNotification(key.replace('Notifications', '').toLowerCase())}
                              disabled={!value}
                              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                                value 
                                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              Test
                            </button>
                          )}
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handleSettingsUpdate('notifications', key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Notification Test Center */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                    <h4 className="font-medium text-slate-800 mb-3">Notification Test Center</h4>
                    <p className="text-sm text-slate-600 mb-3">Test your notification settings to ensure they're working properly.</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => testNotification('system')}
                        className="px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                      >
                        <i className="fas fa-bell mr-2"></i>System Alert
                      </button>
                      <button
                        onClick={() => {
                          const notificationCount = Object.values(settings.notifications).filter(Boolean).length;
                          toast.info(`You have ${notificationCount} notification types enabled`);
                        }}
                        className="px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                      >
                        <i className="fas fa-chart-bar mr-2"></i>Check Status
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Security & Privacy</h3>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-slate-800">Two-Factor Authentication</h4>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.security.twoFactorAuth}
                            onChange={(e) => handleSettingsUpdate('security', 'twoFactorAuth', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                      <p className="text-sm text-slate-500">Add an extra layer of security to your account</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Session Timeout (minutes)</label>
                      <select
                        value={settings.security.sessionTimeout}
                        onChange={(e) => handleSettingsUpdate('security', 'sessionTimeout', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={120}>2 hours</option>
                        <option value={480}>8 hours</option>
                        <option value={1440}>24 hours</option>
                      </select>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-slate-800">Login Alerts</h4>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.security.loginAlerts}
                            onChange={(e) => handleSettingsUpdate('security', 'loginAlerts', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                      <p className="text-sm text-slate-500">Get notified of new login attempts</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeSection === 'system' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">System Preferences</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
                      <select
                        value={settings.system.theme}
                        onChange={(e) => handleThemeChange(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="light">☀️ Light Theme</option>
                        <option value="dark">🌙 Dark Theme</option>
                        <option value="auto">🔄 Auto (System)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Items Per Page</label>
                      <select
                        value={settings.system.itemsPerPage}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          handleSettingsUpdate('system', 'itemsPerPage', value);
                          toast.info(`Display changed to ${value} items per page`);
                        }}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value={5}>5 items</option>
                        <option value={10}>10 items</option>
                        <option value={25}>25 items</option>
                        <option value={50}>50 items</option>
                        <option value={100}>100 items</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Date Format</label>
                      <select
                        value={settings.system.dateFormat}
                        onChange={(e) => {
                          handleSettingsUpdate('system', 'dateFormat', e.target.value);
                          const preview = formatDate(new Date(), e.target.value);
                          toast.info(`Date format changed. Preview: ${preview}`);
                        }}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Auto Refresh Interval</label>
                      <select
                        value={settings.system.refreshInterval}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          handleSettingsUpdate('system', 'refreshInterval', value);
                          if (settings.system.autoRefresh) {
                            toast.info(`Auto refresh interval set to ${value < 60 ? value + ' seconds' : Math.floor(value/60) + ' minute(s)'}`);
                          }
                        }}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={!settings.system.autoRefresh}
                      >
                        <option value={15}>15 seconds</option>
                        <option value={30}>30 seconds</option>
                        <option value={60}>1 minute</option>
                        <option value={300}>5 minutes</option>
                        <option value={600}>10 minutes</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-slate-800">Auto Refresh</h4>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.system.autoRefresh}
                            onChange={(e) => {
                              handleSettingsUpdate('system', 'autoRefresh', e.target.checked);
                              toast.info(`Auto refresh ${e.target.checked ? 'enabled' : 'disabled'}`);
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                      <p className="text-sm text-slate-500">Automatically refresh application data at set intervals</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-slate-800">Auto Refresh on New Applications</h4>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.system.autoRefreshOnUpdates}
                            onChange={(e) => {
                              handleSettingsUpdate('system', 'autoRefreshOnUpdates', e.target.checked);
                              toast.info(`Auto refresh on updates ${e.target.checked ? 'enabled' : 'disabled'}`);
                            }}
                            className="sr-only peer"
                            disabled={!settings.system.autoRefresh}
                          />
                          <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                            settings.system.autoRefresh 
                              ? 'bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 peer-checked:bg-purple-600' 
                              : 'bg-slate-100 cursor-not-allowed'
                          }`}></div>
                        </label>
                      </div>
                      <p className="text-sm text-slate-500">Automatically refresh the application list when new applications are detected</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-slate-800">Real-time Notifications</h4>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.system.realTimeNotifications}
                            onChange={(e) => {
                              handleSettingsUpdate('system', 'realTimeNotifications', e.target.checked);
                              toast.info(`Real-time notifications ${e.target.checked ? 'enabled' : 'disabled'}`);
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                      <p className="text-sm text-slate-500">Show toast notifications when new applications arrive</p>
                    </div>
                  </div>

                  {/* Quick Theme Test */}
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <h5 className="font-medium text-yellow-800 mb-2">Quick Theme Test</h5>
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => handleThemeChange('light')}
                        className="px-3 py-1 bg-white border border-blue-300 text-blue-700 rounded text-sm hover:bg-blue-50"
                      >
                        Test Light
                      </button>
                      <button
                        onClick={() => handleThemeChange('dark')}
                        className="px-3 py-1 bg-white border border-yellow-300 text-yellow-700 rounded text-sm hover:bg-yellow-50"
                      >
                        Test Dark
                      </button>
                      <button
                        onClick={() => {
                          // Debug current theme state
                          const root = document.documentElement;
                          const body = document.body;
                          const computedStyle = getComputedStyle(body);
                          
                          const debugInfo = {
                            rootClasses: root.className,
                            bodyClasses: body.className,
                            bodyBg: computedStyle.backgroundColor,
                            bodyColor: computedStyle.color,
                            cssVarBgPrimary: getComputedStyle(root).getPropertyValue('--bg-primary'),
                            cssVarTextPrimary: getComputedStyle(root).getPropertyValue('--text-primary'),
                            isDarkRoot: root.classList.contains('dark'),
                            isDarkModeBody: body.classList.contains('dark-mode')
                          };
                          
                          console.log('Theme Debug Info:', debugInfo);
                          toast.info(`Root: ${debugInfo.rootClasses} | Body: ${debugInfo.bodyClasses}`, { autoClose: 5000 });
                        }}
                        className="px-3 py-1 bg-white border border-purple-300 text-purple-700 rounded text-sm hover:bg-purple-50"
                      >
                        Debug Theme
                      </button>
                    </div>
                  </div>

                  {/* System Tools */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <h4 className="font-medium text-slate-800 mb-3">System Tools</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          const systemInfo = {
                            userAgent: navigator.userAgent,
                            language: navigator.language,
                            platform: navigator.platform,
                            screenResolution: `${screen.width}x${screen.height}`,
                            timestamp: new Date().toISOString(),
                            settings: settings.system
                          };
                          navigator.clipboard.writeText(JSON.stringify(systemInfo, null, 2));
                          toast.success('System information copied to clipboard');
                        }}
                        className="px-4 py-2 bg-white border border-green-200 text-green-700 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                      >
                        <i className="fas fa-info-circle mr-2"></i>Export System Info
                      </button>
                      <button
                        onClick={() => {
                          localStorage.clear();
                          sessionStorage.clear();
                          toast.success('Browser cache cleared');
                        }}
                        className="px-4 py-2 bg-white border border-green-200 text-green-700 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                      >
                        <i className="fas fa-broom mr-2"></i>Clear Cache
                      </button>
                      <button
                        onClick={() => {
                          const currentTime = new Date().toLocaleString();
                          toast.info(`System time: ${currentTime}`);
                        }}
                        className="px-4 py-2 bg-white border border-green-200 text-green-700 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                      >
                        <i className="fas fa-clock mr-2"></i>Check System Time
                      </button>
                      <button
                        onClick={() => {
                          const used = JSON.stringify(settings).length;
                          const quota = 5 * 1024 * 1024; // 5MB typical localStorage limit
                          const percentUsed = ((used / quota) * 100).toFixed(2);
                          toast.info(`Storage used: ${used} bytes (${percentUsed}% of quota)`);
                        }}
                        className="px-4 py-2 bg-white border border-green-200 text-green-700 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                      >
                        <i className="fas fa-database mr-2"></i>Check Storage
                      </button>
                      <button
                        onClick={() => {
                          const isDark = document.documentElement.classList.contains('dark');
                          const isLight = document.documentElement.classList.contains('light');
                          const bodyBg = document.body.style.backgroundColor;
                          const bodyColor = document.body.style.color;
                          const bgPrimary = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary');
                          
                          const debugInfo = `
Theme Classes: ${isDark ? 'Dark' : ''} ${isLight ? 'Light' : ''} | 
Body BG: ${bodyBg} | 
Body Color: ${bodyColor} | 
CSS Var --bg-primary: ${bgPrimary}
                          `;
                          
                          toast.info(debugInfo, { autoClose: 8000 });
                          console.log('Theme Debug Info:', {
                            isDark,
                            isLight,
                            bodyBg,
                            bodyColor,
                            bgPrimary,
                            allClasses: document.documentElement.className,
                            bodyClasses: document.body.className
                          });
                        }}
                        className="px-4 py-2 bg-white border border-green-200 text-green-700 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
                      >
                        <i className="fas fa-palette mr-2"></i>Debug Theme
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {loading && (
                <span className="flex items-center">
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving changes...
                </span>
              )}
              {!loading && 'Settings are automatically saved'}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
