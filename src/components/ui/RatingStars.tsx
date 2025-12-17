"use client"

import { Star } from "lucide-react"

interface RatingStarsProps {
  rating: number
  onChange?: (rating: number) => void
  readonly?: boolean
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6"
}

export function RatingStars({ rating, onChange, readonly = false, size = "md" }: RatingStarsProps) {
  const handleClick = (value: number) => {
    if (!readonly && onChange) {
      onChange(value)
    }
  }

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => handleClick(value)}
          disabled={readonly}
          className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
        >
          <Star
            className={`${sizeClasses[size]} ${
              value <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-none text-gray-300 dark:text-gray-600"
            }`}
          />
        </button>
      ))}
    </div>
  )
}


