import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const WhyChooseStratcom = () => {
  const [activeCard, setActiveCard] = useState(null)

  const advantages = [
    {
      id: 1,
      icon: "fa-graduation-cap",
      title: "Industry-Expert Instructors",
      description: "Learn from seasoned professionals with extensive experience in enterprise technology solutions and software development.",
      details: "Our instructors bring real-world expertise from leading technology companies and have successfully delivered complex projects across various industries.",
      color: "from-blue-600 to-indigo-600",
      bgColor: "from-blue-50 to-indigo-50"
    },
    {
      id: 2,
      icon: "fa-rocket",
      title: "Comprehensive Skill Development",
      description: "Master both technical and professional skills through our structured curriculum designed for career advancement.",
      details: "Our program covers technical excellence, problem-solving, communication, project management, and leadership skills essential for tech professionals.",
      color: "from-green-600 to-emerald-600",
      bgColor: "from-green-50 to-emerald-50"
    },
    {
      id: 3,
      icon: "fa-laptop-code",
      title: "Modern Technology Stack",
      description: "Work with current industry-standard tools, frameworks, and technologies used by leading organizations.",
      details: "Gain hands-on experience with cloud platforms, modern development frameworks, DevOps tools, and enterprise-grade software solutions.",
      color: "from-blue-600 to-cyan-600",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      id: 4,
      icon: "fa-users",
      title: "Collaborative Learning Environment",
      description: "Develop teamwork and communication skills through group projects and peer learning initiatives.",
      details: "Work in small teams on real-world scenarios, participate in code reviews, and learn effective collaboration practices used in professional settings.",
      color: "from-orange-600 to-red-600",
      bgColor: "from-orange-50 to-red-50"
    },
    {
      id: 5,
      icon: "fa-briefcase",
      title: "Practical Project Experience",
      description: "Build a strong portfolio through hands-on projects that demonstrate your capabilities to potential employers.",
      details: "Complete real-world projects, contribute to open-source initiatives, and develop applications that solve actual business problems.",
      color: "from-teal-600 to-cyan-600",
      bgColor: "from-teal-50 to-cyan-50"
    },
    {
      id: 6,
      icon: "fa-certificate",
      title: "Professional Certification Path",
      description: "Earn industry-recognized certifications and credentials that validate your technical expertise.",
      details: "Prepare for and obtain certifications from major technology providers, enhancing your professional credibility and market value.",
      color: "from-blue-600 to-cyan-600",
      bgColor: "from-blue-50 to-cyan-50"
    }
  ]

  const keyStats = [
    { number: "500+", label: "Program Graduates", icon: "fa-users" },
    { number: "85%", label: "Job Placement Rate", icon: "fa-chart-line" },
    { number: "50+", label: "Industry Projects", icon: "fa-project-diagram" },
    { number: "95%", label: "Student Satisfaction", icon: "fa-star" }
  ]

  return (
    <section className="py-4 lg:py-10 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-4 lg:mb-8">
          <div className="inline-flex items-center px-3 py-1.5 lg:px-4 lg:py-2 bg-blue-100 text-blue-800 rounded-full text-xs lg:text-sm font-medium mb-2 lg:mb-4">
            <i className="fas fa-star mr-1 lg:mr-2 text-xs"></i>
            Why Choose StratCom
          </div>
          
          <h2 className="text-2xl md:text-3xl lg:text-6xl font-bold text-slate-900 mb-2 lg:mb-4 leading-tight px-2 lg:px-0">
            Excellence in
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Technology Education
            </span>
          </h2>
          
          <p className="text-sm md:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4 lg:px-0">
            StratCom Communication & Computer Solutions Ltd is committed to delivering world-class 
            technology education and professional development programs that prepare you for success in the digital economy.
          </p>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-6 mb-4 lg:mb-8 px-2 lg:px-0">
          {keyStats.map((stat, index) => (
            <div key={index} className="text-center p-2 lg:p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-1 lg:mb-3">
                <i className={`fas ${stat.icon} text-white text-sm lg:text-lg`}></i>
              </div>
              <div className="text-lg md:text-xl lg:text-3xl font-bold text-slate-900 mb-1 lg:mb-2">{stat.number}</div>
              <div className="text-slate-600 font-medium text-xs lg:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 mb-6 lg:mb-10 px-2 lg:px-0">
          {advantages.map((advantage) => (
            <div
              key={advantage.id}
              className="group relative cursor-pointer"
              onMouseEnter={() => setActiveCard(advantage.id)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="bg-white rounded-xl p-3 lg:p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 group-hover:border-slate-300/50 transform group-hover:-translate-y-2">
                {/* Icon */}
                <div className={`w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-br ${advantage.color} rounded-lg flex items-center justify-center mb-2 lg:mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`fas ${advantage.icon} text-white text-sm lg:text-xl`}></i>
                </div>
                
                {/* Content */}
                <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-1 lg:mb-2 group-hover:text-slate-800 transition-colors">
                  {advantage.title}
                </h3>
                
                <p className="text-sm lg:text-base text-slate-600 leading-relaxed mb-2 lg:mb-3 group-hover:text-slate-700 transition-colors">
                  {advantage.description}
                </p>
                
                {/* Expanded Details */}
                <div className={`overflow-hidden transition-all duration-300 ${
                  activeCard === advantage.id ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="pt-2 lg:pt-3 border-t border-slate-200">
                    <p className="text-xs lg:text-sm text-slate-600 leading-relaxed">
                      {advantage.details}
                    </p>
                  </div>
                </div>

                {/* Hover Indicator */}
                <div className="absolute top-3 lg:top-4 right-3 lg:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`w-2 h-2 bg-gradient-to-br ${advantage.color} rounded-full`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Professional Commitment Statement */}
        <div className="mt-4 lg:mt-8 text-center px-4 lg:px-0">
          <div className="max-w-4xl mx-auto">
            <blockquote className="text-sm md:text-lg lg:text-lg text-slate-600 italic leading-relaxed">
              "At StratCom, we are committed to fostering the next generation of technology leaders through 
              comprehensive education, practical experience, and professional mentorship. Our mission is to 
              bridge the gap between academic learning and industry requirements."
            </blockquote>
            <div className="mt-3 lg:mt-4 text-slate-500 font-medium text-sm lg:text-base">
              — StratCom Leadership Team
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseStratcom
