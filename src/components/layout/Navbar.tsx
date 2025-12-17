"use client"

import { useSession, signOut } from "next-auth/react"
import { useTheme } from "@/components/providers/ThemeProvider"
import Link from "next/link"
import { 
  BookOpen, 
  Moon, 
  Sun, 
  User, 
  LogOut, 
  Download, 
  Upload, 
  Trash2,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"

interface NavbarProps {
  onExport?: () => void
  onImport?: () => void
  onClearData?: () => void
}

export function Navbar({ onExport, onImport, onClearData }: NavbarProps) {
  const { data: session } = useSession()
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-600 dark:text-blue-400">
            <BookOpen className="w-7 h-7" />
            <span>Книгофонд Pro</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            {session && (
              <>
                <button
                  onClick={onExport}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Экспорт
                </button>
                <button
                  onClick={onImport}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Импорт
                </button>
                <button
                  onClick={onClearData}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Очистить
                </button>
              </>
            )}

            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4" />
                  Светлая тема
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  Тёмная тема
                </>
              )}
            </button>

            {session ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {session.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {session.user?.name || session.user?.email}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                Войти
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-2">
              {session && (
                <>
                  <button
                    onClick={() => { onExport?.(); setIsMenuOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <Download className="w-4 h-4" />
                    Экспорт
                  </button>
                  <button
                    onClick={() => { onImport?.(); setIsMenuOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <Upload className="w-4 h-4" />
                    Импорт
                  </button>
                  <button
                    onClick={() => { onClearData?.(); setIsMenuOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    Очистить
                  </button>
                </>
              )}

              <button
                onClick={() => { toggleTheme(); setIsMenuOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === "dark" ? "Светлая тема" : "Тёмная тема"}
              </button>

              {session ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {session.user?.name || session.user?.email}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    Выйти
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <User className="w-4 h-4" />
                  Войти
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}


