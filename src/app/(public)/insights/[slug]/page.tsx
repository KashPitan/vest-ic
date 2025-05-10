import Image from "next/image";
import { getPayload } from "payload";
import config from "@payload-config";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { FileText, Linkedin } from "lucide-react";
import { SharePostButton } from '@/components/public/SharePostButton'

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
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "posts",
    where: {
      slug: { equals: slug },
    },
    limit: 1,
  });
  const [post] = result.docs;
  const formatedCreatedDate = format(new Date(post.createdAt), "dd/MM/yyyy");
  return (
    <Card className="opacity-100 w-full h-full bg-racing-green/80 border-racing-green/80 mx-8">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <button
              className="bg-gray-500 text-amber-500 px-5 py-1 rounded-xl">
              Category 1
            </button>
              <button className="bg-gray-500 px-5 py-1 pb-2 ml-2 rounded-xl">
                <FileText href="" size={18} />
              </button>
              {/* <button className="bg-gray-500 px-5 py-1 pb-2 ml-2 rounded-xl">
                <Linkedin href="" size={18} />
              </button> */}
              {/* <div className="bg-gray-500 px-5 py-1 pb-2 ml-2 rounded-xl" > */}
                <SharePostButton className="bg-gray-500 px-5 py-1 pb-2 ml-2 rounded-xl"
                ></SharePostButton>
              {/* </div> */}
              
          </div>
          <CardDescription className="text-pure-white">
            {formatedCreatedDate}
          </CardDescription>
        </div>

        <CardTitle className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-pure-white">
          {post.title}
        </CardTitle>

        {post.releaseDate && (
          <Label className="text-pure-white">
            This insight was released on: {post.releaseDate}
          </Label>
        )}
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
      <CardContent>{stringToHtml(post.content)}</CardContent>
    </Card>
  );
};

export default Insight;
