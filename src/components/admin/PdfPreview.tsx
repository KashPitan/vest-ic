import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PDF from "@/components/admin/PDF";
import * as XLSX from "xlsx";

interface PdfPreviewProps {
  workbook: XLSX.WorkBook;
}

export default function PdfPreview({ workbook }: PdfPreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (contentRef.current) {
      const canvas = await html2canvas(contentRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("fund-data.pdf");
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">PDF Preview</h2>
        <button
          onClick={generatePDF}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate PDF
        </button>
      </div>
      <div
        ref={contentRef}
        className="w-full h-[600px] border border-gray-300 rounded-lg overflow-hidden p-4 bg-white"
      >
        <PDF workbook={workbook} />
      </div>
    </div>
  );
}
