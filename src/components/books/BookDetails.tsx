"use client"

import { Book, statusLabels, statusColors } from "@/types/book"
import { RatingStars } from "@/components/ui/RatingStars"
import { BookOpen, Calendar, Hash, FileText, ThumbsUp } from "lucide-react"

interface BookDetailsProps {
  book: Book
  onEdit: () => void
  onClose: () => void
}

export function BookDetails({ book, onEdit, onClose }: BookDetailsProps) {
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "Не указана"
    return new Date(date).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Cover */}
        <div className="flex-shrink-0">
          <div 
            className="w-full md:w-48 h-64 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center"
            style={book.cover ? { backgroundImage: `url(${book.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          >
            {!book.cover && (
              <BookOpen className="w-16 h-16 text-white/80" />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {book.title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {book.author}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Год</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {book.year || "Не указан"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Жанр</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {book.genre || "Не указан"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Статус</span>
              <p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white ${statusColors[book.status]}`}>
                  {statusLabels[book.status]}
                </span>
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Рейтинг</span>
              <div className="mt-1">
                <RatingStars rating={book.rating} readonly size="md" />
              </div>
            </div>
          </div>

          {book.progress > 0 && (
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Прогресс: {book.progress}%</span>
              <div className="mt-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${book.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
        {book.pages && (
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Страниц: <strong>{book.pages}</strong>
            </span>
          </div>
        )}
        {book.isbn && (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ISBN: <strong>{book.isbn}</strong>
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Добавлено: <strong>{formatDate(book.createdAt)}</strong>
          </span>
        </div>
        {book.startDate && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Начал читать: <strong>{formatDate(book.startDate)}</strong>
            </span>
          </div>
        )}
        {book.endDate && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Закончил читать: <strong>{formatDate(book.endDate)}</strong>
            </span>
          </div>
        )}
      </div>

      {book.description && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Описание
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {book.description}
          </p>
        </div>
      )}

      {book.notes && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Мои заметки
          </h3>
          <p className="text-gray-600 dark:text-gray-400 italic">
            {book.notes}
          </p>
        </div>
      )}

      {book.recommend && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
          <ThumbsUp className="w-5 h-5 text-green-600" />
          <span className="text-green-700 dark:text-green-400 font-medium">
            Рекомендую эту книгу
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onEdit}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Редактировать
        </button>
        <button
          onClick={onClose}
          className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          Закрыть
        </button>
      </div>
    </div>
  )
}


