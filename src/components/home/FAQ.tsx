import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'How does VisionFlow AI generate videos?',
    a: 'VisionFlow AI uses advanced diffusion models and transformer architectures trained on billions of video frames. You provide a text prompt, and our AI generates every frame, scene transition, and camera movement automatically.',
  },
  {
    q: 'How long does it take to generate a video?',
    a: 'Most videos are generated in 10-60 seconds depending on length and complexity. Our Pro and Premium plans get priority processing for even faster results.',
  },
  {
    q: 'Can I use generated videos commercially?',
    a: 'Yes! All paid plans include full commercial licensing. You own 100% of the videos you generate. Free plan videos include a watermark and are for personal use only.',
  },
  {
    q: 'What video formats can I export?',
    a: 'We support MP4 (H.264/H.265), WebM, MOV, and GIF exports. Pro and Premium users get access to 4K resolution and ProRes export options.',
  },
  {
    q: 'Is my data and prompts kept private?',
    a: 'Absolutely. Your prompts and generated videos are private by default. We never use your content to train our models without explicit consent.',
  },
  {
    q: 'Can I cancel or change my plan anytime?',
    a: 'Yes, you can upgrade, downgrade, or cancel your subscription at any time. Cancellations take effect at the end of the current billing period.',
  },
  {
    q: 'Do you offer an API for developers?',
    a: 'Yes! Our REST API is available on Premium and Enterprise plans. You can integrate AI video generation directly into your own applications and workflows.',
  },
];

function FAQItem({ q, a, isOpen, onClick }: { q: string; a: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div
      className={`glass-card border cursor-pointer transition-all duration-200 ${isOpen ? 'border-primary-500/30' : 'border-white/5 hover:border-white/10'}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between p-5 gap-4">
        <span className="text-white font-medium text-sm sm:text-base pr-4">{q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-6 h-6 rounded-full glass flex items-center justify-center"
        >
          <ChevronDown className="w-4 h-4 text-dark-400" />
        </motion.div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="text-dark-400 text-sm leading-relaxed px-5 pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 relative" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 glass border border-white/20 text-dark-300 text-sm font-medium px-4 py-2 rounded-full mb-4">
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-white mb-4">
            Everything You Want to
            <br />
            <span className="gradient-text">Know About Us</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-3"
        >
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              q={faq.q}
              a={faq.a}
              isOpen={open === i}
              onClick={() => setOpen(open === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
