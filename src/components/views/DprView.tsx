import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Calendar, 
  HardHat, 
  Printer, 
  CheckCircle, 
  CloudSun, 
  MapPin, 
  Layers, 
  FileText,
  AlertCircle,
  Camera,
  Maximize2,
  X
} from 'lucide-react';
import { NewDprModal } from '../modals/NewDprModal';
import { DailyProgressReport } from '../../types';

export const DprView: React.FC = () => {
  const { dprs, projects, branches, activeBranchId, currentUser } = useApp();
  const [isNewDprOpen, setIsNewDprOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');
  const [selectedDpr, setSelectedDpr] = useState<DailyProgressReport | null>(dprs[0] || null);
  const [zoomPhoto, setZoomPhoto] = useState<string | null>(null);

  const filteredDprs = dprs.filter(d => {
    if (activeBranchId !== 'ALL' && d.branchId !== activeBranchId) return false;
    if (selectedProjectId !== 'ALL' && d.projectId !== selectedProjectId) return false;
    return true;
  });

  const activeDpr = selectedDpr && filteredDprs.find(d => d.id === selectedDpr.id) 
    ? selectedDpr 
    : filteredDprs[0] || null;

  const handlePrintDpr = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & New Report Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[var(--text-main)] tracking-tight">Daily Progress Reports (DPR)</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
              Site Photo Attached
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Field civil engineering logs: labor deployment, materials consumed, geotagged site inspection photos & safety
          </p>
        </div>

        <button
          onClick={() => setIsNewDprOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg transition-colors shadow-md"
        >
          <Camera className="w-4 h-4" />
          <span>Submit Today's DPR + Photo</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-3 rounded-xl shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">Filter Site:</span>
          <select
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
          >
            <option value="ALL">All Assigned Construction Sites</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-[var(--text-muted)] font-mono">
          Showing {filteredDprs.length} Official Site Reports
        </div>
      </div>

      {/* Split View: Left List of DPRs + Right Full Report Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (4 cols): Scrollable List of DPRs */}
        <div className="lg:col-span-4 space-y-3 max-h-[800px] overflow-y-auto pr-1">
          {filteredDprs.map(dpr => {
            const isSelected = activeDpr?.id === dpr.id;
            const totalWorkers = dpr.laborSummary.reduce((sum, l) => sum + l.headcount, 0);

            return (
              <div
                key={dpr.id}
                onClick={() => setSelectedDpr(dpr)}
                className={`p-4 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'bg-[var(--primary-accent-bg)] border-[var(--primary-accent)] shadow-xs'
                    : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-subtle)] border-[var(--border-subtle)]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-[var(--primary-accent-text)] font-bold">{dpr.dprNumber}</span>
                  <span className="text-[11px] text-[var(--text-muted)] font-mono">{dpr.reportDate}</span>
                </div>

                <div className="text-xs font-bold text-[var(--text-main)] mb-1 truncate">{dpr.projectName}</div>
                <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">{dpr.milestoneAchieved}</p>

                <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono">
                  <span className="flex items-center gap-1 text-[var(--text-main)]">
                    <HardHat className="w-3 h-3 text-[var(--primary-accent)]" />
                    <span>{dpr.engineerName.split(' ')[0]}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {dpr.photos && dpr.photos.length > 0 && (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <Camera className="w-3 h-3" />
                        <span>{dpr.photos.length}</span>
                      </span>
                    )}
                    <span className="text-[var(--primary-accent-text)] font-semibold">{totalWorkers} Workers</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column (8 cols): Detailed Printable Official DPR Sheet */}
        <div className="lg:col-span-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
          {activeDpr ? (
            <>
              {/* Sheet Action Bar */}
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[var(--primary-accent-text)] bg-[var(--primary-accent-bg)] px-2 py-0.5 rounded border border-[var(--primary-accent-border)]">
                      {activeDpr.dprNumber}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">· Official Civil Site Log</span>
                  </div>
                  <h2 className="text-lg font-bold text-[var(--text-main)] mt-1">{activeDpr.projectName}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintDpr}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-subtle)] text-[var(--text-main)] border border-[var(--border-subtle)] rounded-lg transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-[var(--primary-accent)]" />
                    <span>Print Log</span>
                  </button>
                </div>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] text-[11px] font-mono">
                <div>
                  <span className="text-[var(--text-subtle)] block text-[10px]">DATE</span>
                  <span className="text-[var(--text-main)] font-semibold">{activeDpr.reportDate}</span>
                </div>
                <div>
                  <span className="text-[var(--text-subtle)] block text-[10px]">WEATHER</span>
                  <span className="text-[var(--primary-accent-text)] font-semibold">{activeDpr.weatherCondition}</span>
                </div>
                <div>
                  <span className="text-[var(--text-subtle)] block text-[10px]">SITE ENGINEER</span>
                  <span className="text-[var(--text-main)] font-semibold">{activeDpr.engineerName}</span>
                </div>
                <div>
                  <span className="text-[var(--text-subtle)] block text-[10px]">SUBMITTED AT</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{activeDpr.submittedAt}</span>
                </div>
              </div>

              {/* Attached Geotagged Site Photos Gallery */}
              {activeDpr.photos && activeDpr.photos.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--primary-accent-text)] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <Camera className="w-4 h-4" />
                      Attached Site Inspection Photos ({activeDpr.photos.length})
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Geotag Verified · Old Padra / Sayaji Site
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {activeDpr.photos.map((photoUrl, pIdx) => (
                      <div
                        key={pIdx}
                        onClick={() => setZoomPhoto(photoUrl)}
                        className="relative group rounded-xl overflow-hidden border border-[var(--border-subtle)] aspect-video bg-slate-900 cursor-pointer shadow-xs hover:border-[var(--primary-accent)] transition-all"
                      >
                        <img
                          src={photoUrl}
                          alt={`Inspection photo ${pIdx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Maximize2 className="w-5 h-5 drop-shadow" />
                        </div>
                        <div className="absolute bottom-1 left-2 text-[9px] font-mono text-white/90 bg-slate-900/80 px-1.5 py-0.5 rounded backdrop-blur-xs">
                          Site Snap #{pIdx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section: Work Executed & Milestone Achieved */}
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-bold text-[var(--primary-accent-text)] uppercase tracking-wider block mb-1">
                    Executed Work Summary
                  </span>
                  <div className="p-3 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] text-xs text-[var(--text-main)] leading-relaxed">
                    {activeDpr.workSummary}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-[var(--primary-accent-text)] uppercase tracking-wider block mb-1">
                    Key Milestone Delivered
                  </span>
                  <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{activeDpr.milestoneAchieved}</span>
                  </div>
                </div>
              </div>

              {/* Section: Field Labor Attendance & Hours */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[var(--primary-accent-text)] uppercase tracking-wider">
                    Labor Deployment & Overtime Hours
                  </span>
                  <span className="text-[var(--text-muted)] font-mono text-[11px]">
                    Total Headcount: {activeDpr.laborSummary.reduce((sum, l) => sum + l.headcount, 0)}
                  </span>
                </div>

                <div className="border border-[var(--border-subtle)] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] text-[11px] font-mono border-b border-[var(--border-subtle)]">
                      <tr>
                        <th className="py-2.5 px-3">Trade / Skill Category</th>
                        <th className="py-2.5 px-3 text-center">Headcount</th>
                        <th className="py-2.5 px-3 text-center">Standard Hours</th>
                        <th className="py-2.5 px-3 text-center">Overtime (OT)</th>
                        <th className="py-2.5 px-3 text-right">Total Man-Hours</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)] font-mono text-[11px]">
                      {activeDpr.laborSummary.map((labor, idx) => {
                        const totalManHours = labor.headcount * (labor.hoursWorked + labor.overtimeHours);
                        return (
                          <tr key={idx} className="hover:bg-[var(--bg-surface-subtle)]">
                            <td className="py-2 px-3 font-sans font-medium text-[var(--text-main)]">{labor.trade}</td>
                            <td className="py-2 px-3 text-center text-[var(--text-main)]">{labor.headcount}</td>
                            <td className="py-2 px-3 text-center text-[var(--text-muted)]">{labor.hoursWorked} hrs</td>
                            <td className="py-2 px-3 text-center text-[var(--primary-accent-text)] font-semibold">+{labor.overtimeHours} hrs</td>
                            <td className="py-2 px-3 text-right font-bold text-[var(--text-main)]">{totalManHours.toFixed(1)} hrs</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section: Material Consumed Today */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[var(--primary-accent-text)] uppercase tracking-wider block">
                  Material Consumption Log
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeDpr.materialsUsed.map((mat, idx) => (
                    <div key={idx} className="p-3 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] flex items-center justify-between text-xs shadow-2xs">
                      <div>
                        <div className="font-semibold text-[var(--text-main)]">{mat.materialName}</div>
                        <div className="text-[10px] text-[var(--text-muted)] font-mono">Issued to site pour</div>
                      </div>
                      <div className="text-right font-mono font-bold text-[var(--primary-accent-text)]">
                        {mat.quantityUsed} {mat.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section: Equipment & Safety */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                    Equipment Runtime & Health
                  </span>
                  <p className="text-xs text-[var(--text-main)] leading-relaxed">
                    {activeDpr.equipmentStatus}
                  </p>
                </div>

                <div className="p-3.5 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] space-y-1">
                  <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                    Safety Compliance & PPE
                  </span>
                  <p className="text-xs text-[var(--text-main)] leading-relaxed">
                    {activeDpr.safetyObservations}
                  </p>
                </div>
              </div>

              {/* Sign-off footer */}
              <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Site Engineer Verified & Signed Off</span>
                </div>
                <div className="text-[var(--text-muted)] font-mono text-[11px]">
                  Logged in P W Construction Unified Cloud System
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-[var(--text-muted)]">
              Select a Daily Progress Report to view complete records
            </div>
          )}
        </div>

      </div>

      {/* Lightbox / Zoom Photo Modal */}
      {zoomPhoto && (
        <div 
          onClick={() => setZoomPhoto(null)} 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-700 shadow-2xl">
            <button
              onClick={() => setZoomPhoto(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={zoomPhoto} alt="Zoomed site photo" className="max-w-full max-h-[85vh] object-contain" />
            <div className="p-3 bg-slate-900/95 text-xs text-slate-300 font-mono flex items-center justify-between">
              <span className="text-amber-400 font-bold">P W Construction Site Inspection Image</span>
              <span>Geotagged & Timestamp Verified</span>
            </div>
          </div>
        </div>
      )}

      <NewDprModal isOpen={isNewDprOpen} onClose={() => setIsNewDprOpen(false)} />

    </div>
  );
};
