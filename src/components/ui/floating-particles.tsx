'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Particle {
  id: number;
  animate: {
    y: number[];
    x: number[];
    opacity: number[];
  };
  transition: {
    duration: number;
    repeat: number;
    delay: number;
  };
  style: {
    left: string;
    top: string;
  };
}

export function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [...Array(20)].map((_, i) => ({
        id: i,
        animate: {
          y: [Math.random() * 1000, Math.random() * -200],
          x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
          opacity: [0, 1, 0],
        },
        transition: {
          duration: Math.random() * 10 + 10,
          repeat: Infinity,
          delay: Math.random() * 5,
        },
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        },
      }));
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          animate={p.animate}
          transition={p.transition}
          style={p.style}
        />
      ))}
    </>
  );
}
