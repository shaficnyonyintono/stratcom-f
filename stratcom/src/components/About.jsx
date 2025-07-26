import React from 'react';
import { Link } from 'react-router-dom';

const About = ({ data }) => (
  <section id="about" className="py-6 lg:py-10 bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
    {/* Decorative gradient blob */}
    <div className="absolute -top-16 left-0 w-80 h-80 bg-blue-200 opacity-30 rounded-full blur-3xl z-0"></div>
    <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-6 lg:gap-8">
      {/* About Content */}
      <div className="flex-1 bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl shadow-2xl border border-blue-100 p-4 lg:p-6" data-aos="fade-up" data-aos-delay="100">
        <h2 className="text-2xl lg:text-4xl font-extrabold text-blue-800 mb-2 lg:mb-4 text-center md:text-left drop-shadow-lg">About Us</h2>
        <p className="text-gray-700 text-sm lg:text-xl mb-3 lg:mb-4 text-center md:text-left leading-relaxed">
          {data.about}
        </p>
        <ul className="mb-3 lg:mb-4 space-y-2 text-blue-800 font-semibold text-sm lg:text-base">
          <li data-aos="fade-right" data-aos-delay="200">
            <span className="inline-block mr-2 text-blue-500">
              <i className="fas fa-cogs"></i>
            </span>
            Services: <span className="font-normal text-gray-700">{data.services}</span>
          </li>
          <li data-aos="fade-right" data-aos-delay="300">
            <span className="inline-block mr-2 text-blue-500">
              <i className="fas fa-map-marker-alt"></i>
            </span>
            Location: <span className="font-normal text-gray-700">{data.location}</span>
          </li>
          <li data-aos="fade-right" data-aos-delay="400">
            <span className="inline-block mr-2 text-blue-500">
              <i className="fas fa-envelope"></i>
            </span>
            Email: <span className="font-normal text-gray-700">{data.email}</span>
          </li>
          <li data-aos="fade-right" data-aos-delay="500">
            <span className="inline-block mr-2 text-blue-500">
              <i className="fas fa-phone"></i>
            </span>
            Tel: <span className="font-normal text-gray-700">{data.tel}</span>
          </li>
        </ul>
        <div className="flex justify-center md:justify-start" data-aos="zoom-in" data-aos-delay="600">
          <Link
            to="/apply"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 lg:px-6 py-2 rounded-full font-semibold shadow transition text-sm lg:text-base"
          >
            Apply for Internship
          </Link>
        </div>
      </div>
      {/* Optional: Add an illustration or company image here */}
      {/* <div className="flex-1 flex justify-center items-center">
        <img src="/about-illustration.svg" alt="About illustration" className="w-80 h-80 object-contain" />
      </div> */}
    </div>
  </section>
);

export default About;
