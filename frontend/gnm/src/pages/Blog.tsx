import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight, Clock, Tag } from 'lucide-react';
import weddingImage from '@/assets/hero-wedding.jpg';
import corporateImage from '@/assets/corporate-event.jpg';
import birthdayImage from '@/assets/birthday-party.jpg';

const Blog = () => {
  const featuredPost = {
    id: 1,
    title: '10 Essential Tips for Planning Your Dream Wedding',
    excerpt: 'Planning a wedding can be overwhelming, but with the right approach and timeline, you can create the perfect day without the stress. Here are our top tips from 10 years of wedding planning experience.',
    image: weddingImage,
    author: 'Sarah Johnson',
    date: '2024-03-15',
    readTime: '8 min read',
    category: 'Wedding Planning',
  };

  const blogPosts = [
    {
      id: 2,
      title: 'How to Choose the Perfect Venue for Your Corporate Event',
      excerpt: 'The venue sets the tone for your entire corporate event. Learn how to select a space that aligns with your objectives and impresses your guests.',
      image: corporateImage,
      author: 'Michael Chen',
      date: '2024-03-10',
      readTime: '6 min read',
      category: 'Corporate Events',
    },
    {
      id: 3,
      title: 'Creative Birthday Party Themes That Will Wow Your Guests',
      excerpt: 'From elegant adult celebrations to fun kids parties, discover unique theme ideas that will make any birthday celebration unforgettable.',
      image: birthdayImage,
      author: 'Emily Rodriguez',
      date: '2024-03-05',
      readTime: '5 min read',
      category: 'Birthday Parties',
    },
    {
      id: 4,
      title: 'Budget Planning: How to Host an Amazing Event Without Breaking the Bank',
      excerpt: 'Smart budgeting strategies that help you maximize impact while minimizing costs. Learn where to splurge and where to save.',
      image: weddingImage,
      author: 'Sarah Johnson',
      date: '2024-02-28',
      readTime: '7 min read',
      category: 'Planning Tips',
    },
    {
      id: 5,
      title: 'The Ultimate Wedding Timeline: 12 Months to Your Perfect Day',
      excerpt: 'A comprehensive month-by-month guide to wedding planning that ensures nothing is forgotten and everything runs smoothly.',
      image: weddingImage,
      author: 'Emily Rodriguez',
      date: '2024-02-20',
      readTime: '10 min read',
      category: 'Wedding Planning',
    },
    {
      id: 6,
      title: 'Sustainable Event Planning: Eco-Friendly Celebrations',
      excerpt: 'Create beautiful events while being mindful of the environment. Tips for sustainable decorations, catering, and venue choices.',
      image: corporateImage,
      author: 'Michael Chen',
      date: '2024-02-15',
      readTime: '6 min read',
      category: 'Sustainability',
    },
  ];

  const categories = [
    'All Posts',
    'Wedding Planning',
    'Corporate Events',
    'Birthday Parties',
    'Planning Tips',
    'Sustainability',
    'Venue Selection',
    'Decoration Ideas',
  ];

  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-muted/50 to-background">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            Event Planning <span className="text-primary">Blog</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Expert tips, inspiration, and insights from our team of professional event planners. 
            Learn how to create unforgettable experiences for any occasion.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-secondary/10 px-4 py-2 rounded-full">
                <span className="text-secondary font-semibold">Featured Article</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full rounded-lg shadow-elegant"
                />
              </div>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="bg-secondary/10 px-3 py-1 rounded-full">
                    <span className="text-secondary font-medium">{featuredPost.category}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
                  {featuredPost.title}
                </h2>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-light rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">{featuredPost.author}</p>
                      <p className="text-sm text-muted-foreground">Senior Event Planner</p>
                    </div>
                  </div>
                  
                  <Button className="btn-hero group">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="lg:flex-1">
              <h2 className="text-3xl font-serif font-bold mb-8">Latest Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blogPosts.map((post) => (
                  <article key={post.id} className="card-elegant overflow-hidden group">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 bg-secondary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-serif font-semibold group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-secondary to-secondary-light rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm font-medium">{post.author}</span>
                        </div>
                        
                        <Button variant="ghost" className="group p-0 h-auto text-primary hover:text-primary-dark">
                          Read More
                          <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              
              {/* Load More */}
              <div className="text-center mt-12">
                <Button size="lg" variant="outline">
                  Load More Articles
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 space-y-8">
              {/* Categories */}
              <div className="card-elegant p-6">
                <h3 className="text-xl font-serif font-semibold mb-4">Categories</h3>
                <nav className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to="#"
                      className="block py-2 px-3 text-muted-foreground hover:text-primary hover:bg-secondary/5 rounded-md transition-colors text-sm"
                    >
                      {category}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Newsletter Signup */}
              <div className="card-elegant p-6 bg-gradient-to-br from-secondary/5 to-secondary-light/5 border-secondary/20">
                <h3 className="text-xl font-serif font-semibold mb-3">Stay Updated</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Get the latest event planning tips and inspiration delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-border rounded-md text-sm"
                  />
                  <Button className="btn-hero w-full">
                    Subscribe
                  </Button>
                </div>
              </div>

              {/* Popular Tags */}
              <div className="card-elegant p-6">
                <h3 className="text-xl font-serif font-semibold mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Wedding Tips',
                    'Budget Planning',
                    'Venue Selection',
                    'Decorations',
                    'Catering',
                    'Photography',
                    'Timeline',
                    'Vendors',
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full hover:bg-secondary/10 hover:text-secondary cursor-pointer transition-colors"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-serif font-bold mb-6">Need Professional Event Planning?</h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Ready to turn your event dreams into reality? Our experienced team is here to help 
            you create an unforgettable celebration.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
<Link to="/booking">
  <Button size="lg" className="btn-hero">
    Start Planning Today
  </Button>
</Link>

<Link to="/services">
  <Button size="lg" variant="outline" className="btn-outline-light text-black">
    View Our Services
  </Button>
</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Blog;