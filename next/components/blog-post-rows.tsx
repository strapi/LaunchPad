"use client";
import { truncate } from "@/lib/utils";
import { format } from "date-fns";
import { Link } from "next-view-transitions";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import FuzzySearch from "fuzzy-search";
import { BlogPost } from "@/.contentlayer/generated";

export const BlogPostRows = ({ blogs }: { blogs: BlogPost[] }) => {
  const [search, setSearch] = useState("");

  const searcher = new FuzzySearch(blogs, ["title", "description"], {
    caseSensitive: false,
  });

  const [results, setResults] = useState(blogs);
  useEffect(() => {
    const results = searcher.search(search);
    setResults(results);
  }, [search]);
  return (
    <div className="w-full py-20">
      <div className="flex sm:flex-row flex-col justify-between gap-4 items-center mb-10">
        <p className="text-2xl font-bold text-white">More Posts</p>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search blogs"
          className="text-sm min-w-full sm:min-w-96  p-2 rounded-md bg-neutral-800 border-none  focus:ring-0 focus:outline-none outline-none text-neutral-200 placeholder-neutral-400"
        />
      </div>

      <div className="divide-y divide-neutral-800">
        {results.length === 0 ? (
          <p className="text-neutral-400 text-center p-4">No results found</p>
        ) : (
          results.map((blog, index) => (
            <BlogPostRow blog={blog} key={blog.url + index} />
          ))
        )}
      </div>
    </div>
  );
};

export const BlogPostRow = ({ blog }: { blog: BlogPost }) => {
  return (
    <Link
      href={`${blog.url}`}
      key={`${blog.url}`}
      className="flex md:flex-row flex-col items-start justify-between md:items-center group py-4"
    >
      <div>
        <p className="text-neutral-300 text-lg font-medium group-hover:text-white transition duration-200">
          {blog.title}
        </p>
        <p className="text-neutral-300 text-sm mt-2 max-w-xl group-hover:text-white transition duration-200">
          {truncate(blog.description, 80)}
        </p>

        <div className="flex gap-2 items-center my-4">
          <p className="text-neutral-300 text-sm  max-w-xl group-hover:text-white transition duration-200">
            {format(new Date(blog.date), "MMMM dd, yyyy")}
          </p>
          <div className="h-1 w-1 rounded-full bg-neutral-800"></div>
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
        </div>
      </div>
      <Image
        src={blog.authorAvatar}
        alt={blog.author}
        width={40}
        height={40}
        className="rounded-full md:h-10 md:w-10 h-6 w-6 mt-4 md:mt-0 object-cover"
      />
    </Link>
  );
};
