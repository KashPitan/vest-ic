import Image from "next/image";
import { db } from "@/db";
import { posts, PostTag, Tag } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { elza, elzaNormal, articulatThin } from "@/fonts";

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

  // TODO: extract to function
  const post = await db.query.posts.findFirst({
    with: {
      postTags: {
        with: {
          tag: true,
        },
      },
    },
    where: eq(posts.slug, slug),
  });

  // TODO: add 404 page
  if (!post) {
    return notFound();
  }

  const formatedReleaseDate = post.releaseDate
    ? format(new Date(post.releaseDate), "dd/MM/yyyy")
    : "";

  // TODO: add tags to the post
  return (
    <Card className="w-full h-full bg-racing-green px-4 py-2 max-w-[1000px] outline-none">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            {post.postTags.map((postTag: PostTag & { tag?: Tag }, index) => (
              <button
                key={postTag.id}
                // add margin right on all elements except last if there are more than 1 items
                className={`bg-pure-white bg-opacity-30 text-[15px] text-amber-500 px-5 py-1 rounded-xl ${elzaNormal.className} ${post.postTags.length > 1 && index != post.postTags.length - 1 ? "mr-2" : ""}`}
              >
                {postTag.tag?.tagName}
              </button>
            ))}
            <button className="bg-pure-white bg-opacity-30 px-5 py-1 pb-2 ml-2 rounded-xl">
              <Image
                className="h-[19.25px] w-[18.75px] text-pure-white-50"
                src={"../icons/file.svg"}
                alt="file icon"
                width={100}
                height={100}
              />
            </button>
            <button className="bg-pure-white bg-opacity-30 px-5 py-1 pb-2 ml-2 rounded-xl">
              <Image
                className="h-[19.25px] w-[18.75px]"
                src={"../icons/linkedin.svg"}
                alt="linkedin icon"
                width={100}
                height={100}
              />
            </button>
          </div>
          <CardDescription className="text-pure-white text-xl">
            {formatedReleaseDate}
          </CardDescription>
        </div>

        <div className="flex justify-between">
          <CardTitle
            className={`pt-6 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-4xl text-pure-white ${elza.className}`}
          >
            {post.title}
          </CardTitle>
          {post.displayImageUrl && (
            <Image
              className="h-60 w-[432px] pl-8 pt-8 rounded-xl"
              src={`${post.displayImageUrl}`}
              alt="Post display image"
              width={100}
              height={100}
            />
          )}
        </div>
        <div className="flex text-pure-white text-[20px]">
          {/* hardcoded for now */}
          <Image
            className="h-[68px] w-[68px] mr-10 rounded-lg"
            src={"../landscape-placeholder.svg"}
            alt="Post display image"
            width={100}
            height={100}
          />
          <div>
            <p>Anshu Prakash</p>
            <p>
              <i>Portfolio Manager</i>
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className={`${articulatThin.className}`}>
        {stringToHtml(post.content)}
      </CardContent>
    </Card>
  );
};

export default Insight;
