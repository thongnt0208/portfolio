import React from 'react';
import { motion } from 'framer-motion';
import {
  ChevronRight, Edit, Type, Bell, Lock,
  CircleHelp, LogOut, RefreshCw, ExternalLink,
} from 'lucide-react';
import { Header } from '../layout/Header';
import { useUserStore } from '../store/useUserStore';
import GoogleDriveIcon from '@assets/winote/illustration/google-drive.svg?react';
import ProfileBlankIcon from '@assets/winote/illustration/profile-blank.svg?react';

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
  interface SettingButton {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    detail?: string;
    toggle?: boolean;
    value?: boolean;
    key?: keyof typeof settings;
  }
  const settingButtons: SettingButton[] = [
    // TODO: implement dark mode later
    // { icon: Moon, label: 'Dark Mode', toggle: true, value: settings.darkMode, key: 'darkMode' as const },
    { icon: Type, label: 'Typography', detail: settings.typography },
    { icon: Bell, label: 'Notifications' },
    { icon: Lock, label: 'Security' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.3 }}
      className="pb-16"
    >
      <Header showBack title="Settings" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="px-6 my-5 pb-16"
      >
        {/* Profile Card */}
        <motion.div variants={item} className="clay-card p-5 flex items-center gap-4 mb-7">
          <div className="w-16 h-16 rounded-full bg-wn-card-green-light flex items-center justify-center shrink-0">
           <ProfileBlankIcon className="w-6 h-6 text-wn-text-secondary" />
          </div>
          <div className="flex-1">
            <h2 className="text-wn-xl font-semibold text-wn-text-primary font-wn">{user.name}</h2>
            <p className="text-wn-sm text-wn-text-secondary font-wn">{user.plan}</p>
          </div>
          <button className="w-10 h-10 rounded-wn-lg bg-wn-bg shadow-wn-card-sm border-none cursor-pointer flex items-center justify-center">
            <Edit size={16} className="text-wn-text-secondary" />
          </button>
        </motion.div>

        {/* Cloud Sync */}
        <motion.div variants={item}>
          <h3 className="wn-section-title">CLOUD SYNC</h3>
          <div className="clay-card p-5 mt-2 mb-7">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-wn-md bg-wn-card-green-light flex items-center justify-center shrink-0">
                <GoogleDriveIcon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-wn-lg font-semibold">Google Drive</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-2 h-2 rounded-full bg-wn-accent-green" />
                  <span className="text-wn-sm text-wn-text-secondary">Synced: Just now</span>
                </div>
              </div>
              <div
                className={`clay-toggle ${settings.cloudSync ? 'clay-toggle--active' : ''}`}
                onClick={() => updateSettings({ cloudSync: !settings.cloudSync })}
              />
            </div>

            <div className="clay-inset flex justify-between p-3 mb-3">
              <span className="text-wn-sm text-wn-text-secondary">Backup Frequency</span>
              <div className="flex items-center gap-1">
                <span className="text-wn-sm text-wn-text-secondary">Daily</span>
                <ChevronRight size={14} className="text-wn-text-tertiary" />
              </div>
            </div>

            <button className="w-full p-3 rounded-wn-md bg-wn-bg-light shadow-wn-btn border border-wn-border cursor-pointer flex items-center justify-center gap-2 font-wn text-wn-md font-medium">
              <RefreshCw size={16} />
              Sync Now
            </button>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div variants={item}>
          <h3 className="wn-section-title">PREFERENCES</h3>
          <div className="clay-card mt-2 mb-7 overflow-hidden">
            {settingButtons.map((pref, i, arr) => (
              <button
                key={pref.label}
                onClick={() => {
                  if (pref.toggle && pref.key) {
                    updateSettings({ [pref.key]: !pref.value });
                  }
                }}
                className={`w-full flex items-center gap-4 p-5 bg-transparent border-none cursor-pointer font-wn text-wn-md text-wn-text-primary text-left ${
                  i < arr.length - 1 ? 'border-b border-wn-divider' : ''
                }`}
              >
                <pref.icon size={18} className="text-wn-text-secondary" />
                <span className="flex-1">{pref.label}</span>
                {pref.toggle ? (
                  <div className={`clay-toggle ${pref.value ? 'clay-toggle--active' : ''}`} />
                ) : (
                  <div className="flex items-center gap-1">
                    {pref.detail && <span className="text-wn-sm text-wn-text-secondary">{pref.detail}</span>}
                    <ChevronRight size={16} className="text-wn-text-tertiary" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Support */}
        <motion.div variants={item}>
          <h3 className="wn-section-title">SUPPORT</h3>
          <div className="clay-card mt-2 overflow-hidden">
            <button className="w-full flex items-center gap-4 p-5 bg-transparent border-none border-b border-wn-divider cursor-pointer font-wn text-wn-md text-wn-text-primary text-left">
              <CircleHelp size={18} className="text-wn-text-secondary" />
              <span className="flex-1">Help & FAQ</span>
              <ExternalLink size={14} className="text-wn-text-tertiary" />
            </button>
            <button className="w-full flex items-center gap-4 p-5 bg-transparent border-none cursor-pointer font-wn text-wn-md text-wn-text-danger text-left">
              <LogOut size={18} className="text-wn-text-danger" />
              <span>Sign Out</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
