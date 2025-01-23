'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Import Scene3d with no SSR
const Scene3d = dynamic(() => import('./Scene3d'), {
  ssr: false,
  loading: () => null
});

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="relative min-h-screen w-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="w-full absolute inset-0 bg-transparent" />
      
      {/* 3D Scene for mobile (background) */}
      {mounted && isMobile && (
        <div className="absolute inset-0 opacity-30">
          <Scene3d />
        </div>
      )}
      
      {/* Content */}
      <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col  lg:flex-row items-center justify-between gap-12">
          {/* Left side - Text content */}
          <motion.div 
            className="flex flex-col text-center lg:text-left relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Creative Developer
              <br />
              <span className="text-gray-800">& Designer</span>
            </motion.h1>
            
            <motion.p 
              className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Transforming ideas into reality through elegant code and stunning design. 
              Specializing in creating immersive digital experiences.
            </motion.p>

            <motion.div 
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <a 
                href="#projects" 
                className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                View Projects
              </a>
              <a 
                href="#contact" 
                className="px-8 py-3 rounded-full border-2 border-gray-300 text-gray-700 font-medium hover:border-gray-400 hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Contact Me
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              className="mt-8 flex gap-6 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {['github', 'linkedin', 'twitter'].map((social) => (
                <a
                  key={social}
                  href={`#${social}`}
                  className="text-gray-500 hover:text-gray-800 transition-colors duration-200"
                >
                  <span className="capitalize">{social}</span>
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side - 3D Scene for desktop */}
          {mounted && !isMobile && (
            <motion.div 
              className="flex-1 relative w-full h-[600px] lg:h-[800px]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.8 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <Scene3d />
            </motion.div>
          )}
        </div>
      </div>
      <Scene3d />
    </section>
  );
};

export default HeroSection;
