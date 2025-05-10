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
      <div className="relative flex flex-col w-full">
        {/* Background graphic */}
        <div className="absolute inset-0 -z-10 opacity-10">
          <Image
            src="/landscape-placeholder.svg?height=1200&width=1200"
            alt="Background graphic"
            fill
            className="object-cover"
          />
        </div>

        <main className="flex-1 flex items-start justify-center py-8">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
