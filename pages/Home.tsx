
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MetalButton } from '../components/MetalButton';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#0a0c10] flex items-center justify-center overflow-hidden relative p-4">
      {/* Background Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] border border-blue-500/30 rounded-full animate-pulse" />
        <div className="absolute w-[500px] h-[500px] md:w-[600px] md:h-[600px] border border-slate-700 rounded-full" />
        <div className="absolute w-[700px] h-[700px] md:w-[800px] md:h-[800px] border border-slate-800 rounded-full" />
      </div>

      {/* Central Ring Visualization */}
      <div className="relative z-10 flex flex-col items-center scale-75 md:scale-100 transition-transform">
        <div className="relative w-64 h-64 md:w-72 md:h-72">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-2 border-slate-400 rounded-full shadow-[0_0_50px_rgba(59,130,246,0.2)] animate-[spin_20s_linear_infinite]" />
          {/* Inner Pulsing Core */}
          <div className="absolute inset-10 md:inset-12 border-4 border-blue-500/50 rounded-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-black shadow-inner">
            <span className="text-slate-400 text-[10px] tracking-[0.4em] font-light uppercase font-orbitron">Vault</span>
          </div>
          {/* Orbital Bits */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_15px_#3b82f6]" />
        </div>
        <h1 className="mt-8 md:mt-12 text-slate-100 text-2xl md:text-3xl font-extralight tracking-[0.2em] uppercase font-orbitron text-center">
          Persona <span className="text-blue-500 font-semibold">Box</span>
        </h1>
        <p className="mt-2 text-slate-500 text-xs md:text-sm tracking-wider font-orbitron text-center px-4">SECURE CHARACTER STORAGE SYSTEM</p>
      </div>

      {/* Navigation Buttons */}
      <MetalButton 
        position="top-left" 
        label="新增名片" 
        icon={<i className="fas fa-plus">+</i>} 
        onClick={() => navigate('/add')}
      />
      <MetalButton 
        position="bottom-right" 
        label="查看名片" 
        icon={<i className="fas fa-th-large">▦</i>} 
        onClick={() => navigate('/list')}
      />
    </div>
  );
};

export default Home;
