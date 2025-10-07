import React from 'react';
import { GraduationCap, Mail, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="h-8 w-8 text-blue-400" />
              <span className="font-bold text-xl">EduMosaic</span>
            </div>
            <p className="text-gray-300 mb-4">
              Connecting passionate instructors with eager learners. Build your skills, 
              share your knowledge, and grow your career with EduMosaic.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>hello@edumosaic.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/courses" className="text-gray-300 hover:text-white transition-colors">Browse Courses</a></li>
              <li><a href="/auth/signup" className="text-gray-300 hover:text-white transition-colors">Become an Instructor</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><a href="/courses?category=web-development" className="text-gray-300 hover:text-white transition-colors">Web Development</a></li>
              <li><a href="/courses?category=data-science" className="text-gray-300 hover:text-white transition-colors">Data Science</a></li>
              <li><a href="/courses?category=design" className="text-gray-300 hover:text-white transition-colors">Design</a></li>
              <li><a href="/courses?category=business" className="text-gray-300 hover:text-white transition-colors">Business</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2025 EduMosaic. All rights reserved. Made with ❤️ for learners everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;