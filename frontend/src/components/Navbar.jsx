import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="text-white text-2xl font-bold cursor-pointer hover:text-gray-300 transition-colors"
            onClick={() => navigate('/')}
          >
            Run Away
          </div>
          
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => navigate('/login')}
              className="text-white/80 hover:text-white transition-colors text-sm font-medium"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
