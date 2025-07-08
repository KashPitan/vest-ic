"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import PortfolioUploadConfirmDialog from "@/components/admin/PortfolioUploadConfirmDialog";

export default function PortfolioDataSourcePage() {
  const [files, setFiles] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch("/api/admin/portfolio/list")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setFiles(data.files || []);
      })
      .catch(() => setError("Failed to fetch files."))
      .finally(() => setLoading(false));
  }, []);

  const handleConfirm = async () => {
    if (!selected) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/portfolio/data-source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: selected }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError("Failed to update data source.");
      } else {
        setSuccess("Portfolio data source updated successfully!");
        setDialogOpen(false);
      }
    } catch {
      setError("Failed to update data source.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Set Portfolio Data Source</h1>
      <div className="mb-4">
        <Button
          onClick={() => setDialogOpen(true)}
          disabled={!selected || loading}
        >
          Confirm Selection
        </Button>
      </div>
      {/* List files with checkboxes */}
      <div className="space-y-2">
        {files.length === 0 ? (
          <div className="text-gray-400">No files found.</div>
        ) : (
          files.map((file) => (
            <label key={file} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selected === file}
                onChange={() => setSelected(file)}
                disabled={loading}
              />
              <span>{file}</span>
            </label>
          ))
        )}
      </div>
      {/* Error and success messages */}
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
      {/* Confirmation dialog */}
      <PortfolioUploadConfirmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirm}
        loading={loading}
        disabled={!selected || loading}
        trigger={<></>} // No trigger, controlled by state
      />
    </div>
  );
}
