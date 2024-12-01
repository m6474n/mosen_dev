import Menu from "@/components/Menu";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Source_Code_Pro } from 'next/font/google'

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import Footer from "@/components/Footer";

export const metadata = {
  title: "Mosen's Portfolio",
  description: "A Next js Portfolio site",
};
const code = Source_Code_Pro({ weight: ['400','200','300', '500','600', '700', '800','900'], subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en"   suppressHydrationWarning>
           <body className={cn("bg-background text-foreground scroll-smooth", code.className)}>

        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
           <Menu/>     
         
      
            
            {children}
<Footer/>
          </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
