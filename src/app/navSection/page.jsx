'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const gradientCombinations = [
  { 
    from: 'from-purple-600', 
    to: 'to-blue-500', 
    hover: { from: 'from-purple-500', to: 'to-blue-400' },
    bg: 'bg-gradient-to-r from-purple-600/10 to-blue-500/10'
  },
  { 
    from: 'from-pink-500', 
    to: 'to-orange-400', 
    hover: { from: 'from-pink-400', to: 'to-orange-300' },
    bg: 'bg-gradient-to-r from-pink-500/10 to-orange-400/10'
  },
  { 
    from: 'from-blue-500', 
    to: 'to-teal-400', 
    hover: { from: 'from-blue-400', to: 'to-teal-300' },
    bg: 'bg-gradient-to-r from-blue-500/10 to-teal-400/10'
  },
  { 
    from: 'from-green-500', 
    to: 'to-blue-400', 
    hover: { from: 'from-green-400', to: 'to-blue-300' },
    bg: 'bg-gradient-to-r from-green-500/10 to-blue-400/10'
  },
  { 
    from: 'from-red-500', 
    to: 'to-pink-500', 
    hover: { from: 'from-red-400', to: 'to-pink-400' },
    bg: 'bg-gradient-to-r from-red-500/10 to-pink-500/10'
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentGradient, setCurrentGradient] = useState(gradientCombinations[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set random gradient on mount
    const randomIndex = Math.floor(Math.random() * gradientCombinations.length);
    setCurrentGradient(gradientCombinations[randomIndex]);
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'backdrop-blur-lg bg-white/70 shadow-lg' 
          : 'backdrop-blur-sm'
      } ${currentGradient.bg} ${
        mounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className={`text-2xl font-bold bg-gradient-to-r ${currentGradient.from} ${currentGradient.to} bg-clip-text text-transparent hover:${currentGradient.hover.from} hover:${currentGradient.hover.to} transition-all duration-300`}
            >
              Hey Rohit
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              {[
                { name: 'Home', href: '/' },
                { name: 'About', href: '/about' },
                { name: 'Projects', href: '/projects' },
                { name: 'Contact', href: '/contact' },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-300 group"
                >
                  {item.name}
                  <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r ${currentGradient.from} ${currentGradient.to} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
                </Link>
              ))}
              <Link
                href="/contact"
                className={`bg-gradient-to-r ${currentGradient.from} ${currentGradient.to} text-white px-4 py-2 rounded-full text-sm font-medium hover:${currentGradient.hover.from} hover:${currentGradient.hover.to} transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
              >
                Get in Touch
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-gray-90 focus:outline-none transition-all duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <div className="relative w-6 h-6">
                <span className={`absolute w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  isOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
                }`} />
                <span className={`absolute w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  isOpen ? 'opacity-0' : 'opacity-100'
                }`} />
                <span className={`absolute w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  isOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
                }`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} transition-all bg-transparent backdrop-blur-lg  duration-300 ease-in-out ${
        isOpen
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <div className={`px-2 pt-2 space-y-1 ${currentGradient.bg} backdrop-blur-lg shadow-lg`}>
          {[
            { name: 'Home', href: '/' },
            { name: 'About', href: '/about' },
            { name: 'Projects', href: '/projects' },
            { name: 'Contact', href: '/contact' },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block text-gray-700 hover:text-gray-900 hover:bg-white/50 px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="px-3 py-2">
            <Link
              href="/contact"
              className={`block w-full text-center bg-gradient-to-r ${currentGradient.from} ${currentGradient.to} text-white px-4 py-2 rounded-full font-medium hover:${currentGradient.hover.from} hover:${currentGradient.hover.to} transition-all duration-300 shadow-md hover:shadow-lg`}
              onClick={() => setIsOpen(false)}
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
