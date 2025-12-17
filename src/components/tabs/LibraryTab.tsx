"use client"

import { Book } from "@/types/book"
import { BookCard } from "@/components/books/BookCard"
import { BookOpen, Plus, Loader2 } from "lucide-react"

interface LibraryTabProps {
  books: Book[]
  isLoading: boolean
  onEdit: (book: Book) => void
  onDelete: (id: string) => void
  onToggleFavorite: (id: string) => void
  onShowDetails: (book: Book) => void
  onAddBook: () => void
}

export function LibraryTab({
  books,
  isLoading,
  onEdit,
  onDelete,
  onToggleFavorite,
  onShowDetails,
  onAddBook
}: LibraryTabProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">Загрузка книг...</p>
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in-up">
        <div className="animate-float">
          <BookOpen className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
          Библиотека пуста
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Начните собирать свою коллекцию книг! Добавьте первую книгу прямо сейчас.
        </p>
        <button
          onClick={onAddBook}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          Добавить книгу
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {books.map((book, index) => (
        <div
          key={book.id}
          className="animate-fade-in-up"
          style={{ 
            animationDelay: `${Math.min(index * 0.08, 0.6)}s`,
            animationFillMode: 'backwards'
          }}
        >
          <BookCard
            book={book}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleFavorite={onToggleFavorite}
            onShowDetails={onShowDetails}
          />
        </div>
      ))}
    </div>
  )
}


