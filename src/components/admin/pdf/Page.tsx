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
    // 295mm page height (see downloadFactsheetButton) = 1125px
    <div className="max-h-[1128px] min-h-[1128px] relative">
      <Header headerDate={headerDate} />

      {/* height = 1125 - 80 (header height) - 16 (footer height) */}
      <div className="absolute inset-x-0 top-[80px] max-h-[1029px] min-h-[1029px]">
        {children}
      </div>

      <Footer footerDate={footerDate} />
    </div>
  );
};

export default Page;
