import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Bell, 
  Smartphone, 
  Monitor, 
  LogOut, 
  ShieldCheck, 
  HardHat, 
  TrendingUp, 
  Compass, 
  UserCheck, 
  ChevronDown,
  Check,
  AlertCircle,
  Sun,
  Moon,
  Palette
} from 'lucide-react';
import { UserRole, ThemeMode, AccentColor } from '../types';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    activeBranchId, 
    setActiveBranchId, 
    branches, 
    logout, 
    switchRole, 
    isMobileSimulated, 
    setIsMobileSimulated,
    notifications,
    markNotificationRead,
    setActiveTab,
    theme,
    setTheme,
    accentColor,
    setAccentColor
  } = useApp();

  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.isRead);

  const activeBranchName = activeBranchId === 'ALL' 
    ? 'All Company Branches' 
    : branches.find(b => b.id === activeBranchId)?.name || 'Branch';

  const roleLabels: Record<UserRole, { label: string; icon: React.ReactNode; color: string }> = {
    ADMIN: { label: 'Admin (siteadmin)', icon: <ShieldCheck className="w-4 h-4 text-amber-500" />, color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30' },
    SITE_ENGINEER: { label: 'Site Engineer', icon: <HardHat className="w-4 h-4 text-emerald-500" />, color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' },
    MARKETING: { label: 'Marketing Head', icon: <TrendingUp className="w-4 h-4 text-blue-500" />, color: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30' },
    DESIGNER: { label: 'Architect / Designer', icon: <Compass className="w-4 h-4 text-purple-500" />, color: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30' },
    EMPLOYEE: { label: 'Field Staff / HR', icon: <UserCheck className="w-4 h-4 text-slate-500 dark:text-slate-300" />, color: 'bg-slate-500/10 text-slate-700 dark:text-slate-200 border-slate-400/30' },
  };

  const themeOptions: { key: ThemeMode; label: string; desc: string; icon: React.ReactNode }[] = [
    { key: 'light', label: 'Industrial Day (Clean)', desc: 'Crisp light enterprise canvas with slate surfaces', icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { key: 'dark', label: 'Deep Onyx & Gold (Dark)', desc: 'High-contrast executive night mode', icon: <Moon className="w-4 h-4 text-slate-400" /> },
    { key: 'navy', label: 'Architectural Blueprint', desc: 'Midnight cobalt & steel engineering aesthetic', icon: <Compass className="w-4 h-4 text-blue-400" /> },
  ];

  const accentOptions: { key: AccentColor; label: string; colorClass: string }[] = [
    { key: 'amber', label: 'Safety Gold', colorClass: 'bg-amber-500' },
    { key: 'orange', label: 'High-Vis Orange', colorClass: 'bg-orange-500' },
    { key: 'blue', label: 'Civil Cobalt', colorClass: 'bg-blue-600' },
    { key: 'emerald', label: 'Site Green', colorClass: 'bg-emerald-500' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[var(--header-bg)] backdrop-blur-md border-b border-[var(--border-subtle)] px-4 lg:px-6 py-2.5 transition-colors shadow-sm">
      <div className="flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-[var(--primary-accent)] text-slate-950 font-black flex items-center justify-center text-sm shadow-sm">
            PW
          </div>
          <div>
            <div 
              onClick={() => setActiveTab('company_profile')}
              className="cursor-pointer group"
              title="View Corporate Company Profile"
            >
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-[var(--text-main)] group-hover:text-[var(--primary-accent-text)] transition-colors whitespace-nowrap">
                  P W Construction
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-wider text-[var(--primary-accent-text)] bg-[var(--primary-accent-bg)] px-1.5 py-0.5 rounded border border-[var(--primary-accent-border)] font-bold">
                  Vadodara HQ
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-[var(--text-muted)] whitespace-nowrap">
                Pixar World Construction Pvt Ltd · ₹ (INR)
              </p>
            </div>
          </div>
        </div>

        {/* Zone 2: Branch Selector, Theme Customizer & Actions */}
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          
          {/* Branch Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowBranchMenu(!showBranchMenu);
                setShowRoleMenu(false);
                setShowNotifMenu(false);
                setShowThemeMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-main)] rounded-lg transition-colors whitespace-nowrap shadow-xs"
              title="Filter by City / Branch"
            >
              <Building2 className="w-3.5 h-3.5 text-[var(--primary-accent)] shrink-0" />
              <span className="max-w-[130px] md:max-w-[180px] truncate">{activeBranchName}</span>
              <ChevronDown className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
            </button>

            {showBranchMenu && (
              <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl shadow-2xl py-2 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-subtle)]">
                  Select Operating Branch
                </div>
                <button
                  onClick={() => {
                    setActiveBranchId('ALL');
                    setShowBranchMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[var(--bg-surface-subtle)] transition-colors ${
                    activeBranchId === 'ALL' ? 'text-[var(--primary-accent-text)] font-semibold bg-[var(--primary-accent-bg)]' : 'text-[var(--text-main)]'
                  }`}
                >
                  <div>
                    <div className="font-medium">All Branches (Consolidated)</div>
                    <div className="text-[11px] text-[var(--text-muted)]">4 City Hubs · Across Maharashtra, NCR & Karnataka</div>
                  </div>
                  {activeBranchId === 'ALL' && <Check className="w-4 h-4 text-[var(--primary-accent)]" />}
                </button>
                {branches.map(branch => (
                  <button
                    key={branch.id}
                    onClick={() => {
                      setActiveBranchId(branch.id);
                      setShowBranchMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[var(--bg-surface-subtle)] transition-colors ${
                      activeBranchId === branch.id ? 'text-[var(--primary-accent-text)] font-semibold bg-[var(--primary-accent-bg)]' : 'text-[var(--text-main)]'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{branch.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">{branch.city} · {branch.code} ({branch.activeProjectsCount} Sites)</div>
                    </div>
                    {activeBranchId === branch.id && <Check className="w-4 h-4 text-[var(--primary-accent)]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme & Color Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowThemeMenu(!showThemeMenu);
                setShowBranchMenu(false);
                setShowRoleMenu(false);
                setShowNotifMenu(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-main)] transition-colors shadow-xs"
              title="Change UI Theme and Color Palette"
            >
              <Palette className="w-3.5 h-3.5 text-[var(--primary-accent)]" />
              <span className="hidden sm:inline capitalize font-medium">{theme}</span>
              <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl shadow-2xl p-3 z-50 space-y-3">
                <div>
                  <div className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    Select Interface Theme
                  </div>
                  <div className="space-y-1.5">
                    {themeOptions.map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => {
                          setTheme(opt.key);
                          setShowThemeMenu(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          theme === opt.key 
                            ? 'bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)] font-bold border border-[var(--primary-accent-border)]' 
                            : 'hover:bg-[var(--bg-surface-subtle)] text-[var(--text-main)]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {opt.icon}
                          <div>
                            <div className="font-semibold">{opt.label}</div>
                            <div className="text-[10px] text-[var(--text-muted)]">{opt.desc}</div>
                          </div>
                        </div>
                        {theme === opt.key && <Check className="w-4 h-4 text-[var(--primary-accent)]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--border-subtle)]">
                  <div className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    Construction Accent Color
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {accentOptions.map(acc => (
                      <button
                        key={acc.key}
                        onClick={() => {
                          setAccentColor(acc.key);
                          setShowThemeMenu(false);
                        }}
                        className={`p-2 rounded-lg text-xs flex items-center gap-2 border transition-all ${
                          accentColor === acc.key 
                            ? 'border-[var(--primary-accent)] bg-[var(--primary-accent-bg)] font-bold text-[var(--text-main)]' 
                            : 'border-[var(--border-subtle)] hover:bg-[var(--bg-surface-subtle)] text-[var(--text-muted)]'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${acc.colorClass} shrink-0`} />
                        <span className="truncate">{acc.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Role Switcher for Instant Testing */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowBranchMenu(false);
                setShowNotifMenu(false);
                setShowThemeMenu(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors shadow-xs ${
                currentUser ? roleLabels[currentUser.role]?.color || 'bg-[var(--bg-surface-subtle)] text-[var(--text-main)] border-[var(--border-subtle)]' : 'bg-[var(--bg-surface-subtle)] text-[var(--text-main)] border-[var(--border-subtle)]'
              }`}
              title="Test as different roles: Admin, Engineer, Marketing, Designer, Employee"
            >
              {currentUser && roleLabels[currentUser.role]?.icon}
              <span className="hidden sm:inline font-semibold">{currentUser ? roleLabels[currentUser.role]?.label : 'Switch User'}</span>
              <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl shadow-2xl py-2 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-subtle)]">
                  Switch Active Role (Instant Demo)
                </div>
                {(Object.keys(roleLabels) as UserRole[]).map(role => (
                  <button
                    key={role}
                    onClick={() => {
                      switchRole(role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[var(--bg-surface-subtle)] transition-colors ${
                      currentUser?.role === role ? 'text-[var(--primary-accent-text)] font-semibold bg-[var(--primary-accent-bg)]' : 'text-[var(--text-main)]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {roleLabels[role].icon}
                      <div>
                        <div className="font-medium">{roleLabels[role].label}</div>
                        <div className="text-[10px] text-[var(--text-muted)]">
                          {role === 'ADMIN' && 'ID: siteadmin (Full Governance)'}
                          {role === 'SITE_ENGINEER' && 'DPR, Labor & Multi-site operations'}
                          {role === 'MARKETING' && 'CRM, Leads & Target Commission'}
                          {role === 'DESIGNER' && 'CAD Blueprints & Task Approvals'}
                          {role === 'EMPLOYEE' && 'Salary Box, Holidays & Leaves'}
                        </div>
                      </div>
                    </div>
                    {currentUser?.role === role && <Check className="w-4 h-4 text-[var(--primary-accent)]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Android Mobile Viewport Emulation Toggle */}
          <button
            onClick={() => setIsMobileSimulated(!isMobileSimulated)}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors shadow-xs ${
              isMobileSimulated 
                ? 'bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)] border-[var(--primary-accent-border)] font-bold' 
                : 'bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-main)]'
            }`}
            title="Toggle Android Mobile View Mode"
          >
            {isMobileSimulated ? <Monitor className="w-3.5 h-3.5 text-[var(--primary-accent)]" /> : <Smartphone className="w-3.5 h-3.5 text-[var(--text-muted)]" />}
            <span>{isMobileSimulated ? 'Exit Android' : 'Android'}</span>
          </button>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowBranchMenu(false);
                setShowRoleMenu(false);
                setShowThemeMenu(false);
              }}
              className="relative p-2 text-[var(--text-main)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] rounded-lg transition-colors shadow-xs"
              title="Operational Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--primary-accent)] text-slate-950 font-bold text-[10px] flex items-center justify-center">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl shadow-2xl py-2 z-50">
                <div className="px-3 py-2 flex items-center justify-between border-b border-[var(--border-subtle)]">
                  <div className="text-xs font-semibold text-[var(--text-main)] uppercase tracking-wider">
                    Automated Notifications ({unreadNotifs.length} New)
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border-subtle)]">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.linkTab) setActiveTab(n.linkTab);
                        setShowNotifMenu(false);
                      }}
                      className={`px-3 py-2.5 text-xs cursor-pointer hover:bg-[var(--bg-surface-subtle)] transition-colors ${
                        !n.isRead ? 'bg-[var(--primary-accent-bg)]' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-[var(--text-main)]">{n.title}</span>
                        <span className="text-[10px] text-[var(--text-muted)] whitespace-nowrap">{n.timestamp}</span>
                      </div>
                      <p className="text-[var(--text-muted)] mt-0.5 line-clamp-2 text-[11px]">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Signout */}
          <button
            onClick={logout}
            className="p-2 text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 rounded-lg border border-transparent hover:border-rose-500/20 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* Temporary Password Reset Warning Bar if flagged */}
      {currentUser?.mustChangePassword && (
        <div className="mt-2 py-1.5 px-3 bg-[var(--primary-accent-bg)] border border-[var(--primary-accent-border)] rounded-lg flex items-center justify-between text-xs text-[var(--primary-accent-text)]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[var(--primary-accent)] shrink-0" />
            <span>You logged in with a temporary password. Please update your security password.</span>
          </div>
          <button 
            onClick={() => setActiveTab('admin_settings')}
            className="px-2.5 py-1 text-[11px] font-semibold bg-[var(--primary-accent)] text-slate-950 rounded hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Update Now
          </button>
        </div>
      )}
    </header>
  );
};
