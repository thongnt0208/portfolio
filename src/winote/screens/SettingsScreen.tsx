import React from 'react';
import { motion } from 'framer-motion';
import {
  ChevronRight, Edit, Moon, Type, Bell, Lock,
  CircleHelp, LogOut, RefreshCw, ExternalLink,
} from 'lucide-react';
import { Header } from '../layout/Header';
import { useUserStore } from '../store/useUserStore';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const SettingsScreen: React.FC = () => {
  const { user, settings, updateSettings } = useUserStore();

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.3 }}
      style={{ paddingBottom: 60 }}
    >
      <Header showBack title="Settings" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ padding: '0 24px' }}
      >
        {/* Profile Card */}
        <motion.div variants={item} className="clay-card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'var(--wn-card-green-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--wn-text-secondary)" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 'var(--wn-text-xl)', fontWeight: 600 }}>{user.name}</h2>
            <p style={{ fontSize: 'var(--wn-text-sm)', color: 'var(--wn-text-secondary)' }}>{user.plan}</p>
          </div>
          <button style={{
            width: 40, height: 40, borderRadius: 'var(--wn-radius-md)',
            background: 'var(--wn-bg-light)', boxShadow: 'var(--wn-shadow-card-sm)',
            border: '1px solid var(--wn-border)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Edit size={16} color="var(--wn-text-secondary)" />
          </button>
        </motion.div>

        {/* Cloud Sync */}
        <motion.div variants={item}>
          <h3 className="wn-section-title">CLOUD SYNC</h3>
          <div className="clay-card" style={{ padding: 20, marginTop: 8, marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 'var(--wn-radius-md)',
                background: 'var(--wn-card-green-light)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: 'var(--wn-text-lg)', fontWeight: 600 }}>Google Drive</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--wn-accent-green)' }} />
                  <span style={{ fontSize: 'var(--wn-text-sm)', color: 'var(--wn-text-secondary)' }}>Synced: Just now</span>
                </div>
              </div>
              <div
                className={`clay-toggle ${settings.cloudSync ? 'clay-toggle--active' : ''}`}
                onClick={() => updateSettings({ cloudSync: !settings.cloudSync })}
              />
            </div>

            <div className="clay-inset" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', marginBottom: 12 }}>
              <span style={{ fontSize: 'var(--wn-text-sm)', color: 'var(--wn-text-secondary)' }}>Backup Frequency</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 'var(--wn-text-sm)', color: 'var(--wn-text-secondary)' }}>Daily</span>
                <ChevronRight size={14} color="var(--wn-text-tertiary)" />
              </div>
            </div>

            <button style={{
              width: '100%', padding: '12px', borderRadius: 'var(--wn-radius-md)',
              background: 'var(--wn-bg-light)', boxShadow: 'var(--wn-shadow-btn)',
              border: '1px solid var(--wn-border)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'var(--wn-font)', fontSize: 'var(--wn-text-md)', fontWeight: 500,
            }}>
              <RefreshCw size={16} />
              Sync Now
            </button>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div variants={item}>
          <h3 className="wn-section-title">PREFERENCES</h3>
          <div className="clay-card" style={{ marginTop: 8, marginBottom: 28, overflow: 'hidden' }}>
            {[
              { icon: Moon, label: 'Dark Mode', toggle: true, value: settings.darkMode, key: 'darkMode' as const },
              { icon: Type, label: 'Typography', detail: settings.typography },
              { icon: Bell, label: 'Notifications' },
              { icon: Lock, label: 'Security' },
            ].map((pref, i, arr) => (
              <button
                key={pref.label}
                onClick={() => {
                  if (pref.toggle && pref.key) {
                    updateSettings({ [pref.key]: !pref.value });
                  }
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '20px',
                  background: 'none',
                  border: 'none',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--wn-divider)' : 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--wn-font)',
                  fontSize: 'var(--wn-text-md)',
                  color: 'var(--wn-text-primary)',
                  textAlign: 'left',
                }}
              >
                <pref.icon size={18} color="var(--wn-text-secondary)" />
                <span style={{ flex: 1 }}>{pref.label}</span>
                {pref.toggle ? (
                  <div className={`clay-toggle ${pref.value ? 'clay-toggle--active' : ''}`} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {pref.detail && <span style={{ fontSize: 'var(--wn-text-sm)', color: 'var(--wn-text-secondary)' }}>{pref.detail}</span>}
                    <ChevronRight size={16} color="var(--wn-text-tertiary)" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Support */}
        <motion.div variants={item}>
          <h3 className="wn-section-title">SUPPORT</h3>
          <div className="clay-card" style={{ marginTop: 8, overflow: 'hidden' }}>
            <button style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 16,
              padding: '20px', background: 'none', border: 'none',
              borderBottom: '1px solid var(--wn-divider)',
              cursor: 'pointer', fontFamily: 'var(--wn-font)',
              fontSize: 'var(--wn-text-md)', color: 'var(--wn-text-primary)', textAlign: 'left',
            }}>
              <CircleHelp size={18} color="var(--wn-text-secondary)" />
              <span style={{ flex: 1 }}>Help & FAQ</span>
              <ExternalLink size={14} color="var(--wn-text-tertiary)" />
            </button>
            <button style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 16,
              padding: '20px', background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: 'var(--wn-font)',
              fontSize: 'var(--wn-text-md)', color: 'var(--wn-text-danger)', textAlign: 'left',
            }}>
              <LogOut size={18} color="var(--wn-text-danger)" />
              <span>Sign Out</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
