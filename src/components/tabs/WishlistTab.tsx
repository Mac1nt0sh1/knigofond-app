"use client"

import { Book } from "@/types/book"
import { Star, Play, Trash2 } from "lucide-react"

interface WishlistTabProps {
  books: Book[]
  onStartReading: (id: string) => void
  onDelete: (id: string) => void
}

export function WishlistTab({ books, onStartReading, onDelete }: WishlistTabProps) {
  const wishlist = books.filter(book => book.status === "WANT_TO_READ")

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-20">
        <Star className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Список желаний пуст
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Добавьте книги, которые хотите прочитать
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {wishlist.map((book) => (
        <div
          key={book.id}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border-l-4 border-yellow-500 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {book.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                {book.author}
              </p>
              {book.year && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {book.year} год
                </span>
              )}
              {book.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                  {book.description}
                </p>
              )}
            </div>

            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onStartReading(book.id)}
                className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
              >
                <Play className="w-4 h-4" />
                Начать читать
              </button>
              <button
                onClick={() => onDelete(book.id)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


