import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/public/home-page/theme-provider";
import Header from "@/components/public/home-page/header";
import Footer from "@/components/public/home-page/footer";
import BackgroundGraphic from "@/components/public/background-graphic/BackgroundGraphic";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex flex-col min-h-screen w-full">
            {/* Background graphic */}
            <div className="absolute inset-0 -z-10">
              <BackgroundGraphic />
            </div>

            <Header />

            <main className="flex-1 flex justify-center py-8">
              {children}
            </main>

            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
