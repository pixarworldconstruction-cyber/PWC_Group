import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Plus, 
  MapPin, 
  Calendar, 
  Users, 
  Search, 
  HardHat, 
  ArrowUpRight, 
  UserCheck, 
  CheckCircle2,
  Pause,
  Play,
  Edit3,
  Trash2,
  Layers,
  Image as ImageIcon,
  AlertTriangle,
  FolderPlus,
  X,
  IndianRupee,
  Clock,
  Lock
} from 'lucide-react';
import { NewProjectModal } from '../modals/NewProjectModal';
import { EditProjectModal } from '../modals/EditProjectModal';
import { AllocateEngineerModal } from '../modals/AllocateEngineerModal';
import { Project } from '../../types';
import { formatLakhsOrCrores } from '../../utils/formatters';

export const ProjectsView: React.FC = () => {
  const { 
    projects, 
    branches, 
    activeBranchId, 
    currentUser, 
    users, 
    setActiveTab,
    toggleProjectHold,
    deleteProject,
    projectCategories,
    addProjectCategory,
    deleteProjectCategory,
    canUserViewFinancials
  } = useApp();

  const canViewFinancials = canUserViewFinancials(currentUser);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [onlyMySites, setOnlyMySites] = useState(false);
  
  // Modals state
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [allocatingProject, setAllocatingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Category Manager Modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');

  // Photo viewer state (track selected preview photo for each project card)
  const [activePhotoByProject, setActivePhotoByProject] = useState<Record<string, string>>({});

  const isAdmin = currentUser?.role === 'ADMIN';
  const isSiteEngineer = currentUser?.role === 'SITE_ENGINEER';

  const filteredProjects = projects.filter(p => {
    if (activeBranchId !== 'ALL' && p.branchId !== activeBranchId) return false;
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && p.type !== categoryFilter) return false;
    if (onlyMySites && currentUser && !p.siteEngineerIds?.includes(currentUser.id)) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.clientName.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate portfolio financial totals in Lakhs / Cr
  const totalPortfolioValue = projects.reduce((acc, p) => acc + (p.totalBudget || 0), 0);
  const totalSpentValue = projects.reduce((acc, p) => acc + (p.spentBudget || 0), 0);
  const onHoldCount = projects.filter(p => p.status === 'On Hold').length;
  const activeCount = projects.filter(p => p.status === 'Active Execution').length;

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryInput.trim()) return;
    addProjectCategory(newCategoryInput.trim());
    setNewCategoryInput('');
  };

  const confirmDeleteProject = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[var(--text-main)] tracking-tight">Construction Projects Portfolio</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
              Amounts in Lakhs & Crores (₹)
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Multi-branch project monitoring, milestone execution, site engineer allocation & budget tracking in INR (₹)
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {isSiteEngineer && (
            <button
              onClick={() => setOnlyMySites(!onlyMySites)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                onlyMySites
                  ? 'bg-[var(--primary-accent)] text-slate-950 border-[var(--primary-accent)]'
                  : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-subtle)] hover:bg-[var(--bg-surface-subtle)]'
              }`}
            >
              <HardHat className="w-4 h-4" />
              <span>{onlyMySites ? 'Showing My Sites' : 'Filter My Sites'}</span>
            </button>
          )}

          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-subtle)] text-[var(--text-main)] border border-[var(--border-subtle)] rounded-lg transition-colors cursor-pointer"
                title="Add or delete project categories"
              >
                <Layers className="w-4 h-4 text-amber-500" />
                <span>Project Categories</span>
              </button>

              <button
                type="button"
                onClick={() => setIsNewProjectOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg transition-colors shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Site Project</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Portfolio Financial Summary Banner (in Lakhs & Crores) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl">
          <span className="text-[10px] text-[var(--text-subtle)] uppercase font-mono block">Total Portfolio Budget</span>
          <span className="text-sm sm:text-base font-extrabold text-[var(--primary-accent-text)] font-mono block mt-0.5">
            {canViewFinancials ? formatLakhsOrCrores(totalPortfolioValue) : '🔒 Confidential'}
          </span>
          <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">
            {canViewFinancials ? `${projects.length} Registered Sites` : 'Accounts / Mktg / Admin'}
          </span>
        </div>

        <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl">
          <span className="text-[10px] text-[var(--text-subtle)] uppercase font-mono block">Incurred / Spent Budget</span>
          <span className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono block mt-0.5">
            {canViewFinancials ? formatLakhsOrCrores(totalSpentValue) : '🔒 Confidential'}
          </span>
          <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">
            {canViewFinancials 
              ? `${totalPortfolioValue > 0 ? ((totalSpentValue / totalPortfolioValue) * 100).toFixed(1) : 0}% Financial Absorption`
              : 'Financial access restricted'}
          </span>
        </div>

        <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl">
          <span className="text-[10px] text-[var(--text-subtle)] uppercase font-mono block">Remaining Uncommitted</span>
          <span className="text-sm sm:text-base font-extrabold text-blue-600 dark:text-blue-400 font-mono block mt-0.5">
            {canViewFinancials ? formatLakhsOrCrores(totalPortfolioValue - totalSpentValue) : '🔒 Confidential'}
          </span>
          <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">
            {canViewFinancials ? 'Available Project Margin' : 'Financial access restricted'}
          </span>
        </div>

        <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl">
          <span className="text-[10px] text-[var(--text-subtle)] uppercase font-mono block">Operational Site Status</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {activeCount} Active
            </span>
            <span className="text-[11px] text-[var(--text-muted)]">·</span>
            <span className={`text-xs font-bold font-mono ${onHoldCount > 0 ? 'text-amber-500' : 'text-[var(--text-muted)]'}`}>
              {onHoldCount} On Hold
            </span>
          </div>
          <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">Admin Instant Hold Toggle</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-3 rounded-xl shadow-xs">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search project name, client, code, category..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[var(--primary-accent)]"
          />
        </div>

        {/* Category & Status Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none"
          >
            <option value="ALL">All Categories ({projectCategories.length})</option>
            {projectCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status segmented filters */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
            {['ALL', 'Active Execution', 'On Hold', 'Finishing', 'Planning'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  statusFilter === status
                    ? 'bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)] border border-[var(--primary-accent-border)] font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-surface-subtle)]'
                }`}
              >
                {status === 'ALL' ? 'All' : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map(proj => {
          const branch = branches.find(b => b.id === proj.branchId);
          const assignedEngineers = users.filter(u => proj.siteEngineerIds?.includes(u.id));
          const isUserAssigned = currentUser && proj.siteEngineerIds?.includes(currentUser.id);
          const isOnHold = proj.status === 'On Hold';

          // Current active preview photo for this card
          const currentPhoto = activePhotoByProject[proj.id] || 
            (proj.photos && proj.photos.length > 0 ? proj.photos[0] : (proj.bannerUrl || '/src/assets/images/hero_construction_site_1792597145952.jpg'));

          const projectPhotos = proj.photos && proj.photos.length > 0 
            ? proj.photos 
            : (proj.bannerUrl ? [proj.bannerUrl] : ['/src/assets/images/hero_construction_site_1792597145952.jpg']);

          return (
            <div
              key={proj.id}
              className={`bg-[var(--bg-surface)] border rounded-2xl overflow-hidden transition-all shadow-xs flex flex-col justify-between group ${
                isOnHold 
                  ? 'border-amber-500/60 ring-1 ring-amber-500/20' 
                  : isUserAssigned 
                    ? 'border-amber-500/50' 
                    : 'border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
              }`}
            >
              {/* Top Banner Image with Scrim */}
              <div className="relative h-48 overflow-hidden bg-slate-900">
                <img
                  src={currentPhoto}
                  alt={proj.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                
                {/* Badges on image */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono">
                  <span className="px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur-md text-amber-400 font-bold border border-slate-700">
                    {proj.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isUserAssigned && (
                      <span className="px-2 py-1 rounded-md bg-emerald-600/90 text-white font-bold flex items-center gap-1 text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> My Site
                      </span>
                    )}

                    {isOnHold ? (
                      <span className="px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 font-black border border-amber-400 flex items-center gap-1 shadow-md">
                        <Pause className="w-3 h-3 fill-slate-950" /> ON HOLD
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur-md text-slate-200 border border-slate-700 font-semibold">
                        {proj.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Project Title and Location */}
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-amber-500/90 text-slate-950 rounded mb-1">
                      {proj.type}
                    </span>
                    {projectPhotos.length > 1 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-900/80 text-slate-300 rounded border border-slate-700 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-amber-400" />
                        {projectPhotos.length} photos
                      </span>
                    )}
                  </div>
                  <div className="text-base font-extrabold text-white tracking-tight leading-snug drop-shadow-sm">
                    {proj.name}
                  </div>
                  <div className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{proj.location}</span>
                    <span>·</span>
                    <span className="text-slate-400 truncate">{branch?.name}</span>
                  </div>
                </div>
              </div>

              {/* Photo Thumbnail Strip (if project has multiple photos) */}
              {projectPhotos.length > 1 && (
                <div className="px-4 py-2 bg-[var(--bg-surface-subtle)] border-b border-[var(--border-subtle)] flex items-center gap-2 overflow-x-auto">
                  <span className="text-[10px] text-[var(--text-subtle)] font-mono whitespace-nowrap shrink-0">
                    Gallery:
                  </span>
                  {projectPhotos.map((photoUrl, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setActivePhotoByProject(prev => ({ ...prev, [proj.id]: photoUrl }))}
                      className={`w-10 h-7 rounded overflow-hidden border shrink-0 transition-transform ${
                        currentPhoto === photoUrl 
                          ? 'border-[var(--primary-accent)] scale-105 ring-1 ring-[var(--primary-accent)]' 
                          : 'border-[var(--border-subtle)] opacity-70 hover:opacity-100'
                      }`}
                      title={`Preview photo ${pIdx + 1}`}
                    >
                      <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                
                {/* Description */}
                <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                  {proj.description || 'Modern structural engineering execution with rigorous quality control.'}
                </p>

                {/* Scope Specs */}
                <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] text-[11px] font-mono">
                  <div>
                    <span className="text-[var(--text-subtle)] block text-[10px]">CLIENT</span>
                    <span className="text-[var(--text-main)] font-semibold truncate block" title={proj.clientName}>
                      {proj.clientName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-subtle)] block text-[10px]">FLOORS</span>
                    <span className="text-[var(--text-main)] font-semibold">{proj.floorsCount || 12} Levels</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-subtle)] block text-[10px]">AREA</span>
                    <span className="text-[var(--text-main)] font-semibold">{proj.builtUpAreaSqFt?.toLocaleString()} sqft</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-[var(--text-muted)]">Execution Progress</span>
                    <span className="text-[var(--primary-accent-text)] font-bold">{proj.progressPercentage}% Complete</span>
                  </div>
                  <div className="w-full h-2.5 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOnHold ? 'bg-amber-500' : 'bg-[var(--primary-accent)]'
                      }`}
                      style={{ width: `${proj.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Budget vs Expenditure in Lakhs / Crores */}
                <div className="p-3 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] space-y-1">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[10px] text-[var(--text-subtle)] uppercase">Total Budget (INR)</span>
                    <span className="text-sm font-extrabold text-[var(--text-main)]">
                      {canViewFinancials ? formatLakhsOrCrores(proj.totalBudget) : '🔒 Confidential'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-mono text-[var(--text-muted)] pt-1 border-t border-[var(--border-subtle)]">
                    {canViewFinancials ? (
                      <>
                        <span>Incurred: <strong className="text-emerald-600 dark:text-emerald-400">{formatLakhsOrCrores(proj.spentBudget)}</strong></span>
                        <span>Rem: <strong className="text-blue-600 dark:text-blue-400">{formatLakhsOrCrores(proj.totalBudget - proj.spentBudget)}</strong></span>
                      </>
                    ) : (
                      <span className="text-[10px] text-amber-500 font-mono flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Financials restricted to Accounts / Mktg / Admin
                      </span>
                    )}
                  </div>
                </div>

                {/* Allocated Site Engineers & Team */}
                <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[var(--text-subtle)] font-mono block">ALLOCATED SITE ENGINEERS</span>
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                      {assignedEngineers.length > 0 ? (
                        assignedEngineers.map(eng => (
                          <span
                            key={eng.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)] border border-[var(--primary-accent-border)] rounded-md"
                          >
                            <HardHat className="w-3 h-3 text-[var(--primary-accent)]" />
                            <span>{eng.fullName.split(' ')[0]}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-amber-500 font-mono">Unassigned</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Admin Action Buttons: Hold, Edit, Delete */}
                    {isAdmin && (
                      <>
                        {/* Hold / Resume quick toggle */}
                        <button
                          type="button"
                          onClick={() => toggleProjectHold(proj.id)}
                          className={`px-2 py-1 text-[11px] font-semibold rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                            isOnHold
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/25'
                          }`}
                          title={isOnHold ? 'Resume project execution' : 'Put project on hold'}
                        >
                          {isOnHold ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                          <span>{isOnHold ? 'Resume' : 'Hold'}</span>
                        </button>

                        {/* Edit project button */}
                        <button
                          type="button"
                          onClick={() => setEditingProject(proj)}
                          className="px-2 py-1 text-[11px] font-semibold bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-subtle)] text-[var(--text-main)] border border-[var(--border-subtle)] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="Edit project specifications"
                        >
                          <Edit3 className="w-3 h-3 text-[var(--primary-accent)]" />
                          <span>Edit</span>
                        </button>

                        {/* Delete project button */}
                        <button
                          type="button"
                          onClick={() => setProjectToDelete(proj)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Allocate engineer button */}
                        <button
                          type="button"
                          onClick={() => setAllocatingProject(proj)}
                          className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-[var(--bg-surface-subtle)] rounded-lg transition-colors cursor-pointer"
                          title="Allocate Site Engineers"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => setActiveTab('dpr')}
                      className="text-[var(--primary-accent-text)] hover:opacity-80 text-xs font-bold flex items-center gap-1 cursor-pointer ml-1"
                    >
                      <span>Site DPRs</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* New Project Modal */}
      <NewProjectModal isOpen={isNewProjectOpen} onClose={() => setIsNewProjectOpen(false)} />

      {/* Edit Project Modal */}
      <EditProjectModal
        project={editingProject}
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
      />

      {/* Allocate Engineers Modal */}
      <AllocateEngineerModal
        project={allocatingProject}
        isOpen={!!allocatingProject}
        onClose={() => setAllocatingProject(null)}
      />

      {/* Category Manager Modal */}
      {isCategoryModalOpen && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[var(--primary-accent)]" />
                <h3 className="text-sm font-bold text-[var(--text-main)]">
                  Project Category Manager
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-[var(--text-main)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-[var(--text-muted)]">
                Add and delete project categories dynamically across P W Construction projects portfolio.
              </p>

              {/* Add Category Form */}
              <form onSubmit={handleAddCategorySubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Healthcare & Clinics, Data Centers"
                  value={newCategoryInput}
                  onChange={e => setNewCategoryInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg shadow-sm cursor-pointer whitespace-nowrap"
                >
                  Add Category
                </button>
              </form>

              {/* Categories List */}
              <div className="space-y-2 border border-[var(--border-subtle)] rounded-xl p-3 bg-[var(--bg-surface-subtle)] max-h-60 overflow-y-auto">
                <span className="text-[10px] text-[var(--text-subtle)] font-mono block mb-1">
                  Active Categories ({projectCategories.length}):
                </span>
                {projectCategories.map(cat => {
                  const usageCount = projects.filter(p => p.type === cat).length;
                  return (
                    <div
                      key={cat}
                      className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[var(--text-main)]">{cat}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                          {usageCount} sites
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteProjectCategory(cat)}
                        className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                        title={`Delete category ${cat}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-1.5 text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-surface-subtle)] rounded-lg hover:text-[var(--text-main)] cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Project Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-[var(--bg-surface)] border border-rose-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-2 rounded-xl bg-rose-500/10">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-main)]">Delete Site Project</h3>
                <p className="text-xs text-[var(--text-muted)]">Are you sure you want to permanently delete this project?</p>
              </div>
            </div>

            <div className="p-3 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] text-xs text-[var(--text-main)] space-y-1">
              <div className="font-bold">{projectToDelete.name} ({projectToDelete.code})</div>
              <div className="text-[var(--text-muted)]">{projectToDelete.location}</div>
              <div className="text-amber-500 font-mono text-[11px]">
                Budget: {formatLakhsOrCrores(projectToDelete.totalBudget)} · Category: {projectToDelete.type}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-surface-subtle)] rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteProject}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-md cursor-pointer"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
