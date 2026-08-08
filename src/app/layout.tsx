import type { Metadata } from 'next' // Force HMR for CSS
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from "@/shared/providers/ThemeProvider";
import { SmoothScrollProvider } from "@/shared/providers/SmoothScrollProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CricketZone - Enterprise Cricket Management OS",
  description: "The complete operating system for modern cricket organizations. Manage tournaments, score matches live, and engage fans on one powerful platform.",
  openGraph: {
    title: "CricketZone - Enterprise Cricket OS",
    description: "Manage tournaments, score live, and engage fans.",
    type: "website",
    url: "https://cricketzone.com",
    siteName: "CricketZone"
  },
  twitter: {
    card: "summary_large_image",
    title: "CricketZone - Enterprise Cricket OS",
    description: "The operating system for modern cricket organizations.",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CricketZone",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-base overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScrollProvider>
            {children}
            <Toaster 
              position="top-right" 
              toastOptions={{
                className: 'bg-bg-surface text-white border border-bg-elevated',
                style: { background: '#111111', color: '#fff', border: '1px solid #222222' }
              }} 
            />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
