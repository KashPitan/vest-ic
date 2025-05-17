import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { FileText, Linkedin } from "lucide-react";
import { elza, articulat } from "@/fonts";
import { getPostBySlug } from "@/data-access-layer/posts";

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
  const post = await getPostBySlug(slug);
  const formatedReleaseDate = post.releaseDate ? format(new Date(post.releaseDate), "dd/MM/yyyy") : '';
  return (
    <Card className="opacity-70 w-full h-full bg-pure-white/10 backdrop-blur-[10px] mx-8 px-6 py-4 max-w-[720px]">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            {post.tags.map((tag) => (
              <button
                key={tag.id}
                className="bg-gray-500 text-amber-500 px-5 py-1 rounded-xl"
              >
                {tag.tag_name}
              </button>
            ))}
            <button className="bg-gray-500 px-5 py-1 pb-2 ml-2 rounded-xl">
              <FileText href={undefined} size={18} />
            </button>
            <button className="bg-gray-500 px-5 py-1 pb-2 ml-2 rounded-xl">
              <Linkedin href={undefined} size={18} />
            </button>
          </div>
          <CardDescription className="text-pure-white">
            {formatedReleaseDate}
          </CardDescription>
        </div>

        <CardTitle
          className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-pure-white ${elza.className}`}
        >
          {post.title}
        </CardTitle>
        {post.displayImageUrl && (
          <Image
            className="h-60 w-60"
            src={`${post.displayImageUrl}`}
            alt="Post display image"
            width={100}
            height={100}
          />
        )}
      </CardHeader>
      <CardContent className={`${articulat.className}`}>
        {stringToHtml(post.content)}
      </CardContent>
    </Card>
  );
};

export default Insight;
