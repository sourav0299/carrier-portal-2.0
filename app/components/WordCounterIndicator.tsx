import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const WordCountIndicator: React.FC<{ wordCount: number; maxWords: number }> = ({ wordCount, maxWords }) => {
  const progress = useMotionValue(wordCount / maxWords);
  const strokeDasharray = useTransform(progress, (value: number) => `${value} 1`);

  return (
    <motion.svg
      width="40"
      height="40"
      viewBox="0 0 100 100"
      className="absolute bottom-2 right-2"
    >
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="#e0e0e0"
        strokeWidth="10"
      />
      <motion.circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="10"
        strokeDasharray={strokeDasharray}
        strokeDashoffset="0"
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dy="7"
        fontSize="24"
        fill="#3b82f6"
      >
        {wordCount}
      </text>
    </motion.svg>
  );
};

export default WordCountIndicator;