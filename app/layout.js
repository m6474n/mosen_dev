import Menu from "@/components/Menu";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Source_Code_Pro } from 'next/font/google'
import Footer from "@/components/Footer";


export const metadata = {
  title: "Mosen's Portfolio",
  description: "A Next js Portfolio site",
};
const code = Source_Code_Pro({ weight: ['400','200','300', '500','600', '700', '800','900'], subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en"   suppressHydrationWarning>
           <body className={cn("bg-background text-foreground scroll-smooth", code.className)}>

        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
           <Menu/>     
         
            {/* <main className="max-w-7xl m-auto p-10 space-y-10"> */}

      
            
            {children}

            <Footer/>
            {/* </main> */}
          </ThemeProvider>
      </body>
    </html>
  );
}
