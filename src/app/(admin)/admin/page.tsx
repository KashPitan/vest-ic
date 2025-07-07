"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="space-y-4">
        <Button
          onClick={() => router.push("/admin/tags")}
          variant="default"
          className="w-full max-w-xs"
        >
          Manage Tags
        </Button>

        <Button
          onClick={() => router.push("/admin/posts")}
          variant="secondary"
          className="w-full max-w-xs"
        >
          Manage Posts
        </Button>

        <Button
          onClick={() => router.push("/admin/portfolio")}
          variant="outline"
          className="w-full max-w-xs"
        >
          Portfolio
        </Button>
      </div>
    </div>
  );
}
