import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Pulse",
    artist: "AI Soundscape",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: 2,
    title: "Cyber Drift",
    artist: "Digital Dreams",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: 3,
    title: "Synth Wave",
    artist: "Future Retro",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&q=80&w=200&h=200",
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Playback failed', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="w-full max-w-md bg-black border-4 border-cyan-400 p-6 shadow-[10px_10px_0px_#ff00ff] relative overflow-hidden screen-tear">
      <div className="scanline absolute inset-0 opacity-20"></div>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center space-x-6 relative z-10">
        <div className="relative border-2 border-magenta-500 p-1 bg-white/5">
            <motion.img
                key={currentTrack.cover}
                initial={{ filter: 'grayscale(1) contrast(2)' }}
                animate={{ filter: 'grayscale(0) contrast(1)' }}
                src={currentTrack.cover}
                alt={currentTrack.title}
                className={`w-24 h-24 object-cover grayscale brightness-50 contrast-150 ${isPlaying ? 'animate-pulse' : ''}`}
            />
            <div className={`absolute inset-0 border-2 border-cyan-400 mix-blend-overlay ${isPlaying ? 'animate-ping' : ''}`}></div>
        </div>

        <div className="flex-1 space-y-1 font-pixel uppercase">
          <AnimatePresence mode="wait">
            <motion.div
                key={currentTrack.title}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
            >
                <h3 className="text-3xl font-bold text-cyan-400 leading-none glitch-text">{currentTrack.title}</h3>
                <p className="text-xl text-magenta-500 opacity-80 mt-1">&gt; {currentTrack.artist}</p>
            </motion.div>
          </AnimatePresence>
          
          <div className="flex items-center space-x-2 pt-3">
            <div className="w-2 h-2 bg-magenta-500 animate-bounce"></div>
            <span className="text-sm tracking-[0.2em] text-white/50">SIGNAL_ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4 relative z-10">
        {/* Progress Bar */}
        <div className="relative h-4 w-full bg-cyan-900/30 border border-cyan-400 overflow-hidden">
          <div 
            className="absolute h-full bg-magenta-500 shadow-[0_0_10px_#ff00ff] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between font-pixel">
          <div className="flex items-center space-x-2">
            <button 
                onClick={prevTrack}
                className="bg-black border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors px-3 py-2 text-xl"
            >
              PREV
            </button>
            
            <button 
              onClick={togglePlay}
              className="bg-magenta-500 text-black px-6 py-2 text-2xl font-black hover:bg-cyan-400 transition-all hover:scale-105 shadow-[4px_4px_0px_#ffffff] active:translate-y-1"
            >
              {isPlaying ? 'PAUSE' : 'PLAY'}
            </button>

            <button 
                onClick={nextTrack}
                className="bg-black border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors px-3 py-2 text-xl"
            >
              NEXT
            </button>
          </div>

          <div className="flex flex-col items-end text-cyan-400/50">
            <span className="text-[10px]">&gt; GAIN_0.85</span>
            <div className="w-16 h-2 border border-cyan-400/30 mt-1 bg-black overflow-hidden">
                <div className="w-2/3 h-full bg-cyan-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
