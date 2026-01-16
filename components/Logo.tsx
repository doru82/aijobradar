"use client";

import { useEffect, useState } from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 120, className = "" }: LogoProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="rgba(34, 197, 94, 0.2)"
          strokeWidth="1"
        />

        {/* Radar rings */}
        {[38, 28, 18].map((r, i) => (
          <circle
            key={r}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="rgba(34, 197, 94, 0.3)"
            strokeWidth="0.5"
            className="animate-pulse-slow"
            style={{ animationDelay: `${i * 500}ms` }}
          />
        ))}

        {/* Crosshairs */}
        <line
          x1="50"
          y1="5"
          x2="50"
          y2="95"
          stroke="rgba(34, 197, 94, 0.2)"
          strokeWidth="0.5"
        />
        <line
          x1="5"
          y1="50"
          x2="95"
          y2="50"
          stroke="rgba(34, 197, 94, 0.2)"
          strokeWidth="0.5"
        />

        {/* Rotating scanner */}
        <g className="origin-center animate-radar-sweep">
          <defs>
            <linearGradient
              id="scannerGradient"
              x1="50%"
              y1="50%"
              x2="100%"
              y2="50%"
            >
              <stop offset="0%" stopColor="rgba(34, 197, 94, 0)" />
              <stop offset="100%" stopColor="rgba(34, 197, 94, 0.6)" />
            </linearGradient>
          </defs>
          <path
            d="M50,50 L50,5 A45,45 0 0,1 92.5,65 Z"
            fill="url(#scannerGradient)"
            style={{ transformOrigin: "50px 50px" }}
          />
        </g>

        {/* Center dot */}
        <circle cx="50" cy="50" r="3" fill="#22c55e" className="animate-pulse" />

        {/* Blips (threat indicators) */}
        <circle
          cx="35"
          cy="30"
          r="2"
          fill="#ef4444"
          className="animate-ping-slow"
          style={{ animationDelay: "0s" }}
        />
        <circle
          cx="70"
          cy="45"
          r="1.5"
          fill="#f97316"
          className="animate-ping-slow"
          style={{ animationDelay: "1s" }}
        />
        <circle
          cx="55"
          cy="70"
          r="1.5"
          fill="#eab308"
          className="animate-ping-slow"
          style={{ animationDelay: "2s" }}
        />
      </svg>
    </div>
  );
}
