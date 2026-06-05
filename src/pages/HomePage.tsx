import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import Showcase from '../components/home/Showcase';
import Testimonials from '../components/home/Testimonials';
import PricingPreview from '../components/home/PricingPreview';
import FAQ from '../components/home/FAQ';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <Hero />
      <Features />
      <Showcase />
      <Testimonials />
      <PricingPreview />
      <FAQ />

      {/* CTA Banner */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/50 via-secondary-900/50 to-accent-900/30" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-poppins text-white mb-6">
              Ready to Transform Your Ideas
              <br />
              <span className="gradient-text">into Stunning Videos?</span>
            </h2>
            <p className="text-dark-300 text-lg mb-10 max-w-xl mx-auto">
              Join 50,000+ creators. Start generating AI videos for free today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary flex items-center gap-2 text-base px-8 py-4 w-full sm:w-auto justify-center">
                <Zap className="w-5 h-5" />
                Start Creating Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/pricing" className="btn-secondary flex items-center gap-2 text-base px-8 py-4 w-full sm:w-auto justify-center">
                View All Plans
              </Link>
            </div>
            <p className="text-dark-500 text-sm mt-6">No credit card required • Cancel anytime • 5 free videos</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
