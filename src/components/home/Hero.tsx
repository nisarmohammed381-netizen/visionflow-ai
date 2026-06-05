import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Play, Star, ArrowRight, Sparkles } from 'lucide-react';

const badges = ['Cinematic', 'Anime', 'Marketing', 'Educational'];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-900">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute inset-0 bg-gradient-radial from-primary-900/30 via-transparent to-transparent" style={{ backgroundPosition: '50% 40%' }} />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/15 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-600/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
        {/* Announcement badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 glass border border-primary-500/30 rounded-full px-4 py-2 mb-8"
        >
          <Sparkles className="w-4 h-4 text-accent-400" />
          <span className="text-sm text-dark-300">Introducing VisionFlow AI 2.0</span>
          <span className="text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full font-medium">New</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-poppins text-white leading-tight mb-6 text-balance"
        >
          Create Professional
          <br />
          <span className="gradient-text">AI Videos</span> From Just
          <br />
          One Prompt
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-dark-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Generate cinematic, marketing, educational, social media, and anime videos
          using advanced AI technology.
        </motion.p>

        {/* Video Style Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {badges.map((badge, i) => (
            <motion.span
              key={badge}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              className="glass border border-white/10 text-dark-300 text-sm px-3 py-1 rounded-full"
            >
              {badge}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link to="/register" className="btn-primary flex items-center gap-2 text-base px-8 py-4 w-full sm:w-auto justify-center">
            <Zap className="w-5 h-5" />
            Start Creating Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button className="btn-secondary flex items-center gap-2 text-base px-8 py-4 w-full sm:w-auto justify-center">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Play className="w-3 h-3 text-white fill-white ml-0.5" />
            </div>
            Watch Demo
          </button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-dark-400"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[
                'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=40&h=40&fit=crop',
                'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=40&h=40&fit=crop',
                'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=40&h=40&fit=crop',
                'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=40&h=40&fit=crop',
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="User"
                  className="w-8 h-8 rounded-full border-2 border-dark-900 object-cover"
                />
              ))}
            </div>
            <span>50,000+ creators</span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
            <span className="ml-1">4.9/5 rating</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>No credit card required</span>
          </div>
        </motion.div>

        {/* Video preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 relative max-w-5xl mx-auto"
        >
          <div className="glass-card p-2 border border-white/10 rounded-2xl overflow-hidden">
            <div className="aspect-video rounded-xl bg-gradient-to-br from-dark-800 to-dark-900 relative overflow-hidden">
              <img
                src="https://images.pexels.com/photos/7988210/pexels-photo-7988210.jpeg?w=1200&h=675&fit=crop"
                alt="AI Video Preview"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-glow"
                >
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </motion.button>
              </div>
              {/* Overlay UI elements */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="glass rounded-lg px-3 py-2">
                  <p className="text-xs text-dark-400">Generated prompt</p>
                  <p className="text-sm text-white font-medium">"Epic cinematic space exploration..."</p>
                </div>
                <div className="glass rounded-lg px-3 py-2 text-xs text-accent-400 font-medium">
                  Cinematic • 4K
                </div>
              </div>
            </div>
          </div>

          {/* Floating stats */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-4 -left-4 sm:-left-8 glass-card px-4 py-3 hidden sm:block"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Generated!</p>
                <p className="text-dark-400 text-xs">In 12 seconds</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-4 -right-4 sm:-right-8 glass-card px-4 py-3 hidden sm:block"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
                <Star className="w-4 h-4 text-primary-400 fill-primary-400" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">2M+ Videos</p>
                <p className="text-dark-400 text-xs">Generated today</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
