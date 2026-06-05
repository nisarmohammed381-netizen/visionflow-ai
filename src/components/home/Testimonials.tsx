import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'YouTube Creator',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=80&h=80&fit=crop',
    content: 'VisionFlow AI completely transformed my content workflow. I used to spend weeks on video production. Now I create stunning videos in minutes.',
    rating: 5,
    videos: '200+ videos',
  },
  {
    name: 'Marcus Johnson',
    role: 'Marketing Director',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=80&h=80&fit=crop',
    content: 'Our ad campaign engagement increased by 300% after switching to AI-generated videos. The quality is absolutely mind-blowing.',
    rating: 5,
    videos: '$2M campaign',
  },
  {
    name: 'Yuki Tanaka',
    role: 'Anime Creator',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=80&h=80&fit=crop',
    content: 'The anime style generation is perfect. It captures the exact aesthetic I want for my series. My audience absolutely loves it.',
    rating: 5,
    videos: '50K subscribers',
  },
  {
    name: 'David Park',
    role: 'E-learning Founder',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=80&h=80&fit=crop',
    content: 'We created an entire course library with educational videos in just one week. The ROI on our subscription has been extraordinary.',
    rating: 5,
    videos: '500+ students',
  },
  {
    name: 'Priya Sharma',
    role: 'Social Media Manager',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?w=80&h=80&fit=crop',
    content: "Managing 10 brands' social media is so much easier now. VisionFlow AI produces content that stops the scroll every time.",
    rating: 5,
    videos: '10 brands',
  },
  {
    name: 'Alex Rivera',
    role: 'Documentary Filmmaker',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=80&h=80&fit=crop',
    content: 'The documentary style is incredibly realistic. I use it for B-roll and establishing shots that would have cost thousands to film.',
    rating: 5,
    videos: '3 documentaries',
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 glass border border-amber-500/30 text-amber-400 text-sm font-medium px-4 py-2 rounded-full mb-4">
            <Star className="w-4 h-4 fill-amber-400" />
            Loved by Creators Worldwide
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-poppins text-white mb-4">
            50,000+ Creators Trust
            <br />
            <span className="gradient-text">VisionFlow AI</span>
          </h2>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto">
            Real results from real creators. See what our community is achieving.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass-card p-6 border border-white/5 hover:border-primary-500/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <Quote className="w-8 h-8 text-primary-500/40" />
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-dark-300 text-sm leading-relaxed mb-6">"{t.content}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">{t.name}</p>
                  <p className="text-dark-400 text-xs">{t.role}</p>
                </div>
                <span className="text-xs glass px-2 py-1 rounded-full text-dark-300 border border-white/5">
                  {t.videos}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
