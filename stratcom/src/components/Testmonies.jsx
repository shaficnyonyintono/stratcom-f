import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Testmonies = ({ data }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // Auto-rotate testimonials
  useEffect(() => {
    if (!data || data.length <= 1) return

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % data.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [data])

  if (!data || data.length === 0) return null

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % data.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + data.length) % data.length)
  }

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index)
  }

  return (
    <section id="testimonials" className="py-8 lg:py-16 bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-200 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-100 opacity-10 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 lg:mb-12" data-aos="fade-up">
          <div className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mb-4 lg:mb-6 shadow-lg transform hover:scale-105 transition-transform duration-200">
            <i className="fas fa-quote-left text-white text-lg lg:text-xl"></i>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-blue-600 bg-clip-text text-transparent mb-3 lg:mb-4 px-2 lg:px-0">
            What Our Clients Say
          </h2>
          <p className="text-slate-600 text-sm md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed px-4 lg:px-0">
            Don't just take our word for it. Here's what our interns and partners have to say about their experience with StratCom Technologies.
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="max-w-4xl mx-auto mb-8 lg:mb-12 px-2 lg:px-0" data-aos="fade-up" data-aos-delay="200">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 relative transform hover:scale-[1.01] transition-all duration-300">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-500/5 pointer-events-none rounded-3xl"></div>
            
            <div className="relative z-10 p-6 md:p-8 lg:p-12">
              {/* Quote Icon */}
              <div className="flex justify-center mb-4 lg:mb-6">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-3 transition-transform duration-200">
                  <i className="fas fa-quote-left text-blue-600 text-lg lg:text-2xl"></i>
                </div>
              </div>

              {/* Testimonial Content */}
              <div className="text-center">
                <p className="text-base md:text-lg lg:text-2xl text-slate-700 leading-relaxed mb-6 lg:mb-8 font-medium italic max-w-3xl mx-auto">
                  "{data[currentTestimonial].message}"
                </p>

                {/* User Info */}
                <div className="flex flex-col items-center">
                  {/* Avatar */}
                  <div className="mb-3 lg:mb-4">
                    {data[currentTestimonial].avatar ? (
                      <img 
                        src={data[currentTestimonial].avatar} 
                        alt={data[currentTestimonial].user} 
                        className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl object-cover border-4 border-white shadow-lg transform hover:scale-110 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg lg:text-xl font-bold shadow-lg transform hover:scale-110 transition-transform duration-200">
                        {data[currentTestimonial].user.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>

                  {/* User Details */}
                  <h4 className="text-lg lg:text-xl font-bold text-slate-800 mb-1 lg:mb-2">
                    {data[currentTestimonial].user}
                  </h4>
                  <p className="text-slate-500 text-xs lg:text-sm bg-slate-100 px-3 py-1 rounded-full">
                    {data[currentTestimonial].role || 'StratCom Graduate'}
                  </p>

                  {/* Star Rating */}
                  <div className="flex items-center mt-3 lg:mt-4 space-x-1 bg-yellow-50 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star text-yellow-400 text-xs lg:text-sm"></i>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center mt-6 lg:mt-8 space-x-3 lg:space-x-4">
            {/* Previous Button */}
            <button
              onClick={prevTestimonial}
              className="w-10 h-10 lg:w-12 lg:h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
              aria-label="Previous testimonial"
            >
              <i className="fas fa-chevron-left text-sm"></i>
            </button>

            {/* Dots Indicator */}
            <div className="flex space-x-1.5 lg:space-x-2 bg-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-full shadow-lg border border-slate-200">
              {data.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full transition-all duration-200 transform hover:scale-125 ${
                    index === currentTestimonial
                      ? 'bg-blue-600 shadow-lg'
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextTestimonial}
              className="w-10 h-10 lg:w-12 lg:h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
              aria-label="Next testimonial"
            >
              <i className="fas fa-chevron-right text-sm"></i>
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8 lg:mt-12 px-2 lg:px-0">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-6 lg:p-8 shadow-2xl transform hover:scale-[1.01] transition-all duration-300 border border-blue-500/20 max-w-3xl mx-auto">
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 lg:mb-4">
              Ready to Join Our Success Stories?
            </h3>
            <p className="text-blue-100 mb-4 lg:mb-6 max-w-2xl mx-auto text-sm lg:text-base">
              Start your journey with StratCom Technologies and become our next success story.
            </p>
            <Link 
              to="/apply" 
              className="inline-block bg-white text-blue-600 px-6 lg:px-8 py-2.5 lg:py-3 rounded-2xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 text-sm lg:text-base"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>Apply Now</span>
                <i className="fas fa-arrow-right text-xs lg:text-sm"></i>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testmonies
