import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#000000] text-cyan-400 font-mono overflow-hidden relative selection:bg-magenta-500/50">
      {/* GLITCH OVERLAYS */}
      <div className="scanline fixed inset-0 z-50 opacity-10 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 md:p-8 space-y-12">
        <motion.header 
          initial={{ skewX: 20, opacity: 0 }}
          animate={{ skewX: 0, opacity: 1 }}
          className="text-center space-y-4"
        >
          <div className="flex flex-col items-center justify-center">
              <span className="text-xl font-pixel text-magenta-500 tracking-[0.5em] animate-pulse">TERMINAL_LINK_ESTABLISHED</span>
              <h1 className="text-7xl md:text-9xl font-pixel font-black tracking-tighter uppercase italic text-cyan-400 glitch-text leading-none">
                GLITCH_SYNTH
              </h1>
          </div>
          <p className="text-[10px] font-mono text-cyan-500/40 uppercase tracking-[1em]">&gt; ENCRYPTED_STREAM_V4.2.0</p>
        </motion.header>

        <main className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-12 w-full max-w-7xl">
          {/* Main Game Interface */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1"
          >
            <SnakeGame />
          </motion.div>

          {/* Side Control Panel */}
          <motion.aside 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full xl:w-auto flex flex-col space-y-8"
          >
            <div className="bg-black/80 border-2 border-magenta-500 p-4 shadow-[8px_8px_0px_#00f3ff]">
                <div className="flex items-center justify-between px-2 mb-4 border-b border-magenta-500/30 pb-2">
                    <span className="text-xs uppercase font-pixel tracking-widest text-magenta-500">AUDIO_MATRIX_CTRL</span>
                    <div className="w-4 h-2 bg-cyan-400 animate-ping" />
                </div>
                <MusicPlayer />
            </div>

            <div className="bg-black border-2 border-cyan-400 p-6 shadow-[8px_8px_0px_#ff00ff] font-pixel">
                <h4 className="text-2xl uppercase tracking-tighter text-magenta-500 mb-4">&gt; OPERATIONAL_MANUAL</h4>
                <ul className="space-y-4">
                    <li className="flex items-center space-x-3 text-cyan-400">
                        <span className="bg-cyan-400 text-black px-2 py-0.5 text-sm font-bold">NAV</span>
                        <span className="text-xl tracking-tight">VECTORS: ↑ ↓ ← →</span>
                    </li>
                    <li className="flex items-center space-x-3 text-cyan-400">
                        <span className="bg-magenta-500 text-black px-2 py-0.5 text-sm font-bold">INT</span>
                        <span className="text-xl tracking-tight">INTERRUPT: [SPACE]</span>
                    </li>
                    <li className="flex items-center space-x-3 text-white/40">
                        <div className="w-4 h-4 bg-magenta-500" />
                        <span className="text-lg tracking-tight uppercase">COLLECT_NODES</span>
                    </li>
                </ul>
            </div>
            
            <div className="text-[10px] text-cyan-500/20 uppercase font-mono max-w-[200px] leading-tight">
              WARNING: UNAUTHORIZED ACCESS TO CORE_DATA MAY LEAD TO SYSTEM_STALL
            </div>
          </motion.aside>
        </main>

        <footer className="pt-8 text-xl font-pixel text-magenta-500/30 uppercase tracking-[0.5em] flex items-center space-x-8">
          <span>(C) 2026_NEURAL_CORP</span>
          <div className="h-4 w-4 bg-cyan-400/10 animate-pulse"></div>
          <span>SECURED_BY_AIS</span>
        </footer>
      </div>
    </div>
  );
}
