import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from './components/Navbar'
import Body from './components/Body'
import Footer from './components/Footer'
import Application from './components/Application'
import AdminPanel from './components/AdminPanel';
import './App.css'

function AppContent() {
  const { pathname } = useLocation();
  const isAdminPanel = pathname === '/admin-panel';

  return (
    <>
      <ToastContainer />
      {!isAdminPanel && <Navbar/>}
      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/apply" element={<Application />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Routes>
      {!isAdminPanel && <Footer />}
    </>
  );
}

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: true, // Whether animation should happen only once
      offset: 100, // Offset (in px) from the original trigger point
      easing: 'ease-out-cubic', // Easing function
    });
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App
