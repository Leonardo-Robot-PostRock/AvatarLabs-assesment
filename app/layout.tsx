import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Content Approval Engine | 5-Star Brand",
  description: "Streamline your content approval workflow with our intuitive platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}