import { getPayload } from "payload";
import config from '@payload-config';
import Link from 'next/link'
import { Separator } from "@/components/ui/separator";

const Insights = async () => {
    const payload = await getPayload({ config });
    const posts = await payload.find({
        collection: 'posts',
        limit: 5,
        sort: '-createdAt', // are these automatically indexed?
        select: {
            id: true,
            title: true,
            slug: true,
            createdAt: true
        }
    });
    return (
        <div>
            <ul>
                {posts.docs.map(({ id, title, slug, createdAt }) => (
                    <li key={id}>
                        <Link href={`/insights/${slug}`} className="text-orange-500 hover:text-orange-700">{title}</Link>
                        <h3>This insight was created on {createdAt}</h3>
                        <Separator />
                    </li>
                )
                )}
            </ul>
        </div>
    )
}

export default Insights;