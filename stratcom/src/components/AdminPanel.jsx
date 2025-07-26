import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { initializeTheme } from '../utils/themeUtils';
import '../utils/forceDarkMode.js'; // Make forceDarkMode available globally
import image1 from '../stratcom_logo.png';

Chart.register(ArcElement, Tooltip, Legend);

const AdminPanel = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Add state for original applications and current filter
  const [originalApplications, setOriginalApplications] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  
  // OTP Authentication State
  const [authStep, setAuthStep] = useState('phone'); // 'phone', 'otp', 'authenticated'
  const [phoneNumber, setPhoneNumber] = useState('+256740432030');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [sessionToken, setSessionToken] = useState(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [maxAttempts] = useState(3);

  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');


  // Filter and Export State
  const [exportLoading, setExportLoading] = useState(false);

  // Auto-refresh state
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Check for existing session on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_session_token');
    if (savedToken) {
      verifyExistingSession(savedToken);
    }

    // Initialize theme using utility function
    initializeTheme();
  }, []);

  // Verify existing session
  const verifyExistingSession = async (token) => {
    try {
      const response = await fetch('http://localhost:8000/otp/admin/verify-session/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_token: token })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.valid) {
          setSessionToken(token);
          setAuthStep('authenticated');
          toast.success('Session restored successfully');
          return;
        }
      }
      
      // Session invalid, remove from storage
      localStorage.removeItem('admin_session_token');
    } catch (error) {
      console.error('Session verification error:', error);
      localStorage.removeItem('admin_session_token');
    }
  };

  // Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setOtpLoading(true);

    try {
      const response = await fetch('http://localhost:8000/otp/admin/request-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone_number: phoneNumber,
          email: email || undefined
        })
      });

      const data = await response.json();

      if (response.ok) {
        setAuthStep('otp');
        toast.success(data.message || 'OTP sent successfully!');
      } else {
        toast.error(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('OTP request error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setOtpLoading(true);

    try {
      const response = await fetch('http://localhost:8000/otp/admin/verify-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone_number: phoneNumber,
          otp_code: otpCode
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSessionToken(data.session.session_token);
        localStorage.setItem('admin_session_token', data.session.session_token);
        setAuthStep('authenticated');
        toast.success('OTP verified successfully!');
      } else {
        setOtpAttempts(prev => prev + 1);
        toast.error(data.error || 'Invalid OTP');
        
        if (otpAttempts >= maxAttempts - 1) {
          setAuthStep('phone');
          setOtpAttempts(0);
          setOtpCode('');
          toast.error('Maximum attempts reached. Please request a new OTP.');
        }
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      if (sessionToken) {
        await fetch('http://localhost:8000/otp/admin/logout/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_token: sessionToken })
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setSessionToken(null);
      localStorage.removeItem('admin_session_token');
      setAuthStep('phone');
      setOtpCode('');
      setOtpAttempts(0);
      toast.success('Logged out successfully');
    }
  };

  // Navigation Handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Scroll to appropriate section
    let targetId = '';
    switch(tab) {
      case 'dashboard':
        targetId = 'dashboard-stats';
        break;
      case 'applications':
        targetId = 'applications-table';
        break;
      case 'analytics':
        targetId = 'application-overview';
        break;
      default:
        break;
    }
    
    // Smooth scroll to the target section
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  // Format date utility
  const formatUserDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const format = 'DD/MM/YYYY'; // Fixed format since settings are removed
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return dateString; // Return original if invalid date
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

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

  // Get current page data
  const getCurrentPageData = () => {
    if (!applications.length) return [];
    
    const itemsPerPage = 10; // Fixed items per page since settings are removed
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return applications.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const getTotalPages = () => {
    const itemsPerPage = 10; // Fixed items per page since settings are removed
    return Math.ceil(applications.length / itemsPerPage);
  };

  // Export functionality
  const handleExport = async () => {
    setExportLoading(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create CSV content
      const csvContent = [
        ['Name', 'Email', 'Phone', 'Course', 'Date of Birth', 'Source', 'Status'],
        ...applications.map(app => [
          app.name,
          app.email,
          app.tel,
          app.course,
          app.date_of_birth,
          app.How_did_you_know_us,
          app.status || 'pending'
        ])
      ].map(row => row.join(',')).join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `applications_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Applications exported successfully!');
    } catch {
      toast.error('Export failed. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  // Filter applications by status
  const filterByStatus = (status) => {
    setCurrentFilter(status);
    if (status === 'all') {
      setApplications(originalApplications);
    } else {
      const filtered = originalApplications.filter(app => (app.status || 'pending') === status);
      setApplications(filtered);
    }
    toast.info(`Filtered by: ${status}`);
  };

  const fetchApplications = useCallback(async (url = null, searchTerm = search) => {
    if (authStep !== 'authenticated') return;
    
    console.log('📡 Fetching applications...', { url, searchTerm });
    setLoading(true);
    try {
      let fetchUrl = url;
      if (!fetchUrl) {
        fetchUrl = searchTerm
          ? `http://localhost:8000/?search=${encodeURIComponent(searchTerm)}`
          : 'http://localhost:8000';
      }
      console.log('🌐 Request URL:', fetchUrl);
      
      const response = await fetch(fetchUrl, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch applications');
      const data = await response.json();
      
      // Handle both paginated and non-paginated responses
      const fetchedApplications = data.results !== undefined ? data.results : data;
      
      console.log('📊 Fetched applications:', fetchedApplications.length, 'applications');
      
      // Store original applications and set current applications
      setOriginalApplications(fetchedApplications);
      setApplications(fetchedApplications);
      setCurrentFilter('all'); // Reset filter when fetching new data
      setLastUpdated(new Date()); // Update timestamp
      
      setNext(data.next || null);
      setPrevious(data.previous || null);
    } catch {
      toast.error('Error fetching applications');
    }
    setLoading(false);
  }, [authStep, sessionToken, search]);

  useEffect(() => { 
    if (authStep === 'authenticated') {
      fetchApplications();
    }
  }, [authStep, sessionToken, fetchApplications]);

  // Simple auto-refresh for applications section (always active when authenticated)
  useEffect(() => {
    if (authStep !== 'authenticated' || activeTab !== 'applications') {
      return;
    }

    console.log('🚀 Starting auto-refresh for applications tab');

    const interval = setInterval(async () => {
      console.log('🔄 Auto-refreshing applications list... (every 10 seconds)');
      setIsAutoRefreshing(true);
      try {
        await fetchApplications();
        console.log('✅ Auto-refresh completed successfully');
      } catch (error) {
        console.error('❌ Auto-refresh failed:', error);
      }
      setTimeout(() => setIsAutoRefreshing(false), 1000); // Show refresh indicator for 1 second
    }, 10000); // Refresh every 10 seconds instead of 15

    return () => {
      console.log('⏹️ Stopping auto-refresh');
      clearInterval(interval);
    };
  }, [authStep, activeTab, fetchApplications]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchApplications(null, search);
  };

  const handlePageChange = (url, page) => {
    setCurrentPage(page);
    fetchApplications(url);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      const response = await fetch(`http://localhost:8000/Application_view/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        toast.error('Failed to delete application');
        return;
      }
      toast.success('Application deleted');
      fetchApplications();
    } catch {
      toast.error('Network error');
    }
  };

  const handleStatus = async (id, status) => {
    // Show immediate feedback
    toast.loading(`Updating application to ${status}...`);
    
    try {
      const response = await fetch(`http://localhost:8000/Application_view/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      // Dismiss loading toast
      toast.dismiss();
      
      if (!response.ok) {
        // Get the error details from the response
        const errorData = await response.text();
        console.error('Status update failed:', response.status, errorData);
        toast.error(`Failed to update status: ${response.status}`);
        return;
      }
      
      const result = await response.json();
      console.log('Status update success:', result);
      
      // Show enhanced feedback with email notification status and timing
      if (result.email_notification === 'sent') {
        toast.success(`Application ${status} ✅ (Email sent successfully!)`, {
          duration: 4000
        });
        // Show helpful timing info
        toast.info(`📧 Email delivery: Check inbox in 2-5 minutes. Also check spam folder.`, {
          duration: 8000,
          position: 'bottom-right'
        });
      } else if (result.email_notification === 'failed') {
        toast.success(`Application ${status} ✅`, {
          duration: 2000
        });
        toast.error(`Email notification failed: ${result.email_error || 'Unknown error'}`, {
          duration: 6000
        });
      } else {
        toast.success(`Application ${status} ✅`);
        // Show delivery info even if we're not sure about email status
        toast.info(`📧 Email notification processing... Check inbox in 2-5 minutes.`, {
          duration: 6000,
          position: 'bottom-right'
        });
      }
      
      // Update local state immediately for instant UI feedback
      setApplications(prev => 
        prev.map(app => 
          app.id === id ? { ...app, status } : app
        )
      );
      
      // Refresh data from server
      fetchApplications();
    } catch (error) {
      toast.dismiss();
      console.error('Network error:', error);
      toast.error('Network error');
    }
  };

  // Calculate summary stats based on original applications (not filtered)
  const total = originalApplications.length;
  const approved = originalApplications.filter(app => app.status === 'approved').length;
  const declined = originalApplications.filter(app => app.status === 'declined').length;
  const pending = total - approved - declined;

  // Calculate current view stats (for display purposes)
  const currentTotal = applications.length;
  const currentApproved = applications.filter(app => app.status === 'approved').length;
  const currentDeclined = applications.filter(app => app.status === 'declined').length;
  const currentPending = currentTotal - currentApproved - currentDeclined;

  const data = {
    labels: ['Approved', 'Declined', 'Pending'],
    datasets: [
      {
        data: [approved, declined, pending],
        backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const options = {
    plugins: {
      legend: { 
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
    },
    cutout: '60%',
    responsive: true,
    maintainAspectRatio: false,
  };

  // Show OTP authentication form if not authenticated
  if (authStep !== 'authenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(156, 163, 175, 0.1) 0%, transparent 50%), 
                             radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`
          }}></div>
        </div>
        
        <div className="relative bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="relative mx-auto mb-4">
              <img 
                src={image1} 
                alt="StratCom Technologies logo" 
                className="h-16 w-16 rounded-full object-cover shadow-lg mx-auto" 
              />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              StratCom Admin
            </h1>
            <p className="text-slate-600 text-sm">Secure Administrative Access</p>
          </div>

          {authStep === 'phone' && (
            <form onSubmit={handleRequestOTP} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">
                  <i className="fas fa-phone mr-2 text-blue-600"></i>
                  Admin Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+256740432030"
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                  <i className="fas fa-envelope mr-2 text-blue-600"></i>
                  Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@stratcom.com"
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800"
                />
              </div>
              
              <button
                type="submit"
                disabled={otpLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3.5 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {otpLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Authentication Code...
                  </span>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Send Verification Code
                  </>
                )}
              </button>
            </form>
          )}

          {authStep === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="text-center mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-mobile-alt text-white text-xl"></i>
                </div>
                <p className="text-sm text-slate-700 font-medium mb-2">
                  Verification code sent via
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
                    <i className="fas fa-sms mr-1"></i>SMS
                  </span>
                  {email && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
                      <i className="fas fa-envelope mr-1"></i>Email
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {phoneNumber.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4')}
                  {email && <><br />{email}</>}
                </p>
                <div className="mt-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-700">
                    <i className="fas fa-clock mr-1"></i>
                    Code expires in 5 minutes
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="otp" className="block text-sm font-semibold text-slate-700 text-center">
                  <i className="fas fa-key mr-2 text-blue-600"></i>
                  Enter 6-Digit Code
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="• • • • • •"
                  className="w-full bg-slate-50 border-2 border-slate-200 px-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-3xl tracking-[0.5em] font-mono font-bold text-slate-800 placeholder:text-slate-300"
                  maxLength={6}
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={otpLoading || otpCode.length !== 6}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {otpLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <i className="fas fa-shield-check mr-2"></i>
                    Verify & Access Admin Panel
                  </>
                )}
              </button>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setAuthStep('phone');
                    setOtpCode('');
                    setOtpAttempts(0);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Change Number
                </button>
                
                {otpAttempts > 0 && (
                  <div className="text-sm text-red-600 font-medium">
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    {maxAttempts - otpAttempts} attempts left
                  </div>
                )}
              </div>
            </form>
          )}
          
          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500">
              <i className="fas fa-lock mr-1"></i>
              Secured by enterprise-grade encryption
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Professional Navigation Header */}
      <nav className="bg-white border-b border-slate-200 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative">
                  <img 
                    src={image1} 
                    alt="StratCom Technologies logo" 
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover shadow-md" 
                  />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    StratCom Admin
                  </h1>
                  <p className="text-xs text-slate-500 font-medium hidden sm:block">Management Portal</p>
                </div>
              </div>
            </div>

            {/* Navigation Links - Hidden on mobile, shown in mobile menu */}
            <div className="hidden md:flex items-center space-x-1">
              <button 
                onClick={() => handleTabChange('dashboard')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl border font-medium text-sm transition-all duration-200 ${
                  activeTab === 'dashboard' 
                    ? 'text-blue-600 bg-blue-50 border-blue-200' 
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50 border-transparent hover:border-blue-200'
                }`}
              >
                <i className="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </button>
              <button 
                onClick={() => handleTabChange('applications')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl border font-medium text-sm transition-all duration-200 ${
                  activeTab === 'applications' 
                    ? 'text-blue-600 bg-blue-50 border-blue-200' 
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50 border-transparent hover:border-blue-200'
                }`}
              >
                <i className="fas fa-users"></i>
                <span>Applications</span>
              </button>
              <button 
                onClick={() => handleTabChange('analytics')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl border font-medium text-sm transition-all duration-200 ${
                  activeTab === 'analytics' 
                    ? 'text-blue-600 bg-blue-50 border-blue-200' 
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50 border-transparent hover:border-blue-200'
                }`}
              >
                <i className="fas fa-chart-bar"></i>
                <span>Analytics</span>
              </button>
            </div>
            
            {/* Right Side: User Profile, Logout */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* User Profile Display - More compact on mobile */}
              <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-200">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                  <i className="fas fa-user text-white text-xs sm:text-sm"></i>
                </div>
                <div className="text-xs sm:text-sm hidden sm:block">
                  <p className="font-semibold text-slate-700">Admin User</p>
                  <p className="text-slate-500 text-xs">{phoneNumber.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4')}</p>
                </div>
              </div>
              
              {/* Quick Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg sm:rounded-xl border border-red-200 hover:border-red-300 transition-all duration-200 font-medium text-xs sm:text-sm shadow-sm hover:shadow-md"
              >
                <i className="fas fa-sign-out-alt text-xs sm:text-sm"></i>
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="md:hidden border-t border-slate-200 bg-slate-50">
          <div className="px-4 sm:px-6 py-2 sm:py-3 space-y-1">
            <button 
              onClick={() => handleTabChange('dashboard')}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeTab === 'dashboard' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <i className="fas fa-tachometer-alt w-4 text-center"></i>
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => handleTabChange('applications')}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeTab === 'applications' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <i className="fas fa-users w-4 text-center"></i>
              <span>Applications</span>
            </button>
            <button 
              onClick={() => handleTabChange('analytics')}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeTab === 'analytics' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <i className="fas fa-chart-bar w-4 text-center"></i>
              <span>Analytics</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <i className="fas fa-home text-slate-400"></i>
            <span className="text-slate-600">Dashboard</span>
            <i className="fas fa-chevron-right text-slate-300 text-xs"></i>
            <span className="text-blue-600 font-medium">Applications</span>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">Application Management</h1>
              <p className="text-sm sm:text-base text-slate-600">Monitor and manage student applications efficiently</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <button 
                onClick={handleExport}
                disabled={exportLoading}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-lg sm:rounded-xl transition-all duration-200 font-medium text-sm shadow-sm disabled:opacity-50"
              >
                {exportLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-download"></i>
                    <span>Export</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Dashboard Stats */}
        <div id="dashboard-stats" className="mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Total Applications Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">
                    {currentFilter === 'all' ? 'Total Applications' : `${currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)} Applications`}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
                    {currentFilter === 'all' ? total : applications.length}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
                  <i className="fas fa-users text-blue-600 text-lg sm:text-xl"></i>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
                <span className="text-slate-500 truncate">
                  {currentFilter === 'all' ? 'All submitted applications' : `Showing filtered results`}
                </span>
              </div>
            </div>

            {/* Approved Applications Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-600">Approved</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">
                    {currentFilter === 'all' ? approved : currentApproved}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
                  <i className="fas fa-check-circle text-green-600 text-lg sm:text-xl"></i>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
                <span className="text-green-600">
                  {total > 0 ? Math.round((approved / total) * 100) : 0}% of total
                </span>
              </div>
            </div>

            {/* Pending Applications Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-600">Pending</p>
                  <p className="text-2xl sm:text-3xl font-bold text-amber-600 mt-1">
                    {currentFilter === 'all' ? pending : currentPending}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
                  <i className="fas fa-clock text-amber-600 text-lg sm:text-xl"></i>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
                <span className="text-amber-600">Awaiting review</span>
              </div>
            </div>

            {/* Declined Applications Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-600">Declined</p>
                  <p className="text-2xl sm:text-3xl font-bold text-red-600 mt-1">
                    {currentFilter === 'all' ? declined : currentDeclined}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
                  <i className="fas fa-times-circle text-red-600 text-lg sm:text-xl"></i>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
                <span className="text-red-600">
                  {total > 0 ? Math.round((declined / total) * 100) : 0}% of total
                </span>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div id="application-overview" className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-800">Application Overview</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {currentFilter === 'all' 
                    ? 'Distribution of all application statuses' 
                    : `Showing overview for all applications (Chart always shows total distribution)`
                  }
                </p>
              </div>
              {currentFilter !== 'all' && (
                <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 sm:px-3 sm:py-1 rounded-full border border-blue-200 self-start sm:self-auto">
                  <i className="fas fa-info-circle mr-1"></i>
                  Chart shows total data, table shows filtered results
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <div className="w-32 h-32 sm:w-48 sm:h-48">
                <Doughnut data={data} options={options} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm mb-4 sm:mb-6">
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-slate-400 text-sm"></i>
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search applications..."
                  className="block w-full pl-10 pr-12 py-3 border border-slate-200 rounded-lg sm:rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 placeholder-slate-400 text-sm"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 hover:bg-blue-700 rounded-md sm:rounded-lg flex items-center justify-center transition-colors">
                    <i className="fas fa-search text-white text-xs sm:text-sm"></i>
                  </div>
                </button>
              </form>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                <i className="fas fa-filter"></i>
                <span className="font-medium">Quick filters:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => filterByStatus('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium text-xs sm:text-sm ${
                    currentFilter === 'all' 
                      ? 'bg-slate-200 text-slate-800' 
                      : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                <button 
                  onClick={() => filterByStatus('approved')}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium text-xs sm:text-sm ${
                    currentFilter === 'approved' 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-green-50 hover:bg-green-100 text-green-600'
                  }`}
                >
                  Approved
                </button>
                <button 
                  onClick={() => filterByStatus('pending')}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium text-xs sm:text-sm ${
                    currentFilter === 'pending' 
                      ? 'bg-amber-200 text-amber-800' 
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                  }`}
                >
                  Pending
                </button>
                <button 
                  onClick={() => filterByStatus('declined')}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium text-xs sm:text-sm ${
                    currentFilter === 'declined' 
                      ? 'bg-red-200 text-red-800' 
                      : 'bg-red-50 hover:bg-red-100 text-red-600'
                  }`}
                >
                  Declined
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div id="applications-table" className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-800">Applications</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage and review submitted applications</p>
              </div>
              {authStep === 'authenticated' && activeTab === 'applications' && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <div className={`w-2 h-2 rounded-full ${isAutoRefreshing ? 'bg-blue-500 animate-ping' : 'bg-green-400 animate-pulse'}`}></div>
                    <span className="text-slate-600">
                      {isAutoRefreshing ? 'Refreshing...' : 'Auto-refreshing every 10s'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 hidden sm:block">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </div>
                  <button
                    onClick={async () => {
                      console.log('🔄 Manual refresh triggered');
                      setIsAutoRefreshing(true);
                      await fetchApplications();
                      setTimeout(() => setIsAutoRefreshing(false), 1000);
                    }}
                    disabled={loading || isAutoRefreshing}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-colors"
                  >
                    <i className={`fas fa-sync-alt text-xs ${loading || isAutoRefreshing ? 'animate-spin' : ''}`}></i>
                    <span className="hidden sm:inline">{isAutoRefreshing ? 'Refreshing' : 'Refresh'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3 text-slate-500">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading applications...</span>
              </div>
            </div>
          ) : applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-inbox text-slate-400 text-2xl"></i>
              </div>
              <h4 className="text-lg font-medium text-slate-800 mb-2">No applications found</h4>
              <p className="text-slate-500 text-center max-w-sm">
                {search ? 'Try adjusting your search criteria' : 'Applications will appear here once submitted'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Applicant</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Course</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">Date of Birth</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">Source</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {getCurrentPageData().map((app, idx) => (
                      <tr key={app.id || idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-xs sm:text-sm">
                                {app.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                              </span>
                            </div>
                            <div className="ml-2 sm:ml-4">
                              <div className="text-xs sm:text-sm font-medium text-slate-900 truncate max-w-[120px] sm:max-w-none">{app.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm text-slate-900 truncate max-w-[120px] sm:max-w-none">{app.email}</div>
                          <div className="text-xs sm:text-sm text-slate-500">{app.tel}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {app.course}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-slate-500 hidden sm:table-cell">
                          {formatUserDate(app.date_of_birth)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-slate-500 hidden lg:table-cell">
                          <div className="truncate max-w-[100px]">{app.How_did_you_know_us}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            app.status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : app.status === 'declined'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            <i className={`mr-1 fas ${
                              app.status === 'approved' 
                                ? 'fa-check-circle' 
                                : app.status === 'declined'
                                ? 'fa-times-circle'
                                : 'fa-clock'
                            }`}></i>
                            <span className="hidden sm:inline">{app.status || 'pending'}</span>
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                            <button
                              onClick={() => handleStatus(app.id, 'approved')}
                              disabled={app.status === 'approved'}
                              className={`inline-flex items-center justify-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-xs font-medium transition-all ${
                                app.status === 'approved'
                                  ? 'bg-green-100 text-green-800 cursor-not-allowed'
                                  : 'bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700'
                              }`}
                            >
                              <i className="fas fa-check mr-1"></i>
                              <span className="hidden sm:inline">{app.status === 'approved' ? 'Approved' : 'Approve'}</span>
                            </button>
                            <button
                              onClick={() => handleStatus(app.id, 'declined')}
                              disabled={app.status === 'declined'}
                              className={`inline-flex items-center justify-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-xs font-medium transition-all ${
                                app.status === 'declined'
                                  ? 'bg-red-100 text-red-800 cursor-not-allowed'
                                  : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700'
                              }`}
                            >
                              <i className="fas fa-times mr-1"></i>
                              <span className="hidden sm:inline">{app.status === 'declined' ? 'Declined' : 'Decline'}</span>
                            </button>
                            <button
                              onClick={() => handleDelete(app.id)}
                              className="inline-flex items-center justify-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-xs font-medium bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-700 transition-all"
                            >
                              <i className="fas fa-trash mr-1"></i>
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {(next || previous) && (
                <div className="bg-white px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => handlePageChange(previous, currentPage - 1)}
                        disabled={!previous}
                        className={`relative inline-flex items-center px-3 sm:px-4 py-2 border text-xs sm:text-sm font-medium rounded-md ${
                          previous
                            ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                            : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(next, currentPage + 1)}
                        disabled={!next}
                        className={`ml-3 relative inline-flex items-center px-3 sm:px-4 py-2 border text-xs sm:text-sm font-medium rounded-md ${
                          next
                            ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                            : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-slate-700">
                          Showing <span className="font-medium">{Math.min(getCurrentPageData().length, 10)}</span> of{' '}
                          <span className="font-medium">{applications.length}</span> results
                          <span className="text-slate-500"> (10 per page)</span>
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage <= 1}
                            className={`relative inline-flex items-center px-3 py-2 rounded-l-md border text-sm font-medium ${
                              currentPage > 1
                                ? 'border-slate-300 bg-white text-slate-500 hover:bg-slate-50'
                                : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            <i className="fas fa-chevron-left"></i>
                          </button>
                          <span className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-700">
                            {currentPage} of {getTotalPages()}
                          </span>
                          <button
                            onClick={() => setCurrentPage(Math.min(getTotalPages(), currentPage + 1))}
                            disabled={currentPage >= getTotalPages()}
                            className={`relative inline-flex items-center px-3 py-2 rounded-r-md border text-sm font-medium ${
                              currentPage < getTotalPages()
                                ? 'border-slate-300 bg-white text-slate-500 hover:bg-slate-50'
                                : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            <i className="fas fa-chevron-right"></i>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;