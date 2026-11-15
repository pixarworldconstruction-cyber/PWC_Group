import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, HardHat, Check, UserPlus, Building2 } from 'lucide-react';
import { Project } from '../../types';

interface AllocateEngineerModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AllocateEngineerModal: React.FC<AllocateEngineerModalProps> = ({ project, isOpen, onClose }) => {
  const { users, allocateEngineersToProject } = useApp();
  
  const siteEngineers = users.filter(u => u.role === 'SITE_ENGINEER');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (project) {
      setSelectedIds(project.siteEngineerIds || []);
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const handleToggle = (engineerId: string) => {
    if (selectedIds.includes(engineerId)) {
      setSelectedIds(selectedIds.filter(id => id !== engineerId));
    } else {
      setSelectedIds([...selectedIds, engineerId]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    allocateEngineersToProject(project.id, selectedIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)]">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-main)]">Allocate Project Site Engineers</h3>
              <p className="text-xs text-[var(--text-muted)]">Assign field civil engineers responsible for DPRs & site execution</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Target Info Banner */}
        <div className="px-6 py-3 bg-[var(--primary-accent-bg)] border-b border-[var(--primary-accent-border)] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-[var(--primary-accent-text)] uppercase">{project.code}</span>
            <div className="text-xs font-bold text-[var(--text-main)]">{project.name}</div>
            <div className="text-[11px] text-[var(--text-muted)]">{project.location}</div>
          </div>
          <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[var(--primary-accent)] text-slate-950 rounded">
            {project.status}
          </span>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="text-xs font-semibold text-[var(--text-main)]">
            Select Site Engineers for this Construction Site:
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {siteEngineers.map(eng => {
              const isSelected = selectedIds.includes(eng.id);
              const isAssigned = eng.assignedProjectIds?.includes(project.id);

              return (
                <div
                  key={eng.id}
                  onClick={() => handleToggle(eng.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[var(--primary-accent-bg)] border-[var(--primary-accent-border)] shadow-2xs'
                      : 'bg-[var(--bg-surface-subtle)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={eng.avatarUrl || '/src/assets/images/avatar_engineer_site_1792597146510.jpg'}
                        alt={eng.fullName}
                        className="w-10 h-10 rounded-lg object-cover border border-[var(--border-subtle)]"
                      />
                      {isSelected && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-slate-950">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[var(--text-main)]">{eng.fullName}</div>
                      <div className="text-[11px] text-[var(--primary-accent-text)] font-mono">{eng.designation}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">
                        Phone: {eng.phone} · Active Sites: {eng.assignedProjectIds?.length || 0}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // Controlled by outer card
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)]">
            Allocated engineers will immediately receive access to submit Daily Progress Reports (DPR), create material dispatch requisitions with needed dates, and inspect blueprints for this site.
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-surface-subtle)] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg transition-colors shadow-md cursor-pointer"
            >
              Confirm Allocations ({selectedIds.length} Engineers)
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
