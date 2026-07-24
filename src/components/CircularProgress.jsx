import React from 'react';
import { motion } from 'framer-motion';

export default function CircularProgress({ score, size = 64, strokeWidth = 6 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = "#16A34A"; // Green (≥90)
  let bgColor = "#F0FDF4";
  let textColor = "#15803D";

  if (score < 65) {
    strokeColor = "#DC2626"; // Red (<65)
    bgColor = "#FEF2F2";
    textColor = "#B91C1C";
  } else if (score < 80) {
    strokeColor = "#F59E0B"; // Amber (65-79)
    bgColor = "#FFFBEB";
    textColor = "#B45309";
  } else if (score < 90) {
    strokeColor = "#2563EB"; // Blue (80-89)
    bgColor = "#EFF6FF";
    textColor = "#1D4ED8";
  }

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      {/* Center Percentage Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-extrabold text-gray-900 leading-none" style={{ color: textColor }}>
          {score}%
        </span>
        <span className="text-[9px] font-medium text-gray-600 mt-0.5">MATCH</span>
      </div>
    </div>
  );
}
