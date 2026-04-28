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

  // Position stars in a circular orbit (moon-like)
  const smallStars = [
    { angle: 0, color: "purple" },
    { angle: 90, color: "blue" },
    { angle: 180, color: "green" },
    { angle: 270, color: "pink" },
  ]

  const orbitRadius = size === "sm" ? "60%" : size === "md" ? "65%" : "65%"

  return (
    <div className={`relative inline-flex ${sizeClasses[size]} ${className}`}>
      {/* Main star - center */}
      <Star
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fill-yellow-400 text-yellow-400 star-glow z-10"
        size={starSizes[size].main}
        strokeWidth={2.5}
      />
      
      {/* Small stars in circular orbit */}
      {smallStars.map(({ angle, color }, index) => {
        const radian = (angle * Math.PI) / 180
        const x = 50 + 50 * Math.cos(radian)
        const y = 50 + 50 * Math.sin(radian)
        
        return (
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
        )
      })}
    </div>
  )
}