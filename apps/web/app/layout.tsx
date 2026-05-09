import { 
  Geist, 
  Geist_Mono, 
  Noto_Sans, 
  Quicksand, 
  Inter, 
  Outfit, 
  Roboto, 
  Lexend 
} from "next/font/google"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LayoutProvider } from "@/contexts/layout-context"
import { cn } from "@workspace/ui/lib/utils";

const notoSans = Noto_Sans({ subsets: ['latin'], variable: '--font-sans' })
const quicksand = Quicksand({ subsets: ['latin'], variable: '--font-quicksand' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-roboto' })
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html  
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased font-sans", 
        fontMono.variable, 
        notoSans.variable,
        quicksand.variable,
        inter.variable,
        outfit.variable,
        roboto.variable,
        lexend.variable
      )}
    >
      <body>
        <LayoutProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LayoutProvider>
      </body>
    </html>
  )
}
