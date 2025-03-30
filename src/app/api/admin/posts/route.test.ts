/**
 * @jest-environment node
 */
import { POST } from './route'

describe('/api/admin/posts', () => {
    const data = {
        title: 'test',
        slug: 'here',
        content: "<div><img src=x onerror=alert('img') /><p>HELLO WORLD</p></div>",
        excerpt: "excerpt",
        tags: [{ value: '2' }],
    }
    const request = {
        json: jest.fn().mockResolvedValue(data)
    }
    it('will create post', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await POST(request as any);
        const data = await response.json()
        expect(data).toMatchObject({
            content: "<div><p>HELLO WORLD</p></div>"
        })
    })
})