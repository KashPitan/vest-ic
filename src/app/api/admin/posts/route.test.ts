/**
 * @jest-environment node
 */
import { getPayload } from 'payload';
import config from "@payload-config";
import { POST } from './route';

const payload = await getPayload({ config });

describe('/api/admin/posts', () => {
    const data = {
        title: 'test',
        slug: 'here',
        content: "<div><img src=x onerror=alert('img') /><p>HELLO WORLD</p></div>",
        excerpt: "excerpt",
        tags: [{ value: '1' },{ value: '2' }],
    }
    const request = {
        json: jest.fn().mockResolvedValue(data)
    }
    it('will create post and tags association', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await POST(request as any);
        const data = await response.json();
        const postTags = (await payload.find({
            collection: 'postTags',
            where: {
                'post_id': { equals: data.post.id }
            },
            depth: 0
        })).docs;

        expect(postTags).toMatchObject(expect.arrayContaining([
            { 'post_id':data.post.id, tag_id: '2'},
            { 'post_id':data.post.id, tag_id: '1'}
        ]));
        expect(data).toMatchObject({
            title: 'test',
            content: "<div><p>HELLO WORLD</p></div>",
            slug: 'here',
            excerpt: "excerpt",
        })
    })
})