import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/public/home-page/theme-provider";
import Header from "@/components/public/home-page/header";
import Footer from "@/components/public/home-page/footer";
import Image from "next/image";
import localFont from "next/font/local";

const articulat = localFont({
  src: "../../public/fonts/articulat/articulatcf-regular.otf",
  weight: "200",
  style: "normal",
});

export const metadata: Metadata = {
  title: "Vest IC | The Protein Revolution",
  description:
    "Vest IC is revolutionizing the protein industry with cutting-edge AI technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${articulat.className} bg-black min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex flex-col min-h-screen">
            {/* Background graphic */}
            <div className="absolute inset-0 -z-10 opacity-10">
              <Image
                src="/placeholder.svg?height=1200&width=1200"
                alt="Background graphic"
                fill
                className="object-cover"
              />
            </div>

            <Header />

            <main className="flex-1 flex items-center justify-center py-8">
              {children}
            </main>

            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
