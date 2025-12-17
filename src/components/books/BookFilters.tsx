"use client"

import { BookStatus, statusLabels, allGenres } from "@/types/book"
import { Search, Filter, RotateCcw } from "lucide-react"

interface BookFiltersProps {
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
  onReset: () => void
}

export function BookFilters({
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
  onReset
}: BookFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg sticky top-5">
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск книг..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
          <Filter className="w-4 h-4" />
          Фильтры
        </h3>

        <div className="space-y-3">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">Все статусы</option>
            {(Object.keys(statusLabels) as BookStatus[]).map(s => (
              <option key={s} value={s}>{statusLabels[s]}</option>
            ))}
          </select>

          <select
            value={genre}
            onChange={(e) => onGenreChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">Все жанры</option>
            {allGenres.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <select
            value={rating}
            onChange={(e) => onRatingChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="">Все рейтинги</option>
            <option value="5">⭐⭐⭐⭐⭐ (5)</option>
            <option value="4">⭐⭐⭐⭐ (4+)</option>
            <option value="3">⭐⭐⭐ (3+)</option>
            <option value="2">⭐⭐ (2+)</option>
            <option value="1">⭐ (1+)</option>
          </select>

          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Сбросить фильтры
          </button>
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Сортировка
        </h3>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          <option value="createdAt">По дате добавления</option>
          <option value="title">По названию</option>
          <option value="author">По автору</option>
          <option value="rating">По рейтингу</option>
          <option value="year">По году</option>
        </select>
      </div>
    </div>
  )
}


