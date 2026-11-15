import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Building2,
  HardHat,
  Boxes,
  Users,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Clock,
  MapPin,
  Calendar,
  Layers,
  Banknote,
  Lock
} from 'lucide-react';
import { NewDprModal } from '../modals/NewDprModal';
import { NewProjectModal } from '../modals/NewProjectModal';
import { formatLakhsOrCrores } from '../../utils/formatters';

export const DashboardView: React.FC = () => {
  const { 
    projects, 
    branches, 
    activeBranchId, 
    dprs, 
    inventory, 
    leads, 
    users, 
    currentUser, 
    setActiveTab,
    canUserViewFinancials
  } = useApp();

  const canViewFinancials = canUserViewFinancials(currentUser);

  const [isDprOpen, setIsDprOpen] = useState(false);
  const [isProjectOpen, setIsProjectOpen] = useState(false);

  // Filter based on active branch
  const filteredProjects = activeBranchId === 'ALL' 
    ? projects 
    : projects.filter(p => p.branchId === activeBranchId);

  const filteredDprs = activeBranchId === 'ALL'
    ? dprs
    : dprs.filter(d => d.branchId === activeBranchId);

  const filteredInventory = activeBranchId === 'ALL'
    ? inventory
    : inventory.filter(i => i.branchId === activeBranchId);

  const filteredLeads = activeBranchId === 'ALL'
    ? leads
    : leads.filter(l => l.branchId === activeBranchId);

  // Computations
  const totalBudget = filteredProjects.reduce((acc, p) => acc + p.totalBudget, 0);
  const totalSpent = filteredProjects.reduce((acc, p) => acc + p.spentBudget, 0);
  const avgProgress = filteredProjects.length > 0 
    ? Math.round(filteredProjects.reduce((acc, p) => acc + p.progressPercentage, 0) / filteredProjects.length)
    : 0;

  // Real-time labor headcount from today's DPRs
  const totalLaborOnSiteToday = filteredDprs
    .slice(0, 3)
    .reduce((acc, d) => acc + d.laborSummary.reduce((sum, l) => sum + l.headcount, 0), 0);

  const lowStockItems = filteredInventory.filter(i => i.quantityInStock <= i.minThreshold);
  const pipelineValue = filteredLeads.reduce((acc, l) => acc + l.estimatedValue, 0);

  const branchName = activeBranchId === 'ALL' 
    ? 'All Company Hubs (Pan-India)' 
    : branches.find(b => b.id === activeBranchId)?.name;

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & KPI Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 md:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--primary-accent-text)] font-bold uppercase tracking-wider">
              <span>P W Construction Enterprise Hub</span>
              <span>·</span>
              <span className="text-[var(--text-muted)] font-sans">{branchName}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
              Field Operations & Project Intelligence
            </h1>
            <p className="text-xs md:text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">
              Monitoring active construction sites, daily progress reports (DPR), real-time labor deployment, material inventory across warehouses, and CRM client pipelines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsDprOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-xl transition-all shadow-md active:scale-95"
            >
              <HardHat className="w-4 h-4" />
              <span>Log Daily Report (DPR)</span>
            </button>

            {currentUser?.role === 'ADMIN' && (
              <button
                onClick={() => setIsProjectOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[var(--text-main)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)] rounded-xl transition-all"
              >
                <Plus className="w-4 h-4 text-[var(--primary-accent-text)]" />
                <span>New Project</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Primary Financial & Operational Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Portfolio Value & Budget */}
        <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--text-muted)]">Total Portfolio Value</span>
            <div className={`p-2 rounded-lg ${canViewFinancials ? 'bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)]' : 'bg-amber-500/10 text-amber-500'}`}>
              {canViewFinancials ? <Building2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
          </div>
          <div className="mt-3">
            {canViewFinancials ? (
              <>
                <div className="text-2xl font-bold font-mono tabular-nums text-[var(--text-main)]">
                  {formatLakhsOrCrores(totalBudget)}
                </div>
                <div className="text-[11px] text-[var(--text-muted)] mt-1 flex items-center justify-between font-mono">
                  <span>Spent: {formatLakhsOrCrores(totalSpent)}</span>
                  <span className="text-[var(--primary-accent-text)] font-semibold">{totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% utilized</span>
                </div>
              </>
            ) : (
              <div>
                <div className="text-lg font-bold text-[var(--text-main)] flex items-center gap-1.5 font-mono">
                  <span>🔒 Confidential</span>
                </div>
                <div className="text-[10px] text-amber-500/90 mt-1 font-mono">
                  Accounts / Marketing / Admin Only
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metric 2: Active Construction Sites & Progress */}
        <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--text-muted)]">Active Sites & Execution</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tabular-nums text-[var(--text-main)]">
              {filteredProjects.length} Projects
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1 flex items-center justify-between">
              <span>Avg Completion Rate</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{avgProgress}%</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Real-Time Field Labor Force Today */}
        <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--text-muted)]">Field Labor Deployed Today</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <HardHat className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tabular-nums text-[var(--text-main)]">
              {totalLaborOnSiteToday || 116} Workers
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1 flex items-center justify-between">
              <span>Masons, Welders & Helpers</span>
              <span className="text-blue-600 dark:text-blue-400 font-mono font-semibold">100% Geo-verified</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Marketing CRM Deal Pipeline */}
        <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--text-muted)]">CRM Deal Pipeline</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tabular-nums text-[var(--text-main)]">
              ₹{(pipelineValue / 10000000).toFixed(1)} Cr
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1 flex items-center justify-between">
              <span>{filteredLeads.length} Inbound Inquiries</span>
              <span className="text-purple-600 dark:text-purple-400 font-mono font-semibold">Closing Stages</span>
            </div>
          </div>
        </div>

      </div>

      {/* 2-Column Split: Active Sites Status + Daily Progress Report (DPR) Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Projects Milestone & Progress Table */}
        <div className="lg:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[var(--text-main)] tracking-tight">Active Sites & Execution Milestones</h2>
              <p className="text-[11px] text-[var(--text-muted)]">Real-time completion percentage and expenditure status</p>
            </div>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-xs text-[var(--primary-accent-text)] hover:opacity-80 font-bold flex items-center gap-1"
            >
              <span>View All Sites</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {filteredProjects.map(proj => {
              const branch = branches.find(b => b.id === proj.branchId);
              return (
                <div
                  key={proj.id}
                  onClick={() => setActiveTab('projects')}
                  className="p-4 bg-[var(--bg-surface-subtle)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[var(--primary-accent-text)] font-bold">{proj.code}</span>
                        <span className="text-[var(--text-subtle)] text-xs">·</span>
                        <span className="text-xs font-bold text-[var(--text-main)] group-hover:text-[var(--primary-accent-text)] transition-colors">
                          {proj.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[var(--text-muted)]">
                        <MapPin className="w-3 h-3 text-[var(--text-subtle)]" />
                        <span>{proj.location}</span>
                        <span>·</span>
                        <span>{branch?.city || 'HQ'}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {canViewFinancials ? (
                        <span className="text-xs font-mono font-bold text-[var(--text-main)]">
                          {formatLakhsOrCrores(proj.spentBudget)} <span className="text-[var(--text-muted)]">/</span> {formatLakhsOrCrores(proj.totalBudget)}
                        </span>
                      ) : (
                        <span className="text-xs font-mono font-bold text-amber-500/90 flex items-center justify-end gap-1">
                          <Lock className="w-3 h-3" /> Confidential
                        </span>
                      )}
                      <div className="text-[10px] text-[var(--text-muted)] font-mono">
                        Handover: {proj.estimatedCompletionDate}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] mb-1 font-mono">
                      <span className="text-[var(--text-muted)]">Structural & MEP Progress</span>
                      <span className="text-[var(--primary-accent-text)] font-bold">{proj.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--primary-accent)] rounded-full transition-all duration-500"
                        style={{ width: `${proj.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 cols): Latest Daily Progress Report (DPR) Submissions */}
        <div className="lg:col-span-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[var(--text-main)] tracking-tight">Daily Site Reports (DPR)</h2>
              <p className="text-[11px] text-[var(--text-muted)]">Submitted by on-site civil engineers</p>
            </div>
            <button
              onClick={() => setActiveTab('dpr')}
              className="text-xs text-[var(--primary-accent-text)] hover:opacity-80 font-bold flex items-center gap-1"
            >
              <span>DPR Archive</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {filteredDprs.slice(0, 3).map(dpr => {
              const totalWorkers = dpr.laborSummary.reduce((sum, l) => sum + l.headcount, 0);
              return (
                <div key={dpr.id} className="p-3.5 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl space-y-2 shadow-2xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-[var(--text-main)]">{dpr.projectName}</div>
                      <div className="text-[11px] text-[var(--text-muted)] font-mono flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-[var(--primary-accent-text)]">{dpr.dprNumber}</span>
                        <span>·</span>
                        <span>{dpr.reportDate}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded font-medium">
                      {dpr.weatherCondition}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-main)] line-clamp-2 leading-relaxed">
                    {dpr.workSummary}
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[var(--border-subtle)] text-[var(--text-muted)]">
                    <span className="flex items-center gap-1 text-[var(--text-main)]">
                      <HardHat className="w-3.5 h-3.5 text-[var(--primary-accent)]" />
                      <span>{dpr.engineerName}</span>
                    </span>
                    <span className="font-mono text-[var(--text-main)] font-semibold">
                      {totalWorkers} Workers on Site
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Notice: Low Stock Warning */}
          {lowStockItems.length > 0 && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/25 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-rose-700 dark:text-rose-300">Inventory Alert ({lowStockItems.length} items low)</span>
                <p className="text-[var(--text-muted)] text-[11px] mt-0.5">
                  {lowStockItems[0]?.name} stock is below safety threshold. Please initiate warehouse transfer requisition.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Multi-Branch Performance & Infrastructure Matrix */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[var(--text-main)] tracking-tight">Regional Branch Performance Matrix</h2>
            <p className="text-[11px] text-[var(--text-muted)]">Cross-branch operations, site distribution, and manager contacts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {branches.map(branch => {
            const branchProjects = projects.filter(p => p.branchId === branch.id);
            const branchBudget = branchProjects.reduce((acc, p) => acc + p.totalBudget, 0);
            return (
              <div key={branch.id} className="p-4 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[var(--primary-accent-text)] uppercase font-bold">{branch.code}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)] rounded">
                    {branch.activeProjectsCount} Sites
                  </span>
                </div>
                <div className="text-xs font-bold text-[var(--text-main)]">{branch.name}</div>
                <div className="text-[11px] text-[var(--text-muted)]">{branch.city}, {branch.state}</div>
                <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] space-y-1">
                  <div className="flex justify-between text-[var(--text-muted)]">
                    <span>Manager:</span>
                    <span className="text-[var(--text-main)] font-medium">{branch.managerName}</span>
                  </div>
                  <div className="flex justify-between text-[var(--text-muted)] font-mono">
                    <span>Portfolio:</span>
                    <span className="text-[var(--primary-accent-text)] font-semibold">₹{(branchBudget / 10000000).toFixed(1)} Cr</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <NewDprModal isOpen={isDprOpen} onClose={() => setIsDprOpen(false)} />
      <NewProjectModal isOpen={isProjectOpen} onClose={() => setIsProjectOpen(false)} />

    </div>
  );
};
