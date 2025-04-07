import { getPayload } from "payload";
import config from "@payload-config";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

const stringToHtml = (value: string) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: value,
      }}
    ></div>
  );
};

const Insight = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "posts",
    where: {
      slug: { equals: slug },
    },
    limit: 1,
  });
  const [post] = result.docs;
  return (
    <div className="w-full">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {post.title || "UNKNOWN TITLE"}
      </h1>
      <Label>This insight was created on: {post.createdAt}</Label>
      {post.releaseDate && (
        <Label>This insight was released on: {post.releaseDate}</Label>
      )}

      <Separator />
      {stringToHtml(post.content)}
    </div>
  );
};

export default Insight;
