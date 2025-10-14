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
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        // const pageHeight = 295; // A4 height in mm

        // Find all page elements
        const pageElements = contentRef.current.querySelectorAll(".pdf-page");

        if (pageElements.length === 0) {
          throw new Error("No page elements found");
        }

        // Process each page separately
        for (let i = 0; i < pageElements.length; i++) {
          const pageElement = pageElements[i] as HTMLElement;

          // Add new page for each page element (except the first one)
          if (i > 0) {
            pdf.addPage();
          }

          // Capture this specific page element
          const canvas = await html2canvas(pageElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            height: pageElement.offsetHeight,
            width: pageElement.offsetWidth,
          });

          const imgData = canvas.toDataURL("image/png");
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Add the image to the current page
          pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        }

        // Open PDF in new tab
        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, "_blank");

        // Download the PDF file
        const link = document.createElement("a");
        link.href = pdfUrl;

        // TODO: this file name should be dynamic
        link.download = "factsheet.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

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
