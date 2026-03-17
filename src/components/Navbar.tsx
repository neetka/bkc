"use client";

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-blue-600/90 backdrop-blur-md text-white shadow-xl' : 'bg-transparent text-white'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <a href="#home" className="flex items-center space-x-3 group">
            <img
              src="/logo.png"
              alt="CSC Baghpur Logo"
              className="h-10 w-10 rounded-lg shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-105"
            />
            <span className="text-xl font-bold transition-colors duration-300 group-hover:text-gray-200">CSC Baghpur</span>
          </a>
          <div className="hidden md:flex space-x-6">
            <a href="#home" className="nav-link">Home</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#services" className="nav-link">Services</a>
            <a href="#gallery" className="nav-link">Gallery</a>
            <a href="#bulletin" className="nav-link">Updates</a>
            <a href="#join" className="nav-link">Join</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1">
            <a href="#home" className="block py-2 px-3 rounded-lg hover:bg-white/10 transition-all duration-300" onClick={toggleMenu}>Home</a>
            <a href="#about" className="block py-2 px-3 rounded-lg hover:bg-white/10 transition-all duration-300" onClick={toggleMenu}>About</a>
            <a href="#services" className="block py-2 px-3 rounded-lg hover:bg-white/10 transition-all duration-300" onClick={toggleMenu}>Services</a>
            <a href="#gallery" className="block py-2 px-3 rounded-lg hover:bg-white/10 transition-all duration-300" onClick={toggleMenu}>Gallery</a>
            <a href="#bulletin" className="block py-2 px-3 rounded-lg hover:bg-white/10 transition-all duration-300" onClick={toggleMenu}>Updates</a>
            <a href="#join" className="block py-2 px-3 rounded-lg hover:bg-white/10 transition-all duration-300" onClick={toggleMenu}>Join</a>
            <a href="#contact" className="block py-2 px-3 rounded-lg hover:bg-white/10 transition-all duration-300" onClick={toggleMenu}>Contact</a>
          </div>
        )}
      </div>
    </nav>
  );
}