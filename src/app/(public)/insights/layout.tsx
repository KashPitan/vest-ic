import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Vest IC | The Protein Revolution",
  description:
    "Vest IC is revolutionizing the protein industry with cutting-edge AI technology.",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
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
    </ThemeProvider>
  );
};

export default Layout;
