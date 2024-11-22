import { Nav, Navbar } from "@/components/Navbar";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Prompt } from 'next/font/google'


export const metadata = {
  title: "Mosen's Portfolio",
  description: "A Next js Portfolio site",
};
const prompt = Prompt({ weight: ['400', '100','200','300', '500','600', '700', '800','900'], subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en"   suppressHydrationWarning>
           <body className={cn("bg-background text-foreground scroll-smooth", prompt.className)}>

        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <main className="max-w-7xl m-auto p-10 space-y-10">
            <Nav/>
            {children}
            </main>
          </ThemeProvider>
      </body>
    </html>
  );
}
