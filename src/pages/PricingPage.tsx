import { motion } from 'framer-motion';
import { Check, Zap, Star, Crown, HelpCircle } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: 0,
    period: '/month',
    description: 'Perfect for getting started',
    credits: 5,
    icon: Zap,
    color: 'border-white/10',
    iconColor: 'bg-white/5 text-dark-300',
    features: [
      { text: '5 AI videos per month', included: true },
      { text: '720p resolution', included: true },
      { text: '8 video styles', included: true },
      { text: 'Community templates', included: true },
      { text: 'Watermarked exports', included: true },
      { text: 'AI Voiceover', included: false },
      { text: 'AI Background Music', included: false },
      { text: 'Priority rendering', included: false },
      { text: 'API access', included: false },
      { text: 'Custom branding', included: false },
    ],
    highlighted: false,
    btnClass: 'btn-secondary w-full',
    plan: 'free',
  },
  {
    name: 'Pro',
    price: 29,
    period: '/month',
    description: 'For serious content creators',
    credits: 100,
    icon: Star,
    color: 'border-primary-500/50',
    iconColor: 'bg-primary-500/20 text-primary-400',
    features: [
      { text: '100 AI videos per month', included: true },
      { text: '1080p resolution', included: true },
      { text: 'All video styles', included: true },
      { text: 'Premium templates', included: true },
      { text: 'No watermark', included: true },
      { text: 'AI Voiceover', included: true },
      { text: 'AI Background Music', included: true },
      { text: 'Priority rendering', included: true },
      { text: 'API access', included: false },
      { text: 'Custom branding', included: false },
    ],
    highlighted: true,
    btnClass: 'btn-primary w-full',
    badge: 'Most Popular',
    plan: 'pro',
  },
  {
    name: 'Premium',
    price: 79,
    period: '/month',
    description: 'Unlimited creativity for studios',
    credits: 9999,
    icon: Crown,
    color: 'border-secondary-500/40',
    iconColor: 'bg-secondary-500/20 text-secondary-400',
    features: [
      { text: 'Unlimited AI videos', included: true },
      { text: '4K resolution', included: true },
      { text: 'All video styles', included: true },
      { text: 'Custom templates', included: true },
      { text: 'No watermark', included: true },
      { text: 'AI Voiceover & Music', included: true },
      { text: 'Priority rendering', included: true },
      { text: 'API access', included: true },
      { text: 'Custom branding', included: true },
      { text: 'Priority support', included: true },
    ],
    highlighted: false,
    btnClass: 'w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-secondary-600 to-primary-600 hover:from-secondary-700 hover:to-primary-700 transition-all duration-200 hover:scale-105',
    plan: 'premium',
  },
];

const faqs = [
  { q: 'Can I change plans at any time?', a: 'Yes, you can upgrade or downgrade instantly. Changes take effect immediately.' },
  { q: 'Do unused credits roll over?', a: 'Credits reset monthly. Unused credits do not carry over to the next billing period.' },
  { q: "What's included in the API?", a: 'Full REST API with video generation, status polling, and webhook support. Available on Premium.' },
];

export default function PricingPage() {
  const { profile } = useAuth();

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold font-poppins text-white mb-3">
            Choose Your Plan
          </h1>
          <p className="text-dark-400 text-lg max-w-xl mx-auto">
            Start free, scale as you grow. Cancel anytime.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`glass-card p-8 border ${plan.color} ${plan.highlighted ? 'glow-border' : ''} relative transition-all duration-300`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-xs px-4 py-1 rounded-full font-semibold">
                    {plan.badge}
                  </span>
                </div>
              )}

              {profile?.plan === plan.plan && (
                <div className="absolute top-4 right-4">
                  <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-medium">
                    Current Plan
                  </span>
                </div>
              )}

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${plan.iconColor}`}>
                <plan.icon className="w-6 h-6" />
              </div>

              <h2 className="text-2xl font-bold font-poppins text-white mb-1">{plan.name}</h2>
              <p className="text-dark-400 text-sm mb-5">{plan.description}</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white font-poppins">${plan.price}</span>
                <span className="text-dark-400">{plan.period}</span>
              </div>

              <div className="mb-8">
                <p className="text-dark-400 text-xs mb-3">
                  {plan.credits >= 9999 ? 'Unlimited credits' : `${plan.credits} credits / month`}
                </p>
                <ul className="space-y-2.5">
                  {plan.features.map(feature => (
                    <li key={feature.text} className={`flex items-center gap-2.5 text-sm ${feature.included ? 'text-dark-200' : 'text-dark-500'}`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${feature.included ? (plan.highlighted ? 'bg-primary-500/20' : 'bg-white/10') : 'bg-white/5'}`}>
                        {feature.included ? (
                          <Check className={`w-2.5 h-2.5 ${plan.highlighted ? 'text-primary-400' : 'text-dark-300'}`} />
                        ) : (
                          <span className="w-1.5 h-0.5 bg-dark-600 rounded" />
                        )}
                      </div>
                      {feature.text}
                    </li>
                  ))}
                </ul>
              </div>

              {profile?.plan === plan.plan ? (
                <button disabled className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-white/5 border border-white/10 cursor-not-allowed text-sm">
                  Current Plan
                </button>
              ) : (
                <button className={`${plan.btnClass} text-sm`}>
                  {plan.price === 0 ? 'Downgrade to Free' : `Upgrade to ${plan.name}`}
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Enterprise */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-8 border border-white/10 mb-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold font-poppins text-white mb-2">Enterprise</h3>
              <p className="text-dark-400 max-w-lg">
                Custom volume pricing, dedicated infrastructure, SLA guarantees, and white-label options for agencies and large teams.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button className="btn-secondary text-sm px-6 py-3">
                View Details
              </button>
              <button className="btn-primary text-sm px-6 py-3">
                Contact Sales
              </button>
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold font-poppins text-white mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary-400" />
            Billing FAQ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {faqs.map(faq => (
              <div key={faq.q} className="glass-card p-5 border border-white/5">
                <h4 className="text-white font-semibold text-sm mb-2">{faq.q}</h4>
                <p className="text-dark-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
