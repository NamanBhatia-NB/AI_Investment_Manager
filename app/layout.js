import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ScrollProvider } from "@/components/ScrollContext";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AI Investment Manager",
  description: "AI website to manage investments",
};

<link rel="manifest" href="/manifest.json" />

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{
      layout: {
        unsafe_disableDevelopmentModeWarnings: true,
      },
    }}>
      <ScrollProvider>
        <html lang="en">
          <head>
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#ffffff" />
            <script dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/service-worker.js');
                  });
                }
              `
            }} />
          </head>
          <body className={`${inter.className}`}>
            {/* header */}
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Toaster />
            {/* footer */}
            <Footer />
          </body>
        </html>
      </ScrollProvider>
    </ClerkProvider>
  );
}
