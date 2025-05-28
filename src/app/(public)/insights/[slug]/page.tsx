import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";

const stringToHtml = (value: string) => {
  return (
    <div
      className="text-pure-white"
      dangerouslySetInnerHTML={{
        __html: value,
      }}
    ></div>
  );
};

const Insight = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);

  return (
    <div className="w-full">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-pure-white">
        {post.title || "UNKNOWN TITLE"}
      </h1>
      {post.createdAt && (
        <Label className="text-pure-white">
          This insight was created on: {post.createdAt.toDateString()}
        </Label>
      )}

      {post.releaseDate && (
        <Label className="text-pure-white">
          This insight was released on: {post.releaseDate.toDateString()}
        </Label>
      )}

      <Separator />
      {post.displayImageUrl && (
        <Image
          className="h-60 w-60"
          src={`${post.displayImageUrl}`}
          alt="Post display image"
          width={100}
          height={100}
        />
      )}
      {stringToHtml(post.content)}
    </div>
  );
};

export default Insight;
