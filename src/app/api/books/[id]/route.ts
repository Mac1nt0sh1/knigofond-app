import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - получить одну книгу
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 }
      )
    }

    const book = await prisma.book.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!book) {
      return NextResponse.json(
        { error: "Книга не найдена" },
        { status: 404 }
      )
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error("Error fetching book:", error)
    return NextResponse.json(
      { error: "Ошибка при получении книги" },
      { status: 500 }
    )
  }
}

// PUT - обновить книгу
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 }
      )
    }

    // Проверяем, принадлежит ли книга пользователю
    const existingBook = await prisma.book.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existingBook) {
      return NextResponse.json(
        { error: "Книга не найдена" },
        { status: 404 }
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

    const book = await prisma.book.update({
      where: { id },
      data: {
        title,
        author,
        year: year ? parseInt(year) : null,
        isbn,
        genre,
        status,
        rating: rating || 0,
        progress: progress || 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        description,
        notes,
        cover,
        recommend: recommend || false,
        pages: pages ? parseInt(pages) : null
      }
    })

    return NextResponse.json(book)
  } catch (error) {
    console.error("Error updating book:", error)
    return NextResponse.json(
      { error: "Ошибка при обновлении книги" },
      { status: 500 }
    )
  }
}

// DELETE - удалить книгу
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 }
      )
    }

    // Проверяем, принадлежит ли книга пользователю
    const existingBook = await prisma.book.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existingBook) {
      return NextResponse.json(
        { error: "Книга не найдена" },
        { status: 404 }
      )
    }

    await prisma.book.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting book:", error)
    return NextResponse.json(
      { error: "Ошибка при удалении книги" },
      { status: 500 }
    )
  }
}


