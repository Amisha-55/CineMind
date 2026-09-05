import React from 'react';

export const AmbientGlow: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Top Left Indigo Glow */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[140px]" />
      
      {/* Center Right Violet/Purple Glow */}
      <div className="absolute top-[35%] -right-40 w-[500px] h-[500px] bg-accent-purple/8 rounded-full blur-[130px]" />
      
      {/* Bottom Center Cyan Glow */}
      <div className="absolute -bottom-40 left-[20%] w-[550px] h-[550px] bg-accent-cyan/6 rounded-full blur-[150px]" />
    </div>
  );
};
