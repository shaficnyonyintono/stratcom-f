import React, { useState, useEffect } from 'react';

/**
 * Notification System Diagnostic Component
 * This component helps debug notification system issues
 */
const NotificationDiagnostic = ({ sessionToken, isAuthenticated }) => {
  const [diagnosticInfo, setDiagnosticInfo] = useState({
    apiTest: null,
    sessionTokenStatus: null,
    authStatus: null,
    corsTest: null,
    lastAPICall: null,
    errorLog: []
  });

  const logError = (error) => {
    setDiagnosticInfo(prev => ({
      ...prev,
      errorLog: [...prev.errorLog.slice(-4), error] // Keep last 5 errors
    }));
  };

  const testAPI = async () => {
    console.log('🔧 Running API diagnostic test...');
    
    try {
      // Test 1: Basic API connection
      const response = await fetch('http://localhost:8000/notifications/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': 'diagnostic_test_123'
        }
      });
      
      const data = await response.json();
      
      setDiagnosticInfo(prev => ({
        ...prev,
        apiTest: {
          status: response.status,
          ok: response.ok,
          data: data,
          timestamp: new Date().toISOString()
        },
        lastAPICall: new Date().toISOString()
      }));
      
      console.log('✅ API Test Result:', {
        status: response.status,
        ok: response.ok,
        notifications: data.notifications?.length || 0,
        unreadCount: data.unread_count || 0
      });
      
    } catch (error) {
      console.error('❌ API Test Failed:', error);
      logError(`API Test: ${error.message}`);
      setDiagnosticInfo(prev => ({
        ...prev,
        apiTest: {
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }));
    }
  };

  const testWithAuth = async () => {
    if (!sessionToken) {
      logError('No session token available');
      return;
    }
    
    try {
      console.log('🔧 Testing with authentication...');
      
      const response = await fetch('http://localhost:8000/notifications/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
          'X-Session-ID': 'diagnostic_auth_test_123'
        }
      });
      
      const data = await response.json();
      
      console.log('✅ Authenticated API Test Result:', {
        status: response.status,
        ok: response.ok,
        notifications: data.notifications?.length || 0,
        unreadCount: data.unread_count || 0
      });
      
    } catch (error) {
      console.error('❌ Authenticated API Test Failed:', error);
      logError(`Auth API Test: ${error.message}`);
    }
  };

  useEffect(() => {
    setDiagnosticInfo(prev => ({
      ...prev,
      sessionTokenStatus: sessionToken ? 'Available' : 'Missing',
      authStatus: isAuthenticated ? 'Authenticated' : 'Not Authenticated'
    }));
  }, [sessionToken, isAuthenticated]);

  const formatJSON = (obj) => {
    return JSON.stringify(obj, null, 2);
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 max-h-96 overflow-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm">🔧 Notification Diagnostic</h3>
        <div className="flex gap-2">
          <button 
            onClick={testAPI}
            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            Test API
          </button>
          <button 
            onClick={testWithAuth}
            disabled={!sessionToken}
            className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            Test Auth
          </button>
        </div>
      </div>
      
      <div className="space-y-2 text-xs">
        <div>
          <strong>Session Token:</strong> 
          <span className={sessionToken ? 'text-green-600' : 'text-red-600'}>
            {' ' + diagnosticInfo.sessionTokenStatus}
          </span>
        </div>
        
        <div>
          <strong>Auth Status:</strong> 
          <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
            {' ' + diagnosticInfo.authStatus}
          </span>
        </div>
        
        {diagnosticInfo.lastAPICall && (
          <div>
            <strong>Last API Call:</strong> {new Date(diagnosticInfo.lastAPICall).toLocaleTimeString()}
          </div>
        )}
        
        {diagnosticInfo.apiTest && (
          <div>
            <strong>API Test Result:</strong>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-20">
              {formatJSON(diagnosticInfo.apiTest)}
            </pre>
          </div>
        )}
        
        {diagnosticInfo.errorLog.length > 0 && (
          <div>
            <strong>Recent Errors:</strong>
            <div className="bg-red-50 p-2 rounded max-h-20 overflow-auto">
              {diagnosticInfo.errorLog.map((error, index) => (
                <div key={index} className="text-red-600 text-xs">{error}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDiagnostic;
