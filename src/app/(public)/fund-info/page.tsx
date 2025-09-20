import { Suspense } from "react";
import { getLatestFundDataAuditRecord } from "@/data-access-layer/fundDataAudit";
import { downloadFileFromBlob, getBlobUrl } from "@/lib/blob";
import * as XLSX from "xlsx";
import FundData from "@/components/admin/FundData";
import DownloadFactsheetButton from "./DownloadFactsheetButton";

async function FundInfoContent() {
  try {
    // Get the latest fund data audit record
    const auditResult = await getLatestFundDataAuditRecord();

    if (!auditResult.success || !auditResult.data) {
      return (
        <div className="w-full mx-auto p-8">
          <h1 className="text-2xl font-bold mb-6">Fund Information</h1>
          <div className="text-red-500">
            No fund data available. Please contact an administrator to upload
            fund data.
          </div>
        </div>
      );
    }

    // Get the blob URL for the file
    const blobUrl = await getBlobUrl(`fund-data/${auditResult.data.filename}`);

    // Download the file from blob storage
    const fileBuffer = await downloadFileFromBlob(blobUrl);

    // Parse the Excel file
    const workbook = XLSX.read(fileBuffer, { type: "array" });

    return (
      <div className="w-full mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl text-pure-white font-bold">
            Fund Information
          </h1>
          <DownloadFactsheetButton
            workbook={workbook}
            fileName={auditResult.data.filename}
          />
        </div>
        <div className="mb-4 text-sm text-pure-white">
          Last updated:{" "}
          {new Date(auditResult.data.uploadDate ?? "").toLocaleDateString()}
        </div>
        <div className="mt-6">
          <FundData workbook={workbook} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading fund info:", error);
    return (
      <div className="w-full mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Fund Information</h1>
        <div className="text-red-500">
          Error loading fund data. Please try again later.
        </div>
      </div>
    );
  }
}

export default function FundInfoPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full mx-auto p-8">
          <h1 className="text-2xl font-bold mb-6">Fund Information</h1>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      }
    >
      <FundInfoContent />
    </Suspense>
  );
}
