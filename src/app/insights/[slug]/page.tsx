import { getPayload } from "payload";
import config from '@payload-config';
import sanitizeHtml from 'sanitize-html';
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

const stringToHtml = (value: string) => {
    return <div dangerouslySetInnerHTML={{
        __html: sanitizeHtml(value)
    }}></div>
}

export default async function Insight({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const payload = await getPayload({ config });
    const result = await payload.find({
        collection: 'posts',
        where: {
            slug: { equals: slug }
        },
        limit: 1
    });
    const [post] = result.docs;
    return (
        <div className="w-full"><h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{post.title || 'UNKNOWN TITLE'}</h1>
            <Label>This post was created on: {post.createdAt}</Label>
            <Separator/>
            {stringToHtml(post.content)}
        </div>
    )
}