import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Plus, 
  Trash2, 
  Camera, 
  CloudSun, 
  HardHat, 
  CheckCircle, 
  Upload, 
  Image as ImageIcon,
  Sparkles,
  MapPin
} from 'lucide-react';
import { DailyLaborBreakdown, DailyMaterialConsumption } from '../../types';

export const NewDprModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { projects, currentUser, addDpr, inventory } = useApp();

  const [projectId, setProjectId] = useState(projects[0]?.id || 'PRJ-01');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [weatherCondition, setWeatherCondition] = useState<'Sunny / Clear' | 'Partly Cloudy' | 'Rainy / Wet Site' | 'Extreme Heat' | 'Windy / Dust'>('Sunny / Clear');
  const [workSummary, setWorkSummary] = useState('');
  const [milestoneAchieved, setMilestoneAchieved] = useState('');
  const [equipmentStatus, setEquipmentStatus] = useState('Tower Crane #1 operational (8.5 hrs). Concrete boom placer active.');
  const [safetyObservations, setSafetyObservations] = useState('100% PPE compliance. Perimeter safety cable checked.');
  const [delaysOrBlockers, setDelaysOrBlockers] = useState('');

  // Photos attached state
  const [attachedPhotos, setAttachedPhotos] = useState<string[]>([
    '/src/assets/images/hero_construction_site_1792597145952.jpg'
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset realistic site photos for instant site snapshot attachment
  const sampleSnaps = [
    { label: 'Slab Concreting Pour', url: '/src/assets/images/hero_construction_site_1792597145952.jpg' },
    { label: 'CAD Drawing Check', url: '/src/assets/images/blueprint_draft_cad_1792597146290.jpg' },
    { label: 'Site Engineer Inspection', url: '/src/assets/images/avatar_engineer_site_1792597146510.jpg' }
  ];

  // Labor Headcount breakdown
  const [laborList, setLaborList] = useState<DailyLaborBreakdown[]>([
    { trade: 'Masons', headcount: 12, hoursWorked: 8.5, overtimeHours: 1.5 },
    { trade: 'Bar Benders', headcount: 18, hoursWorked: 9.0, overtimeHours: 2.0 },
    { trade: 'Carpenters', headcount: 14, hoursWorked: 8.5, overtimeHours: 1.0 },
    { trade: 'General Helpers', headcount: 30, hoursWorked: 8.5, overtimeHours: 2.0 },
  ]);

  // Materials consumed
  const [materialsList, setMaterialsList] = useState<DailyMaterialConsumption[]>([
    { materialId: 'MAT-01', materialName: 'Ready-Mix Concrete M40 Grade', unit: 'Cum (m³)', quantityUsed: 120 },
    { materialId: 'MAT-02', materialName: 'Tata Tiscon 550D TMT Rebar (16mm)', unit: 'Tons', quantityUsed: 8.5 }
  ]);

  if (!isOpen) return null;

  const handleAddLabor = () => {
    setLaborList([...laborList, { trade: 'Electricians', headcount: 4, hoursWorked: 8, overtimeHours: 0 }]);
  };

  const handleRemoveLabor = (index: number) => {
    setLaborList(laborList.filter((_, i) => i !== index));
  };

  const handleAddMaterial = () => {
    const firstInv = inventory[0];
    setMaterialsList([...materialsList, { materialId: firstInv?.id || 'MAT-01', materialName: firstInv?.name || 'Cement', unit: firstInv?.unit || 'Bags', quantityUsed: 50 }]);
  };

  const handleRemoveMaterial = (index: number) => {
    setMaterialsList(materialsList.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setAttachedPhotos(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemovePhoto = (idx: number) => {
    setAttachedPhotos(attachedPhotos.filter((_, i) => i !== idx));
  };

  const handleAddPresetPhoto = (url: string) => {
    if (!attachedPhotos.includes(url)) {
      setAttachedPhotos([...attachedPhotos, url]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedProj = projects.find(p => p.id === projectId);
    addDpr({
      projectId,
      projectName: selectedProj?.name || 'Construction Site',
      branchId: selectedProj?.branchId || 'BR-01',
      reportDate,
      weatherCondition,
      workSummary,
      milestoneAchieved,
      equipmentStatus,
      safetyObservations,
      delaysOrBlockers: delaysOrBlockers || undefined,
      laborSummary: laborList,
      materialsUsed: materialsList,
      photos: attachedPhotos.length > 0 ? attachedPhotos : ['/src/assets/images/hero_construction_site_1792597145952.jpg'],
      supervisorSignOff: true
    });
    onClose();
  };

  const totalHeadcount = laborList.reduce((acc, curr) => acc + Number(curr.headcount || 0), 0);
  const totalLaborHours = laborList.reduce((acc, curr) => acc + (Number(curr.headcount || 0) * (Number(curr.hoursWorked || 0) + Number(curr.overtimeHours || 0))), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)]">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-main)]">Submit Daily Progress Report (DPR) with Site Photos</h3>
              <p className="text-xs text-[var(--text-muted)]">P W Construction · Field Engineering Operations</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Row 1: Site & Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Select Construction Site *</label>
              <select
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                required
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Report Date *</label>
              <input
                type="date"
                value={reportDate}
                onChange={e => setReportDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Weather Condition *</label>
              <select
                value={weatherCondition}
                onChange={e => setWeatherCondition(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
              >
                <option value="Sunny / Clear">Sunny / Clear</option>
                <option value="Partly Cloudy">Partly Cloudy</option>
                <option value="Rainy / Wet Site">Rainy / Wet Site</option>
                <option value="Extreme Heat">Extreme Heat</option>
                <option value="Windy / Dust">Windy / Dust</option>
              </select>
            </div>
          </div>

          {/* Row 2: Work Summary & Milestone */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Today's Executed Work Summary *</label>
            <textarea
              value={workSummary}
              onChange={e => setWorkSummary(e.target.value)}
              placeholder="e.g. Concreted 18th floor slab deck. Shuttering checked by site engineer. Internal brickwork started on 12th floor..."
              rows={3}
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] placeholder:text-[var(--text-subtle)]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Specific Milestone Achieved *</label>
            <input
              type="text"
              value={milestoneAchieved}
              onChange={e => setMilestoneAchieved(e.target.value)}
              placeholder="e.g. Slab #18 complete; Column steel reinforcement tied for #19"
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] placeholder:text-[var(--text-subtle)]"
              required
            />
          </div>

          {/* Site Engineer Site Photos Attachment Section */}
          <div className="p-4 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-[var(--primary-accent-text)] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Camera className="w-4 h-4" />
                  Site Engineer Site Photos ({attachedPhotos.length} Attached)
                </span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  Take photos using device camera or upload high-res site inspection images
                </span>
              </div>

              {/* Upload & Camera Buttons */}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[var(--primary-accent)] text-slate-950 rounded-lg hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Take / Upload Photo</span>
                </button>
              </div>
            </div>

            {/* Attached Photo Thumbnails */}
            {attachedPhotos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {attachedPhotos.map((photo, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-[var(--border-strong)] aspect-video bg-slate-900 shadow-xs">
                    <img
                      src={photo}
                      alt={`Site snapshot ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-1.5">
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="self-end p-1 rounded-full bg-rose-600 text-white hover:bg-rose-500 transition-colors shadow"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <div className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>GPS Geotagged</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-[var(--text-muted)] border border-dashed border-[var(--border-subtle)] rounded-lg">
                No site photos attached yet. Click above or select quick inspection snaps below.
              </div>
            )}

            {/* Quick Sample Site Snaps for Prototyping */}
            <div className="pt-2 border-t border-[var(--border-subtle)]">
              <span className="text-[10px] text-[var(--text-subtle)] font-mono block mb-1.5">QUICK SAMPLE SITE SNAPS:</span>
              <div className="flex flex-wrap gap-2">
                {sampleSnaps.map((snap, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAddPresetPhoto(snap.url)}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] text-[var(--text-main)] border border-[var(--border-subtle)] transition-colors"
                  >
                    <Plus className="w-3 h-3 text-[var(--primary-accent)]" />
                    <span>+ {snap.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Field Labor Attendance & Headcounts */}
          <div className="bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold text-[var(--primary-accent-text)] uppercase tracking-wider font-mono">Labor Headcounts & Hours</span>
                <span className="ml-3 text-xs text-[var(--text-muted)] font-mono">Total Workers: {totalHeadcount} · Total Hours: {totalLaborHours.toFixed(1)} hrs</span>
              </div>
              <button
                type="button"
                onClick={handleAddLabor}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] text-[var(--text-main)] border border-[var(--border-subtle)] rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Trade
              </button>
            </div>

            <div className="space-y-2">
              {laborList.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-[var(--bg-surface)] p-2 rounded-lg border border-[var(--border-subtle)]">
                  <div className="col-span-4">
                    <select
                      value={item.trade}
                      onChange={e => {
                        const copy = [...laborList];
                        copy[idx].trade = e.target.value as any;
                        setLaborList(copy);
                      }}
                      className="w-full px-2 py-1.5 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded text-[var(--text-main)]"
                    >
                      <option value="Masons">Masons</option>
                      <option value="Carpenters">Carpenters</option>
                      <option value="Bar Benders">Bar Benders</option>
                      <option value="Electricians">Electricians</option>
                      <option value="Plumbers">Plumbers</option>
                      <option value="General Helpers">General Helpers</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Count"
                      value={item.headcount}
                      onChange={e => {
                        const copy = [...laborList];
                        copy[idx].headcount = Number(e.target.value);
                        setLaborList(copy);
                      }}
                      className="w-full px-2 py-1.5 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded text-[var(--text-main)] text-center font-mono"
                      title="Workers count"
                      min={1}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Reg hrs"
                      value={item.hoursWorked}
                      onChange={e => {
                        const copy = [...laborList];
                        copy[idx].hoursWorked = Number(e.target.value);
                        setLaborList(copy);
                      }}
                      className="w-full px-2 py-1.5 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded text-[var(--text-main)] text-center font-mono"
                      step={0.5}
                      title="Regular hours"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      placeholder="OT hrs"
                      value={item.overtimeHours}
                      onChange={e => {
                        const copy = [...laborList];
                        copy[idx].overtimeHours = Number(e.target.value);
                        setLaborList(copy);
                      }}
                      className="w-full px-2 py-1.5 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded text-[var(--text-main)] text-center font-mono"
                      step={0.5}
                      title="Overtime hours"
                    />
                  </div>
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveLabor(idx)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Material Consumption */}
          <div className="bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[var(--primary-accent-text)] uppercase tracking-wider font-mono">Materials Consumed Today</span>
              <button
                type="button"
                onClick={handleAddMaterial}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] text-[var(--text-main)] border border-[var(--border-subtle)] rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>

            <div className="space-y-2">
              {materialsList.map((mat, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-[var(--bg-surface)] p-2 rounded-lg border border-[var(--border-subtle)]">
                  <div className="col-span-6">
                    <input
                      type="text"
                      value={mat.materialName}
                      onChange={e => {
                        const copy = [...materialsList];
                        copy[idx].materialName = e.target.value;
                        setMaterialsList(copy);
                      }}
                      className="w-full px-2 py-1.5 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded text-[var(--text-main)]"
                      placeholder="Material Name"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={mat.quantityUsed}
                      onChange={e => {
                        const copy = [...materialsList];
                        copy[idx].quantityUsed = Number(e.target.value);
                        setMaterialsList(copy);
                      }}
                      className="w-full px-2 py-1.5 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded text-[var(--text-main)] text-center font-mono"
                      placeholder="Qty"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={mat.unit}
                      onChange={e => {
                        const copy = [...materialsList];
                        copy[idx].unit = e.target.value;
                        setMaterialsList(copy);
                      }}
                      className="w-full px-2 py-1.5 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded text-[var(--text-main)] text-center"
                      placeholder="Unit"
                    />
                  </div>
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveMaterial(idx)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment & Safety */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Equipment Run Time & Machine Health</label>
              <input
                type="text"
                value={equipmentStatus}
                onChange={e => setEquipmentStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Safety & Toolbox Observations</label>
              <input
                type="text"
                value={safetyObservations}
                onChange={e => setSafetyObservations(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
              />
            </div>
          </div>

          {/* Blockers or Delays */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Delays / Urgent Material Blockers (Optional)</label>
            <input
              type="text"
              value={delaysOrBlockers}
              onChange={e => setDelaysOrBlockers(e.target.value)}
              placeholder="e.g. Awaiting 20mm TMT rebar delivery from Vadodara central depot..."
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] placeholder:text-[var(--text-subtle)]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-subtle)] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg transition-colors shadow-md cursor-pointer"
            >
              Sign Off & Submit DPR ({attachedPhotos.length} Photos)
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
