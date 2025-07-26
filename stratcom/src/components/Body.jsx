import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ImageSlider from './ImageSlider'
import About from './About'
import Features from './Features'
import WhyChooseStratcom from './WhyChooseStratcom'

// Modern Hero Section with Professional Design
const Hero = () => (
  <section className="relative h-[65vh] pt-[40px] lg:pt-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
    {/* Animated Background Elements */}
    <div className="absolute inset-0">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-full blur-3xl"></div>
    </div>
    
    {/* Grid Pattern Overlay */}
    <div className="absolute inset-0 opacity-20">
      <div className="w-full h-full" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
    </div>
    
    <div className="relative z-10 container mx-auto px-4 lg:px-6 py-4 lg:py-8 flex flex-col items-center justify-center h-full text-center">
      {/* Main Heading */}
      <div className="mb-1 lg:mb-2" data-aos="fade-up" data-aos-delay="100">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-black text-white mb-1 lg:mb-2 leading-tight">
          Launch Your
          <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Tech Career
          </span>
        </h1>
        <p className="text-sm md:text-lg lg:text-xl text-slate-300 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed">
          Join StratCom's elite internship program. Work with cutting-edge technology, 
          learn from industry experts, and build the skills that matter in today's digital world.
        </p>
      </div>
      
      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 lg:gap-4 mb-2 lg:mb-6 w-full max-w-4xl" data-aos="fade-up" data-aos-delay="300">
        <div className="text-center p-1.5 lg:p-3 bg-white/10 backdrop-blur-sm rounded-lg lg:rounded-xl border border-white/20" data-aos="zoom-in" data-aos-delay="400">
          <div className="text-base lg:text-2xl font-bold text-cyan-400">100+</div>
          <div className="text-slate-300 text-xs">Projects</div>
        </div>
        <div className="text-center p-1.5 lg:p-3 bg-white/10 backdrop-blur-sm rounded-lg lg:rounded-xl border border-white/20" data-aos="zoom-in" data-aos-delay="500">
          <div className="text-base lg:text-2xl font-bold text-blue-400">500+</div>
          <div className="text-slate-300 text-xs">Interns</div>
        </div>
        <div className="text-center p-1.5 lg:p-3 bg-white/10 backdrop-blur-sm rounded-lg lg:rounded-xl border border-white/20" data-aos="zoom-in" data-aos-delay="600">
          <div className="text-base lg:text-2xl font-bold text-blue-400">24/7</div>
          <div className="text-slate-300 text-xs">Support</div>
        </div>
        <div className="text-center p-1.5 lg:p-3 bg-white/10 backdrop-blur-sm rounded-lg lg:rounded-xl border border-white/20" data-aos="zoom-in" data-aos-delay="700">
          <div className="text-base lg:text-2xl font-bold text-green-400">100%</div>
          <div className="text-slate-300 text-xs">Ready</div>
        </div>
      </div>
      
      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-1 lg:gap-3 mb-0 lg:mb-4 px-2" data-aos="fade-up" data-aos-delay="800">
        <Link
          to="/apply"
          className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-2 lg:px-6 py-1 lg:py-3 rounded-md lg:rounded-xl font-medium lg:font-semibold text-xs lg:text-base shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/25"
        >
          Start Journey
          <i className="fas fa-arrow-right ml-1 lg:ml-2 group-hover:translate-x-1 transition-transform text-xs lg:text-sm"></i>
        </Link>
        <button className="bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20 px-2 lg:px-6 py-1 lg:py-3 rounded-md lg:rounded-xl font-medium lg:font-semibold text-xs lg:text-base transition-all duration-300">
          Learn More
          <i className="fas fa-play ml-1 lg:ml-2 text-xs lg:text-sm"></i>
        </button>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-2 lg:bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-4 lg:w-5 h-6 lg:h-8 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-1 lg:h-2 bg-white/60 rounded-full mt-1 animate-pulse"></div>
        </div>
      </div>
    </div>
  </section>
)

// Services Overview Section
const ServicesOverview = () => (
  <section id="what-we-offer" className="py-4 lg:py-6 bg-white">
    <div className="container mx-auto px-4 lg:px-6">
      <div className="text-center mb-4 lg:mb-6" data-aos="fade-up">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-1 lg:mb-2">
          What We <span className="text-blue-600">Offer</span>
        </h2>
        <p className="text-sm md:text-xl text-slate-600 max-w-3xl mx-auto px-2 lg:px-0">
          Comprehensive IT solutions and training programs designed to accelerate your career growth
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
        <div className="group p-3 lg:p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl lg:rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2" data-aos="fade-up" data-aos-delay="100">
          <div className="w-10 h-10 lg:w-16 lg:h-16 bg-blue-600 rounded-lg lg:rounded-xl flex items-center justify-center mb-2 lg:mb-4 group-hover:scale-110 transition-transform">
            <i className="fas fa-code text-white text-sm lg:text-2xl"></i>
          </div>
          <h3 className="text-lg lg:text-2xl font-bold text-slate-900 mb-1 lg:mb-2">Web Development</h3>
          <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
            Master modern web technologies including React, Node.js, and cloud deployment strategies.
          </p>
        </div>
        
        <div className="group p-3 lg:p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl lg:rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2" data-aos="fade-up" data-aos-delay="200">
          <div className="w-10 h-10 lg:w-16 lg:h-16 bg-blue-600 rounded-lg lg:rounded-xl flex items-center justify-center mb-2 lg:mb-4 group-hover:scale-110 transition-transform">
            <i className="fas fa-network-wired text-white text-sm lg:text-2xl"></i>
          </div>
          <h3 className="text-lg lg:text-2xl font-bold text-slate-900 mb-1 lg:mb-2">Network Engineering</h3>
          <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
            Learn routing, switching, and network security with hands-on enterprise equipment.
          </p>
        </div>
        
        <div className="group p-3 lg:p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl lg:rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2" data-aos="fade-up" data-aos-delay="300">
          <div className="w-10 h-10 lg:w-16 lg:h-16 bg-green-600 rounded-lg lg:rounded-xl flex items-center justify-center mb-2 lg:mb-4 group-hover:scale-110 transition-transform">
            <i className="fas fa-mobile-alt text-white text-sm lg:text-2xl"></i>
          </div>
          <h3 className="text-lg lg:text-2xl font-bold text-slate-900 mb-1 lg:mb-2">Mobile Development</h3>
          <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
            Build native and cross-platform mobile applications for iOS and Android platforms.
          </p>
        </div>
      </div>
    </div>
  </section>
)

// Testimonial Carousel Component
const TestimonialCarousel = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
  };

  // Auto-rotation effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Main Testimonial Display */}
      <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-100">
        <div className="text-center">
          <div className="mb-4">
            <i className="fas fa-quote-left text-3xl text-blue-600 opacity-20"></i>
          </div>
          
          <p className="text-gray-700 text-base lg:text-lg leading-relaxed mb-6 italic">
            "{testimonials[currentIndex].message}"
          </p>
          
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {testimonials[currentIndex].user.charAt(0)}
              </span>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">{testimonials[currentIndex].user}</h4>
              <p className="text-sm text-gray-600">{testimonials[currentIndex].role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevTestimonial}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
        aria-label="Previous testimonial"
      >
        <i className="fas fa-chevron-left text-gray-600"></i>
      </button>
      
      <button
        onClick={nextTestimonial}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
        aria-label="Next testimonial"
      >
        <i className="fas fa-chevron-right text-gray-600"></i>
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToTestimonial(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const Body = () => {
  const [details] = useState({
    about: 'StratCom Technologies is a leading IT solutions provider in Uganda, established in 2025. We specialize in cutting-edge technology solutions and professional development programs.',
    services: 'Web Application Development, Network Infrastructure, IT Consultancy, Mobile App Development, Professional Training & Internship Programs',
    location: 'Kampala, Uganda - East Africa Technology Hub',
    email: 'careers@stratcomtech.ug',
    tel: '+256 740 432 030',
    id: 1
  });

  const testimonials = [
    {
      id: 1,
      message: 'The internship program at StratCom transformed my career. The hands-on experience and mentorship I received were invaluable.',
      user: 'Eng Shafic',
      role: 'Software Engineer'
    },
    {
      id: 2,
      message: 'Working with the StratCom team taught me industry best practices and gave me the confidence to pursue my dreams in tech.',
      user: 'Janat M',
      role: 'Frontend Developer'
    },
    {
      id: 3,
      message: 'The quality of training and real-world projects at StratCom exceeded my expectations. Highly recommend their program.',
      user: 'Eng Ali',
      role: 'Full Stack Developer'
    },
    {
      id: 4,
      message: 'StratCom\'s comprehensive approach to tech education prepared me for success in the competitive IT industry.',
      user: 'Sarah K',
      role: 'Network Engineer'
    }
  ];

  return (
    <div className="bg-white">
      <Hero />
      <ServicesOverview />
      <WhyChooseStratcom />
      
      {/* About Section */}
      <section id="about" className="py-4 lg:py-6 bg-white" data-aos="fade-up">
        <div className="container mx-auto px-4 lg:px-6">
          <About data={details} />
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-6 lg:py-8 bg-gray-50" data-aos="fade-up">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-6 lg:mb-8">
            <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mb-3">
              <i className="fas fa-quote-left mr-1"></i>
              Success Stories
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
              What Our <span className="text-blue-600">Graduates Say</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Real experiences from professionals who started their journey with us
            </p>
          </div>
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-4 lg:py-6 bg-white" data-aos="fade-up">
        <div className="container mx-auto px-4 lg:px-6">
          <Features />
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="py-6 lg:py-8 bg-gradient-to-r from-blue-900 to-slate-900" data-aos="fade-up">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 lg:mb-3">
            Ready to Start Your Journey?
          </h2>
          <p className="text-sm md:text-xl text-slate-300 mb-3 lg:mb-4 max-w-2xl mx-auto px-2 lg:px-0">
            Join hundreds of successful graduates who started their tech careers with StratCom
          </p>
          <Link
            to="/apply"
            className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 lg:px-10 py-3 lg:py-4 rounded-lg lg:rounded-xl font-semibold text-sm lg:text-lg shadow-2xl transition-all duration-300 transform hover:scale-105"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            Apply Now - Limited Spots Available
            <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Body
