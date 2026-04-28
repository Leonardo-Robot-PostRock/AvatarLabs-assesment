"use client"

import { Star } from "lucide-react"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

const colorMap: Record<string, string> = {
  purple: "text-purple-400 fill-purple-400",
  blue: "text-blue-400 fill-blue-400",
  green: "text-green-400 fill-green-400",
  pink: "text-pink-400 fill-pink-400",
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

  // Crescent moon formation: stars closer to main star
  const smallStars = [
    { x: 65, y: 25, color: "purple" },
    { x: 78, y: 38, color: "blue" },
    { x: 82, y: 55, color: "green" },
    { x: 72, y: 72, color: "pink" },
  ]

  return (
    <div className={`relative inline-flex ${sizeClasses[size]} ${className}`}>
      {/* Main star - center-left */}
      <Star
        className="absolute left-[30%] top-[50%] -translate-x-1/2 -translate-y-1/2 text-yellow-400 fill-yellow-400 star-glow z-10"
        size={starSizes[size].main}
        strokeWidth={2.5}
      />
      
      {/* Small stars forming crescent moon */}
      {smallStars.map(({ x, y, color }, index) => (
        <Star
          key={index}
          className={`absolute z-0 ${colorMap[color]}`}
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