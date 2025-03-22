'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SimpleHeader from '@/components/SimpleHeader';
import Footer from '@/components/home/Footer';
import { motion } from 'framer-motion';

// Types for Blogger API response
interface BloggerPost {
  id: string;
  title: string;
  content: string;
  published: string;
  updated: string;
  url: string;
  author: {
    displayName: string;
    url: string;
    image: {
      url: string;
    };
  };
  images?: { url: string }[];
  labels?: string[];
}

interface BloggerResponse {
  items: BloggerPost[];
  nextPageToken?: string;
}

// Categories for blog posts
const categories = [
  'All Categories',
  'Technology',
  'Career Advice',
  'Workplace Trends',
  'Interview Tips',
  'Industry Insights',
  'Skill Development',
  'Personal Branding',
];

// Blog statistics
const blogStats = {
  articles: 0,
  readers: '15K+',
  authors: 1,
  categories: categories.length - 1, // Excluding "All Categories"
};

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [blogPosts, setBlogPosts] = useState<BloggerPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BloggerPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Animation variants for staggered animation
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  // Fetch blog posts from Blogger API
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        
        // API key provided by user
        const BLOGGER_API_KEY = 'AIzaSyBWlho-GbHftGKXi_XDPxj0UnkwTGHVTCU';
        
        // Replace with your Blogger blog ID
        // To find your blog ID:
        // 1. Go to your Blogger dashboard
        // 2. The ID is in the URL: https://www.blogger.com/blog/posts/YOUR_BLOG_ID
        // 3. Or view any post and find it in: https://www.blogger.com/blog/post/edit/YOUR_BLOG_ID/post_id
        const BLOGGER_BLOG_ID = 'YOUR_BLOG_ID'; // Replace this with your actual blog ID
        
        const response = await fetch(
          `https://www.googleapis.com/blogger/v3/blogs/${BLOGGER_BLOG_ID}/posts?key=${BLOGGER_API_KEY}&maxResults=20`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        
        const data: BloggerResponse = await response.json();
        
        if (data.items && data.items.length > 0) {
          // Update blog stats
          blogStats.articles = data.items.length;
          
          // Set the first post as featured
          setFeaturedPost(data.items[0]);
          
          // Set remaining posts to blogPosts state
          setBlogPosts(data.items.slice(1));
        } else {
          throw new Error('No blog posts found');
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogPosts();
  }, []);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Helper function to extract image from content
  const extractImageFromContent = (content: string): string => {
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = content.match(imgRegex);
    return match ? match[1] : '/images/blog/placeholder.jpg';
  };
  
  // Helper function to extract excerpt from content
  const extractExcerpt = (content: string, maxLength: number = 150): string => {
    // Remove HTML tags
    const text = content.replace(/<[^>]*>?/gm, '');
    // Trim and limit length
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Get reading time in minutes
  const getReadingTime = (content: string): string => {
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>?/gm, '');
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Filter posts based on search term and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         extractExcerpt(post.content).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || 
                           (post.labels && post.labels.includes(selectedCategory));
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SimpleHeader />
      
      {/* Hero section */}
      <section className="relative bg-gradient-to-br from-primary-blue to-secondary-blue py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-yellow opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-light-blue opacity-10 blur-3xl"></div>
        </div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center">
            <motion.h1 
              className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              JobCraft Blog
            </motion.h1>
            <motion.p 
              className="max-w-2xl mx-auto text-xl text-white/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Insights, tips, and trends to help you navigate the Indian job market and advance your career.
            </motion.p>
            
            {/* Search bar */}
            <motion.div
              className="mt-8 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search articles, topics, or authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-3 px-5 pr-12 rounded-full border-none focus:ring-2 focus:ring-primary-yellow shadow-lg text-gray-800"
                />
                <div className="absolute right-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </motion.div>
            
            {/* Statistics */}
            <motion.div 
              className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg py-3 px-4">
                <p className="text-3xl font-bold text-white">{blogStats.articles}</p>
                <p className="text-white/80 text-sm">Articles</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg py-3 px-4">
                <p className="text-3xl font-bold text-white">{blogStats.readers}</p>
                <p className="text-white/80 text-sm">Monthly Readers</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg py-3 px-4">
                <p className="text-3xl font-bold text-white">{blogStats.authors}</p>
                <p className="text-white/80 text-sm">Authors</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg py-3 px-4">
                <p className="text-3xl font-bold text-white">{blogStats.categories}</p>
                <p className="text-white/80 text-sm">Categories</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <div className="mx-auto w-24 h-24 mb-6 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary-blue mb-2">{error}</h3>
              <p className="text-gray-600 mb-6">
                There was a problem loading the blog posts.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-secondary-blue transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featuredPost && (
                <section className="mb-16">
                  <h2 className="text-2xl font-bold text-primary-blue mb-6 flex items-center">
                    <span className="h-6 w-1.5 bg-primary-yellow rounded-full mr-3"></span>
                    Featured Article
                  </h2>
                  <motion.div 
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="lg:flex">
                      <div className="lg:w-1/2 relative h-80 lg:h-auto">
                        <Image 
                          src={extractImageFromContent(featuredPost.content) || '/images/blog/featured.jpg'} 
                          alt={featuredPost.title} 
                          fill 
                          priority
                          style={{objectFit: 'cover'}}
                          className="h-full w-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden flex items-end">
                          <div className="p-6">
                            <div className="text-white/90 font-bold text-lg line-clamp-2">{featuredPost.title}</div>
                          </div>
                        </div>
                      </div>
                      <div className="lg:w-1/2 p-8">
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="px-3 py-1 bg-primary-yellow/10 text-primary-yellow text-xs font-bold rounded-full">
                            Featured
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(featuredPost.published)}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-primary-blue hover:text-primary-yellow transition-colors line-clamp-2">
                          <Link href={featuredPost.url || `#`}>
                            {featuredPost.title}
                          </Link>
                        </h2>
                        <p className="mt-4 text-gray-600 line-clamp-3">
                          {extractExcerpt(featuredPost.content, 200)}
                        </p>
                        <div className="mt-6 flex items-center">
                          <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-primary-yellow">
                            <Image 
                              src={featuredPost.author.image?.url || '/images/team/ceo.jpg'} 
                              alt={featuredPost.author.displayName} 
                              fill 
                              style={{objectFit: 'cover'}}
                            />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">{featuredPost.author.displayName}</p>
                            <p className="text-sm text-gray-500">{getReadingTime(featuredPost.content)}</p>
                          </div>
                        </div>
                        <div className="mt-6">
                          <Link 
                            href={featuredPost.url} 
                            className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-blue hover:bg-secondary-blue transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Read Full Article
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </section>
              )}
              
              {/* Category tabs */}
              <section className="mb-8">
                <div className="flex flex-wrap gap-2 mb-8">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary-blue text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </section>
              
              {/* All articles section */}
              <section>
                <h2 className="text-2xl font-bold text-primary-blue mb-6 flex items-center">
                  <span className="h-6 w-1.5 bg-primary-yellow rounded-full mr-3"></span>
                  {selectedCategory === 'All Categories' ? 'All Articles' : selectedCategory}
                </h2>
                {filteredPosts.length > 0 ? (
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    {filteredPosts.map((post) => (
                      <motion.div 
                        key={post.id} 
                        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col"
                        variants={item}
                      >
                        <div className="relative h-48">
                          <Image 
                            src={extractImageFromContent(post.content) || '/images/blog/placeholder.jpg'} 
                            alt={post.title} 
                            fill 
                            style={{objectFit: 'cover'}}
                          />
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/90 text-primary-blue text-xs font-bold rounded-full backdrop-blur-sm">
                              {post.labels?.[0] || 'General'}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 flex-grow flex flex-col">
                          <h3 className="text-lg font-bold text-primary-blue mb-2 hover:text-primary-yellow transition-colors line-clamp-2">
                            <Link href={post.url} target="_blank" rel="noopener noreferrer">
                              {post.title}
                            </Link>
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                            {extractExcerpt(post.content)}
                          </p>
                          <div className="mt-auto">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="relative h-8 w-8 rounded-full overflow-hidden">
                                  <Image 
                                    src={post.author.image?.url || '/images/team/ceo.jpg'} 
                                    alt={post.author.displayName} 
                                    fill 
                                    style={{objectFit: 'cover'}}
                                  />
                                </div>
                                <span className="ml-2 text-sm text-gray-700">{post.author.displayName}</span>
                              </div>
                              <span className="text-xs text-gray-500">{getReadingTime(post.content)}</span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <Link 
                                href={post.url} 
                                className="text-primary-blue hover:text-primary-yellow font-medium text-sm transition-colors flex items-center"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Read full article
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl">
                    <div className="mx-auto w-24 h-24 mb-6 text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-primary-blue mb-2">No articles found</h3>
                    <p className="text-gray-600 mb-6">
                      We couldn't find any articles matching your search criteria.
                    </p>
                    <button 
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('All Categories');
                      }}
                      className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-secondary-blue transition-colors"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </section>
            </>
          )}
          
          {/* Newsletter subscription */}
          <section className="mt-20">
            <div className="bg-gradient-to-r from-primary-blue to-secondary-blue rounded-2xl shadow-xl p-8 sm:p-12 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary-yellow opacity-10 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-light-blue opacity-10 blur-3xl"></div>
              
              <div className="relative md:flex items-center justify-between">
                <div className="md:w-2/3 mb-8 md:mb-0">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">Join Our Newsletter</h3>
                  <p className="text-white/90 max-w-md">
                    Get the latest articles, career tips, and insights delivered straight to your inbox. 
                    We'll send you weekly updates that are actually worth reading.
                  </p>
                </div>
                <div className="md:w-1/3">
                  <form className="flex flex-col sm:flex-row">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="w-full px-4 py-3 rounded-lg sm:rounded-r-none text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-yellow mb-2 sm:mb-0"
                    />
                    <button
                      type="submit"
                      className="bg-primary-yellow text-primary-blue px-6 py-3 rounded-lg sm:rounded-l-none font-medium hover:bg-white transition-colors"
                    >
                      Subscribe
                    </button>
                  </form>
                  <p className="text-white/70 text-xs mt-2">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 