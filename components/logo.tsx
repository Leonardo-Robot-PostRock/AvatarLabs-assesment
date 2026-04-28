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
    sm: { main: 14, small: 6 },
    md: { main: 20, small: 9 },
    lg: { main: 28, small: 12 },
  }

  return (
    <div className={`relative inline-flex ${sizeClasses[size]} ${className}`}>
      {/* Main star - center */}
      <Star
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fill-yellow-400 text-yellow-400 star-glow"
        size={starSizes[size].main}
        strokeWidth={2.5}
      />
      {/* Small stars around */}
      <Star
        className="absolute -left-0.5 top-0 fill-purple-400 text-purple-400"
        size={starSizes[size].small}
        strokeWidth={2}
      />
      <Star
        className="absolute -right-0.5 top-0 fill-blue-400 text-blue-400"
        size={starSizes[size].small}
        strokeWidth={2}
      />
      <Star
        className="absolute -bottom-0.5 left-1/4 fill-green-400 text-green-400"
        size={starSizes[size].small}
        strokeWidth={2}
      />
      <Star
        className="absolute -bottom-0.5 right-1/4 fill-pink-400 text-pink-400"
        size={starSizes[size].small}
        strokeWidth={2}
      />
    </div>
  )
}