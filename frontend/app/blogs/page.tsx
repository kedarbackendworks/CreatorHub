"use client";

import Navbar from "@/src/components/Navbar";
import BlogsHero from "@/src/components/Blogs/BlogsHero";
import BlogsSearch from "@/src/components/Blogs/BlogsSearch";
import BlogsGrid from "@/src/components/Blogs/BlogsGrid";

export default function BlogsPage() {
  return (
    <main className="min-h-screen bg-white font-['Figtree',sans-serif]">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <BlogsHero />

      {/* Search and Filters */}
      <BlogsSearch />

      {/* Blog Grid */}
      <BlogsGrid />
    </main>
  );
}
