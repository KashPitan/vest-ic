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
        <article className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="flex-shrink-0">
            <Image
              className="rounded-xl w-full md:w-[313px] h-[200px] md:h-[256px] object-cover"
              src={post.displayImageUrl || "../landscape-placeholder.svg"}
              alt={`Cover image for ${post.title}`}
              width={313}
              height={256}
            />
          </div>
          <div className="flex-1 min-w-0">
            {/* min-w-0 prevents flex item overflow */}
            <Link
              href={`/insights/${post.slug}`}
              className="text-pure-white text-xl font-semibold "
            >
              <h2>{post.title}</h2>
            </Link>
            {post.createdAt && (
              <h3 className="text-pure-white mb-3">
                {format(post.createdAt, "dd/MM/yyyy")}
              </h3>
            )}
            <p
              className={`text-pure-white mb-4 ${articulat.className} max-h-[120px] max-w-2/3 overflow-hidden text-ellipsis`}
            >
              {post.excerpt}
            </p>
          </div>
        </article>
      </Card>
    </li>
  );
};
