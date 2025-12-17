"use client"

import { Book } from "@/types/book"
import { BookOpenCheck, Play } from "lucide-react"

interface ReadingTabProps {
  books: Book[]
  onUpdateProgress: (id: string, increment: number) => void
  onMarkAsRead: (id: string) => void
}

export function ReadingTab({ books, onUpdateProgress, onMarkAsRead }: ReadingTabProps) {
  const currentlyReading = books.filter(book => book.status === "READING")

  if (currentlyReading.length === 0) {
    return (
      <div className="text-center py-20">
        <BookOpenCheck className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Сейчас ничего не читается
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Начните читать книгу и измените её статус
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {currentlyReading.map((book) => (
        <div
          key={book.id}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {book.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {book.author}
          </p>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Прогресс</span>
              <span className="font-bold text-gray-900 dark:text-white">{book.progress}%</span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 animate-pulse"
                style={{ width: `${book.progress}%` }}
              />
            </div>
          </div>

          {book.startDate && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Начато: {new Date(book.startDate).toLocaleDateString("ru-RU")}
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => onUpdateProgress(book.id, 10)}
              className="flex-1 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 rounded-lg transition-colors text-sm font-medium"
            >
              +10%
            </button>
            <button
              onClick={() => onUpdateProgress(book.id, 25)}
              className="flex-1 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 rounded-lg transition-colors text-sm font-medium"
            >
              +25%
            </button>
            <button
              onClick={() => onMarkAsRead(book.id)}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-1"
            >
              <Play className="w-4 h-4" />
              Завершить
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

