"use client"

import { Book, statusLabels, statusColors } from "@/types/book"
import { RatingStars } from "@/components/ui/RatingStars"
import { Edit, Info, Star, Trash2, BookOpen } from "lucide-react"

interface BookCardProps {
  book: Book
  onEdit: (book: Book) => void
  onDelete: (id: string) => void
  onToggleFavorite: (id: string) => void
  onShowDetails: (book: Book) => void
}

export function BookCard({ book, onEdit, onDelete, onToggleFavorite, onShowDetails }: BookCardProps) {
  const progressColor = book.progress === 100 
    ? "bg-green-500" 
    : book.progress >= 50 
      ? "bg-blue-500" 
      : book.progress > 0 
        ? "bg-yellow-500" 
        : "bg-gray-300"

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return null
    return new Date(date).toLocaleDateString("ru-RU")
  }

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 ease-out hover:-translate-y-2 overflow-hidden h-full flex flex-col">
      {/* Cover */}
      <div className="relative overflow-hidden">
        <div 
          className="h-56 bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-105"
          style={book.cover ? { backgroundImage: `url(${book.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
          {!book.cover && (
            <BookOpen className="w-16 h-16 text-white/80 transition-transform duration-500 ease-out group-hover:scale-105" />
          )}
        </div>
        {/* Overlay on hover - более мягкий */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium text-white ${statusColors[book.status]} transition-all duration-300`}>
          {statusLabels[book.status]}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 mb-1">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {book.author}
        </p>
        
        {book.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {book.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-3">
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">
            {book.year || "Год неизвестен"}
          </span>
          <RatingStars rating={book.rating} readonly size="sm" />
        </div>

        {book.genre && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span className="font-medium">Жанр:</span> {book.genre}
          </p>
        )}

        {book.progress > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Прогресс</span>
              <span>{book.progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full ${progressColor} transition-all duration-300`}
                style={{ width: `${book.progress}%` }}
              />
            </div>
          </div>
        )}

        {book.pages && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span className="font-medium">Страниц:</span> {book.pages}
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => onEdit(book)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-300 ease-out hover:scale-105"
            title="Редактировать"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onShowDetails(book)}
            className="p-2 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 rounded-lg transition-all duration-300 ease-out hover:scale-105"
            title="Подробнее"
          >
            <Info size={18} />
          </button>
          <button
            onClick={() => onToggleFavorite(book.id)}
            className={`p-2 rounded-lg transition-all duration-300 ease-out hover:scale-105 ${
              book.status === "FAVORITE"
                ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/30"
                : "text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
            title="В избранное"
          >
            <Star size={18} className={`transition-all duration-300 ${book.status === "FAVORITE" ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={() => onDelete(book.id)}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-300 ease-out hover:scale-105"
            title="Удалить"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-900/50 text-xs text-gray-500 dark:text-gray-400">
        Добавлено: {formatDate(book.createdAt)}
      </div>
    </div>
  )
}


