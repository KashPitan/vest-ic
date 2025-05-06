import BackgroundGraphic from "@/components/public/background-graphic/BackgroundGraphic";
import Footer from "@/components/public/home-page/footer";
import Header from "@/components/public/home-page/header";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

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
        {/* Background graphic */}
        <div className="absolute inset-0 -z-10">
          <BackgroundGraphic />
        </div>

        <Header />

        <main className="flex-1 flex items-center justify-center py-8">
          {children}
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Layout;
