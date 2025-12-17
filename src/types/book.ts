export type BookStatus = 
  | "WANT_TO_READ"   // Хочу прочитать
  | "READING"        // Читаю сейчас
  | "READ"           // Прочитано
  | "FAVORITE"       // Любимая
  | "ABANDONED"      // Брошено

export interface Book {
  id: string
  title: string
  author: string
  year?: number | null
  isbn?: string | null
  genre?: string | null
  status: BookStatus
  rating: number
  progress: number
  startDate?: Date | string | null
  endDate?: Date | string | null
  description?: string | null
  notes?: string | null
  cover?: string | null
  recommend: boolean
  pages?: number | null
  createdAt: Date | string
  updatedAt: Date | string
  userId: string
}

export interface BookFormData {
  title: string
  author: string
  year?: number | null
  isbn?: string | null
  genre?: string | null
  status: BookStatus
  rating: number
  progress: number
  startDate?: string | null
  endDate?: string | null
  description?: string | null
  notes?: string | null
  cover?: string | null
  recommend: boolean
  pages?: number | null
}

export const statusLabels: Record<BookStatus, string> = {
  WANT_TO_READ: "Хочу прочитать",
  READING: "Читаю сейчас",
  READ: "Прочитано",
  FAVORITE: "Любимая",
  ABANDONED: "Брошено"
}

export const statusColors: Record<BookStatus, string> = {
  WANT_TO_READ: "bg-yellow-500",
  READING: "bg-blue-500",
  READ: "bg-green-500",
  FAVORITE: "bg-red-500",
  ABANDONED: "bg-gray-500"
}

export const allGenres = [
  'Роман', 'Фантастика', 'Фэнтези', 'Детектив', 'Триллер', 'Ужасы',
  'Научная литература', 'Биография', 'Исторический', 'Поэзия', 'Драма',
  'Комедия', 'Приключения', 'Детская', 'Психология', 'Философия',
  'Бизнес', 'Саморазвитие', 'Кулинария', 'Искусство'
]


