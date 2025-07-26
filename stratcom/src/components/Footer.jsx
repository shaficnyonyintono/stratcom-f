import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-cyan-600/5 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>
      
      {/* Main Footer Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-6 pt-8 lg:pt-16 pb-6 lg:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">
                Stratcom Communications & Computer Solutions Ltd
              </h3>
              <p className="text-slate-300 leading-relaxed mb-6 text-sm lg:text-base">
                 We Aspire To Inspire
              </p>
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-slate-800 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
                aria-label="Twitter"
              >
                <i className="fab fa-x-twitter text-sm" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-slate-800 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook text-sm" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-slate-800 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-green-600 transition-all duration-300 transform hover:scale-110"
                aria-label="WhatsApp"
              >
                <i className="fab fa-whatsapp text-sm" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-slate-800 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin text-sm" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base lg:text-lg font-semibold text-white mb-4 lg:mb-6 relative">
              Quick Links
              <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 mt-2"></div>
            </h4>
            <ul className="space-y-2 lg:space-y-3">
              <li>
                <Link to="/" className="text-slate-300 hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <i className="fas fa-home mr-2 text-xs group-hover:text-blue-400"></i>
                  Home
                </Link>
              </li>
              <li>
                <a href="#about" className="text-slate-300 hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <i className="fas fa-info-circle mr-2 text-xs group-hover:text-blue-400"></i>
                  About Us
                </a>
              </li>
              <li>
                <a href="#features" className="text-slate-300 hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <i className="fas fa-star mr-2 text-xs group-hover:text-blue-400"></i>
                  Features
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-slate-300 hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <i className="fas fa-quote-left mr-2 text-xs group-hover:text-blue-400"></i>
                  Testimonials
                </a>
              </li>
              <li>
                <Link to="/apply" className="text-slate-300 hover:text-blue-400 transition-colors duration-200 flex items-center group">
                  <i className="fas fa-file-alt mr-2 text-xs group-hover:text-blue-400"></i>
                  Apply Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base lg:text-lg font-semibold text-white mb-4 lg:mb-6 relative">
              Get in Touch
              <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 mt-2"></div>
            </h4>
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-start space-x-3 group">
                <div className="w-8 h-8 bg-slate-800 dark:bg-slate-700 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-blue-600 transition-colors duration-300">
                  <i className="fas fa-envelope text-slate-400 text-sm group-hover:text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Email</p>
                  <a href="mailto:stuartmcse@gmail.com" className="text-slate-200 hover:text-blue-400 transition-colors duration-200">
                    stuartmcse@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 group">
                <div className="w-8 h-8 bg-slate-800 dark:bg-slate-700 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-green-600 transition-colors duration-300">
                  <i className="fas fa-phone text-slate-400 text-sm group-hover:text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Phone</p>
                  <a href="tel:+256752373023" className="text-slate-200 hover:text-blue-400 transition-colors duration-200">
                    +256 752373023
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 group">
                <div className="w-8 h-8 bg-slate-800 dark:bg-slate-700 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-red-600 transition-colors duration-300">
                  <i className="fas fa-map-marker-alt text-slate-400 text-sm group-hover:text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Location</p>
                  <p className="text-slate-200">Bombo Rd,Makerere Kavule Kampala, Uganda</p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6 relative">
              Stay Updated
              <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 mt-2"></div>
            </h4>
            <p className="text-slate-300 mb-4 text-sm leading-relaxed">
              Subscribe to our newsletter for the latest updates, tech insights, and exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-slate-800 dark:bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <i className="fas fa-envelope text-slate-400 text-sm"></i>
                </div>
              </div>
              <button
                type="submit"
                disabled={subscribed}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-green-600 disabled:to-green-600 px-4 py-3 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                {subscribed ? (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-check mr-2"></i>
                    Subscribed!
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-paper-plane mr-2"></i>
                    Subscribe
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-slate-700 dark:border-slate-600">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <p className="text-slate-400 text-sm">
                &copy; {new Date().getFullYear()} Stratcom Communication & Computer Solutions Ltd. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors duration-200">
                Privacy Policy
              </a>
              <span className="text-slate-600">•</span>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors duration-200">
                Terms of Service
              </a>
              <span className="text-slate-600">•</span>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
          
          {/* Back to Top Button */}
          <div className="mt-6 text-center">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center space-x-2 text-slate-400 hover:text-blue-400 transition-colors duration-200 group"
            >
              <span className="text-sm">Back to top</span>
              <i className="fas fa-chevron-up text-xs group-hover:transform group-hover:-translate-y-1 transition-transform duration-200"></i>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
