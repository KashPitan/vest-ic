import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { format } from "date-fns";

export default async function PostsPage() {
  const allPosts = await db.query.posts.findMany({
    columns: {
      id: true,
      title: true,
      slug: true,
      releaseDate: true,
    },
    orderBy: [desc(posts.createdAt)],
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Link href="/admin2/posts/create">
          <Button>Create New Post</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {allPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">{post.title}</CardTitle>
              <Link href={`/admin2/posts/edit/${post.id}`}>
                <Button variant="outline">Edit</Button>
              </Link>
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
    </div>
  );
}
