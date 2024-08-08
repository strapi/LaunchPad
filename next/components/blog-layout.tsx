import { IconArrowLeft } from "@tabler/icons-react";
import { Container } from "./container";
import Image from "next/image";
import { Logo } from "./logo";
import { Link } from "next-view-transitions";
import { format } from "date-fns";
import { headers } from "next/headers";
import { BlogCardVertical } from "./blog-card";
import { allBlogPosts, BlogPost } from "@/.contentlayer/generated";

export async function BlogLayout({
  blog,
  children,
}: {
  blog: BlogPost;
  children: React.ReactNode;
}) {
  const headerList = headers();
  const pathname = headerList.get("x-current-path");
  const slug = pathname?.split("/").pop();

  const relatedBlogs = slug
    ? allBlogPosts.filter((blog) => !blog.url.includes(slug)).slice(0, 3)
    : [];

  return (
    <Container className="mt-16 lg:mt-32">
      <div className="flex justify-between items-center px-2 py-8">
        <Link href="/blog" className="flex space-x-2 items-center">
          <IconArrowLeft className="w-4 h-4 text-muted" />
          <span className="text-sm text-muted">Back</span>
        </Link>
      </div>
      <div className="w-full mx-auto">
        {blog.image ? (
          <Image
            src={blog.image}
            height="800"
            width="800"
            className="h-40 md:h-96 w-full aspect-square object-cover rounded-3xl [mask-image:radial-gradient(circle,white,transparent)]"
            alt={blog.title}
          />
        ) : (
          <div className="h-40 md:h-96 w-full aspect-squace rounded-3xl shadow-derek bg-neutral-900 flex items-center justify-center">
            <Logo />
          </div>
        )}
      </div>
      <div className="xl:relative">
        <div className="mx-auto max-w-2xl">
          <article className="pb-8 pt-8">
            <div className="flex gap-4 flex-wrap ">
              {blog.categories?.map((category, idx) => (
                <p
                  key={`category-${idx}`}
                  className="text-xs font-bold text-muted px-2 py-1 rounded-full bg-neutral-800 capitalize"
                >
                  {category}
                </p>
              ))}
            </div>
            <header className="flex flex-col">
              <h1 className="mt-8 text-4xl font-bold tracking-tight text-neutral-200 sm:text-5xl ">
                {blog.title}
              </h1>
            </header>
            <div className="mt-8 prose prose-sm prose-invert" data-mdx-content>
              {children}
            </div>
            <div className="flex space-x-2 items-center pt-12 border-t border-neutral-800 mt-12">
              <div className="flex space-x-2 items-center ">
                <Image
                  src={blog.authorAvatar}
                  alt={blog.author}
                  width={20}
                  height={20}
                  className="rounded-full h-5 w-5"
                />
                <p className="text-sm font-normal text-muted">
                  {blog.author}
                </p>
              </div>
              <div className="h-5 rounded-lg w-0.5 bg-neutral-700" />
              <time
                dateTime={blog.date}
                className="flex items-center text-base "
              >
                <span className="text-muted text-sm">
                  {format(new Date(blog.date), "MMMM dd, yyyy")}
                </span>
              </time>
            </div>
          </article>
        </div>
      </div>
      {relatedBlogs && relatedBlogs.length > 0 && (
        <div className="mt-12 pb-20">
          <h2 className="text-2xl font-bold text-neutral-200 mb-10">
            Related Blogs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {relatedBlogs.map((blog) => (
              <BlogCardVertical key={blog.url} blog={blog} />
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
