"use client"

import { useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { useBooks } from "@/hooks/useBooks"
import { Book, BookFormData } from "@/types/book"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { Modal } from "@/components/ui/Modal"
import { Alert } from "@/components/ui/Alert"
import { BookForm } from "@/components/books/BookForm"
import { BookDetails } from "@/components/books/BookDetails"
import { LibraryTab } from "@/components/tabs/LibraryTab"
import { ReadingTab } from "@/components/tabs/ReadingTab"
import { WishlistTab } from "@/components/tabs/WishlistTab"
import { StatsTab } from "@/components/tabs/StatsTab"
import { ReviewsTab } from "@/components/tabs/ReviewsTab"
import { 
  BookOpen, 
  BookOpenCheck, 
  Star, 
  BarChart3, 
  MessageSquare,
  Plus,
  LogIn
} from "lucide-react"
import Link from "next/link"

type TabType = "library" | "reading" | "wishlist" | "stats" | "reviews"

interface AlertState {
  message: string
  type: "success" | "error" | "warning" | "info"
}

export default function HomePage() {
  const { data: session, status } = useSession()
  const {
    books,
    stats,
    isLoading,
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
    createBook,
    updateBook,
    deleteBook,
    toggleFavorite,
    updateProgress,
    markAsRead,
    startReading,
    fetchBooks,
    fetchStats
  } = useBooks()

  const [activeTab, setActiveTab] = useState<TabType>("library")
  const [isBookModalOpen, setIsBookModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [alert, setAlert] = useState<AlertState | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showAlert = (message: string, type: AlertState["type"]) => {
    setAlert({ message, type })
  }

  const handleAddBook = () => {
    setSelectedBook(null)
    setIsBookModalOpen(true)
  }

  const handleEditBook = (book: Book) => {
    setSelectedBook(book)
    setIsBookModalOpen(true)
    setIsDetailsModalOpen(false)
  }

  const handleShowDetails = (book: Book) => {
    setSelectedBook(book)
    setIsDetailsModalOpen(true)
  }

  const handleDeleteBook = async (id: string) => {
    if (confirm("Удалить эту книгу из библиотеки?")) {
      const success = await deleteBook(id)
      if (success) {
        showAlert("Книга удалена", "warning")
      } else {
        showAlert("Ошибка при удалении книги", "error")
      }
    }
  }

  const handleToggleFavorite = async (id: string) => {
    const success = await toggleFavorite(id)
    if (success) {
      showAlert("Статус книги изменён", "info")
    }
  }

  const handleSubmitBook = async (data: BookFormData) => {
    setIsSubmitting(true)
    try {
      if (selectedBook) {
        const result = await updateBook(selectedBook.id, data)
        if (result) {
          showAlert("Книга обновлена!", "success")
          setIsBookModalOpen(false)
        } else {
          showAlert("Ошибка при обновлении книги", "error")
        }
      } else {
        const result = await createBook(data)
        if (result) {
          showAlert("Книга успешно добавлена!", "success")
          setIsBookModalOpen(false)
        } else {
          showAlert("Ошибка при добавлении книги", "error")
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateProgress = async (id: string, increment: number) => {
    const success = await updateProgress(id, increment)
    if (success) {
      const book = books.find(b => b.id === id)
      if (book && (book.progress || 0) + increment >= 100) {
        showAlert("Книга отмечена как прочитанная!", "success")
        setActiveTab("library")
      } else {
        showAlert("Прогресс обновлён", "info")
      }
    }
  }

  const handleMarkAsRead = async (id: string) => {
    const success = await markAsRead(id)
    if (success) {
      showAlert("Книга отмечена как прочитанная!", "success")
      setActiveTab("library")
    }
  }

  const handleStartReading = async (id: string) => {
    const success = await startReading(id)
    if (success) {
      showAlert("Начато чтение книги!", "success")
      setActiveTab("reading")
    }
  }

  const handleQuickAdd = () => {
    setSelectedBook(null)
    setIsBookModalOpen(true)
  }

  const handleScanISBN = () => {
    showAlert("Функция сканирования ISBN в разработке", "info")
  }

  const handleExport = () => {
    const data = {
      books,
      exportDate: new Date().toISOString()
    }
    const dataStr = JSON.stringify(data, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const fileName = `knigofond_backup_${new Date().toISOString().slice(0, 10)}.json`

    const link = document.createElement("a")
    link.setAttribute("href", dataUri)
    link.setAttribute("download", fileName)
    link.click()

    showAlert("Данные экспортированы", "success")
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      if (data.books && Array.isArray(data.books)) {
        if (confirm(`Импортировать ${data.books.length} книг? Это добавит их к существующим.`)) {
          for (const book of data.books) {
            await createBook(book)
          }
          await fetchBooks()
          await fetchStats()
          showAlert(`Импортировано ${data.books.length} книг`, "success")
        }
      } else {
        showAlert("Неверный формат файла", "error")
      }
    } catch {
      showAlert("Ошибка при чтении файла", "error")
    }

    e.target.value = ""
  }

  const handleClearData = async () => {
    if (confirm("ВНИМАНИЕ! Это удалит ВСЕ книги. Продолжить?")) {
      for (const book of books) {
        await deleteBook(book.id)
      }
      showAlert("Все данные очищены", "warning")
    }
  }

  const tabs = [
    { id: "library" as const, label: "Библиотека", icon: BookOpen },
    { id: "reading" as const, label: "Читаю сейчас", icon: BookOpenCheck },
    { id: "wishlist" as const, label: "Хочу прочитать", icon: Star },
    { id: "stats" as const, label: "Аналитика", icon: BarChart3 },
    { id: "reviews" as const, label: "Отзывы", icon: MessageSquare }
  ]

  // Show loading
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <BookOpen className="w-24 h-24 mx-auto text-blue-600 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Добро пожаловать в Книгофонд Pro
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Ваша персональная библиотека для отслеживания прочитанных книг, 
              создания списков чтения и анализа читательских привычек.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
              >
                <LogIn className="w-5 h-5" />
                Войти или зарегистрироваться
              </Link>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <BookOpen className="w-12 h-12 text-blue-600 mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Управляйте библиотекой
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Добавляйте книги, отмечайте прогресс чтения и оставляйте заметки
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <BarChart3 className="w-12 h-12 text-green-600 mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Анализируйте статистику
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Следите за своими читательскими достижениями и прогрессом
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <Star className="w-12 h-12 text-yellow-500 mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Создавайте списки
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Планируйте чтение и отмечайте любимые книги
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <Navbar
        onExport={handleExport}
        onImport={handleImport}
        onClearData={handleClearData}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileImport}
        className="hidden"
      />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <Sidebar
              search={search}
              status={statusFilter}
              genre={genreFilter}
              rating={ratingFilter}
              sortBy={sortBy}
              onSearchChange={setSearch}
              onStatusChange={setStatusFilter}
              onGenreChange={setGenreFilter}
              onRatingChange={setRatingFilter}
              onSortChange={setSortBy}
              onResetFilters={resetFilters}
              onAddBook={handleAddBook}
              onQuickAdd={handleQuickAdd}
              onScanISBN={handleScanISBN}
              stats={{
                totalBooks: stats.totalBooks,
                readBooks: stats.readBooks,
                readingBooks: stats.readingBooks,
                avgRating: stats.avgRating
              }}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-6 overflow-hidden">
              <div className="flex overflow-x-auto">
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-all duration-300 ${
                      activeTab === tab.id
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <tab.icon className={`w-5 h-5 transition-transform duration-300 ${activeTab === tab.id ? "scale-110" : ""}`} />
                    <span>{tab.label}</span>
                    {/* Active indicator */}
                    <span 
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-transform duration-300 origin-left ${
                        activeTab === tab.id ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {tabs.find(t => t.id === activeTab)?.icon && (
                    <span>{(() => {
                      const Icon = tabs.find(t => t.id === activeTab)!.icon
                      return <Icon className="w-6 h-6" />
                    })()}</span>
                  )}
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                {activeTab === "library" && (
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="createdAt">По дате добавления</option>
                    <option value="title">По названию</option>
                    <option value="author">По автору</option>
                    <option value="rating">По рейтингу</option>
                    <option value="year">По году</option>
                  </select>
                )}
              </div>

              {activeTab === "library" && (
                <LibraryTab
                  books={books}
                  isLoading={isLoading}
                  onEdit={handleEditBook}
                  onDelete={handleDeleteBook}
                  onToggleFavorite={handleToggleFavorite}
                  onShowDetails={handleShowDetails}
                  onAddBook={handleAddBook}
                />
              )}

              {activeTab === "reading" && (
                <ReadingTab
                  books={books}
                  onUpdateProgress={handleUpdateProgress}
                  onMarkAsRead={handleMarkAsRead}
                />
              )}

              {activeTab === "wishlist" && (
                <WishlistTab
                  books={books}
                  onStartReading={handleStartReading}
                  onDelete={handleDeleteBook}
                />
              )}

              {activeTab === "stats" && (
                <StatsTab books={books} stats={stats} />
              )}

              {activeTab === "reviews" && (
                <ReviewsTab books={books} onEdit={handleEditBook} />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={handleAddBook}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-400 ease-out hover:scale-105 hover:shadow-xl z-30 group animate-fade-in-up"
      >
        <Plus className="w-6 h-6 transition-transform duration-400 ease-out group-hover:rotate-45" />
      </button>

      {/* Book Form Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title={selectedBook ? "Редактировать книгу" : "Добавить книгу"}
        size="xl"
      >
        <BookForm
          book={selectedBook}
          onSubmit={handleSubmitBook}
          onCancel={() => setIsBookModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Book Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Информация о книге"
        size="lg"
      >
        {selectedBook && (
          <BookDetails
            book={selectedBook}
            onEdit={() => handleEditBook(selectedBook)}
            onClose={() => setIsDetailsModalOpen(false)}
          />
        )}
      </Modal>

      {/* Alert */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  )
}
