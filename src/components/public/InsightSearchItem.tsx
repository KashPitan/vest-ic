import Link from "next/link";
import { format } from "date-fns";
import { Card } from "../ui/card";
import { Post } from "@/db/schema";
import { articulat } from "@/fonts";
import Image from "next/image";

interface InsightSearchItemProps {
  post: Post;
}

export const InsightSearchItem = ({ post }: InsightSearchItemProps) => {
  return (
    <li key={post.id}>
      <Card className="bg-pure-white/10 backdrop-blur-[10px] p-4 h-full md:min-h-[300px] rounded-2xl">
        <div className="flex gap-6">
          <Image
            className="rounded-xl min-h-[256px] min-w-[313px] max-h-[300px]"
            src={post.displayImageUrl || "../landscape-placeholder.svg"}
            alt="file icon"
            width={313}
            height={256}
          />
          <div>
            <Link
              href={`/insights/${post.slug}`}
              className="text-pure-white text-xl font-semibold "
            >
              {post.title}
            </Link>
            {post.createdAt && (
              <h3 className="text-pure-white mb-3">
                {format(post.createdAt, "dd/MM/yyyy")}
              </h3>
            )}
            <p
              className={`text-pure-white mb-4 ${articulat.className} max-h-[120px] max-w-1/3 overflow-hidden text-ellipsis`}
            >
              {post.excerpt}
            </p>
          </div>
        </div>
      </Card>
    </li>
  );
};
