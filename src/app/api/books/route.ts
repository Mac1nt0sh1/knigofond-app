import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - получить все книги пользователя
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const genre = searchParams.get("genre")
    const rating = searchParams.get("rating")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      userId: session.user.id
    }

    if (status) {
      where.status = status
    }

    if (genre) {
      where.genre = {
        contains: genre,
        mode: "insensitive"
      }
    }

    if (rating) {
      where.rating = {
        gte: parseInt(rating)
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } }
      ]
    }

    const books = await prisma.book.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder
      }
    })

    return NextResponse.json(books)
  } catch (error) {
    console.error("Error fetching books:", error)
    return NextResponse.json(
      { error: "Ошибка при получении книг" },
      { status: 500 }
    )
  }
}

// POST - создать новую книгу
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      author,
      year,
      isbn,
      genre,
      status,
      rating,
      progress,
      startDate,
      endDate,
      description,
      notes,
      cover,
      recommend,
      pages
    } = body

    if (!title || !author) {
      return NextResponse.json(
        { error: "Название и автор обязательны" },
        { status: 400 }
      )
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        year: year ? parseInt(year) : null,
        isbn,
        genre,
        status: status || "WANT_TO_READ",
        rating: rating || 0,
        progress: progress || 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        description,
        notes,
        cover,
        recommend: recommend || false,
        pages: pages ? parseInt(pages) : null,
        userId: session.user.id
      }
    })

    return NextResponse.json(book)
  } catch (error) {
    console.error("Error creating book:", error)
    return NextResponse.json(
      { error: "Ошибка при создании книги" },
      { status: 500 }
    )
  }
}


