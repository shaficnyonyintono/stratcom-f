import React, { useState } from 'react'
import { toast } from 'react-toastify'

const Application = () => {
    const data = { 
        name: '',
        tel: '',
        date_of_birth: '',
        email: '',
        course: '',
        How_did_you_know_us: '',
    }
    const [formData, setFormData] = useState(data)
    const [editId, setEditId] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev_data => ({
            ...prev_data,
            [name]: value
        }))
    }
    
    const clearForm = () => {
        setFormData(data);
        setCurrentStep(1);
    }
    
    const isInvalid = Object.values(formData).some(value => value === '');

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Validate all required fields
        if (!formData.name || !formData.email || !formData.tel || !formData.date_of_birth || !formData.course || !formData.How_did_you_know_us) {
            toast.error('Please fill in all required fields');
            setIsSubmitting(false);
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            setIsSubmitting(false);
            return;
        }
        
        // Phone validation (basic Uganda format)
        const phoneRegex = /^(\+256|0)[0-9]{9}$/;
        if (!phoneRegex.test(formData.tel.replace(/\s/g, ''))) {
            toast.error('Please enter a valid phone number (e.g., +256 XXX XXX XXX or 0XXX XXX XXX)');
            setIsSubmitting(false);
            return;
        }
        
        const url = editId
            ? `http://127.0.0.1:8000/Application_view/${editId}`
            : "http://127.0.0.1:8000/";
        const method = editId ? "PUT" : "POST";
        
        console.log('Submitting to:', url);
        console.log('Method:', method);
        console.log('Data:', formData);
        
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Backend error:', errorData);
                
                // Handle specific error messages
                if (errorData.email) {
                    toast.error(`Email error: ${errorData.email[0]}`);
                } else if (errorData.tel) {
                    toast.error(`Phone error: ${errorData.tel[0]}`);
                } else if (errorData.name) {
                    toast.error(`Name error: ${errorData.name[0]}`);
                } else {
                    toast.error(editId ? 'Failed to update application' : 'Failed to submit application');
                }
                throw new Error(JSON.stringify(errorData));
            }
            
            const responseData = await response.json();
            console.log('Success response:', responseData);
            
            toast.success(
                editId 
                    ? 'Application updated successfully!' 
                    : 'Application submitted successfully! We will contact you soon.'
            );
            
            clearForm();
            setEditId(null);
        } catch (error) {
            console.error('Network error:', error);
            if (error.message.includes('Failed to fetch')) {
                toast.error('Unable to connect to server. Please check your internet connection and ensure the Django server is running.');
            } else if (!error.message.includes('email') && !error.message.includes('phone') && !error.message.includes('name')) {
                toast.error(editId ? 'Failed to update application' : 'Failed to submit application');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    const nextStep = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    }

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    }

    const getStepValidation = (step) => {
        switch (step) {
            case 1:
                return formData.name && formData.email && formData.tel;
            case 2:
                return formData.date_of_birth && formData.course;
            case 3:
                return formData.How_did_you_know_us;
            default:
                return false;
        }
    }

    return (
        <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-8 lg:py-10 px-3 lg:px-4">
            {/* Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-100 rounded-full opacity-10 blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-3 lg:mb-4" data-aos="fade-up">
                    <div className="inline-flex items-center px-3 lg:px-4 py-1.5 lg:py-2 bg-blue-100 text-blue-800 rounded-full text-xs lg:text-sm font-semibold mb-2 lg:mb-3">
                        <i className="fas fa-graduation-cap mr-1 lg:mr-2"></i>
                        Start Your Journey
                    </div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-2 lg:mb-3 leading-tight">
                        Apply for
                        <span className="block bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                            Tech Internship
                        </span>
                    </h1>
                    <p className="text-sm lg:text-base text-slate-600 max-w-xl mx-auto leading-relaxed px-2 lg:px-0">
                        Take the first step towards your tech career. Join our comprehensive internship program 
                        and gain hands-on experience with industry professionals.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-3 lg:mb-4" data-aos="fade-up" data-aos-delay="200">
                    <div className="flex items-center justify-center space-x-2 lg:space-x-4">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-bold text-sm lg:text-base transition-all duration-300 ${
                                    currentStep >= step 
                                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
                                        : 'bg-white text-slate-400 border-2 border-slate-200'
                                }`}>
                                    {currentStep > step ? (
                                        <i className="fas fa-check text-xs lg:text-sm"></i>
                                    ) : (
                                        step
                                    )}
                                </div>
                                {step < 3 && (
                                    <div className={`w-8 lg:w-12 h-1 mx-1 lg:mx-2 transition-all duration-300 ${
                                        currentStep > step ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-slate-200'
                                    }`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-2 lg:mt-3 space-x-4 lg:space-x-6">
                        <span className="text-xs lg:text-sm text-slate-600 text-center">Personal Info</span>
                        <span className="text-xs lg:text-sm text-slate-600 text-center">Academic Details</span>
                        <span className="text-xs lg:text-sm text-slate-600 text-center">Additional Info</span>
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-2xl lg:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden" data-aos="fade-up" data-aos-delay="300">
                    <form onSubmit={handleRegister} className="p-4 lg:p-8 xl:p-12">
                        {/* Step 1: Personal Information */}
                        {currentStep === 1 && (
                            <div className="space-y-4 lg:space-y-6" data-aos="fade-in" data-aos-delay="400">
                                <div className="text-center mb-6 lg:mb-8">
                                    <h2 className="text-xl lg:text-3xl font-bold text-slate-900 mb-1 lg:mb-2">Personal Information</h2>
                                    <p className="text-sm lg:text-base text-slate-600">Let's start with your basic information</p>
                                </div>

                                {/* Name Field */}
                                <div className="group">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 lg:pl-4 flex items-center pointer-events-none">
                                            <i className="fas fa-user text-slate-400 group-focus-within:text-blue-600 transition-colors text-sm lg:text-base"></i>
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            placeholder="Enter your full name"
                                            name="name"
                                            onChange={handleChange}
                                            className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-3 lg:py-4 border-2 border-slate-200 rounded-lg lg:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-base lg:text-lg"
                                        />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="group">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 lg:pl-4 flex items-center pointer-events-none">
                                            <i className="fas fa-envelope text-slate-400 group-focus-within:text-blue-600 transition-colors text-sm lg:text-base"></i>
                                        </div>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            placeholder="your.email@example.com"
                                            name="email"
                                            onChange={handleChange}
                                            className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-3 lg:py-4 border-2 border-slate-200 rounded-lg lg:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-base lg:text-lg"
                                        />
                                    </div>
                                </div>

                                {/* Phone Field */}
                                <div className="group">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 lg:pl-4 flex items-center pointer-events-none">
                                            <i className="fas fa-phone text-slate-400 group-focus-within:text-blue-600 transition-colors text-sm lg:text-base"></i>
                                        </div>
                                        <input
                                            type="tel"
                                            value={formData.tel}
                                            placeholder="+256 XXX XXX XXX"
                                            name="tel"
                                            onChange={handleChange}
                                            className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-3 lg:py-4 border-2 border-slate-200 rounded-lg lg:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-base lg:text-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Academic Details */}
                        {currentStep === 2 && (
                            <div className="space-y-4 lg:space-y-6">
                                <div className="text-center mb-6 lg:mb-8">
                                    <h2 className="text-xl lg:text-3xl font-bold text-slate-900 mb-1 lg:mb-2">Academic Details</h2>
                                    <p className="text-sm lg:text-base text-slate-600">Tell us about your educational background</p>
                                </div>

                                {/* Date of Birth */}
                                <div className="group">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Date of Birth *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 lg:pl-4 flex items-center pointer-events-none">
                                            <i className="fas fa-calendar-alt text-slate-400 group-focus-within:text-blue-600 transition-colors text-sm lg:text-base"></i>
                                        </div>
                                        <input
                                            type="date"
                                            value={formData.date_of_birth}
                                            name="date_of_birth"
                                            onChange={handleChange}
                                            className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-3 lg:py-4 border-2 border-slate-200 rounded-lg lg:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-base lg:text-lg"
                                        />
                                    </div>
                                </div>

                                {/* Course Selection */}
                                <div className="group">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Preferred Internship Track *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 lg:pl-4 flex items-center pointer-events-none">
                                            <i className="fas fa-graduation-cap text-slate-400 group-focus-within:text-blue-600 transition-colors text-sm lg:text-base"></i>
                                        </div>
                                        <select
                                            value={formData.course}
                                            name="course"
                                            onChange={handleChange}
                                            className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-3 lg:py-4 border-2 border-slate-200 rounded-lg lg:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-base lg:text-lg appearance-none bg-white"
                                        >
                                            <option value="">Select your preferred track</option>
                                            <option value="SOFTWARE ENGINEERING">Software Engineering & Development</option>
                                            <option value="COMPUTER SCIENCE">Computer Science & Programming</option>
                                            <option value="CIVIL ENGINEERING">Civil Engineering & Infrastructure</option>
                                            <option value="MECHANICAL ENGINEERING">Mechanical Engineering & Design</option>
                                            <option value="ELECTRICAL ENGINEERING">Electrical Engineering & Systems</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-3 lg:pr-4 flex items-center pointer-events-none">
                                            <i className="fas fa-chevron-down text-slate-400 text-sm lg:text-base"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Additional Information */}
                        {currentStep === 3 && (
                            <div className="space-y-4 lg:space-y-6">
                                <div className="text-center mb-6 lg:mb-8">
                                    <h2 className="text-xl lg:text-3xl font-bold text-slate-900 mb-1 lg:mb-2">Additional Information</h2>
                                    <p className="text-sm lg:text-base text-slate-600">Help us understand you better</p>
                                </div>

                                {/* How did you know us */}
                                <div className="group">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        How did you hear about us? *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-3 lg:top-4 left-3 lg:left-4 pointer-events-none">
                                            <i className="fas fa-question-circle text-slate-400 group-focus-within:text-blue-600 transition-colors text-sm lg:text-base"></i>
                                        </div>
                                        <textarea
                                            value={formData.How_did_you_know_us}
                                            placeholder="Tell us how you discovered StratCom Technologies and what motivated you to apply for this internship..."
                                            name="How_did_you_know_us"
                                            onChange={handleChange}
                                            rows="4"
                                            className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-3 lg:py-4 border-2 border-slate-200 rounded-lg lg:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-base lg:text-lg resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Summary Card */}
                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-blue-200">
                                    <h3 className="text-base lg:text-lg font-semibold text-slate-900 mb-3 lg:mb-4">Application Summary</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 text-sm">
                                        <div>
                                            <span className="text-slate-600">Name:</span>
                                            <span className="ml-2 font-semibold text-slate-900 break-words">{formData.name || 'Not provided'}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-600">Email:</span>
                                            <span className="ml-2 font-semibold text-slate-900 break-words">{formData.email || 'Not provided'}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-600">Phone:</span>
                                            <span className="ml-2 font-semibold text-slate-900">{formData.tel || 'Not provided'}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-600">Track:</span>
                                            <span className="ml-2 font-semibold text-slate-900 break-words">{formData.course || 'Not selected'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-slate-200 space-y-3 sm:space-y-0">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className={`w-full sm:w-auto px-6 lg:px-8 py-3 rounded-lg lg:rounded-xl font-semibold transition-all duration-300 text-sm lg:text-base ${
                                    currentStep === 1
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                                }`}
                            >
                                <i className="fas fa-arrow-left mr-2"></i>
                                Previous
                            </button>

                            {currentStep < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!getStepValidation(currentStep)}
                                    className={`w-full sm:w-auto px-6 lg:px-8 py-3 rounded-lg lg:rounded-xl font-semibold transition-all duration-300 text-sm lg:text-base ${
                                        getStepValidation(currentStep)
                                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg transform hover:scale-105'
                                            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                    }`}
                                >
                                    Next
                                    <i className="fas fa-arrow-right ml-2"></i>
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isInvalid || isSubmitting}
                                    className={`w-full sm:w-auto px-6 lg:px-8 py-3 rounded-lg lg:rounded-xl font-semibold transition-all duration-300 text-sm lg:text-base ${
                                        isInvalid || isSubmitting
                                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg transform hover:scale-105'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin mr-2"></i>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Application
                                            <i className="fas fa-paper-plane ml-2"></i>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Cancel Edit Button */}
                        {editId && (
                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        clearForm();
                                        setEditId(null);
                                    }}
                                    className="w-full py-3 rounded-lg lg:rounded-xl text-white font-semibold bg-slate-500 hover:bg-slate-600 transition-all duration-300 text-sm lg:text-base"
                                >
                                    Cancel Edit
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Trust Indicators */}
                <div className="text-center mt-8 lg:mt-12">
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-slate-600">
                        <div className="flex items-center">
                            <i className="fas fa-shield-alt text-green-600 mr-2"></i>
                            <span className="text-sm">Secure Application</span>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-clock text-blue-600 mr-2"></i>
                            <span className="text-sm">Quick Response</span>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-certificate text-blue-600 mr-2"></i>
                            <span className="text-sm">Verified Program</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Application
