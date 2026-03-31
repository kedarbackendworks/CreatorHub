"use client";

import BlogCard from "./BlogCard";

const blogPosts = [
  {
    image: "/assets/images/blogs/blog_1.png",
    title: "Design That Feels Effortless",
    readTime: "11min",
    likes: "1.2k",
    views: "4.5k",
    description: "Good design goes unnoticed when it works. This article explores how simplicity, clarity, and balance create seamless user journeys.",
    date: "23 Jan, 2025",
  },
  {
    image: "/assets/images/blogs/blog_2.png",
    title: "Design That Feels Effortless",
    readTime: "11min",
    likes: "1.2k",
    views: "4.5k",
    description: "Good design goes unnoticed when it works. This article explores how simplicity, clarity, and balance create seamless user journeys.",
    date: "23 Jan, 2025",
  },
  {
    image: "/assets/images/blogs/blog_3.png",
    title: "Design That Feels Effortless",
    readTime: "11min",
    likes: "1.2k",
    views: "4.5k",
    description: "Good design goes unnoticed when it works. This article explores how simplicity, clarity, and balance create seamless user journeys.",
    date: "23 Jan, 2025",
  },
  {
    image: "/assets/images/blogs/blog_4.png",
    title: "Design That Feels Effortless",
    readTime: "11min",
    likes: "1.2k",
    views: "4.5k",
    description: "Good design goes unnoticed when it works. This article explores how simplicity, clarity, and balance create seamless user journeys.",
    date: "23 Jan, 2025",
  },
  // Row 2
  {
    image: "/assets/images/blogs/blog_1.png",
    title: "Design That Feels Effortless",
    readTime: "11min",
    likes: "1.2k",
    views: "4.5k",
    description: "Good design goes unnoticed when it works. This article explores how simplicity, clarity, and balance create seamless user journeys.",
    date: "23 Jan, 2025",
  },
  {
    image: "/assets/images/blogs/blog_2.png",
    title: "Design That Feels Effortless",
    readTime: "11min",
    likes: "1.2k",
    views: "4.5k",
    description: "Good design goes unnoticed when it works. This article explores how simplicity, clarity, and balance create seamless user journeys.",
    date: "23 Jan, 2025",
  },
  {
    image: "/assets/images/blogs/blog_3.png",
    title: "Design That Feels Effortless",
    readTime: "11min",
    likes: "1.2k",
    views: "4.5k",
    description: "Good design goes unnoticed when it works. This article explores how simplicity, clarity, and balance create seamless user journeys.",
    date: "23 Jan, 2025",
  },
  {
    image: "/assets/images/blogs/blog_4.png",
    title: "Design That Feels Effortless",
    readTime: "11min",
    likes: "1.2k",
    views: "4.5k",
    description: "Good design goes unnoticed when it works. This article explores how simplicity, clarity, and balance create seamless user journeys.",
    date: "23 Jan, 2025",
  },
  // Row 3
  {
    image: "/assets/images/blogs/blog_1.png",
    title: "Design That Feels Effortless",
    readTime: "11min",
    likes: "1.2k",
    views: "4.5k",
    description: "Good design goes unnoticed when it works. This article explores how simplicity, clarity, and balance create seamless user journeys.",
    date: "23 Jan, 2025",
  },
  {
    image: "/assets/images/blogs/blog_2.png",
    title: "Design That Feels Effortless",
    readTime: "11min",
    likes: "1.2k",
    views: "4.5k",
    description: "Good design goes unnoticed when it works. This article explores how simplicity, clarity, and balance create seamless user journeys.",
    date: "23 Jan, 2025",
  },
  {
    image: "/assets/images/blogs/blog_3.png",
    title: "Design That Feels Effortless",
    readTime: "11min",
    likes: "1.2k",
    views: "4.5k",
    description: "Good design goes unnoticed when it works. This article explores how simplicity, clarity, and balance create seamless user journeys.",
    date: "23 Jan, 2025",
  },
  {
    image: "/assets/images/blogs/blog_4.png",
    title: "Design That Feels Effortless",
    readTime: "11min",
    likes: "1.2k",
    views: "4.5k",
    description: "Good design goes unnoticed when it works. This article explores how simplicity, clarity, and balance create seamless user journeys.",
    date: "23 Jan, 2025",
  },
  // Row 4
  {
    image: "/assets/images/blogs/blog_1.png",
    title: "Design That Feels Effortless",
    readTime: "11min",
    likes: "1.2k",
    views: "4.5k",
    description: "Good design goes unnoticed when it works. This article explores how simplicity, clarity, and balance create seamless user journeys.",
    date: "23 Jan, 2025",
  },
  {
    image: "/assets/images/blogs/blog_2.png",
    title: "Design That Feels Effortless",
    readTime: "11min",
    likes: "1.2k",
    views: "4.5k",
    description: "Good design goes unnoticed when it works. This article explores how simplicity, clarity, and balance create seamless user journeys.",
    date: "23 Jan, 2025",
  },
  {
    image: "/assets/images/blogs/blog_3.png",
    title: "Design That Feels Effortless",
    readTime: "11min",
    likes: "1.2k",
    views: "4.5k",
    description: "Good design goes unnoticed when it works. This article explores how simplicity, clarity, and balance create seamless user journeys.",
    date: "23 Jan, 2025",
  },
  {
    image: "/assets/images/blogs/blog_4.png",
    title: "Design That Feels Effortless",
    readTime: "11min",
    likes: "1.2k",
    views: "4.5k",
    description: "Good design goes unnoticed when it works. This article explores how simplicity, clarity, and balance create seamless user journeys.",
    date: "23 Jan, 2025",
  },
];

export default function BlogsGrid() {
  return (
    <section className="bg-white py-12 px-5 md:px-[64px] max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
        {blogPosts.map((post, index) => (
          <BlogCard key={index} {...post} />
        ))}
      </div>
    </section>
  );
}
