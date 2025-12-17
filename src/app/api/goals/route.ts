import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - получить цель на текущий год
export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const currentYear = new Date().getFullYear()

  try {
    const goal = await prisma.readingGoal.findUnique({
      where: {
        userId_year: {
          userId: session.user.id,
          year: currentYear
        }
      }
    })

    // Получаем количество прочитанных книг за год
    const booksReadThisYear = await prisma.book.count({
      where: {
        userId: session.user.id,
        status: "READ",
        endDate: {
          gte: new Date(currentYear, 0, 1),
          lt: new Date(currentYear + 1, 0, 1)
        }
      }
    })

    // Также считаем книги без endDate, но с updatedAt в этом году и статусом READ
    const booksReadNoEndDate = await prisma.book.count({
      where: {
        userId: session.user.id,
        status: "READ",
        endDate: null,
        updatedAt: {
          gte: new Date(currentYear, 0, 1),
          lt: new Date(currentYear + 1, 0, 1)
        }
      }
    })

    const totalRead = booksReadThisYear + booksReadNoEndDate

    return NextResponse.json({
      goal: goal?.target || 0,
      year: currentYear,
      completed: totalRead,
      percentage: goal?.target ? Math.round((totalRead / goal.target) * 100) : 0
    })
  } catch (error) {
    console.error("Goal fetch error:", error)
    return NextResponse.json({ error: "Ошибка получения цели" }, { status: 500 })
  }
}

// POST - установить/обновить цель
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { target, year } = await request.json()
    const goalYear = year || new Date().getFullYear()

    if (!target || target < 1 || target > 365) {
      return NextResponse.json(
        { error: "Цель должна быть от 1 до 365 книг" },
        { status: 400 }
      )
    }

    const goal = await prisma.readingGoal.upsert({
      where: {
        userId_year: {
          userId: session.user.id,
          year: goalYear
        }
      },
      update: { target },
      create: {
        userId: session.user.id,
        year: goalYear,
        target
      }
    })

    return NextResponse.json(goal)
  } catch (error) {
    console.error("Goal set error:", error)
    return NextResponse.json({ error: "Ошибка установки цели" }, { status: 500 })
  }
}

