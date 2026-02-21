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
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative bg */}
      <div style={{
        position: 'absolute',
        top: -80,
        right: -60,
        width: 250,
        height: 250,
        borderRadius: '50%',
        background: 'var(--wn-card-green)',
        opacity: 0.3,
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '48px 24px 16px',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 8,
            display: 'flex', alignItems: 'center',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '0 24px', flex: 1 }}>
        {/* Icon + Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: 24 }}
        >
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 'var(--wn-radius-lg)',
            background: 'linear-gradient(135deg, var(--wn-card-yellow) 0%, var(--wn-premium-gold) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            boxShadow: '0 4px 16px rgba(197,164,78,0.3)',
          }}>
            <Crown size={28} color="white" />
          </div>

          <h1 style={{
            fontSize: 'var(--wn-text-2xl)',
            fontWeight: 700,
            lineHeight: 1.3,
            marginBottom: 8,
          }}>
            Remove Ads & Unlock<br />All Features
          </h1>
          <p style={{
            fontSize: 'var(--wn-text-base)',
            color: 'var(--wn-text-secondary)',
            lineHeight: 1.6,
          }}>
            Go Pro for the full WiNote experience with AI tools, advanced search, and zero interruptions.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.07 }}
              className="clay-card"
              style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: 16 }}
            >
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--wn-radius-sm)',
                background: 'var(--wn-card-green-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <f.icon size={16} color="var(--wn-accent-green)" />
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--wn-text-base)', fontWeight: 600, marginBottom: 2 }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 'var(--wn-text-sm)', color: 'var(--wn-text-secondary)', lineHeight: 1.4 }}>
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
          style={{ marginBottom: 24 }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 4,
            marginBottom: 4,
          }}>
            <span style={{ fontSize: 'var(--wn-text-3xl)', fontWeight: 800 }}>$4.99</span>
            <span style={{ fontSize: 'var(--wn-text-base)', color: 'var(--wn-text-secondary)' }}>/month</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Check size={14} color="var(--wn-accent-green)" />
            <span style={{ fontSize: 'var(--wn-text-sm)', color: 'var(--wn-text-secondary)' }}>
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
        style={{ padding: '16px 24px 40px' }}
      >
        <button
          onClick={() => { togglePremium(); navigate('/winote'); }}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 'var(--wn-radius-md)',
            background: 'var(--wn-accent-green)',
            color: 'white',
            border: 'none',
            fontSize: 'var(--wn-text-md)',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--wn-font)',
            boxShadow: '0 4px 16px rgba(107,143,91,0.4)',
          }}
        >
          Start Free Trial
        </button>
      </motion.div>
    </motion.div>
  );
};
