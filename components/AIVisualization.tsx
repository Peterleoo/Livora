import React from 'react';
import { motion } from 'framer-motion';

export const AIFluidOrbs: React.FC = () => {
  return (
    <div className="relative w-16 h-12 flex items-center justify-center">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 8, 0],
          y: [0, -4, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-8 h-8 bg-indigo-400/30 rounded-full blur-md"
      />
      <motion.div
        animate={{
          scale: [1.1, 0.9, 1.1],
          x: [0, -8, 0],
          y: [0, 4, 0],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute w-6 h-6 bg-cyan-400/30 rounded-full blur-sm"
      />
      <motion.div
        animate={{
          scale: [0.9, 1.1, 0.9],
          y: [0, -6, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute w-7 h-7 bg-purple-400/20 rounded-full blur-lg"
      />
    </div>
  );
};

export const AIThinkingDots: React.FC = () => (
  <div className="flex gap-1.5 items-center px-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: i * 0.2,
        }}
        className="w-1.5 h-1.5 bg-indigo-500 rounded-full"
      />
    ))}
  </div>
);
