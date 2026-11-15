import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Building2, Upload, Trash2, Image as ImageIcon, Check } from 'lucide-react';
import { Project } from '../../types';
import { formatLakhsOrCrores } from '../../utils/formatters';

interface EditProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({ project, isOpen, onClose }) => {
  const { branches, editProject, projectCategories } = useApp();

  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [branchId, setBranchId] = useState('BR-01');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Commercial Complex');
  const [totalBudget, setTotalBudget] = useState(150000000);
  const [spentBudget, setSpentBudget] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [status, setStatus] = useState<Project['status']>('Active Execution');
  const [startDate, setStartDate] = useState('');
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState('');
  const [description, setDescription] = useState('');
  const [floorsCount, setFloorsCount] = useState(12);
  const [builtUpAreaSqFt, setBuiltUpAreaSqFt] = useState(120000);
  const [photos, setPhotos] = useState<string[]>([]);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');

  useEffect(() => {
    if (project) {
      setName(project.name);
      setClientName(project.clientName);
      setClientContact(project.clientContact);
      setBranchId(project.branchId);
      setLocation(project.location);
      setType(project.type);
      setTotalBudget(project.totalBudget);
      setSpentBudget(project.spentBudget);
      setProgressPercentage(project.progressPercentage);
      setStatus(project.status);
      setStartDate(project.startDate);
      setEstimatedCompletionDate(project.estimatedCompletionDate);
      setDescription(project.description);
      setFloorsCount(project.floorsCount || 12);
      setBuiltUpAreaSqFt(project.builtUpAreaSqFt || 120000);
      setPhotos(project.photos || (project.bannerUrl ? [project.bannerUrl] : []));
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotos(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddPhotoUrl = () => {
    const url = customPhotoUrl.trim();
    if (!url) return;
    setPhotos(prev => [...prev, url]);
    setCustomPhotoUrl('');
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editProject(project.id, {
      name,
      clientName,
      clientContact,
      branchId,
      location,
      type,
      totalBudget: Number(totalBudget),
      spentBudget: Number(spentBudget),
      progressPercentage: Number(progressPercentage),
      status,
      startDate,
      estimatedCompletionDate,
      description,
      floorsCount: Number(floorsCount),
      builtUpAreaSqFt: Number(builtUpAreaSqFt),
      photos,
      bannerUrl: photos.length > 0 ? photos[0] : project.bannerUrl
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[var(--text-main)]">Edit Site Project Specifications</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--primary-accent-text)] border border-[var(--border-subtle)] font-bold">
                  {project.code}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">Update project budget in Lakhs/Cr, photos gallery, schedule and status</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Project Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Project Category *</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
              >
                {projectCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Project Execution Status *</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-semibold focus:outline-none focus:border-[var(--primary-accent)]"
              >
                <option value="Active Execution">Active Execution</option>
                <option value="Planning">Planning</option>
                <option value="Finishing">Finishing</option>
                <option value="Handover">Handover</option>
                <option value="On Hold">On Hold (Paused)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Milestone Progress (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={progressPercentage}
                onChange={e => setProgressPercentage(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Managing Branch Hub *</label>
              <select
                value={branchId}
                onChange={e => setBranchId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Client / Developer Name *</label>
              <input
                type="text"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Client Contact Details</label>
              <input
                type="text"
                value={clientContact}
                onChange={e => setClientContact(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Site Location & Address *</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
              required
            />
          </div>

          {/* Financials in Lakhs / Crores */}
          <div className="p-4 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[var(--primary-accent-text)] uppercase tracking-wider font-mono">
                Project Financials in Indian Rupees (₹)
              </label>
              <span className="text-xs font-mono font-bold text-amber-500">
                Total: {formatLakhsOrCrores(totalBudget)} · Spent: {formatLakhsOrCrores(spentBudget)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Total Project Budget (₹ Raw Amount) *
                </label>
                <input
                  type="number"
                  value={totalBudget}
                  onChange={e => setTotalBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono font-bold"
                  step={500000}
                  required
                />
                <span className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5 block">
                  Displayed as: <strong className="text-[var(--primary-accent-text)]">{formatLakhsOrCrores(totalBudget)}</strong>
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Spent / Incurred Budget (₹)
                </label>
                <input
                  type="number"
                  value={spentBudget}
                  onChange={e => setSpentBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono"
                  step={100000}
                />
                <span className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5 block">
                  Displayed as: <strong className="text-emerald-500">{formatLakhsOrCrores(spentBudget)}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Estimated Completion Date</label>
              <input
                type="date"
                value={estimatedCompletionDate}
                onChange={e => setEstimatedCompletionDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Floors Count</label>
              <input
                type="number"
                value={floorsCount}
                onChange={e => setFloorsCount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Built-up Area (Sq. Ft.)</label>
              <input
                type="number"
                value={builtUpAreaSqFt}
                onChange={e => setBuiltUpAreaSqFt(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono"
              />
            </div>
          </div>

          {/* Project Photos Upload & Gallery */}
          <div className="p-4 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[var(--primary-accent-text)] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[var(--primary-accent)]" />
                <span>Project Photos & Site Elevation Images ({photos.length})</span>
              </label>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">Upload local photos or add URLs</span>
            </div>

            {/* Upload & URL Input Row */}
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] text-[var(--text-main)] border border-dashed border-[var(--border-strong)] rounded-lg cursor-pointer transition-colors shrink-0">
                <Upload className="w-4 h-4 text-[var(--primary-accent)]" />
                <span>Upload Site Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Or paste external image URL (https://...)"
                  value={customPhotoUrl}
                  onChange={e => setCustomPhotoUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono text-[11px]"
                />
                <button
                  type="button"
                  onClick={handleAddPhotoUrl}
                  className="px-3 py-1.5 text-xs font-semibold bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)] border border-[var(--primary-accent-border)] rounded-lg hover:opacity-90 cursor-pointer"
                >
                  Add URL
                </button>
              </div>
            </div>

            {/* Photos Preview Grid */}
            {photos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {photos.map((url, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-[var(--border-subtle)] aspect-video bg-slate-900">
                    <img src={url} alt={`Site photo ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[9px] font-mono font-bold bg-amber-500 text-slate-950 rounded">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded hover:bg-rose-500 transition-colors cursor-pointer opacity-90 group-hover:opacity-100"
                      title="Remove photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 text-center text-xs text-[var(--text-muted)] border border-dashed border-[var(--border-subtle)] rounded-lg">
                No site photos added yet. Upload files or paste image URLs.
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Project Scope & Engineering Highlights</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)] shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-surface-subtle)] rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Project Changes</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
