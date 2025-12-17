import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - получить статистику книг пользователя
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Общее количество книг
    const totalBooks = await prisma.book.count({
      where: { userId }
    })

    // Прочитанные книги
    const readBooks = await prisma.book.count({
      where: {
        userId,
        status: { in: ["READ", "FAVORITE"] }
      }
    })

    // Читаю сейчас
    const readingBooks = await prisma.book.count({
      where: {
        userId,
        status: "READING"
      }
    })

    // Хочу прочитать
    const wantToReadBooks = await prisma.book.count({
      where: {
        userId,
        status: "WANT_TO_READ"
      }
    })

    // Средний рейтинг
    const ratingResult = await prisma.book.aggregate({
      where: {
        userId,
        rating: { gt: 0 }
      },
      _avg: {
        rating: true
      }
    })

    // Статистика по жанрам
    const genreStats = await prisma.book.groupBy({
      by: ["genre"],
      where: {
        userId,
        genre: { not: null }
      },
      _count: {
        genre: true
      }
    })

    // Статистика по месяцам (книги с датой окончания)
    const booksWithEndDate = await prisma.book.findMany({
      where: {
        userId,
        endDate: { not: null }
      },
      select: {
        endDate: true
      }
    })

    const monthlyStats: Record<string, number> = {}
    booksWithEndDate.forEach(book => {
      if (book.endDate) {
        const monthKey = book.endDate.toISOString().substring(0, 7)
        monthlyStats[monthKey] = (monthlyStats[monthKey] || 0) + 1
      }
    })

    return NextResponse.json({
      totalBooks,
      readBooks,
      readingBooks,
      wantToReadBooks,
      avgRating: ratingResult._avg.rating?.toFixed(1) || "0.0",
      genreStats: genreStats.map(g => ({
        genre: g.genre,
        count: g._count.genre
      })),
      monthlyStats
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { error: "Ошибка при получении статистики" },
      { status: 500 }
    )
  }
}


