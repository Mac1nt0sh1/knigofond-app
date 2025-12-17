import { NextRequest, NextResponse } from "next/server"

interface OpenLibraryBook {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
  isbn?: string[]
  cover_i?: number
  subject?: string[]
  number_of_pages_median?: number
}

interface SearchResult {
  title: string
  author: string
  year: number | null
  isbn: string | null
  cover: string | null
  genre: string | null
  pages: number | null
  description: string | null
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")
  const isbn = searchParams.get("isbn")

  if (!query && !isbn) {
    return NextResponse.json({ error: "Укажите поисковый запрос" }, { status: 400 })
  }

  try {
    let results: SearchResult[] = []

    if (isbn) {
      // Поиск по ISBN
      const response = await fetch(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`,
        { next: { revalidate: 3600 } }
      )
      const data = await response.json()
      
      const bookData = data[`ISBN:${isbn}`]
      if (bookData) {
        results.push({
          title: bookData.title || "",
          author: bookData.authors?.[0]?.name || "Неизвестный автор",
          year: bookData.publish_date ? parseInt(bookData.publish_date.match(/\d{4}/)?.[0] || "") || null : null,
          isbn: isbn,
          cover: bookData.cover?.medium || bookData.cover?.large || null,
          genre: bookData.subjects?.[0]?.name || null,
          pages: bookData.number_of_pages || null,
          description: bookData.description?.value || bookData.description || null
        })
      }
    } else if (query) {
      // Поиск по названию/автору
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10&fields=key,title,author_name,first_publish_year,isbn,cover_i,subject,number_of_pages_median`,
        { next: { revalidate: 3600 } }
      )
      const data = await response.json()

      results = (data.docs as OpenLibraryBook[]).map((book) => ({
        title: book.title,
        author: book.author_name?.[0] || "Неизвестный автор",
        year: book.first_publish_year || null,
        isbn: book.isbn?.[0] || null,
        cover: book.cover_i 
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
          : null,
        genre: book.subject?.[0] || null,
        pages: book.number_of_pages_median || null,
        description: null
      }))
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Ошибка поиска" }, { status: 500 })
  }
}

