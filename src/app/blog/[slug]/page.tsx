import BlogPostView from '@/components/BlogPostView';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <BlogPostView slug={params.slug} />;
}
