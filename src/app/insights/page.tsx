import { getPayload } from "payload";
import config from '@payload-config';

export default async function Insights() {
    const payload = await getPayload({ config });
    const posts = await payload.find({
        collection: 'posts',
        limit: 5
    });
    return (
        <div>
            <ul>
                {posts.docs.map((post) => {
                    if (post.content) return (<li key={post.id}><h1>{post.title || 'UNKNOWN TITLE'}</h1>
                        <h3>This post was created on {post.createdAt}</h3>
                        </li>
                    )
                }
                )}
            </ul>
        </div>
    )
}