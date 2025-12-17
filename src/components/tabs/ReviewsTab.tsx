"use client"

import { Book } from "@/types/book"
import { RatingStars } from "@/components/ui/RatingStars"
import { MessageSquare, ThumbsUp, Edit } from "lucide-react"

interface ReviewsTabProps {
  books: Book[]
  onEdit: (book: Book) => void
}

export function ReviewsTab({ books, onEdit }: ReviewsTabProps) {
  const reviewedBooks = books.filter(book => book.rating > 0 || book.notes)

  if (reviewedBooks.length === 0) {
    return (
      <div className="text-center py-20">
        <MessageSquare className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Пока нет отзывов
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Оцените книгу или оставьте заметки
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviewedBooks.map((book) => (
        <div
          key={book.id}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border-l-4 border-blue-500"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {book.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {book.author}
              </p>
              <div className="mt-2">
                <RatingStars rating={book.rating} readonly size="md" />
              </div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(book.createdAt).toLocaleDateString("ru-RU")}
            </span>
          </div>

          {book.notes && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Мои заметки:
              </h4>
              <p className="text-gray-600 dark:text-gray-400 italic">
                {book.notes}
              </p>
            </div>
          )}

          {book.recommend && (
            <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm">
              <ThumbsUp className="w-4 h-4" />
              Рекомендую
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => onEdit(book)}
              className="inline-flex items-center gap-1 px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-sm"
            >
              <Edit className="w-4 h-4" />
              Редактировать отзыв
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}


