import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Building2, Upload, Trash2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { formatLakhsOrCrores } from '../../utils/formatters';

export const NewProjectModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { branches, addProject, projectCategories } = useApp();

  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [branchId, setBranchId] = useState(branches[0]?.id || 'BR-01');
  const [location, setLocation] = useState('');
  const [type, setType] = useState(projectCategories[0] || 'Residential High-Rise');
  const [totalBudget, setTotalBudget] = useState(150000000); // 15 Cr default
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState('2028-06-30');
  const [description, setDescription] = useState('');
  const [floorsCount, setFloorsCount] = useState(18);
  const [builtUpAreaSqFt, setBuiltUpAreaSqFt] = useState(180000);
  const [photos, setPhotos] = useState<string[]>([
    '/src/assets/images/hero_construction_site_1792597145952.jpg'
  ]);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');

  if (!isOpen) return null;

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

  const photoPresets = [
    { label: 'High-Rise Tower', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60' },
    { label: 'Commercial Glass', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60' },
    { label: 'PEB Industrial Hub', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=60' },
    { label: 'Foundation Site', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=60' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const primaryBanner = photos.length > 0 ? photos[0] : '/src/assets/images/hero_construction_site_1792597145952.jpg';
    addProject({
      name,
      clientName,
      clientContact,
      branchId,
      location,
      type,
      totalBudget: Number(totalBudget),
      spentBudget: 0,
      startDate,
      estimatedCompletionDate,
      description,
      floorsCount: Number(floorsCount),
      builtUpAreaSqFt: Number(builtUpAreaSqFt),
      progressPercentage: 5,
      status: 'Active Execution',
      photos: photos.length > 0 ? photos : [primaryBanner],
      bannerUrl: primaryBanner
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-main)]">Create New Construction Project</h3>
              <p className="text-xs text-[var(--text-muted)]">Assign branch, budget in Lakhs/Cr, site schedule and upload project photos</p>
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
                placeholder="e.g. Sayaji Emerald High-Rise Bay"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Client / Developer Name *</label>
              <input
                type="text"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="e.g. Apex Infotech Infrastructure"
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Client Contact Details *</label>
              <input
                type="text"
                value={clientContact}
                onChange={e => setClientContact(e.target.value)}
                placeholder="+91 98200 12345 (Name & Designation)"
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Managing Branch Hub *</label>
              <select
                value={branchId}
                onChange={e => setBranchId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Site Location & Address *</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Sayajigunj, Near Railway Station, Vadodara"
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                required
              />
            </div>
          </div>

          {/* Budget in INR with Lakhs / Crores Preview */}
          <div className="p-4 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[var(--primary-accent-text)] uppercase tracking-wider font-mono">
                Total Project Amount / Budget (₹ INR) *
              </label>
              <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Amount: {formatLakhsOrCrores(totalBudget)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <input
                  type="number"
                  value={totalBudget}
                  onChange={e => setTotalBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] font-mono font-bold"
                  step={500000}
                  required
                />
                <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                  Enter raw numeric amount in INR. Shows dynamically as Lakhs / Crores across all reports.
                </span>
              </div>

              {/* Quick Lakhs / Cr presets */}
              <div>
                <span className="text-[10px] text-[var(--text-subtle)] font-mono block mb-1">Quick Budget Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: '₹ 80 L', value: 8000000 },
                    { label: '₹ 2.5 Cr', value: 25000000 },
                    { label: '₹ 10 Cr', value: 100000000 },
                    { label: '₹ 25 Cr', value: 250000000 },
                    { label: '₹ 50 Cr', value: 500000000 },
                  ].map(p => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setTotalBudget(p.value)}
                      className="px-2 py-1 text-[10px] font-mono font-semibold bg-[var(--bg-surface)] hover:bg-[var(--primary-accent-bg)] hover:text-[var(--primary-accent-text)] border border-[var(--border-subtle)] rounded cursor-pointer transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Floors / Levels</label>
              <input
                type="number"
                value={floorsCount}
                onChange={e => setFloorsCount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Built-up Area (Sq. Ft.)</label>
              <input
                type="number"
                value={builtUpAreaSqFt}
                onChange={e => setBuiltUpAreaSqFt(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Start Date *</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Target Handover Date *</label>
              <input
                type="date"
                value={estimatedCompletionDate}
                onChange={e => setEstimatedCompletionDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                required
              />
            </div>
          </div>

          {/* Project Photos Upload & Gallery */}
          <div className="p-4 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[var(--primary-accent-text)] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[var(--primary-accent)]" />
                <span>Upload Project Photos & Site Gallery ({photos.length})</span>
              </label>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">Camera / Local Files / Presets</span>
            </div>

            {/* Presets and Upload Controls */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <label className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] text-[var(--text-main)] border border-dashed border-[var(--border-strong)] rounded-lg cursor-pointer transition-colors shrink-0">
                  <Upload className="w-4 h-4 text-[var(--primary-accent)]" />
                  <span>Choose Photo File</span>
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
                    placeholder="Or enter image URL (https://...)"
                    value={customPhotoUrl}
                    onChange={e => setCustomPhotoUrl(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhotoUrl}
                    className="px-3 py-1.5 text-xs font-semibold bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)] border border-[var(--primary-accent-border)] rounded-lg hover:opacity-90 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Quick Image Presets */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-[10px] text-[var(--text-subtle)] font-mono flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Quick Stock Photos:
                </span>
                {photoPresets.map(preset => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setPhotos(prev => [...prev, preset.url])}
                    className="px-2 py-0.5 text-[10px] font-medium bg-[var(--bg-surface)] hover:bg-[var(--primary-accent-bg)] hover:text-[var(--primary-accent-text)] border border-[var(--border-subtle)] rounded transition-colors cursor-pointer"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photos Preview Grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {photos.map((url, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-[var(--border-subtle)] aspect-video bg-slate-900">
                    <img src={url} alt={`Site photo ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[9px] font-mono font-bold bg-amber-500 text-slate-950 rounded">
                        Cover Photo
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
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Project Scope & Engineering Highlights</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Deep pile foundation, shear wall system, post-tensioned slabs..."
              rows={2}
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)] shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-subtle)] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg transition-colors shadow-md cursor-pointer"
            >
              Create Site Project
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
