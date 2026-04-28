"use client"

import { Star } from "lucide-react"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const starSizes = {
    sm: { main: 14, small: 5 },
    md: { main: 20, small: 7 },
    lg: { main: 28, small: 10 },
  }

  // Crescent moon formation: stars stacked on the upper-right side
  const smallStars = [
    { x: 78, y: 18, color: "purple" },   // top-right
    { x: 92, y: 32, color: "blue" },     // upper-right
    { x: 98, y: 52, color: "green" },    // middle-right
    { x: 88, y: 75, color: "pink" },     // lower-right
  ]

  return (
    <div className={`relative inline-flex ${sizeClasses[size]} ${className}`}>
      {/* Main star - center-left (exposed part of moon) */}
      <Star
        className="absolute left-[35%] top-[50%] -translate-x-1/2 -translate-y-1/2 fill-yellow-400 text-yellow-400 star-glow z-10"
        size={starSizes[size].main}
        strokeWidth={2.5}
      />
      
      {/* Small stars forming crescent moon on the right */}
      {smallStars.map(({ x, y, color }, index) => (
        <Star
          key={index}
          className={`absolute fill-${color}-400 text-${color}-400 z-0`}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          size={starSizes[size].small}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}