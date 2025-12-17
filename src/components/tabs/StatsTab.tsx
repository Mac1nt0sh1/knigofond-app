"use client"

import { useEffect, useRef, useMemo } from "react"
import { Chart, registerables } from "chart.js"
import { Book } from "@/types/book"
import { Trophy, Calendar, TrendingUp, BookOpen, Star, Clock, FileText } from "lucide-react"

Chart.register(...registerables)

interface StatsTabProps {
  books: Book[]
  stats: {
    totalBooks: number
    readBooks: number
    readingBooks: number
    wantToReadBooks?: number
    avgRating: string
    genreStats: { genre: string | null; count: number }[]
    monthlyStats: Record<string, number>
  }
}

export function StatsTab({ books, stats }: StatsTabProps) {
  const readingChartRef = useRef<HTMLCanvasElement>(null)
  const genreChartRef = useRef<HTMLCanvasElement>(null)
  const readingChartInstance = useRef<Chart | null>(null)
  const genreChartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    // Reading Chart
    if (readingChartRef.current) {
      if (readingChartInstance.current) {
        readingChartInstance.current.destroy()
      }

      const sortedMonths = Object.keys(stats.monthlyStats).sort()
      const ctx = readingChartRef.current.getContext("2d")
      
      if (ctx) {
        readingChartInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: sortedMonths.map(month => {
              const date = new Date(month + "-01")
              return date.toLocaleDateString("ru-RU", { month: "short" })
            }),
            datasets: [{
              label: "Книг прочитано",
              data: sortedMonths.map(month => stats.monthlyStats[month]),
              borderColor: "#4361ee",
              backgroundColor: "rgba(67, 97, 238, 0.1)",
              borderWidth: 2,
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }
        })
      }
    }

    // Genre Chart
    if (genreChartRef.current) {
      if (genreChartInstance.current) {
        genreChartInstance.current.destroy()
      }

      const topGenres = stats.genreStats
        .filter(g => g.genre)
        .sort((a, b) => b.count - a.count)
        .slice(0, 8)

      const ctx = genreChartRef.current.getContext("2d")
      
      if (ctx) {
        genreChartInstance.current = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: topGenres.map(g => g.genre),
            datasets: [{
              data: topGenres.map(g => g.count),
              backgroundColor: [
                "#4361ee", "#3a0ca3", "#7209b7", "#f72585",
                "#4cc9f0", "#4895ef", "#560bad", "#b5179e"
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom"
              }
            }
          }
        })
      }
    }

    return () => {
      if (readingChartInstance.current) {
        readingChartInstance.current.destroy()
      }
      if (genreChartInstance.current) {
        genreChartInstance.current.destroy()
      }
    }
  }, [stats])

  // Achievements
  const achievements = []
  if (stats.totalBooks >= 1) achievements.push({ name: "Новичок", desc: "Добавьте первую книгу", icon: "🥳", unlocked: true })
  if (stats.totalBooks >= 10) achievements.push({ name: "Коллекционер", desc: "10 книг в библиотеке", icon: "📚", unlocked: true })
  if (stats.totalBooks >= 50) achievements.push({ name: "Библиотекарь", desc: "50 книг в библиотеке", icon: "🏛️", unlocked: stats.totalBooks >= 50 })
  if (stats.readBooks >= 1) achievements.push({ name: "Читатель", desc: "Прочитайте первую книгу", icon: "📖", unlocked: true })
  if (stats.readBooks >= 10) achievements.push({ name: "Книголюб", desc: "Прочитайте 10 книг", icon: "😍", unlocked: stats.readBooks >= 10 })
  if (stats.readBooks >= 50) achievements.push({ name: "Книжный червь", desc: "Прочитайте 50 книг", icon: "🐛", unlocked: stats.readBooks >= 50 })

  const uniqueGenres = new Set<string>()
  books.forEach(book => {
    if (book.genre) {
      book.genre.split(",").forEach(g => uniqueGenres.add(g.trim()))
    }
  })
  if (uniqueGenres.size >= 5) {
    achievements.push({ name: "Разносторонний", desc: "Читайте разные жанры", icon: "🌈", unlocked: true })
  }

  // Monthly stats
  const sortedMonths = Object.keys(stats.monthlyStats).sort().slice(-6)

  // Enhanced statistics
  const enhancedStats = useMemo(() => {
    const readBooks = books.filter(b => b.status === "READ")
    
    // Total pages read
    const totalPages = readBooks.reduce((sum, b) => sum + (b.pages || 0), 0)
    
    // Average pages per book
    const avgPages = readBooks.length > 0 
      ? Math.round(totalPages / readBooks.length)
      : 0

    // Books this year
    const thisYear = new Date().getFullYear()
    const booksThisYear = readBooks.filter(b => {
      const date = b.endDate ? new Date(b.endDate) : new Date(b.updatedAt)
      return date.getFullYear() === thisYear
    }).length

    // Most productive month
    const monthCounts = Object.entries(stats.monthlyStats)
    const mostProductiveMonth = monthCounts.length > 0
      ? monthCounts.reduce((max, curr) => curr[1] > max[1] ? curr : max)
      : null

    // Rating distribution
    const ratingDistribution = [0, 0, 0, 0, 0]
    readBooks.forEach(b => {
      if (b.rating >= 1 && b.rating <= 5) {
        ratingDistribution[b.rating - 1]++
      }
    })

    // Average reading speed (days per book)
    let totalDays = 0
    let booksWithDates = 0
    readBooks.forEach(b => {
      if (b.startDate && b.endDate) {
        const start = new Date(b.startDate)
        const end = new Date(b.endDate)
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        if (days > 0 && days < 365) {
          totalDays += days
          booksWithDates++
        }
      }
    })
    const avgDaysPerBook = booksWithDates > 0 ? Math.round(totalDays / booksWithDates) : 0

    // Favorite author
    const authorCounts: Record<string, number> = {}
    books.forEach(b => {
      if (!authorCounts[b.author]) authorCounts[b.author] = 0
      authorCounts[b.author]++
    })
    const favoriteAuthor = Object.entries(authorCounts)
      .sort((a, b) => b[1] - a[1])[0]

    return {
      totalPages,
      avgPages,
      booksThisYear,
      mostProductiveMonth,
      ratingDistribution,
      avgDaysPerBook,
      favoriteAuthor
    }
  }, [books, stats.monthlyStats])

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
          <BookOpen className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-bold">{stats.readBooks}</p>
          <p className="text-sm text-white/80">Книг прочитано</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white">
          <FileText className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-bold">{enhancedStats.totalPages.toLocaleString()}</p>
          <p className="text-sm text-white/80">Страниц прочитано</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white">
          <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-bold">{enhancedStats.booksThisYear}</p>
          <p className="text-sm text-white/80">Книг в {new Date().getFullYear()}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white">
          <Star className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-bold">{stats.avgRating}</p>
          <p className="text-sm text-white/80">Средний рейтинг</p>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {enhancedStats.avgDaysPerBook > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{enhancedStats.avgDaysPerBook} дн.</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Среднее время на книгу</p>
            </div>
          </div>
        )}
        {enhancedStats.avgPages > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{enhancedStats.avgPages}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Среднее страниц в книге</p>
            </div>
          </div>
        )}
        {enhancedStats.favoriteAuthor && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center text-2xl">
              ✍️
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white truncate">{enhancedStats.favoriteAuthor[0]}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{enhancedStats.favoriteAuthor[1]} книг — любимый автор</p>
            </div>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📈 Динамика чтения
          </h3>
          <div className="h-72">
            <canvas ref={readingChartRef}></canvas>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📊 Жанры
          </h3>
          <div className="h-72">
            <canvas ref={genreChartRef}></canvas>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
          <Star className="w-5 h-5 text-yellow-500" />
          Распределение оценок
        </h3>
        <div className="flex items-end gap-4 h-32">
          {enhancedStats.ratingDistribution.map((count, index) => {
            const maxCount = Math.max(...enhancedStats.ratingDistribution, 1)
            const height = (count / maxCount) * 100
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-lg relative" style={{ height: '100px' }}>
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t-lg transition-all duration-500"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(index + 1)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Achievements & Monthly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Достижения
          </h3>
          <div className="space-y-3">
            {achievements.length > 0 ? (
              achievements.map((ach, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    ach.unlocked ? "bg-gray-50 dark:bg-gray-700" : "bg-gray-100 dark:bg-gray-900 opacity-50"
                  }`}
                >
                  <span className="text-2xl">{ach.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{ach.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{ach.desc}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Достижения появятся здесь</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-4">
            <Calendar className="w-5 h-5 text-blue-500" />
            Чтение по месяцам
          </h3>
          <div className="space-y-3">
            {sortedMonths.length > 0 ? (
              sortedMonths.map(month => {
                const count = stats.monthlyStats[month]
                const monthName = new Date(month + "-01").toLocaleDateString("ru-RU", { month: "long" })
                return (
                  <div key={month}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">{monthName}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{count} кн.</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${Math.min(100, count * 20)}%` }}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Нет данных о прочитанных книгах</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


