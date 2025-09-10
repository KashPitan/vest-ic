"use client";

import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
import PDF from "@/components/admin/PDF";

interface DownloadFactsheetButtonProps {
  workbook: XLSX.WorkBook;
  fileName: string;
}

export default function DownloadFactsheetButton({
  workbook,
  fileName,
}: DownloadFactsheetButtonProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (contentRef.current) {
      try {
        const canvas = await html2canvas(contentRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        // TODO: adjust image dimension so logo is not distorted
        const imgWidth = 210;

        // 295mm - standard a4 size
        // pdf page height is set to be the pixel equivalent so that we can create page components
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

        // Open PDF in new tab
        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, "_blank");

        // Clean up the URL object after a delay
        setTimeout(() => {
          URL.revokeObjectURL(pdfUrl);
        }, 1000);
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Error generating PDF. Please try again.");
      }
    }
  };

  return (
    <>
      <Button
        onClick={generatePDF}
        className="bg-racing-green hover:bg-regular-green text-pure-white px-6 py-2 rounded-lg transition-colors"
      >
        Download Factsheet
      </Button>

      {/* Hidden div for PDF generation using the existing PDF component */}
      <div
        ref={contentRef}
        className="fixed left-[-9999px] top-[-9999px] w-[800px] bg-white"
        style={{ zIndex: -1 }}
      >
        <PDF workbook={workbook} fileName={fileName} />
      </div>
    </>
  );
}
