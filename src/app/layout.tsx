import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { ThemeProvider } from "@/components/providers/ThemeProvider"

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter"
})

export const metadata: Metadata = {
  title: "Книгофонд Pro - Ваша персональная библиотека",
  description: "Управляйте своей библиотекой, отслеживайте прочитанные книги и анализируйте читательские привычки",
  keywords: ["книги", "библиотека", "чтение", "книгофонд", "трекер книг"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
