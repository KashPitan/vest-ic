import { getPayload } from "payload";
import config from '@payload-config';
import { RichText } from '@payloadcms/richtext-lexical/react'

export default async function Insights() {
    const payload = await getPayload({ config });
    const posts = await payload.find({
        collection: 'posts',

    });
    return (
        <div>
            <ul>
                {posts.docs.map((post) => {
                    if (post.content) return (<li key={post.id}><h1>{post.title || 'UNKNOWN TITLE'}</h1>
                        <h3>This post was created on {post.createdAt}</h3>
                        <RichText data={post.content} /><br/></li>
                    )
                }
                )}
            </ul>
        </div>
    )
}