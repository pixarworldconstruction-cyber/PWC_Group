import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  KeyRound, 
  ShieldCheck, 
  HardHat, 
  TrendingUp, 
  Compass, 
  UserCheck, 
  Lock, 
  ArrowRight,
  AlertCircle,
  Palette,
  Sun,
  Moon
} from 'lucide-react';
import { UserRole, ThemeMode, AccentColor } from '../types';

export const LoginScreen: React.FC = () => {
  const { login, updatePassword, theme, setTheme, accentColor, setAccentColor } = useApp();

  const [username, setUsername] = useState('siteadmin');
  const [password, setPassword] = useState('0102');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Temporary password reset flow
  const [isResetMode, setIsResetMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const res = login(username, password);
    if (!res.success) {
      setErrorMsg(res.message || 'Login failed. Please verify credentials.');
    } else if (res.tempPasswordAlert) {
      setIsResetMode(true);
    }
  };

  const handleSetPermanentPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim() || newPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters.');
      return;
    }
    setIsResetMode(false);
  };

  const quickLogin = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    login(user, pass);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors duration-200">
      
      {/* Top right Theme quick toggle on login screen */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'navy' : 'light')}
          className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-main)] hover:bg-[var(--bg-surface-subtle)] transition-colors shadow-xs flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          title="Toggle Theme"
        >
          {theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : theme === 'dark' ? <Moon className="w-4 h-4 text-slate-400" /> : <Compass className="w-4 h-4 text-blue-400" />}
          <span className="capitalize">{theme} Theme</span>
        </button>
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--primary-accent)] text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-black/10">
            PW
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--text-main)] tracking-tight">P W CONSTRUCTION</h1>
            <p className="text-xs font-semibold text-[var(--primary-accent-text)]">
              Pixar World Construction Private Limited
            </p>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Vadodara Headquarters · Multi-Branch Project, Field DPR & HR Operations
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
          
          {isResetMode ? (
            /* First-time login Temporary Password Change Screen */
            <form onSubmit={handleSetPermanentPassword} className="space-y-4">
              <div className="p-3 bg-[var(--primary-accent-bg)] border border-[var(--primary-accent-border)] rounded-xl text-xs text-[var(--primary-accent-text)] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[var(--primary-accent)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">First-Time Login Security Setup</span>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    You logged in using a temporary password. Please set your permanent confidential password to continue.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Set New Permanent Password *</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new secure password..."
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg transition-opacity shadow-md cursor-pointer"
              >
                Save Permanent Password & Enter Portal
              </button>
            </form>
          ) : (
            /* Standard Login Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">User ID *</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="e.g. siteadmin or engineer1"
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Password *</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] font-mono"
                  required
                />
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/25 rounded-lg text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg transition-opacity shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Quick Demo Accounts for Instant Evaluation Testing */}
          <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-subtle)] text-center">
              Quick 1-Click Test Access
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => quickLogin('siteadmin', '0102')}
                className="p-2 bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg text-left transition-colors shadow-2xs cursor-pointer"
              >
                <div className="font-bold flex items-center gap-1 text-[var(--primary-accent-text)]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--primary-accent)]" />
                  <span>Site Admin</span>
                </div>
                <div className="text-[10px] text-[var(--text-muted)] font-mono">siteadmin / 0102</div>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('engineer1', '0102')}
                className="p-2 bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg text-left transition-colors shadow-2xs cursor-pointer"
              >
                <div className="font-bold flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <HardHat className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Site Engineer</span>
                </div>
                <div className="text-[10px] text-[var(--text-muted)] font-mono">engineer1 / 0102</div>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('marketing1', '0102')}
                className="p-2 bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg text-left transition-colors shadow-2xs cursor-pointer"
              >
                <div className="font-bold flex items-center gap-1 text-blue-600 dark:text-blue-400">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                  <span>Marketing Rep</span>
                </div>
                <div className="text-[10px] text-[var(--text-muted)] font-mono">marketing1 / 0102</div>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('designer1', '0102')}
                className="p-2 bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg text-left transition-colors shadow-2xs cursor-pointer"
              >
                <div className="font-bold flex items-center gap-1 text-purple-600 dark:text-purple-400">
                  <Compass className="w-3.5 h-3.5 text-purple-500" />
                  <span>Architect Studio</span>
                </div>
                <div className="text-[10px] text-[var(--text-muted)] font-mono">designer1 / 0102</div>
              </button>
            </div>
          </div>

        </div>

        {/* Footer Note */}
        <div className="text-center text-[11px] text-[var(--text-muted)] font-mono">
          Pixar World Construction Private Limited · Vadodara, Gujarat (₹ INR)
        </div>

      </div>
    </div>
  );
};
