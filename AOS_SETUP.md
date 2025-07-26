# AOS Installation Guide

## Install AOS (Animate On Scroll) Library

To complete the AOS setup for your frontend, please run the following command in your terminal:

```bash
cd C:\Users\user\Desktop\internfinal\frontend\stratcom
npm install aos
```

## What's Been Added

I've already added AOS animations to your React components:

### 1. **App.jsx** - AOS Initialization
- Imported AOS library and CSS
- Added AOS.init() with configuration:
  - Duration: 1000ms
  - Once: true (animations trigger only once)
  - Offset: 100px
  - Easing: ease-out-cubic

### 2. **Body.jsx** - Main Landing Page
- **Hero Section**: Fade-up animations with staggered delays
- **Stats Cards**: Zoom-in animations with individual delays
- **CTA Buttons**: Fade-up animation
- **All Sections**: Fade-up animations for smooth scrolling experience

### 3. **Features.jsx** - Features Page
- **Section Header**: Fade-up animation
- **Feature Cards**: Fade-up animations with staggered delays based on index
- **CTA Section**: Fade-up, fade-right, fade-left animations
- **Stats**: Zoom-in animations

### 4. **About.jsx** - About Section
- **Main Container**: Fade-up animation
- **List Items**: Fade-right animations with staggered delays
- **CTA Button**: Zoom-in animation

### 5. **Testmonies.jsx** - Testimonials
- **Header Section**: Fade-up animation
- **Testimonial Card**: Fade-up animation with delay

### 6. **Application.jsx** - Application Form
- **Header**: Fade-up animation
- **Progress Bar**: Fade-up with delay
- **Form Container**: Fade-up with delay
- **Form Steps**: Fade-in animations

## Animation Types Used

- **fade-up**: Elements fade in and slide up
- **fade-right/fade-left**: Elements fade in and slide from sides
- **zoom-in**: Elements scale up while fading in
- **fade-in**: Simple fade in effect

## Animation Delays

- Staggered delays (100ms, 200ms, 300ms, etc.) create a cascading effect
- Feature cards use index-based delays for sequential animation
- Form elements have progressive delays for smooth user experience

## Configuration Details

```javascript
AOS.init({
  duration: 1000,        // Animation duration in ms
  once: true,           // Whether animation should happen only once
  offset: 100,          // Offset (in px) from trigger point
  easing: 'ease-out-cubic' // Easing function
});
```

## After Installation

1. Run `npm install aos` in your frontend directory
2. Start your development server: `npm run dev`
3. Navigate to your website and scroll to see the animations
4. All animations will trigger as elements come into view

The animations will make your website more engaging and professional, with smooth transitions as users scroll through different sections.
