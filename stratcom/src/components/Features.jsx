import React from 'react'
import { Link } from 'react-router-dom'
import services from '../services.jpg'

const features = [
  { 
    icon: "fa-laptop-code", 
    label: "Hands-On Learning", 
    desc: "Real-world projects with cutting-edge technology stacks and industry-standard tools.",
    color: "from-blue-600 to-cyan-600"
  },
  { 
    icon: "fa-users-gear", 
    label: "Expert Mentorship", 
    desc: "Learn from senior developers and engineers with 10+ years of industry experience.",
    color: "from-blue-600 to-cyan-600"
  },
  { 
    icon: "fa-certificate", 
    label: "Industry Certification", 
    desc: "Earn recognized certifications and build a portfolio that employers value.",
    color: "from-green-600 to-emerald-600"
  },
  { 
    icon: "fa-rocket", 
    label: "Career Acceleration", 
    desc: "Fast-track your career with job placement assistance and interview preparation.",
    color: "from-orange-600 to-red-600"
  },
  { 
    icon: "fa-network-wired", 
    label: "Enterprise Infrastructure", 
    desc: "Work with enterprise-grade servers, networks, and cloud platforms.",
    color: "from-cyan-600 to-blue-600"
  },
  { 
    icon: "fa-clock", 
    label: "Flexible Schedule", 
    desc: "Part-time and full-time options to fit your academic or personal schedule.",
    color: "from-teal-600 to-cyan-600"
  }
]

const Features = () => (
  <section id="features" className="relative bg-white overflow-hidden">
    {/* Background Elements */}
    <div className="absolute inset-0">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-50 to-cyan-50 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
    </div>
    
    <div className="relative z-10 container mx-auto px-4 lg:px-6">
      {/* Section Header */}
      <div className="text-center mb-4 lg:mb-8" data-aos="fade-up">
        <div className="inline-flex items-center px-3 lg:px-4 py-1.5 lg:py-2 bg-blue-100 text-blue-800 rounded-full text-xs lg:text-sm font-semibold mb-2 lg:mb-3">
          <i className="fas fa-star mr-1 lg:mr-2"></i>
          Why Choose Our Program
        </div>
        <h2 className="text-2xl md:text-4xl lg:text-6xl font-black text-slate-900 mb-2 lg:mb-4 leading-tight">
          Premium Features for
          <span className="block bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Future Tech Leaders
          </span>
        </h2>
        <p className="text-sm md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4 lg:px-0">
          Our comprehensive internship program combines theoretical knowledge with practical experience, 
          giving you the competitive edge in today's tech industry.
        </p>
      </div>

      {/* Main Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 mb-6 lg:mb-10">
        {features.map((feature, idx) => (
          <FeatureCard key={idx} {...feature} index={idx} />
        ))}
      </div>

      {/* CTA Section with Image */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-6 md:p-8" data-aos="fade-up" data-aos-delay="200">
        <div className="order-2 lg:order-1" data-aos="fade-right" data-aos-delay="300">
          <h3 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">
            Ready to Transform Your Career?
          </h3>
          <p className="text-slate-300 text-sm lg:text-lg mb-6 lg:mb-8 leading-relaxed">
            Join our elite internship program and gain access to exclusive opportunities, 
            mentorship from industry leaders, and a direct pathway to your dream job in tech.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <div className="text-center p-3 lg:p-4 bg-white/10 backdrop-blur-sm rounded-lg lg:rounded-xl border border-white/20" data-aos="zoom-in" data-aos-delay="400">
              <div className="text-xl lg:text-2xl font-bold text-cyan-400">95%</div>
              <div className="text-slate-300 text-xs lg:text-sm">Job Placement Rate</div>
            </div>
            <div className="text-center p-3 lg:p-4 bg-white/10 backdrop-blur-sm rounded-lg lg:rounded-xl border border-white/20" data-aos="zoom-in" data-aos-delay="500">
              <div className="text-xl lg:text-2xl font-bold text-green-400">2 Months</div>
              <div className="text-slate-300 text-xs lg:text-sm">Average Program</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4" data-aos="fade-up" data-aos-delay="600">
            <Link
              to="/apply"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-lg lg:rounded-xl font-semibold text-sm lg:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Apply Now
              <i className="fas fa-arrow-right ml-2"></i>
            </Link>
            <button className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 px-6 lg:px-8 py-3 lg:py-4 rounded-lg lg:rounded-xl font-semibold text-sm lg:text-lg transition-all duration-300">
              Download Brochure
              <i className="fas fa-download ml-2"></i>
            </button>
          </div>
        </div>
        
        <div className="order-1 lg:order-2 relative" data-aos="fade-left" data-aos-delay="400">
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/20">
              <img 
                src={services} 
                alt="Professional tech workspace" 
                className="rounded-xl w-full h-80 object-cover shadow-xl"
              />
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-cyan-400/20 rounded-full backdrop-blur-sm border border-cyan-400/30 flex items-center justify-center">
              <i className="fas fa-code text-cyan-400 text-xl"></i>
            </div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-400/20 rounded-full backdrop-blur-sm border border-blue-400/30 flex items-center justify-center">
              <i className="fas fa-graduation-cap text-blue-400 text-lg"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)

const FeatureCard = ({ icon, label, desc, color, index }) => (
  <div className="group relative" data-aos="fade-up" data-aos-delay={index * 100}>
    {/* Animated background */}
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 rounded-xl lg:rounded-2xl transition-all duration-500 transform group-hover:scale-105`}></div>
    
    <div className="relative bg-white rounded-xl lg:rounded-2xl p-3 lg:p-5 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 group-hover:border-slate-200 transform group-hover:-translate-y-2">
      {/* Icon */}
      <div className={`w-12 lg:w-16 h-12 lg:h-16 bg-gradient-to-br ${color} rounded-lg lg:rounded-xl flex items-center justify-center mb-2 lg:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <i className={`fas ${icon} text-white text-lg lg:text-2xl`}></i>
      </div>
      
      {/* Content */}
      <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-1 lg:mb-2 group-hover:text-slate-800 transition-colors">
        {label}
      </h3>
      <p className="text-sm lg:text-base text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">
        {desc}
      </p>
      
      {/* Hover indicator */}
      <div className="absolute top-3 lg:top-4 right-3 lg:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className={`w-2 lg:w-3 h-2 lg:h-3 bg-gradient-to-br ${color} rounded-full`}></div>
      </div>
      
      {/* Index number */}
      <div className="absolute -top-2 lg:-top-3 -left-2 lg:-left-3 w-6 lg:w-8 h-6 lg:h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs lg:text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">
        {index + 1}
      </div>
    </div>
  </div>
)

export default Features
