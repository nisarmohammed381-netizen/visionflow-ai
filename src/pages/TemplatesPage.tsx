import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Lock, Zap, Eye } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { supabase } from '../lib/supabase';
import { Template } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const categories = [
  'All', 'YouTube Videos', 'Instagram Reels', 'TikTok Videos',
  'Business Ads', 'Product Promotions', 'Educational Content', 'Anime Videos', 'News Videos',
];

const mockTemplates: Omit<Template, 'id' | 'created_at'>[] = [
  { title: 'YouTube Channel Intro', category: 'YouTube Videos', description: 'Professional channel intro with logo reveal', thumbnail_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=400&h=225&fit=crop', preview_url: '', prompt_template: 'Create a professional YouTube channel intro for {channel_name}', style: 'cinematic', duration: 15, is_pro: false },
  { title: 'YouTube End Screen', category: 'YouTube Videos', description: 'Engaging end screen with subscribe animation', thumbnail_url: 'https://images.pexels.com/photos/7988210/pexels-photo-7988210.jpeg?w=400&h=225&fit=crop', preview_url: '', prompt_template: 'YouTube end screen with subscribe button animation', style: 'marketing', duration: 20, is_pro: false },
  { title: 'Instagram Story Ad', category: 'Instagram Reels', description: 'Vertical story format product advertisement', thumbnail_url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?w=400&h=225&fit=crop', preview_url: '', prompt_template: 'Instagram story ad for {product_name}', style: 'marketing', duration: 15, is_pro: false },
  { title: 'Instagram Reel Highlights', category: 'Instagram Reels', description: 'Dynamic reel with text overlay effects', thumbnail_url: 'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?w=400&h=225&fit=crop', preview_url: '', prompt_template: 'Viral Instagram reel showcasing {content}', style: 'cinematic', duration: 30, is_pro: false },
  { title: 'TikTok Viral Format', category: 'TikTok Videos', description: 'Trending TikTok style with captions', thumbnail_url: 'https://images.pexels.com/photos/3109671/pexels-photo-3109671.jpeg?w=400&h=225&fit=crop', preview_url: '', prompt_template: 'Viral TikTok video about {topic}', style: 'cinematic', duration: 30, is_pro: false },
  { title: 'TikTok Dance Video', category: 'TikTok Videos', description: 'Upbeat music with dynamic visuals', thumbnail_url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=400&h=225&fit=crop', preview_url: '', prompt_template: 'Energetic TikTok dance video with {music_style}', style: 'cinematic', duration: 15, is_pro: true },
  { title: 'Business Corporate Ad', category: 'Business Ads', description: 'Professional corporate brand commercial', thumbnail_url: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?w=400&h=225&fit=crop', preview_url: '', prompt_template: 'Corporate advertisement for {company_name}', style: 'marketing', duration: 60, is_pro: true },
  { title: 'Startup Pitch Video', category: 'Business Ads', description: 'Compelling startup pitch presentation', thumbnail_url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=400&h=225&fit=crop', preview_url: '', prompt_template: 'Startup pitch video for {startup_name}', style: 'marketing', duration: 120, is_pro: true },
  { title: 'Product Launch', category: 'Product Promotions', description: 'Sleek product reveal with dramatic lighting', thumbnail_url: 'https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?w=400&h=225&fit=crop', preview_url: '', prompt_template: 'Product launch reveal for {product_name}', style: 'cinematic', duration: 30, is_pro: false },
  { title: 'E-commerce Ad', category: 'Product Promotions', description: 'Shopping-optimized product showcase', thumbnail_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=400&h=225&fit=crop', preview_url: '', prompt_template: 'E-commerce video ad for {product}', style: 'marketing', duration: 30, is_pro: false },
  { title: 'Explainer Video', category: 'Educational Content', description: 'Clear step-by-step educational content', thumbnail_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=400&h=225&fit=crop', preview_url: '', prompt_template: 'Educational explainer about {topic}', style: 'educational', duration: 120, is_pro: false },
  { title: 'Online Course Intro', category: 'Educational Content', description: 'Engaging course introduction video', thumbnail_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=400&h=225&fit=crop', preview_url: '', prompt_template: 'Course introduction for {course_name}', style: 'educational', duration: 60, is_pro: false },
  { title: 'Anime Intro Opening', category: 'Anime Videos', description: 'Japanese anime style series opening', thumbnail_url: 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg?w=400&h=225&fit=crop', preview_url: '', prompt_template: 'Anime opening sequence for {series_name}', style: 'anime', duration: 90, is_pro: true },
  { title: 'Anime Action Scene', category: 'Anime Videos', description: 'Intense anime battle and action sequence', thumbnail_url: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?w=400&h=225&fit=crop', preview_url: '', prompt_template: 'Anime action scene featuring {characters}', style: 'anime', duration: 30, is_pro: true },
  { title: 'News Report', category: 'News Videos', description: 'Professional broadcast news style', thumbnail_url: 'https://images.pexels.com/photos/586030/pexels-photo-586030.jpeg?w=400&h=225&fit=crop', preview_url: '', prompt_template: 'News report about {topic}', style: 'documentary', duration: 60, is_pro: false },
  { title: 'Documentary Style', category: 'News Videos', description: 'Cinematic documentary storytelling', thumbnail_url: 'https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg?w=400&h=225&fit=crop', preview_url: '', prompt_template: 'Documentary about {subject}', style: 'documentary', duration: 120, is_pro: true },
];

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const { profile } = useAuth();
  const navigate = useNavigate();

  const filtered = mockTemplates.filter(t => {
    const matchCategory = activeCategory === 'All' || t.category === activeCategory;
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-poppins text-white mb-1">Templates</h1>
            <p className="text-dark-400">Start with a professionally designed template</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="input-glass pl-9 w-full sm:w-64 text-sm"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-primary-600 text-white shadow-glow'
                  : 'glass border border-white/10 text-dark-400 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((template, i) => (
            <motion.div
              key={template.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -6 }}
              className="glass-card overflow-hidden p-0 border border-white/5 hover:border-primary-500/30 transition-all duration-300 group"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={template.thumbnail_url}
                  alt={template.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
                {template.is_pro && (
                  <div className="absolute top-2 right-2">
                    <span className="flex items-center gap-1 text-xs bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-1 rounded-full font-semibold">
                      <Lock className="w-2.5 h-2.5" /> Pro
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-2">
                    <button className="glass border border-white/20 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-white/10 transition-colors">
                      <Eye className="w-3 h-3" /> Preview
                    </button>
                    <button
                      onClick={() => navigate(`/create?template=${encodeURIComponent(template.title)}`)}
                      disabled={template.is_pro && profile?.plan === 'free'}
                      className="bg-primary-600 hover:bg-primary-700 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Zap className="w-3 h-3" /> Use
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-white font-semibold text-sm font-poppins leading-tight">{template.title}</h3>
                  {template.is_pro && profile?.plan === 'free' && (
                    <Lock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  )}
                </div>
                <p className="text-dark-400 text-xs mb-3 line-clamp-2">{template.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs glass px-2 py-0.5 rounded-full text-dark-300 border border-white/5 capitalize">{template.style}</span>
                  <span className="text-dark-500 text-xs">{template.duration}s</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Filter className="w-12 h-12 text-dark-500 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">No templates found</h3>
            <p className="text-dark-400 text-sm">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
