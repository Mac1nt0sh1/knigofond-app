import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    // Проверяем наличие DATABASE_URL
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL is not set")
      return NextResponse.json(
        { error: "Ошибка конфигурации сервера" },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { name, email, password } = body

    // Валидация входных данных
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Заполните все поля" },
        { status: 400 }
      )
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Некорректный email адрес" },
        { status: 400 }
      )
    }

    // Валидация пароля
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Пароль должен содержать минимум 6 символов" },
        { status: 400 }
      )
    }

    // Проверяем, существует ли пользователь
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 400 }
      )
    }

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 12)

    // Создаём пользователя
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error: any) {
    console.error("Registration error:", error)
    
    // Обработка специфичных ошибок Prisma
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 400 }
      )
    }

    if (error?.code === 'P1001' || error?.code === 'P1003') {
      return NextResponse.json(
        { error: "Ошибка подключения к базе данных. Попробуйте позже." },
        { status: 503 }
      )
    }

    // Общая ошибка
    return NextResponse.json(
      { 
        error: process.env.NODE_ENV === 'development' 
          ? error?.message || "Ошибка при регистрации"
          : "Ошибка при регистрации. Попробуйте позже."
      },
      { status: 500 }
    )
  }
}


