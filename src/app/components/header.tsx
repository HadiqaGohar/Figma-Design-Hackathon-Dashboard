'use client';

import React from 'react';

const Header = () => {
  return (
    <header className="bg-pink-500 shadow-md sticky top-0 z-50">
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg">
          <span className="bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-clip-text text-transparent">
            GlowUpBeauty Dashboard
          </span>
        </h1>
      </div>
    </header>
  );
};

export default Header;
