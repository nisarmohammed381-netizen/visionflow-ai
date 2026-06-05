import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Check, Zap, Star, Crown } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: 0,
    period: '/month',
    description: 'Perfect for trying out VisionFlow AI',
    credits: 5,
    features: ['5 AI videos per month', '720p resolution', 'Basic video styles', 'Community templates', 'Watermarked exports'],
    icon: Zap,
    highlighted: false,
    color: 'border-white/10 hover:border-white/20',
    btnClass: 'btn-secondary',
  },
  {
    name: 'Pro',
    price: 29,
    period: '/month',
    description: 'For serious content creators',
    credits: 100,
    features: ['100 AI videos per month', '1080p resolution', 'All video styles', 'Premium templates', 'No watermark', 'AI Voiceover', 'Priority rendering'],
    icon: Star,
    highlighted: true,
    color: 'border-primary-500/50 glow-border',
    btnClass: 'btn-primary',
    badge: 'Most Popular',
  },
  {
    name: 'Premium',
    price: 79,
    period: '/month',
    description: 'For studios and power users',
    credits: 999,
    features: ['Unlimited AI videos', '4K resolution', 'All video styles', 'Custom templates', 'No watermark', 'AI Voiceover & Music', 'API access', 'Priority support', 'Custom branding'],
    icon: Crown,
    highlighted: false,
    color: 'border-secondary-500/30 hover:border-secondary-500/50',
    btnClass: 'bg-gradient-to-r from-secondary-600 to-primary-600 hover:from-secondary-700 hover:to-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105',
  },
];

export default function PricingPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 bg-dark-950/50 relative overflow-hidden" ref={ref}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 glass border border-green-500/30 text-green-400 text-sm font-medium px-4 py-2 rounded-full mb-4">
            <Crown className="w-4 h-4" />
            Simple Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-poppins text-white mb-4">
            Start Free, Scale as
            <br />
            <span className="gradient-text">You Grow</span>
          </h2>
          <p className="text-dark-400 text-lg max-w-xl mx-auto">
            No hidden fees. Cancel anytime. Upgrade or downgrade instantly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`glass-card p-8 border ${plan.color} transition-all duration-300 relative`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-xs px-4 py-1 rounded-full font-semibold shadow-glow">
                    {plan.badge}
                  </span>
                </div>
              )}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${plan.highlighted ? 'bg-primary-500/20' : 'bg-white/5'}`}>
                <plan.icon className={`w-6 h-6 ${plan.highlighted ? 'text-primary-400' : 'text-dark-300'}`} />
              </div>
              <h3 className="text-2xl font-bold text-white font-poppins mb-1">{plan.name}</h3>
              <p className="text-dark-400 text-sm mb-4">{plan.description}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white font-poppins">${plan.price}</span>
                <span className="text-dark-400 text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-dark-300">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlighted ? 'bg-primary-500/20' : 'bg-white/5'}`}>
                      <Check className={`w-2.5 h-2.5 ${plan.highlighted ? 'text-primary-400' : 'text-dark-400'}`} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/register" className={`${plan.btnClass} text-center block text-sm`}>
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Link to="/pricing" className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
            View full pricing details →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
