"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";
import PdfPreview from "@/components/admin/PdfPreview";
import PortfolioComponentsPreview from "@/components/admin/PortfolioComponentsPreview";

export default function PortfolioPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.endsWith(".xlsm")) {
      setError("Only .xlsm files are allowed.");
      setFile(null);
      setWorkbook(null);
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (typeof data === "string" || data instanceof ArrayBuffer) {
        const wb = XLSX.read(data, { type: "array" });
        setWorkbook(wb);
      }
    };
    reader.readAsArrayBuffer(f);
  };

  return (
    <div className="w-full mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Portfolio Upload</h1>
      <div className="space-y-4">
        <Input type="file" accept=".xlsm" onChange={handleFileChange} />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {file && (
          <div className="text-sm text-gray-700">Uploaded: {file.name}</div>
        )}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Sheet Names Preview</h2>
          {workbook ? (
            <PortfolioComponentsPreview workbook={workbook} />
          ) : (
            <div className="text-gray-400">No file uploaded.</div>
          )}
        </div>
        {workbook && <PdfPreview workbook={workbook} />}
      </div>
    </div>
  );
}
