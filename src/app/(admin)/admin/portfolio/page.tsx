"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";
import PdfPreview from "@/components/admin/PdfPreview";
import PortfolioComponentsPreview from "@/components/admin/PortfolioComponentsPreview";
import { Button } from "@/components/ui/button";
import PortfolioUploadConfirmDialog from "@/components/admin/PortfolioUploadConfirmDialog";

export default function PortfolioPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setSuccess("");
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

  const handleUpload = async () => {
    if (!file) return;
    setError("");
    setSuccess("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed.");
      } else {
        setSuccess("File uploaded successfully!");
      }
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Portfolio Upload</h1>
      <div className="space-y-4">
        <Input type="file" accept=".xlsm" onChange={handleFileChange} />
        <PortfolioUploadConfirmDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onConfirm={handleUpload}
          loading={uploading}
          disabled={!file || uploading}
          trigger={
            <Button disabled={!file || uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          }
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
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
