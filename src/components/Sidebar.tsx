import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  Clock,
  Boxes,
  Users,
  Compass,
  CheckSquare,
  Banknote,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Briefcase,
  Building,
  BarChart3,
  FolderArchive,
  CalendarClock,
  Calculator,
  Layers,
  MessageSquare,
  Bell,
  Sparkles
} from 'lucide-react';
import { ModuleKey, HrSubSection, CrmSubSection } from '../types';

export const Sidebar: React.FC = () => {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    hrSubTab,
    setHrSubTab,
    crmSubTab,
    setCrmSubTab,
    modules, 
    rolePermissions,
    inventory,
    inquiries,
    packages,
    reminders,
    users,
    employeeDocs,
    timeLogs,
    verifications,
    drafts,
    tasks,
    hasHrSubPermission
  } = useApp();

  // Expanded sub-menus state (default open for easy navigation)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    salarybox: true,
    crm: true,
  });

  const toggleSection = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Determine permitted modules for current role
  const userRole = currentUser?.role || 'EMPLOYEE';
  const rolePerm = rolePermissions.find(r => r.roleId === userRole);

  const iconMap: Record<string, React.ReactNode> = {
    LayoutDashboard: <LayoutDashboard className="w-4 h-4" />,
    Building2: <Building2 className="w-4 h-4" />,
    ClipboardList: <ClipboardList className="w-4 h-4" />,
    Clock: <Clock className="w-4 h-4" />,
    Boxes: <Boxes className="w-4 h-4" />,
    Users: <Users className="w-4 h-4" />,
    Compass: <Compass className="w-4 h-4" />,
    CheckSquare: <CheckSquare className="w-4 h-4" />,
    Banknote: <Banknote className="w-4 h-4" />,
    Briefcase: <Briefcase className="w-4 h-4" />,
    Building: <Building className="w-4 h-4" />,
    ShieldCheck: <ShieldCheck className="w-4 h-4" />,
  };

  // Badges for real-time counters
  const lowStockCount = inventory.filter(i => i.quantityInStock <= i.minThreshold).length;
  const activeInquiriesCount = (inquiries || []).filter(i => i.stage !== 'Converted to Business' && i.stage !== 'Dropped / Lost').length;
  const openTasksCount = tasks.filter(t => t.status !== 'Completed').length;
  const pendingDraftsCount = drafts.filter(d => d.status === 'Marketing / Client Review' || d.status === 'Site Review').length;
  const totalFollowUps = (inquiries || []).reduce((acc, inq) => acc + (inq.followUps?.length || 0), 0);
  const activeRemindersCount = (reminders || []).filter(r => !r.isCompleted).length;
  const pendingKycCount = (verifications || []).filter(v => v.status === 'Pending Verification').length;

  const getBadge = (key: string) => {
    if (key === 'inventory' && lowStockCount > 0) {
      return <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-rose-500/15 text-rose-500 rounded border border-rose-500/20">{lowStockCount} low</span>;
    }
    if (key === 'crm' && activeInquiriesCount > 0) {
      return <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-blue-500/15 text-blue-500 rounded border border-blue-500/20">{activeInquiriesCount} Leads</span>;
    }
    if (key === 'salarybox') {
      return <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-500/20">8 Modules</span>;
    }
    if (key === 'collaboration' && openTasksCount > 0) {
      return <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-amber-500/15 text-amber-500 rounded border border-amber-500/20">{openTasksCount}</span>;
    }
    if (key === 'designs' && pendingDraftsCount > 0) {
      return <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-purple-500/15 text-purple-500 rounded border border-purple-500/20">{pendingDraftsCount}</span>;
    }
    return null;
  };

  // Group modules
  const visibleModules = modules.filter(mod => {
    if (!mod.isEnabled) return false;
    if (userRole === 'ADMIN') return true;
    const perm = rolePerm?.permissions[mod.key as ModuleKey];
    return perm ? perm.view : false;
  });

  // HR & Payroll 8 Sub Sections Definition
  const hrSubSections: { id: HrSubSection; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'team', label: '1. My Team', icon: <Users className="w-3.5 h-3.5" />, badge: `${users.length}` },
    { id: 'attendance', label: '2. Attendance', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'payroll', label: '3. Payroll', icon: <Banknote className="w-3.5 h-3.5" /> },
    { id: 'reports', label: '4. Report', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'verification', label: '5. Verification', icon: <ShieldCheck className="w-3.5 h-3.5" />, badge: pendingKycCount > 0 ? `${pendingKycCount} new` : undefined },
    { id: 'docs', label: '6. Employee Details', icon: <FolderArchive className="w-3.5 h-3.5" />, badge: `${employeeDocs.length}` },
    { id: 'timesheets', label: '7. Time Sheet', icon: <CalendarClock className="w-3.5 h-3.5" /> },
    { id: 'salary_calc', label: '8. Salary Calculation', icon: <Calculator className="w-3.5 h-3.5" /> },
  ];

  // Marketing Section 4 Sub Sections Definition
  const crmSubSections: { id: CrmSubSection; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'pipeline', label: 'Pipeline', icon: <Layers className="w-3.5 h-3.5" />, badge: `${inquiries.length}` },
    { id: 'followups', label: 'Call & meeting', icon: <MessageSquare className="w-3.5 h-3.5" />, badge: totalFollowUps > 0 ? `${totalFollowUps}` : undefined },
    { id: 'reminders', label: 'Reminder & schedule', icon: <Bell className="w-3.5 h-3.5" />, badge: activeRemindersCount > 0 ? `${activeRemindersCount}` : undefined },
    { id: 'packages', label: 'Packages', icon: <Briefcase className="w-3.5 h-3.5" />, badge: `${packages.length}` },
  ];

  const handleHrSubClick = (subId: HrSubSection, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTab('salarybox');
    setHrSubTab(subId);
  };

  const handleCrmSubClick = (subId: CrmSubSection, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTab('crm');
    setCrmSubTab(subId);
  };

  return (
    <aside className="w-64 bg-[var(--sidebar-bg)] border-r border-[var(--border-subtle)] flex flex-col justify-between shrink-0 select-none transition-colors h-[calc(100vh-64px)] sticky top-16">
      <div className="py-3 flex flex-col flex-1 overflow-hidden">
        
        {/* User Mini Profile Badge */}
        {currentUser && (
          <div className="px-4 mb-3 pb-3 border-b border-[var(--border-subtle)] shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={currentUser.avatarUrl || '/src/assets/images/avatar_engineer_site_1792597146510.jpg'} 
                  alt={currentUser.fullName}
                  className="w-9 h-9 rounded-lg object-cover border border-[var(--border-strong)] bg-[var(--bg-surface-subtle)]"
                />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[var(--sidebar-bg)] rounded-full" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-[var(--text-main)] truncate">{currentUser.fullName}</div>
                <div className="text-[10px] text-[var(--primary-accent-text)] font-mono truncate">{currentUser.designation}</div>
                <div className="text-[10px] text-[var(--text-muted)] truncate">{currentUser.department}</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Modules (Scrollable) */}
        <div className="px-3 flex-1 overflow-y-auto no-scrollbar space-y-1">
          <div className="px-2 mb-2 text-[10px] font-bold tracking-wider text-[var(--text-subtle)] uppercase">
            Operations & Navigation
          </div>

          <nav className="space-y-1">
            {visibleModules.map(mod => {
              const isActive = activeTab === mod.key;
              const isCrm = mod.key === 'crm';
              const isSalaryBox = mod.key === 'salarybox';
              const isExpanded = expandedSections[mod.key] ?? isActive;

              return (
                <div key={mod.id} className="space-y-1">
                  
                  {/* Primary Module Nav Button */}
                  <div
                    onClick={() => {
                      setActiveTab(mod.key);
                      if (isCrm || isSalaryBox) {
                        setExpandedSections(prev => ({ ...prev, [mod.key]: true }));
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all group cursor-pointer ${
                      isActive
                        ? 'bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)] font-bold border border-[var(--primary-accent-border)] shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-subtle)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`${isActive ? 'text-[var(--primary-accent)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-main)]'}`}>
                        {iconMap[mod.iconName] || <LayoutDashboard className="w-4 h-4" />}
                      </span>
                      <span className="truncate">{mod.name}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {getBadge(mod.key)}

                      {/* Expand / Collapse toggle for CRM & SalaryBox */}
                      {(isCrm || isSalaryBox) ? (
                        <button
                          type="button"
                          onClick={(e) => toggleSection(mod.key, e)}
                          className="p-1 rounded hover:bg-[var(--bg-surface)] text-[var(--text-subtle)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                          title="Toggle sub-sections"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 text-[var(--primary-accent-text)]" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </button>
                      ) : (
                        isActive && <ChevronRight className="w-3.5 h-3.5 text-[var(--primary-accent)] shrink-0" />
                      )}
                    </div>
                  </div>

                  {/* ========================================================
                      NESTED HR & PAYROLL 8 SUB-SECTIONS IN LEFT SIDEBAR
                     ======================================================== */}
                  {isSalaryBox && isExpanded && (
                    <div className="pl-3 pr-1 py-1 space-y-0.5 border-l-2 border-emerald-500/30 ml-4 animate-fadeIn">
                      <div className="px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        HR & Payroll Sections
                      </div>
                      {hrSubSections
                        .filter(sub => hasHrSubPermission(sub.id, currentUser))
                        .map((sub) => {
                        const isSubActive = isActive && hrSubTab === sub.id;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={(e) => handleHrSubClick(sub.id, e)}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] rounded-md transition-all cursor-pointer ${
                              isSubActive
                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-subtle)]'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className={isSubActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--text-subtle)]'}>
                                {sub.icon}
                              </span>
                              <span className="truncate">{sub.label}</span>
                            </div>
                            {sub.badge && (
                              <span className={`text-[9px] font-mono px-1 rounded ${
                                isSubActive
                                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold'
                                  : 'bg-[var(--border-subtle)] text-[var(--text-subtle)]'
                              }`}>
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* ========================================================
                      NESTED MARKETING 4 SUB-SECTIONS IN LEFT SIDEBAR
                     ======================================================== */}
                  {isCrm && isExpanded && (
                    <div className="pl-3 pr-1 py-1 space-y-0.5 border-l-2 border-blue-500/30 ml-4 animate-fadeIn">
                      <div className="px-2 py-0.5 text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        Marketing Sections
                      </div>
                      {crmSubSections.map((sub) => {
                        const isSubActive = isActive && crmSubTab === sub.id;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={(e) => handleCrmSubClick(sub.id, e)}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] rounded-md transition-all cursor-pointer ${
                              isSubActive
                                ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 font-bold border border-blue-500/30'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-subtle)]'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className={isSubActive ? 'text-blue-600 dark:text-blue-400' : 'text-[var(--text-subtle)]'}>
                                {sub.icon}
                              </span>
                              <span className="truncate">{sub.label}</span>
                            </div>
                            {sub.badge && (
                              <span className={`text-[9px] font-mono px-1 rounded ${
                                isSubActive
                                  ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold'
                                  : 'bg-[var(--border-subtle)] text-[var(--text-subtle)]'
                              }`}>
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                </div>
              );
            })}
          </nav>
        </div>

      </div>

      {/* Footer Info & Corporate Details */}
      <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] text-[10px] text-[var(--text-muted)] shrink-0">
        <div className="flex items-center justify-between font-mono">
          <span className="font-bold">P W CONSTRUCTION</span>
          <span className="text-[var(--primary-accent-text)] font-bold">VADODARA</span>
        </div>
        <p className="mt-0.5 text-[9px] text-[var(--text-subtle)] truncate">
          Civil & Interior Infrastructure System
        </p>
      </div>
    </aside>
  );
};
