import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Navigation from "@/components/Navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Momo & J",
  description: "Our universe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative text-slate-900 dark:text-slate-50 pt-20">
        {/* Global Background Image */}
        <div className="fixed inset-0 z-[-2]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/background.jpg')" }}
          />
        </div>
        {/* Global Background Overlay for Readability */}
        <div className="fixed inset-0 z-[-1] bg-white/40 dark:bg-black/60 backdrop-blur-md" />

        <Navigation />
        <main className="flex-1 flex flex-col p-4 md:p-8">{children}</main>
      </body>
    </html>
  );
}
