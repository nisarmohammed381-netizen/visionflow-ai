import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Wand2, Mic, Subtitles, Image, Music, Film, Layers, Sparkles
} from 'lucide-react';

const features = [
  {
    icon: Wand2,
    title: 'Text to Video',
    description: 'Transform any text prompt into cinematic videos with AI-powered scene generation and camera movements.',
    color: 'primary',
    badge: 'Core',
  },
  {
    icon: Image,
    title: 'Image to Video',
    description: 'Bring static images to life with smooth AI-generated motion, depth, and camera animations.',
    color: 'secondary',
    badge: 'Popular',
  },
  {
    icon: Film,
    title: 'Script to Video',
    description: 'Convert full scripts into multi-scene videos with automatic scene transitions and B-roll footage.',
    color: 'accent',
    badge: 'Pro',
  },
  {
    icon: Mic,
    title: 'AI Voiceover',
    description: 'Generate natural-sounding voiceovers in 50+ languages with customizable tone, pace, and emotion.',
    color: 'primary',
    badge: 'New',
  },
  {
    icon: Subtitles,
    title: 'AI Subtitles',
    description: 'Auto-generate accurate subtitles with perfect timing, custom styling, and multi-language translation.',
    color: 'secondary',
    badge: '',
  },
  {
    icon: Layers,
    title: 'AI Scene Generator',
    description: 'Automatically create multiple scene variations from a single prompt to find your perfect video.',
    color: 'accent',
    badge: '',
  },
  {
    icon: Music,
    title: 'AI Background Music',
    description: 'Generate custom background music that perfectly matches your video mood, tempo, and style.',
    color: 'primary',
    badge: '',
  },
  {
    icon: Sparkles,
    title: 'AI Thumbnail Generator',
    description: 'Create eye-catching video thumbnails optimized for clicks using AI visual design intelligence.',
    color: 'secondary',
    badge: '',
  },
];

const colorMap = {
  primary: {
    icon: 'bg-primary-500/15 text-primary-400',
    badge: 'bg-primary-500/15 text-primary-400',
    border: 'hover:border-primary-500/30',
  },
  secondary: {
    icon: 'bg-secondary-500/15 text-secondary-400',
    badge: 'bg-secondary-500/15 text-secondary-400',
    border: 'hover:border-secondary-500/30',
  },
  accent: {
    icon: 'bg-accent-500/15 text-accent-400',
    badge: 'bg-accent-500/15 text-accent-400',
    border: 'hover:border-accent-500/30',
  },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" className="py-24 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 glass border border-accent-500/30 text-accent-400 text-sm font-medium px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            Advanced AI Features
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-poppins text-white mb-4">
            Everything You Need to Create
            <br />
            <span className="gradient-text">Stunning AI Videos</span>
          </h2>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto">
            A complete AI-powered video production suite. From idea to final video in minutes.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {features.map(feature => {
            const colors = colorMap[feature.color as keyof typeof colorMap];
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className={`glass-card p-6 border border-white/5 ${colors.border} transition-all duration-300 group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors.icon} group-hover:scale-110 transition-transform duration-200`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  {feature.badge && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-white font-semibold font-poppins mb-2">{feature.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
