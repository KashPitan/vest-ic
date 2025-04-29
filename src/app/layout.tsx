import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/public/home-page/theme-provider";
import Header from "@/components/public/home-page/header";
import Footer from "@/components/public/home-page/footer";
import Gradient from "./Gradient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vest IC | The Protein Revolution",
  description:
    "Vest IC is revolutionizing the protein industry with cutting-edge AI technology.",
};

function BackgroundGraphic() {
  return (
    <div className="absolute inset-0 -z-10">
      <Gradient />
    </div>
  );
}

function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex-1 flex items-center justify-center py-8">
        {children}
      </div>
      <Footer />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}  min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex flex-col min-h-screen">
            <BackgroundGraphic />
            <MainContent>{children}</MainContent>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
