import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Search, Brain, Shield, Check } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';

const features = [
  { icon: Sparkles, title: 'AI-Powered Summaries', desc: 'Get instant summaries of your notes with on-device AI.' },
  { icon: Search, title: 'Advanced Search', desc: 'Search inside PDFs and handwritten notes.' },
  { icon: Brain, title: 'Smart Auto-Tagging', desc: 'Automatically tag and categorize your notes.' },
  { icon: Shield, title: 'Ad-Free Experience', desc: 'Remove all ads permanently.' },
];

export const PremiumScreen: React.FC = () => {
  const navigate = useNavigate();
  const { togglePremium } = useUserStore();

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.3 }}
      className="min-h-[100dvh] flex flex-col relative overflow-hidden"
    >
      {/* Decorative bg */}
      <div className="absolute -top-20 -right-[60px] w-[250px] h-[250px] rounded-full bg-wn-card-green opacity-30 blur-[60px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center pt-12 px-6 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-transparent border-none cursor-pointer p-2 flex items-center"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="px-6 flex-1">
        {/* Icon + Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div
            className="w-16 h-16 rounded-wn-lg flex items-center justify-center mb-5"
            style={{
              background: 'linear-gradient(135deg, var(--wn-card-yellow) 0%, var(--wn-premium-gold) 100%)',
              boxShadow: '0 4px 16px rgba(197,164,78,0.3)',
            }}
          >
            <Crown size={28} color="white" />
          </div>

          <h1 className="text-wn-2xl font-bold leading-snug mb-2">
            Remove Ads & Unlock<br />All Features
          </h1>
          <p className="text-wn-base text-wn-text-secondary leading-relaxed">
            Go Pro for the full WiNote experience with AI tools, advanced search, and zero interruptions.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-3 mb-8"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.07 }}
              className="clay-card flex items-start gap-3.5 p-4"
            >
              <div className="w-9 h-9 rounded-wn-sm bg-wn-card-green-light flex items-center justify-center shrink-0">
                <f.icon size={16} color="var(--wn-accent-green)" />
              </div>
              <div>
                <h3 className="text-wn-base font-semibold mb-0.5">
                  {f.title}
                </h3>
                <p className="text-wn-sm text-wn-text-secondary leading-snug">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-wn-3xl font-extrabold">$4.99</span>
            <span className="text-wn-base text-wn-text-secondary">/month</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check size={14} color="var(--wn-accent-green)" />
            <span className="text-wn-sm text-wn-text-secondary">
              7-day free trial included
            </span>
          </div>
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="pt-4 px-6 pb-10"
      >
        <button
          onClick={() => { togglePremium(); navigate('/winote'); }}
          className="w-full p-4 rounded-wn-md bg-wn-accent-green text-white border-none text-wn-md font-semibold cursor-pointer font-wn"
          style={{ boxShadow: '0 4px 16px rgba(107,143,91,0.4)' }}
        >
          Start Free Trial
        </button>
      </motion.div>
    </motion.div>
  );
};
