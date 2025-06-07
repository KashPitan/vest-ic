"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import React from "react";
import { Loader2 } from "lucide-react";

export default function TagsPage() {
  const [allTags, setAllTags] = React.useState<
    Array<{
      id: string;
      tagName: string;
      createdAt: Date | null;
    }>
  >([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchTags() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/tags");
        if (!response.ok) {
          throw new Error("Failed to fetch tags");
        }
        const fetchedTags = await response.json();
        setAllTags(fetchedTags);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch tags");
      } finally {
        setIsLoading(false);
      }
    }
    fetchTags();
  }, []);

  async function deleteTag(id: string) {
    try {
      const response = await fetch(`/api/admin/tags?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete tag");
      }

      toast.success("Tag deleted successfully");
      // Refresh the page to show updated list
      window.location.reload();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete tag",
      );
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tags</h1>
        {/* TODO: add create-tag page */}
        <Link href="/admin2/tags/create">
          <Button>Create New Tag</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4">
          {allTags.map((tag) => (
            <Card key={tag.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">
                  {tag.tagName}
                </CardTitle>
                <div className="flex gap-2">
                  <Link href={`/admin2/tags/edit/${tag.id}`}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                  <DeleteTagDialog tag={tag} onDelete={deleteTag} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  {tag.createdAt && (
                    <p className="text-sm text-muted-foreground">
                      Created: {format(new Date(tag.createdAt), "PPP")}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function DeleteTagDialog({
  tag,
  onDelete,
}: {
  tag: { id: string; tagName: string };
  onDelete: (id: string) => Promise<void>;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the tag "
            {tag.tagName}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onDelete(tag.id)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
