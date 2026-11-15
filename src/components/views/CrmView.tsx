import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  Building, 
  Calendar, 
  Target,
  ArrowRight,
  HardHat,
  Compass,
  Briefcase,
  Layers,
  MessageSquare,
  Bell,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Filter,
  ShieldCheck,
  Building2,
  Lock,
  Sparkles,
  Calculator,
  ChevronRight,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { Inquiry, InquiryStage, FollowUpContactType, ReminderType } from '../../types';
import { formatLakhsOrCrores } from '../../utils/formatters';
import { PrimaryInquiryModal } from '../modals/PrimaryInquiryModal';
import { SecondarySpecModal } from '../modals/SecondarySpecModal';
import { AddFollowUpModal } from '../modals/AddFollowUpModal';
import { AddReminderModal } from '../modals/AddReminderModal';
import { PackageManageModal } from '../modals/PackageManageModal';
import { InquiryDetailsModal } from '../modals/InquiryDetailsModal';

export const CrmView: React.FC = () => {
  const { 
    inquiries, 
    updateInquiryStage, 
    convertInquiryToProject,
    packages,
    reminders,
    toggleReminder,
    currentUser, 
    users, 
    branches, 
    activeBranchId, 
    setActiveTab,
    crmSubTab: activeSubTab,
    setCrmSubTab: setActiveSubTab
  } = useApp();

  // Role Gatekeeper: Strictly accessible by MARKETING and ADMIN only
  const isAuthorized = currentUser?.role === 'ADMIN' || currentUser?.role === 'MARKETING';

  // Sub-tabs in CRM View (Synced with Left Sidebar)
  const [pipelineViewMode, setPipelineViewMode] = useState<'kanban' | 'table'>('kanban');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [reminderFilter, setReminderFilter] = useState<'ALL' | 'TODAY' | 'UPCOMING' | 'OVERDUE' | 'COMPLETED'>('ALL');

  // Modals state
  const [isPrimaryModalOpen, setIsPrimaryModalOpen] = useState(false);
  const [isSecondaryModalOpen, setIsSecondaryModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  // If unauthorized user lands here
  if (!isAuthorized) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-8 max-w-xl mx-auto my-12 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl mx-auto flex items-center justify-center border border-rose-500/20">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-[var(--text-main)]">Access Restricted to Marketing & Admin</h2>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            The Inquiry Intake & Marketing CRM module is restricted exclusively to Marketing Business Development officers and System Administrators.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg shadow-sm"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Filter Inquiries
  const filteredInquiries = inquiries.filter(inq => {
    if (activeBranchId !== 'ALL' && inq.branchId !== activeBranchId) return false;
    if (stageFilter !== 'ALL' && inq.stage !== stageFilter) return false;
    if (serviceFilter !== 'ALL' && inq.serviceType !== serviceFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        inq.customerName.toLowerCase().includes(q) ||
        inq.inquiryNumber.toLowerCase().includes(q) ||
        inq.contactNumber.toLowerCase().includes(q) ||
        inq.siteAddress.toLowerCase().includes(q) ||
        (inq.notes && inq.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Marketing Rep Performance
  const marketingRep = currentUser?.role === 'MARKETING' 
    ? currentUser 
    : users.find(u => u.role === 'MARKETING') || currentUser;

  const targetAmount = marketingRep?.salesTarget || 6000000;
  const commissionRate = marketingRep?.targetCommissionRate || 4.5;

  const convertedDeals = inquiries.filter(i => i.stage === 'Converted to Business');
  const totalConvertedValue = convertedDeals.reduce((sum, i) => sum + (i.budget || 0), 0);
  const totalPipelineValue = filteredInquiries.reduce((sum, i) => sum + (i.budget || 0), 0);
  const conversionRate = inquiries.length > 0 ? Math.round((convertedDeals.length / inquiries.length) * 100) : 0;
  const targetProgress = Math.min(100, Math.round((totalConvertedValue / targetAmount) * 100));
  const estimatedCommissionEarned = (totalConvertedValue * commissionRate) / 100;

  // Reminders calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const pendingReminders = reminders.filter(r => !r.isCompleted);
  const todayReminders = pendingReminders.filter(r => r.dueDate === todayStr);
  const overdueReminders = pendingReminders.filter(r => r.dueDate < todayStr);

  const filteredReminders = reminders.filter(r => {
    if (reminderFilter === 'TODAY') return !r.isCompleted && r.dueDate === todayStr;
    if (reminderFilter === 'UPCOMING') return !r.isCompleted && r.dueDate > todayStr;
    if (reminderFilter === 'OVERDUE') return !r.isCompleted && r.dueDate < todayStr;
    if (reminderFilter === 'COMPLETED') return r.isCompleted;
    return true;
  });

  // Stages for the full visual pipeline
  const pipelineStages: InquiryStage[] = [
    'New Inquiry',
    'Requirement Assessment',
    'Site Visit & Survey',
    'Package Quotation Shared',
    'Negotiation & Financing',
    'Converted to Business',
    'Dropped / Lost'
  ];

  const handleOpenDetails = (inq: Inquiry) => {
    setSelectedInquiry(inq);
    setIsDetailsModalOpen(true);
  };

  const handleOpenSecondary = (inq: Inquiry) => {
    setSelectedInquiry(inq);
    setIsSecondaryModalOpen(true);
  };

  const handleOpenFollowUp = (inq: Inquiry) => {
    setSelectedInquiry(inq);
    setIsFollowUpModalOpen(true);
  };

  const handleOpenReminder = (inq: Inquiry) => {
    setSelectedInquiry(inq);
    setIsReminderModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Application Bar & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[var(--primary-accent-text)] bg-[var(--primary-accent-bg)] px-2.5 py-0.5 rounded border border-[var(--primary-accent-border)] uppercase tracking-wider">
              Marketing & Admin Exclusive
            </span>
            <span className="text-xs text-[var(--text-muted)]">· P W Construction CRM Hub</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--text-main)] tracking-tight mt-1">
            Client Inquiries & CRM Pipeline
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            Primary lead capture (Form 1), detailed planning specifications (Form 2), call/meeting follow-up logs, reminders & site project conversion
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsPackageModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[var(--text-main)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5 text-[var(--primary-accent)]" />
            <span>Packages ({packages.length})</span>
          </button>

          <button
            onClick={() => {
              setSelectedInquiry(null);
              setIsFollowUpModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[var(--text-main)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
            <span>+ Log Follow-up</span>
          </button>

          <button
            onClick={() => {
              setSelectedInquiry(null);
              setIsReminderModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[var(--text-main)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-amber-500" />
            <span>+ Reminder</span>
            {pendingReminders.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full">
                {pendingReminders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsPrimaryModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Inquiry (1st Form)</span>
          </button>
        </div>
      </div>

      {/* KPI Performance Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-2xs">
          <span className="text-[10px] text-[var(--text-subtle)] block uppercase font-mono font-bold">Total Inquiries</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-bold text-[var(--text-main)] font-mono">{inquiries.length}</span>
            <span className="text-[10px] text-[var(--text-muted)]">({filteredInquiries.length} shown)</span>
          </div>
          <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">Active Inbound Pipeline</span>
        </div>

        <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-2xs">
          <span className="text-[10px] text-[var(--text-subtle)] block uppercase font-mono font-bold">Pipeline Value</span>
          <div className="text-xl font-bold text-[var(--primary-accent-text)] font-mono mt-0.5">
            {formatLakhsOrCrores(totalPipelineValue)}
          </div>
          <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">Estimated Booking Value</span>
        </div>

        <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-2xs">
          <span className="text-[10px] text-[var(--text-subtle)] block uppercase font-mono font-bold">Converted Deals</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {convertedDeals.length}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              {conversionRate}% Win Rate
            </span>
          </div>
          <span className="text-[10px] text-[var(--text-muted)] block mt-0.5 font-mono">
            {formatLakhsOrCrores(totalConvertedValue)} Won
          </span>
        </div>

        <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-2xs">
          <span className="text-[10px] text-[var(--text-subtle)] block uppercase font-mono font-bold">2nd Form Specs</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-bold text-purple-600 dark:text-purple-400 font-mono">
              {inquiries.filter(i => i.hasDetailedSpec).length} / {inquiries.length}
            </span>
          </div>
          <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">
            Detailed Planning Completed
          </span>
        </div>

        <div className="p-3.5 bg-[var(--primary-accent-bg)] border border-[var(--primary-accent-border)] rounded-xl shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[10px] text-[var(--text-subtle)] block uppercase font-mono font-bold">Pending Reminders</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-bold text-[var(--primary-accent-text)] font-mono">
              {todayReminders.length} Today
            </span>
            {overdueReminders.length > 0 && (
              <span className="text-[10px] font-bold text-rose-500 font-mono">
                +{overdueReminders.length} Overdue
              </span>
            )}
          </div>
          <span className="text-[10px] text-[var(--primary-accent-text)] block mt-0.5 font-semibold">
            Calls & Meetings Scheduled
          </span>
        </div>
      </div>

      {/* Target & Commission Progress Engine */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-4 md:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[var(--primary-accent)]" />
              <span className="text-xs font-mono font-bold text-[var(--primary-accent-text)] uppercase tracking-wider">
                Marketing Target-Based Incentive Engine
              </span>
            </div>
            <div className="text-sm font-bold text-[var(--text-main)]">
              Representative: {marketingRep?.fullName} ({marketingRep?.designation})
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Monthly Sales Target: <b className="font-mono text-[var(--text-main)]">₹{(targetAmount / 100000).toFixed(1)} Lakhs</b> · Commission: <b className="font-mono text-[var(--primary-accent-text)]">{commissionRate}%</b> on verified client conversion.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="p-2.5 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl text-right">
              <span className="text-[10px] text-[var(--text-subtle)] block">ACHIEVED CLOSURES</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatLakhsOrCrores(totalConvertedValue)}</span>
            </div>

            <div className="p-2.5 bg-[var(--primary-accent-bg)] border border-[var(--primary-accent-border)] rounded-xl text-right">
              <span className="text-[10px] text-[var(--text-subtle)] block">PROJECTED INCENTIVE</span>
              <span className="text-sm font-bold text-[var(--primary-accent-text)]">+₹{Math.round(estimatedCommissionEarned).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[var(--border-subtle)]">
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-[var(--text-muted)] text-[11px]">Monthly Target Progress</span>
            <span className="text-[var(--primary-accent-text)] font-bold text-[11px]">{targetProgress}% Met</span>
          </div>
          <div className="w-full h-2 bg-[var(--border-subtle)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--primary-accent)] to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, targetProgress)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main CRM Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'pipeline', label: 'Pipeline & Inquiries', icon: <Layers className="w-3.5 h-3.5" />, count: inquiries.length },
            { id: 'followups', label: 'Call & Meeting Followups', icon: <MessageSquare className="w-3.5 h-3.5" />, count: inquiries.reduce((sum, i) => sum + (i.followUps?.length || 0), 0) },
            { id: 'reminders', label: 'Reminders & Schedule', icon: <Bell className="w-3.5 h-3.5" />, count: pendingReminders.length },
            { id: 'packages', label: 'Packages Catalog', icon: <Briefcase className="w-3.5 h-3.5" />, count: packages.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)] font-bold border border-[var(--primary-accent-border)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-subtle)]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {activeSubTab === 'pipeline' && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg p-0.5">
              <button
                onClick={() => setPipelineViewMode('kanban')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                  pipelineViewMode === 'kanban' ? 'bg-[var(--bg-surface)] text-[var(--text-main)] shadow-2xs font-bold' : 'text-[var(--text-muted)]'
                }`}
              >
                Kanban Pipeline
              </button>
              <button
                onClick={() => setPipelineViewMode('table')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                  pipelineViewMode === 'table' ? 'bg-[var(--bg-surface)] text-[var(--text-main)] shadow-2xs font-bold' : 'text-[var(--text-muted)]'
                }`}
              >
                Table List
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Search & Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-3 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search customer name, contact phone, inquiry #, address..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeSubTab === 'pipeline' && (
            <>
              <select
                value={stageFilter}
                onChange={e => setStageFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-semibold focus:outline-none"
              >
                <option value="ALL">All Pipeline Stages</option>
                {pipelineStages.map(stg => (
                  <option key={stg} value={stg}>{stg}</option>
                ))}
              </select>

              <select
                value={serviceFilter}
                onChange={e => setServiceFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-semibold focus:outline-none"
              >
                <option value="ALL">All Services</option>
                <option value="Planning Civil Construction + Interior Design">Civil + Interior Design</option>
                <option value="Only Construction Service">Only Construction Service</option>
                <option value="Only Interior Design">Only Interior Design</option>
              </select>
            </>
          )}

          {activeSubTab === 'reminders' && (
            <div className="flex items-center gap-1">
              {(['ALL', 'TODAY', 'UPCOMING', 'OVERDUE', 'COMPLETED'] as const).map(flt => (
                <button
                  key={flt}
                  onClick={() => setReminderFilter(flt)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                    reminderFilter === flt
                      ? 'bg-[var(--primary-accent)] text-slate-950 border-[var(--primary-accent)] font-bold'
                      : 'bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {flt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: PIPELINE & INQUIRIES */}
      {/* ========================================================================= */}
      {activeSubTab === 'pipeline' && (
        <div className="space-y-4">
          
          {pipelineViewMode === 'kanban' ? (
            /* KANBAN BOARD */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 items-start overflow-x-auto pb-4">
              {pipelineStages.map(stage => {
                const stageInquiries = filteredInquiries.filter(i => i.stage === stage);
                const stageTotalValue = stageInquiries.reduce((sum, i) => sum + (i.budget || 0), 0);

                return (
                  <div
                    key={stage}
                    className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-3 flex flex-col justify-between shadow-2xs min-h-[380px]"
                  >
                    <div>
                      {/* Column Header */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-[var(--text-main)] truncate" title={stage}>
                          {stage}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                          {stageInquiries.length}
                        </span>
                      </div>

                      <div className="text-[10px] text-[var(--primary-accent-text)] font-mono font-bold mb-3">
                        {formatLakhsOrCrores(stageTotalValue)}
                      </div>

                      {/* Cards in this Stage */}
                      <div className="space-y-2.5">
                        {stageInquiries.map(inq => (
                          <div
                            key={inq.id}
                            className="p-3 bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--primary-accent)] rounded-xl transition-all shadow-2xs space-y-2 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-[var(--primary-accent-text)] bg-[var(--primary-accent-bg)] px-1.5 py-0.2 rounded border border-[var(--primary-accent-border)]">
                                {inq.inquiryNumber}
                              </span>
                              {inq.hasDetailedSpec ? (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold rounded">
                                  2nd Spec ✓
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleOpenSecondary(inq)}
                                  className="text-[9px] font-mono px-1.5 py-0.2 bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold rounded hover:underline"
                                  title="Click to fill 2nd Secondary Form"
                                >
                                  + 2nd Form
                                </button>
                              )}
                            </div>

                            <div>
                              <h4 
                                onClick={() => handleOpenDetails(inq)}
                                className="font-bold text-[var(--text-main)] text-xs hover:text-[var(--primary-accent-text)] cursor-pointer truncate"
                              >
                                {inq.customerName}
                              </h4>
                              <div className="text-[10px] text-[var(--text-muted)] truncate flex items-center gap-1 mt-0.5">
                                <Phone className="w-2.5 h-2.5 text-[var(--text-muted)] shrink-0" />
                                <span>{inq.contactNumber}</span>
                              </div>
                            </div>

                            <div className="p-2 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-subtle)] text-[11px] font-mono space-y-0.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[var(--text-muted)] text-[10px]">Budget:</span>
                                <span className="font-bold text-[var(--text-main)]">{formatLakhsOrCrores(inq.budget)}</span>
                              </div>
                              {inq.totalSqFtArea && (
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="text-[var(--text-muted)]">Area & Floors:</span>
                                  <span className="text-[var(--text-muted)]">{inq.totalSqFtArea} sqft ({inq.floorsCount})</span>
                                </div>
                              )}
                              {inq.selectedPackageName && (
                                <div className="text-[10px] text-[var(--primary-accent-text)] truncate font-semibold">
                                  {inq.selectedPackageName}
                                </div>
                              )}
                            </div>

                            {/* Card Footer: Quick action buttons */}
                            <div className="pt-1 border-t border-[var(--border-subtle)] flex items-center justify-between gap-1 text-[10px]">
                              <button
                                onClick={() => handleOpenDetails(inq)}
                                className="text-[var(--text-muted)] hover:text-[var(--text-main)] font-semibold"
                              >
                                Dossier
                              </button>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleOpenFollowUp(inq)}
                                  className="p-1 text-[var(--text-muted)] hover:text-blue-500 rounded"
                                  title="Log Call / Meeting Followup"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleOpenReminder(inq)}
                                  className="p-1 text-[var(--text-muted)] hover:text-amber-500 rounded"
                                  title="Add Reminder"
                                >
                                  <Bell className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* If Converted to Business, prominent project conversion button */}
                            {stage === 'Converted to Business' && (
                              <button
                                onClick={() => handleOpenDetails(inq)}
                                className="w-full mt-1 py-1 px-2 text-[10px] font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors flex items-center justify-center gap-1"
                              >
                                <Building2 className="w-3 h-3" />
                                <span>{inq.convertedProjectId ? 'Project Linked ✓' : 'Convert to Active Site'}</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {stageInquiries.length === 0 && (
                      <div className="py-12 text-center text-[10px] text-[var(--text-subtle)]">
                        No inquiries in this stage
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* TABLE LIST VIEW */
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[var(--bg-surface-subtle)] border-b border-[var(--border-subtle)] text-[var(--text-muted)] font-mono text-[10px] uppercase">
                    <tr>
                      <th className="py-3 px-4">Inquiry #</th>
                      <th className="py-3 px-4">Customer Name & Contact</th>
                      <th className="py-3 px-4">Form 1 Budget</th>
                      <th className="py-3 px-4">Form 2 Specifications</th>
                      <th className="py-3 px-4">Site Location</th>
                      <th className="py-3 px-4">Pipeline Stage</th>
                      <th className="py-3 px-4">Followups</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)]">
                    {filteredInquiries.map(inq => (
                      <tr key={inq.id} className="hover:bg-[var(--bg-surface-subtle)] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[var(--primary-accent-text)]">
                          {inq.inquiryNumber}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[var(--text-main)]">{inq.customerName}</div>
                          <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" />
                            <span>{inq.contactNumber}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-[var(--text-main)]">
                          {formatLakhsOrCrores(inq.budget)}
                        </td>
                        <td className="py-3 px-4">
                          {inq.hasDetailedSpec ? (
                            <div className="space-y-0.5 text-[11px]">
                              <span className="font-semibold text-[var(--text-main)]">{inq.serviceType}</span>
                              <div className="text-[10px] text-[var(--text-muted)] font-mono">
                                {inq.totalSqFtArea} sqft · {inq.floorsCount} · {inq.paymentMode}
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenSecondary(inq)}
                              className="text-[10px] font-bold text-[var(--primary-accent-text)] hover:underline flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Complete 2nd Form</span>
                            </button>
                          )}
                        </td>
                        <td className="py-3 px-4 text-[11px] text-[var(--text-muted)] max-w-xs truncate">
                          {inq.siteAddress}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={inq.stage}
                            onChange={e => updateInquiryStage(inq.id, e.target.value as InquiryStage)}
                            className="px-2 py-1 text-[11px] font-semibold bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--primary-accent-text)]"
                          >
                            {pipelineStages.map(stg => (
                              <option key={stg} value={stg}>{stg}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[11px] font-mono text-[var(--text-muted)]">
                            {inq.followUps?.length || 0} calls/meetings
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenDetails(inq)}
                              className="px-2.5 py-1 text-xs font-semibold text-[var(--text-main)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg hover:bg-[var(--bg-surface-subtle)]"
                            >
                              Dossier
                            </button>
                            <button
                              onClick={() => handleOpenFollowUp(inq)}
                              className="p-1 text-blue-500 hover:bg-blue-500/10 rounded-lg"
                              title="Log Call / Meeting"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: CALL & MEETING FOLLOW-UP LOGS */}
      {/* ========================================================================= */}
      {activeSubTab === 'followups' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-4 rounded-2xl">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                <span>Client Interaction & Follow-up History</span>
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Every client touchpoint (phone calls, meetings, site visits, WhatsApp) logged by marketing officers
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedInquiry(null);
                setIsFollowUpModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Log New Interaction</span>
            </button>
          </div>

          <div className="space-y-3">
            {inquiries.flatMap(inq => (inq.followUps || []).map(flw => ({ ...flw, inquiry: inq })))
              .sort((a, b) => new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime())
              .map(item => (
                <div
                  key={item.id}
                  className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] rounded-2xl shadow-2xs space-y-3 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold text-[var(--primary-accent-text)] bg-[var(--primary-accent-bg)] px-2.5 py-0.5 rounded-lg border border-[var(--primary-accent-border)] font-mono">
                        {item.contactType}
                      </span>
                      <div>
                        <span 
                          onClick={() => handleOpenDetails(item.inquiry)}
                          className="text-xs font-bold text-[var(--text-main)] hover:text-[var(--primary-accent-text)] cursor-pointer"
                        >
                          {item.inquiry.customerName} ({item.inquiry.inquiryNumber})
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)] ml-2">
                          · Contact: {item.inquiry.contactNumber}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] font-mono">
                      <span>{item.date} at {item.time}</span>
                      <span>· Rep: <b className="text-[var(--text-main)]">{item.loggedByName}</b></span>
                    </div>
                  </div>

                  {/* Discussion Text */}
                  <div className="text-xs text-[var(--text-main)] leading-relaxed bg-[var(--bg-surface-subtle)] p-3 rounded-xl border border-[var(--border-subtle)]">
                    {item.discussionNotes}
                  </div>

                  {/* Next Action Scheduled */}
                  {item.nextActionDate && (
                    <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] pt-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[var(--primary-accent)]" />
                        <span>Next Action Date: <b className="text-[var(--primary-accent-text)]">{item.nextActionDate}</b></span>
                        {item.nextActionNotes && <span>— {item.nextActionNotes}</span>}
                      </div>

                      <button
                        onClick={() => handleOpenReminder(item.inquiry)}
                        className="text-[11px] font-bold text-[var(--primary-accent-text)] hover:underline"
                      >
                        + Set Reminder
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: REMINDERS & SCHEDULE */}
      {/* ========================================================================= */}
      {activeSubTab === 'reminders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-4 rounded-2xl">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Client Follow-up Reminders & Alerts</span>
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Timely call, WhatsApp/message, and meeting alerts for customer inquiries
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedInquiry(null);
                setIsReminderModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Reminder</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredReminders.map(rem => {
              const isOverdue = !rem.isCompleted && rem.dueDate < todayStr;
              const isToday = !rem.isCompleted && rem.dueDate === todayStr;

              return (
                <div
                  key={rem.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    rem.isCompleted
                      ? 'bg-[var(--bg-surface-subtle)] border-[var(--border-subtle)] opacity-60'
                      : isOverdue
                      ? 'bg-rose-500/5 border-rose-500/30'
                      : isToday
                      ? 'bg-[var(--primary-accent-bg)] border-[var(--primary-accent)]'
                      : 'bg-[var(--bg-surface)] border-[var(--border-subtle)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={rem.isCompleted}
                        onChange={() => toggleReminder(rem.id)}
                        className="w-4 h-4 mt-0.5 rounded text-[var(--primary-accent)] cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-subtle)]">
                            {rem.type}
                          </span>
                          <span className={`text-xs font-bold ${rem.isCompleted ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-main)]'}`}>
                            {rem.title}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-[var(--text-muted)] mt-1">
                          Client: <b className="text-[var(--text-main)]">{rem.customerName}</b> ({rem.contactNumber})
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {rem.priority === 'Urgent' && (
                        <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                          🔥 Urgent
                        </span>
                      )}
                      {rem.priority === 'High' && (
                        <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          ⚡ High
                        </span>
                      )}
                      {rem.priority === 'Normal' && (
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          🟢 Normal
                        </span>
                      )}
                    </div>
                  </div>

                  {rem.notes && (
                    <p className="text-xs text-[var(--text-muted)] bg-[var(--bg-surface-subtle)] p-2.5 rounded-xl border border-[var(--border-subtle)]">
                      {rem.notes}
                    </p>
                  )}

                  <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono">
                    <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[var(--primary-accent)]" />
                      <span>Due: {rem.dueDate} at {rem.dueTime}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${rem.contactNumber}`}
                        className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                      <button
                        onClick={() => toggleReminder(rem.id)}
                        className="text-[11px] text-[var(--primary-accent-text)] hover:underline font-bold"
                      >
                        {rem.isCompleted ? 'Mark Pending' : 'Mark Done'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: PACKAGES CATALOG */}
      {/* ========================================================================= */}
      {activeSubTab === 'packages' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-4 rounded-2xl">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[var(--primary-accent)]" />
                <span>Construction & Turnkey Package Configurations</span>
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Admin controls package rates and inclusions. Marketing references packages to calculate client quotes.
              </p>
            </div>

            <button
              onClick={() => setIsPackageModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg shadow-xs cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Manage & Add Packages</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map(pkg => (
              <div
                key={pkg.id}
                className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[var(--primary-accent-text)] bg-[var(--primary-accent-bg)] px-2 py-0.5 rounded border border-[var(--primary-accent-border)]">
                      {pkg.id}
                    </span>
                    <span className="text-xs font-mono font-bold text-[var(--primary-accent-text)]">
                      ₹{pkg.ratePerSqFt.toLocaleString('en-IN')}/sqft
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[var(--text-main)] leading-snug">
                    {pkg.name}
                  </h4>
                  <div className="text-[11px] text-[var(--primary-accent-text)] font-semibold">
                    {pkg.serviceType}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-subtle)] block">
                      Inclusions
                    </span>
                    {pkg.inclusions.slice(0, 4).map((inc, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[var(--text-main)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-tight">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                  <span className="text-[10px] text-[var(--text-muted)]">
                    Active in Quotation Engine
                  </span>
                  <button
                    onClick={() => setIsPackageModalOpen(true)}
                    className="text-[11px] font-bold text-[var(--primary-accent-text)] hover:underline"
                  >
                    View Details &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL DIALOGS */}
      <PrimaryInquiryModal
        isOpen={isPrimaryModalOpen}
        onClose={() => setIsPrimaryModalOpen(false)}
        onSuccess={(inqId) => {
          const inq = inquiries.find(i => i.id === inqId);
          if (inq) handleOpenDetails(inq);
        }}
      />

      <SecondarySpecModal
        isOpen={isSecondaryModalOpen}
        onClose={() => setIsSecondaryModalOpen(false)}
        inquiry={selectedInquiry}
      />

      <AddFollowUpModal
        isOpen={isFollowUpModalOpen}
        onClose={() => setIsFollowUpModalOpen(false)}
        inquiry={selectedInquiry}
      />

      <AddReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        inquiry={selectedInquiry}
      />

      <PackageManageModal
        isOpen={isPackageModalOpen}
        onClose={() => setIsPackageModalOpen(false)}
      />

      <InquiryDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        inquiry={selectedInquiry}
        onOpenSecondarySpec={handleOpenSecondary}
        onOpenAddFollowUp={handleOpenFollowUp}
        onOpenAddReminder={handleOpenReminder}
      />

    </div>
  );
};
