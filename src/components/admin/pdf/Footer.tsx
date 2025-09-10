import { articulat } from "@/fonts";

interface FooterProps {
  footerDate: string | null;
}

export default function Footer({ footerDate }: FooterProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 min-h-[16px]">
      <p className={`${articulat.className} text-xs text-center`}>
        Data as of {footerDate || "N/A"}. Please see important information at
        the end of the document.
      </p>
    </div>
  );
}
