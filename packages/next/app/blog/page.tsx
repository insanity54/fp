import Link from 'next/link';
import { siteUrl } from '@/lib/constants';
import { IBlogPost } from '@/lib/blog';


export default async function PostsPage() {
  const res = await fetch(`${siteUrl}/api/blogs`);
  const posts: IBlogPost[] = [
    {
      id: 1,
      slug: '2021-10-29-the-story-of-futureporn',
      title: 'The Story Of Futureporn'
    }
  ]

  return (
    <div className="container mb-5">
    <div className="content mb-5">

      <h1>All Blog Posts</h1>
      <hr style={{ width: '220px' }} />

      <div style={{ paddingTop: '40px' }}>
        {posts.map((post: IBlogPost) => (
          <article key={post.slug}>
            <Link href={`/blog/${post.slug}`}>
              <h2>&gt; {post.title}</h2>
            </Link>
          </article>
        ))}
      </div>
    </div>
    </div>
  );
}