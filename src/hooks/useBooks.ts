"use client"

import { useState, useCallback, useEffect } from "react"
import { Book, BookFormData } from "@/types/book"

interface Stats {
  totalBooks: number
  readBooks: number
  readingBooks: number
  wantToReadBooks: number
  avgRating: string
  genreStats: { genre: string | null; count: number }[]
  monthlyStats: Record<string, number>
}

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    readBooks: 0,
    readingBooks: 0,
    wantToReadBooks: 0,
    avgRating: "0.0",
    genreStats: [],
    monthlyStats: {}
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [genreFilter, setGenreFilter] = useState("")
  const [ratingFilter, setRatingFilter] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")

  const fetchBooks = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (statusFilter) params.append("status", statusFilter)
      if (genreFilter) params.append("genre", genreFilter)
      if (ratingFilter) params.append("rating", ratingFilter)
      if (sortBy) params.append("sortBy", sortBy)

      const response = await fetch(`/api/books?${params.toString()}`)
      if (!response.ok) {
        if (response.status === 401) {
          setBooks([])
          return
        }
        throw new Error("Failed to fetch books")
      }
      const data = await response.json()
      setBooks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [search, statusFilter, genreFilter, ratingFilter, sortBy])

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/books/stats")
      if (!response.ok) {
        if (response.status === 401) return
        throw new Error("Failed to fetch stats")
      }
      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error("Error fetching stats:", err)
    }
  }, [])

  const createBook = async (data: BookFormData): Promise<Book | null> => {
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error("Failed to create book")
      const book = await response.json()
      await fetchBooks()
      await fetchStats()
      return book
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      return null
    }
  }

  const updateBook = async (id: string, data: BookFormData): Promise<Book | null> => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error("Failed to update book")
      const book = await response.json()
      await fetchBooks()
      await fetchStats()
      return book
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      return null
    }
  }

  const deleteBook = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "DELETE"
      })
      if (!response.ok) throw new Error("Failed to delete book")
      await fetchBooks()
      await fetchStats()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      return false
    }
  }

  const toggleFavorite = async (id: string): Promise<boolean> => {
    const book = books.find(b => b.id === id)
    if (!book) return false

    const newStatus = book.status === "FAVORITE" ? "READ" : "FAVORITE"
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...book, status: newStatus })
      })
      if (!response.ok) throw new Error("Failed to update book")
      await fetchBooks()
      await fetchStats()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      return false
    }
  }

  const updateProgress = async (id: string, increment: number): Promise<boolean> => {
    const book = books.find(b => b.id === id)
    if (!book) return false

    const newProgress = Math.min(100, (book.progress || 0) + increment)
    const formatDate = (date: Date | string | null | undefined) => {
      if (!date) return null
      return typeof date === 'string' ? date.split('T')[0] : date.toISOString().split('T')[0]
    }
    
    const updates = {
      title: book.title,
      author: book.author,
      year: book.year,
      isbn: book.isbn,
      genre: book.genre,
      status: newProgress === 100 ? "READ" as const : book.status,
      rating: book.rating,
      progress: newProgress,
      startDate: formatDate(book.startDate),
      endDate: newProgress === 100 ? new Date().toISOString().split("T")[0] : formatDate(book.endDate),
      description: book.description,
      notes: book.notes,
      cover: book.cover,
      recommend: book.recommend,
      pages: book.pages
    }

    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      })
      if (!response.ok) throw new Error("Failed to update book")
      await fetchBooks()
      await fetchStats()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      return false
    }
  }

  const markAsRead = async (id: string): Promise<boolean> => {
    const book = books.find(b => b.id === id)
    if (!book) return false

    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...book,
          status: "READ",
          progress: 100,
          endDate: new Date().toISOString().split("T")[0]
        })
      })
      if (!response.ok) throw new Error("Failed to update book")
      await fetchBooks()
      await fetchStats()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      return false
    }
  }

  const startReading = async (id: string): Promise<boolean> => {
    const book = books.find(b => b.id === id)
    if (!book) return false

    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...book,
          status: "READING",
          progress: 0,
          startDate: new Date().toISOString().split("T")[0]
        })
      })
      if (!response.ok) throw new Error("Failed to update book")
      await fetchBooks()
      await fetchStats()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      return false
    }
  }

  const resetFilters = () => {
    setSearch("")
    setStatusFilter("")
    setGenreFilter("")
    setRatingFilter("")
    setSortBy("createdAt")
  }

  useEffect(() => {
    fetchBooks()
    fetchStats()
  }, [fetchBooks, fetchStats])

  return {
    books,
    stats,
    isLoading,
    error,
    search,
    statusFilter,
    genreFilter,
    ratingFilter,
    sortBy,
    setSearch,
    setStatusFilter,
    setGenreFilter,
    setRatingFilter,
    setSortBy,
    resetFilters,
    fetchBooks,
    fetchStats,
    createBook,
    updateBook,
    deleteBook,
    toggleFavorite,
    updateProgress,
    markAsRead,
    startReading
  }
}

