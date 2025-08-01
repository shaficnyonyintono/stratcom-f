import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import image1 from '../stratcom_logo.png'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Helper for active link styling
  const isActive = (path) => location.pathname === path;
  const isAdminPanel = location.pathname === '/admin-panel';

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Company Name */}
          <Link to="/" className="flex items-center space-x-3 group" aria-label="StratCom Technologies homepage">
            <div className="relative">
              <img 
                src={image1} 
                alt="StratCom Technologies logo" 
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover shadow-md group-hover:shadow-lg transition-shadow duration-300" 
              />
              <div className="absolute inset-0 rounded-full bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="block">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                StratCom <span className="text-blue-600">Communications</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                and Computer Solutions
              </p>
              <p className="text-xs text-blue-500 font-medium italic mt-0.5 sm:mt-1">
                "We aspire to inspire"
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {location.pathname === '/application' && (
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive('/') 
                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <i className="fas fa-home mr-2"></i>Home
              </Link>
            )}
            
            {location.pathname === '/' && (
              <>
                <button
                  onClick={() => scrollToSection('about')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
                >
                  <i className="fas fa-info-circle mr-2"></i>About
                </button>
                <button
                  onClick={() => scrollToSection('what-we-offer')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
                >
                  <i className="fas fa-cogs mr-2"></i>Services
                </button>
                <button
                  onClick={() => scrollToSection('features')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
                >
                  <i className="fas fa-star mr-2"></i>Features
                </button>
                <button
                  onClick={() => scrollToSection('testimonials')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200"
                >
                  <i className="fas fa-users mr-2"></i>Testimonials
                </button>
              </>
            )}
            
            {!isAdminPanel && (
              <Link
                to="/apply"
                className={`ml-4 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 transform hover:scale-105 ${
                  isActive('/apply')
                    ? 'bg-blue-700 text-white shadow-lg ring-2 ring-blue-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                }`}
              >
                <i className="fas fa-paper-plane mr-2"></i>Apply Now
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 rounded-lg transition-all duration-200 ${
              menuOpen 
                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 z-50">
            {/* Mobile Menu Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-900">Menu</span>
            </div>
            
            <div className="px-4 py-3 space-y-1">
              {location.pathname === '/application' && (
                <Link
                  to="/"
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                    isActive('/') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <i className="fas fa-home mr-3 w-5"></i>Home
                </Link>
              )}
              
              {location.pathname === '/' && (
                <>
                  <button
                    onClick={() => scrollToSection('about')}
                    className="w-full flex items-center px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <i className="fas fa-info-circle mr-3 w-5"></i>About
                  </button>
                  <button
                    onClick={() => scrollToSection('what-we-offer')}
                    className="w-full flex items-center px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <i className="fas fa-cogs mr-3 w-5"></i>Services
                  </button>
                  <button
                    onClick={() => scrollToSection('features')}
                    className="w-full flex items-center px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <i className="fas fa-star mr-3 w-5"></i>Features
                  </button>
                  <button
                    onClick={() => scrollToSection('testimonials')}
                    className="w-full flex items-center px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <i className="fas fa-users mr-3 w-5"></i>Testimonials
                  </button>
                </>
              )}
              
              {!isAdminPanel && (
                <Link
                  to="/apply"
                  className="flex items-center justify-center mx-4 mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-sm transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <i className="fas fa-paper-plane mr-2"></i>Apply Now
                </Link>
              )}
            </div>
          </div>
      )}
    </nav>
  )
}

export default Navbar
