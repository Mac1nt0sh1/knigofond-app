"use client"

import { useState, useEffect, useCallback } from "react"
import { Book, BookFormData, BookStatus, allGenres, statusLabels } from "@/types/book"
import { RatingStars } from "@/components/ui/RatingStars"
import { Search, Loader2, BookOpen } from "lucide-react"

interface BookFormProps {
  book?: Book | null
  onSubmit: (data: BookFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

interface SearchResult {
  title: string
  author: string
  year: number | null
  isbn: string | null
  cover: string | null
  genre: string | null
  pages: number | null
  description: string | null
}

const defaultFormData: BookFormData = {
  title: "",
  author: "",
  year: null,
  isbn: null,
  genre: null,
  status: "WANT_TO_READ",
  rating: 0,
  progress: 0,
  startDate: null,
  endDate: null,
  description: null,
  notes: null,
  cover: null,
  recommend: false,
  pages: null
}

export function BookForm({ book, onSubmit, onCancel, isLoading }: BookFormProps) {
  const [formData, setFormData] = useState<BookFormData>(defaultFormData)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        year: book.year,
        isbn: book.isbn,
        genre: book.genre,
        status: book.status,
        rating: book.rating,
        progress: book.progress,
        startDate: book.startDate ? new Date(book.startDate).toISOString().split("T")[0] : null,
        endDate: book.endDate ? new Date(book.endDate).toISOString().split("T")[0] : null,
        description: book.description,
        notes: book.notes,
        cover: book.cover,
        recommend: book.recommend,
        pages: book.pages
      })
    } else {
      setFormData(defaultFormData)
    }
  }, [book])

  // Поиск книг онлайн
  const searchBooks = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setSearchResults(data.results || [])
      setShowResults(true)
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Debounce поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchBooks(searchQuery)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery, searchBooks])

  const selectSearchResult = (result: SearchResult) => {
    setFormData(prev => ({
      ...prev,
      title: result.title,
      author: result.author,
      year: result.year,
      isbn: result.isbn,
      cover: result.cover,
      genre: result.genre || prev.genre,
      pages: result.pages,
      description: result.description || prev.description
    }))
    setShowResults(false)
    setSearchQuery("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" 
        ? (e.target as HTMLInputElement).checked 
        : type === "number" 
          ? value ? parseInt(value) : null
          : value || null
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Поиск книг онлайн */}
      {!book && (
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            🔍 Найти книгу онлайн
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              className="w-full pl-12 pr-4 py-3 border border-blue-300 dark:border-blue-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white bg-blue-50 dark:bg-blue-900/20"
              placeholder="Введите название или автора для поиска..."
            />
            {isSearching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin" />
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Данные загружаются из OpenLibrary — обложка и информация заполнятся автоматически
          </p>

          {/* Результаты поиска */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectSearchResult(result)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  {result.cover ? (
                    <img
                      src={result.cover}
                      alt={result.title}
                      className="w-12 h-16 object-cover rounded shadow"
                    />
                  ) : (
                    <div className="w-12 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded shadow flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white/80" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {result.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {result.author} {result.year && `• ${result.year}`}
                    </p>
                    {result.pages && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {result.pages} стр.
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {showResults && searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
            <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 text-center text-gray-500 dark:text-gray-400">
              Книги не найдены. Попробуйте другой запрос или заполните форму вручную.
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Левая колонка */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Название книги *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Введите название"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Автор(ы) *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Несколько авторов через запятую"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Год издания
              </label>
              <input
                type="number"
                name="year"
                value={formData.year || ""}
                onChange={handleChange}
                min="1000"
                max={new Date().getFullYear()}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ISBN
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="978-5-XXXXX-XXX-X"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Жанр(ы)
            </label>
            <input
              type="text"
              name="genre"
              value={formData.genre || ""}
              onChange={handleChange}
              list="genres"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Роман, Фантастика"
            />
            <datalist id="genres">
              {allGenres.map(genre => (
                <option key={genre} value={genre} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Количество страниц
            </label>
            <input
              type="number"
              name="pages"
              value={formData.pages || ""}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Правая колонка */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Статус
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {(Object.keys(statusLabels) as BookStatus[]).map(status => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Мой рейтинг
            </label>
            <RatingStars
              rating={formData.rating}
              onChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
              size="lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Прогресс чтения: {formData.progress}%
            </label>
            <input
              type="range"
              name="progress"
              value={formData.progress}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Дата начала
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Дата окончания
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Полноширинные поля */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Описание
        </label>
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
          placeholder="Краткое описание книги..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Мои заметки
        </label>
        <textarea
          name="notes"
          value={formData.notes || ""}
          onChange={handleChange}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
          placeholder="Цитаты, мысли, впечатления..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Обложка
        </label>
        <div className="flex gap-4">
          {formData.cover && (
            <div className="flex-shrink-0">
              <img
                src={formData.cover}
                alt="Обложка"
                className="w-20 h-28 object-cover rounded-lg shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          )}
          <div className="flex-1">
            <input
              type="url"
              name="cover"
              value={formData.cover || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="https://example.com/cover.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.cover ? "Обложка загружена автоматически" : "Используйте поиск выше для автоматической загрузки"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="recommend"
          id="recommend"
          checked={formData.recommend}
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="recommend" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Рекомендую эту книгу
        </label>
      </div>

      {/* Кнопки */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Сохранение..." : book ? "Обновить книгу" : "Сохранить книгу"}
        </button>
      </div>
    </form>
  )
}


