import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Gift, Play, CheckCircle } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

export const RewardsOverlay: React.FC = () => {
  const { closeRewardsOverlay } = useUIStore();
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setCompleted(true);
          return 100;
        }
        return p + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [completed]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center"
    >
      <div
        onClick={completed ? closeRewardsOverlay : undefined}
        className="absolute inset-0 bg-[rgba(30,30,20,0.7)] backdrop-blur-[4px]"
      />

      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-[calc(100%-48px)] max-w-[380px] bg-wn-bg rounded-wn-xl overflow-hidden py-8 px-6 flex flex-col items-center text-center shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
      >
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-[120px] opacity-40 pointer-events-none bg-gradient-to-b from-wn-card-green to-transparent" />

        {/* Close */}
        {completed && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={closeRewardsOverlay}
            aria-label="Close"
            className="absolute top-4 right-4 w-8 h-8 rounded-full border border-wn-border bg-wn-bg-light cursor-pointer flex items-center justify-center"
          >
            <X size={16} />
          </motion.button>
        )}

        {/* Icon */}
        <motion.div
          animate={completed ? { scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 0.6 }}
          className={`w-[72px] h-[72px] rounded-full flex items-center justify-center mb-5 mt-4 relative z-[1] shadow-[0_4px_16px_rgba(107,143,91,0.3)] ${
            completed
              ? 'bg-gradient-to-br from-wn-accent-green to-[#8BAF6B]'
              : 'bg-gradient-to-br from-wn-card-yellow to-wn-premium-gold'
          }`}
        >
          {completed ? (
            <CheckCircle size={32} color="white" />
          ) : progress > 0 ? (
            <Play size={28} color="white" fill="white" />
          ) : (
            <Gift size={28} color="white" />
          )}
        </motion.div>

        {/* Title */}
        <h2 className="text-wn-xl font-bold mb-2 relative z-[1] text-wn-text-primary font-wn">
          {completed ? 'Reward Earned!' : 'Watch to Earn Rewards'}
        </h2>

        <p className="text-wn-base text-wn-text-secondary leading-normal mb-6 relative z-[1] font-wn">
          {completed
            ? 'You earned 30 minutes of ad-free experience.'
            : 'Watch a short video to unlock 30 minutes of ad-free experience.'}
        </p>

        {/* Progress */}
        {!completed && (
          <div className="w-full mb-6 relative z-[1]">
            <div className="h-2 rounded bg-wn-card-gray overflow-hidden shadow-wn-inset">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full rounded bg-gradient-to-r from-wn-cta-bg to-[#8BAF6B]"
              />
            </div>
            <p className="text-wn-xs text-wn-text-tertiary mt-2">
              {progress < 100 ? `${Math.round(progress)}% complete` : 'Finishing...'}
            </p>
          </div>
        )}

        {/* CTA */}
        {completed && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.96 }}
            onClick={closeRewardsOverlay}
            className="w-full py-3.5 rounded-wn-xl bg-wn-cta-bg text-wn-white border-none text-wn-md font-semibold cursor-pointer font-wn relative z-[1]"
          >
            Continue
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};
