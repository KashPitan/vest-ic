import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface PageProps {
  children: React.ReactNode;
  headerDate: string;
  footerDate: string;
}

const Page = ({ children, headerDate, footerDate }: PageProps) => {
  return (
    // 295mm page height (see downloadFactsheetButton) = 1115px
    <div className="pdf-page max-h-[1115px] min-h-[1115px] relative">
      <Header headerDate={headerDate} />

      {/* height = 1115 - 80 (header height) - 16 (footer height) */}
      <div className="absolute inset-x-0 top-[80px] max-h-[1019px] min-h-[1019px]">
        {children}
      </div>

      <Footer footerDate={footerDate} />
    </div>
  );
};

export default Page;
