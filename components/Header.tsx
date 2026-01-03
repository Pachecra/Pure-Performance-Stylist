import React from 'react';
import { Feather } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-100 p-4 sticky top-0 z-20">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo Icon - Feather/Wing shape similar to the brand */}
          <div className="text-brand-black">
             <Feather className="w-8 h-8 fill-brand-black" style={{ transform: 'scaleX(-1) rotate(-20deg)' }} />
          </div>
          
          {/* Brand Name - Bold Italic Sans */}
          <div>
            <h1 className="font-brand text-2xl font-black italic tracking-tighter text-brand-black leading-none">
              PURE <span className="text-transparent bg-clip-text bg-brand-gradient">GYMNASTICS</span>
            </h1>
            <p className="text-[9px] text-gray-400 tracking-[0.3em] uppercase font-bold mt-0.5 ml-0.5">Performance Stylist</p>
          </div>
        </div>
        
        {/* Subtitle / Status */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-brand-gradient animate-pulse"></div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Online</span>
        </div>
      </div>
    </header>
  );
};