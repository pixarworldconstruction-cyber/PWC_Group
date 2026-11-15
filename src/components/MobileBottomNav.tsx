import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  ClipboardList, 
  Users, 
  Banknote, 
  LayoutDashboard,
  ShieldCheck,
  Compass
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser } = useApp();
  const role = currentUser?.role;

  // Customize 5 core mobile navigation destinations based on role
  const getTabs = () => {
    if (role === 'SITE_ENGINEER') {
      return [
        { key: 'dpr', label: 'DPR Log', icon: <ClipboardList className="w-5 h-5" /> },
        { key: 'projects', label: 'Sites', icon: <Building2 className="w-5 h-5" /> },
        { key: 'designs', label: 'Drawings', icon: <Compass className="w-5 h-5" /> },
        { key: 'salarybox', label: 'Salary Box', icon: <Banknote className="w-5 h-5" /> },
        { key: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
      ];
    }
    if (role === 'MARKETING') {
      return [
        { key: 'crm', label: 'CRM Leads', icon: <Users className="w-5 h-5" /> },
        { key: 'projects', label: 'Projects', icon: <Building2 className="w-5 h-5" /> },
        { key: 'collaboration', label: 'Tasks', icon: <ClipboardList className="w-5 h-5" /> },
        { key: 'salarybox', label: 'Salary Box', icon: <Banknote className="w-5 h-5" /> },
        { key: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
      ];
    }
    if (role === 'DESIGNER') {
      return [
        { key: 'designs', label: 'Blueprints', icon: <Compass className="w-5 h-5" /> },
        { key: 'collaboration', label: 'Tasks', icon: <ClipboardList className="w-5 h-5" /> },
        { key: 'projects', label: 'Sites', icon: <Building2 className="w-5 h-5" /> },
        { key: 'salarybox', label: 'Salary Box', icon: <Banknote className="w-5 h-5" /> },
        { key: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
      ];
    }
    if (role === 'EMPLOYEE') {
      return [
        { key: 'salarybox', label: 'Salary Box', icon: <Banknote className="w-5 h-5" /> },
        { key: 'labor', label: 'Timesheet', icon: <ClipboardList className="w-5 h-5" /> },
        { key: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
      ];
    }

    // Default / Admin
    return [
      { key: 'dashboard', label: 'BI Analytics', icon: <LayoutDashboard className="w-5 h-5" /> },
      { key: 'projects', label: 'Projects', icon: <Building2 className="w-5 h-5" /> },
      { key: 'dpr', label: 'Field DPR', icon: <ClipboardList className="w-5 h-5" /> },
      { key: 'crm', label: 'CRM', icon: <Users className="w-5 h-5" /> },
      { key: 'admin_settings', label: 'Admin', icon: <ShieldCheck className="w-5 h-5" /> },
    ];
  };

  const tabs = getTabs();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--header-bg)] backdrop-blur-md border-t border-[var(--border-subtle)] safe-area-bottom shadow-lg">
      <div className={`grid grid-cols-${tabs.length} items-center h-16 max-w-md mx-auto px-2`}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`min-h-[48px] flex flex-col items-center justify-center py-1 transition-colors ${
                isActive ? 'text-[var(--primary-accent-text)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--primary-accent)] rounded-full" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
