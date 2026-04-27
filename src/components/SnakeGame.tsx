import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  // Random food position
  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 5, y: 5 });
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Eat food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ': // Space to pause/resume
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, 150);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#0a0a0f'; // Dark background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = '#1e1e2d';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00f3ff' : '#00b8e6'; // Neon Cyan
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00f3ff';
      ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2);
      ctx.shadowBlur = 0;
    });

    // Draw food
    ctx.fillStyle = '#ff00ff'; // Neon Magenta
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-black border-2 border-magenta-500 shadow-[10px_10px_0px_#00f3ff] relative screen-tear">
      <div className="scanline absolute inset-0 opacity-30"></div>
      
      <div className="flex justify-between w-full font-pixel text-magenta-500">
        <div className="flex flex-col">
            <span className="text-xl uppercase tracking-tighter">DATA_STREAM</span>
            <span className="text-4xl font-bold glitch-text">SCORE:{score}</span>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-xl uppercase tracking-tighter">MAX_BUFFER</span>
            <span className="text-4xl font-bold">HS:{highScore}</span>
        </div>
      </div>

      <div className="relative border-4 border-cyan-400 bg-black">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="block"
        />
        
        {(gameOver || isPaused) && (
          <div className="absolute inset-0 flex items-center justify-center bg-magenta-500/20 backdrop-blur-[2px]">
            <div className="text-center p-8 bg-black border-4 border-magenta-500 shadow-[15px_15px_0px_#00f3ff]">
              {gameOver ? (
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="space-y-6"
                >
                  <h2 className="text-6xl font-black text-magenta-500 uppercase font-pixel glitch-text italic">SYSTEM_CRITICAL</h2>
                  <p className="font-mono text-cyan-400 text-xs mb-4">SEGMENTATION_FAULT: SERPENT_COLLISION_DETECTED</p>
                  <button
                    onClick={resetGame}
                    className="w-full py-4 bg-cyan-400 text-black font-black uppercase font-pixel text-2xl hover:bg-magenta-500 hover:text-white transition-all active:translate-y-1 shadow-[5px_5px_0px_#ff00ff]"
                  >
                    REBOOT_CORE
                  </button>
                </motion.div>
              ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6 text-center"
                >
                  <h2 className="text-5xl font-bold text-cyan-400 uppercase font-pixel tracking-tighter">IDLE_STATE</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="w-full py-4 border-4 border-magenta-500 text-magenta-500 font-pixel text-2xl uppercase hover:bg-magenta-500 hover:text-black transition-all"
                  >
                    RESUME_LINK
                  </button>
                  <p className="text-[10px] text-cyan-400 mt-4 uppercase font-mono tracking-widest animate-pulse">&gt; WAITING FOR USER INPUT...</p>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="text-xl text-magenta-500 font-pixel text-center tracking-widest bg-cyan-400/10 px-4 py-2 w-full border border-cyan-400/30">
        {isPaused ? "INPUT READY: PRESS_SPACE" : "SYNCING_NEURAL_INTERFACE"}
      </div>
    </div>
  );
}
