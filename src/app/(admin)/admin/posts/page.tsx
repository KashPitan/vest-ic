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

export default function PostsPage() {
  const [allPosts, setAllPosts] = React.useState<
    Array<{
      id: string;
      title: string;
      slug: string;
      releaseDate: Date | null;
    }>
  >([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const fetchedPosts = await response.json();
        setAllPosts(fetchedPosts);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, []);

  async function deletePost(id: string) {
    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete post");
      }

      toast.success("Post deleted successfully");
      // Refresh the page to show updated list
      window.location.reload();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete post",
      );
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Link href="/admin/posts/create">
          <Button>Create New Post</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4">
          {allPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">
                  {post.title}
                </CardTitle>
                <div className="flex gap-2">
                  <Link href={`/admin/posts/edit/${post.id}`}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                  <DeletePostDialog post={post} onDelete={deletePost} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Slug: {post.slug}
                  </p>
                  {post.releaseDate && (
                    <p className="text-sm text-muted-foreground">
                      Release Date: {format(new Date(post.releaseDate), "PPP")}
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

function DeletePostDialog({
  post,
  onDelete,
}: {
  post: { id: string; title: string };
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
            This action cannot be undone. This will permanently delete the post
            `&ldquo;`{post.title}`&ldquo;`.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onDelete(post.id)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
