import PDF from "@/components/admin/PDF";
import * as XLSX from "xlsx";
import DownloadFactsheetButton from "@/app/(public)/fund-info/DownloadFactsheetButton";

interface PdfPreviewProps {
  workbook: XLSX.WorkBook;
}

export default function PdfPreview({ workbook }: PdfPreviewProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">PDF Preview</h2>
        <DownloadFactsheetButton workbook={workbook} />
      </div>
      <div className="w-full h-full border border-gray-300 rounded-lg overflow-hidden p-4 bg-white">
        <PDF workbook={workbook} />
      </div>
    </div>
  );
}
