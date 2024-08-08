import { allBlogPosts } from "@/.contentlayer/generated";
import { BlogLayout } from "@/components/blog-layout";
import { getMDXComponent } from "next-contentlayer2/hooks";

export default function BlogPage({ params }: { params: { slug: string } }) {
  const blog = allBlogPosts.find((blog) => blog.url.includes(`/${params.slug}`));

  if (!blog) {
    return <div>Blog not found</div>;
  } 
  const Component = getMDXComponent(blog.body.code);
  return (
    <BlogLayout blog={blog}>
      <Component />
    </BlogLayout>
  );
}