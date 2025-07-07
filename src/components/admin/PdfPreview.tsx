import { PDFViewer } from "@react-pdf/renderer";
import PDF from "@/components/admin/PDF";
import * as XLSX from "xlsx";

interface PdfPreviewProps {
  workbook: XLSX.WorkBook;
}

export default function PdfPreview({ workbook }: PdfPreviewProps) {
  return (
    <div className="w-full h-full">
      <h2 className="text-lg font-semibold mb-2">PDF Preview</h2>
      <div className="w-full h-[600px] border border-gray-300 rounded-lg overflow-hidden">
        <PDFViewer style={{ width: "100%", height: "100%" }}>
          <PDF workbook={workbook} />
        </PDFViewer>
      </div>
    </div>
  );
}
