import PDF from "@/components/admin/PDF";
import * as XLSX from "xlsx";
import DownloadFactsheetButton from "@/app/(public)/fund-info/DownloadFactsheetButton";

interface PdfPreviewProps {
  workbook: XLSX.WorkBook;
  fileName: string;
}

export default function PdfPreview({ workbook, fileName }: PdfPreviewProps) {
  return (
    // preview width is set to match the width of the generated pdf
    <div className="items-center">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">PDF Preview</h2>
        <DownloadFactsheetButton workbook={workbook} fileName={fileName} />
      </div>
      <div className="w-[800px] h-full border border-gray-300 overflow-hidden bg-white">
        <PDF workbook={workbook} fileName={fileName} />
      </div>
    </div>
  );
}
