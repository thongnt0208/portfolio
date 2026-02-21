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
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={completed ? closeRewardsOverlay : undefined}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(30, 30, 20, 0.7)',
          backdropFilter: 'blur(4px)',
        }}
      />

      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          position: 'relative',
          width: 'calc(100% - 48px)',
          maxWidth: 380,
          background: 'var(--wn-bg)',
          borderRadius: 'var(--wn-radius-2xl)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Decorative gradient */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 120,
          background: 'linear-gradient(180deg, var(--wn-card-green) 0%, transparent 100%)',
          opacity: 0.4,
          pointerEvents: 'none',
        }} />

        {/* Close */}
        {completed && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={closeRewardsOverlay}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '1px solid var(--wn-border)',
              background: 'var(--wn-bg-light)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </motion.button>
        )}

        {/* Icon */}
        <motion.div
          animate={completed ? { scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 0.6 }}
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: completed
              ? 'linear-gradient(135deg, var(--wn-accent-green) 0%, #8BAF6B 100%)'
              : 'linear-gradient(135deg, var(--wn-card-yellow) 0%, var(--wn-premium-gold) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            marginTop: 16,
            boxShadow: '0 4px 16px rgba(107,143,91,0.3)',
            position: 'relative',
            zIndex: 1,
          }}
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
        <h2 style={{
          fontSize: 'var(--wn-text-xl)',
          fontWeight: 700,
          marginBottom: 8,
          position: 'relative',
          zIndex: 1,
        }}>
          {completed ? 'Reward Earned!' : 'Watch to Earn Rewards'}
        </h2>

        <p style={{
          fontSize: 'var(--wn-text-base)',
          color: 'var(--wn-text-secondary)',
          lineHeight: 1.5,
          marginBottom: 24,
          position: 'relative',
          zIndex: 1,
        }}>
          {completed
            ? 'You earned 30 minutes of ad-free experience.'
            : 'Watch a short video to unlock 30 minutes of ad-free experience.'}
        </p>

        {/* Progress */}
        {!completed && (
          <div style={{
            width: '100%',
            marginBottom: 24,
            position: 'relative',
            zIndex: 1,
          }}>
            <div style={{
              height: 8,
              borderRadius: 4,
              background: 'var(--wn-card-gray)',
              overflow: 'hidden',
              boxShadow: 'var(--wn-shadow-inset)',
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                style={{
                  height: '100%',
                  borderRadius: 4,
                  background: 'linear-gradient(90deg, var(--wn-accent-green) 0%, #8BAF6B 100%)',
                }}
              />
            </div>
            <p style={{
              fontSize: 'var(--wn-text-xs)',
              color: 'var(--wn-text-tertiary)',
              marginTop: 8,
            }}>
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
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--wn-radius-md)',
              background: 'var(--wn-accent-green)',
              color: 'white',
              border: 'none',
              fontSize: 'var(--wn-text-md)',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--wn-font)',
              position: 'relative',
              zIndex: 1,
            }}
          >
            Continue
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};
