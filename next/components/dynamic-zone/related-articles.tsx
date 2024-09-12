"use client";
import React from "react";
import { BlogCardVertical } from "../blog-card";

export const RelatedArticles = ({ heading, sub_heading, articles }: { heading: string; sub_heading: string; articles: any[] }) => {
  return (
    <div className="mt-12 pb-20">
      <h2 className="text-2xl font-bold text-neutral-200 mb-10">
        {heading}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {articles.map((article) => (
          <BlogCardVertical key={article.title} article={article} />
        ))}
      </div>
    </div>
  );
};
