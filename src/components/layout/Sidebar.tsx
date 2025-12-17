"use client"

import { BookFilters } from "@/components/books/BookFilters"
import { ReadingGoal } from "@/components/goals/ReadingGoal"
import { Plus, Zap, Barcode, BarChart3 } from "lucide-react"

interface SidebarProps {
  search: string
  status: string
  genre: string
  rating: string
  sortBy: string
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onGenreChange: (value: string) => void
  onRatingChange: (value: string) => void
  onSortChange: (value: string) => void
  onResetFilters: () => void
  onAddBook: () => void
  onQuickAdd: () => void
  onScanISBN: () => void
  stats: {
    totalBooks: number
    readBooks: number
    readingBooks: number
    avgRating: string
  }
}

export function Sidebar({
  search,
  status,
  genre,
  rating,
  sortBy,
  onSearchChange,
  onStatusChange,
  onGenreChange,
  onRatingChange,
  onSortChange,
  onResetFilters,
  onAddBook,
  onQuickAdd,
  onScanISBN,
  stats
}: SidebarProps) {
  return (
    <div className="space-y-6">
      {/* Reading Goal */}
      <ReadingGoal />

      {/* Filters */}
      <BookFilters
        search={search}
        status={status}
        genre={genre}
        rating={rating}
        sortBy={sortBy}
        onSearchChange={onSearchChange}
        onStatusChange={onStatusChange}
        onGenreChange={onGenreChange}
        onRatingChange={onRatingChange}
        onSortChange={onSortChange}
        onReset={onResetFilters}
      />

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-4">
          <Zap className="w-4 h-4" />
          Быстрые действия
        </h3>
        <div className="space-y-2">
          <button
            onClick={onAddBook}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Добавить книгу
          </button>
          <button
            onClick={onQuickAdd}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Zap className="w-4 h-4" />
            Быстрое добавление
          </button>
          <button
            onClick={onScanISBN}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
          >
            <Barcode className="w-4 h-4" />
            Сканировать ISBN
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-4">
          <BarChart3 className="w-4 h-4" />
          Статистика
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Всего книг:</span>
            <span className="font-bold text-gray-900 dark:text-white">{stats.totalBooks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Прочитано:</span>
            <span className="font-bold text-gray-900 dark:text-white">{stats.readBooks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Читаю сейчас:</span>
            <span className="font-bold text-gray-900 dark:text-white">{stats.readingBooks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Средний рейтинг:</span>
            <span className="font-bold text-gray-900 dark:text-white">{stats.avgRating}</span>
          </div>
        </div>
      </div>
    </div>
  )
}


