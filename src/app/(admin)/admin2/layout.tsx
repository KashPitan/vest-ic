import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "../../globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Admin Dashboard | Vest IC",
  description: "Admin dashboard for managing Vest IC content and settings.",
};

const inter = Inter({ subsets: ["latin"] });

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex flex-col min-h-screen">
            <main className="flex-1 flex items-start justify-center py-8">
              {children}
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default AdminLayout;
