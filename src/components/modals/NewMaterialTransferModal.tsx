import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Boxes, ArrowRightLeft, Calendar, IndianRupee, AlertCircle } from 'lucide-react';

export const NewMaterialTransferModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { inventory, projects, requestMaterialTransfer, currentUser } = useApp();

  const isSiteEngineer = currentUser?.role === 'SITE_ENGINEER';
  const defaultProjectId = currentUser?.assignedProjectIds?.[0] || projects[0]?.id || 'PRJ-01';

  const [itemId, setItemId] = useState(inventory[0]?.id || 'MAT-01');
  const [quantity, setQuantity] = useState(10);
  const [toProjectId, setToProjectId] = useState(defaultProjectId);
  const [fromLocation, setFromLocation] = useState('Vadodara Central Depot (Makarpura GIDC)');
  
  // Material needed date defaults to 3 days from now
  const defaultNeededDate = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
  const [materialNeededDate, setMaterialNeededDate] = useState(defaultNeededDate);
  const [urgency, setUrgency] = useState<'Immediate / Emergency' | 'High (24-48 hrs)' | 'Standard (3-5 days)' | 'Scheduled'>('High (24-48 hrs)');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const selectedItem = inventory.find(i => i.id === itemId);
  const selectedProj = projects.find(p => p.id === toProjectId);
  const estimatedCost = (selectedItem?.unitPrice || 500) * Number(quantity);

  const setQuickDate = (daysFromNow: number, urg: typeof urgency) => {
    const target = new Date(Date.now() + 86400000 * daysFromNow).toISOString().split('T')[0];
    setMaterialNeededDate(target);
    setUrgency(urg);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestMaterialTransfer({
      itemId,
      itemName: selectedItem?.name || 'Raw Material',
      category: selectedItem?.category || 'Cement & Aggregates',
      unit: selectedItem?.unit || 'Units',
      quantity: Number(quantity),
      fromLocation,
      toProjectId,
      toProjectName: selectedProj?.name || 'Site Yard',
      materialNeededDate,
      urgency,
      estimatedCost,
      notes: notes || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)]">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-main)]">Request Material Requisition</h3>
              <p className="text-xs text-[var(--text-muted)]">Requisition materials with needed date for Accounts & Admin clearance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Destination Project */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Destination Project Site *</label>
            <select
              value={toProjectId}
              onChange={e => setToProjectId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
              required
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
              ))}
            </select>
          </div>

          {/* Select Material */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Select Material (Cement, Steel, Aggregate, etc.) *</label>
            <select
              value={itemId}
              onChange={e => setItemId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
              required
            >
              {inventory.map(item => (
                <option key={item.id} value={item.id}>
                  [{item.category}] {item.name} — Current Depot Stock: {item.quantityInStock} {item.unit}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity & Units */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Quantity Needed *</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                  min={1}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] font-mono text-center font-bold"
                  required
                />
                <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">{selectedItem?.unit}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Estimated Requisition Cost (₹)</label>
              <div className="px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center justify-between">
                <span>₹{estimatedCost.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-[var(--text-muted)] font-sans">@ ₹{selectedItem?.unitPrice}/unit</span>
              </div>
            </div>
          </div>

          {/* Material Needed Date & Urgency */}
          <div className="p-3 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5 font-mono">
                <Calendar className="w-4 h-4 text-[var(--primary-accent)]" />
                <span>Target Material Needed Date *</span>
              </label>
              <span className="text-[10px] text-[var(--primary-accent-text)] font-mono font-bold">{urgency}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="date"
                  value={materialNeededDate}
                  onChange={e => setMaterialNeededDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] font-mono font-semibold"
                  required
                />
              </div>

              <div>
                <select
                  value={urgency}
                  onChange={e => setUrgency(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                >
                  <option value="Immediate / Emergency">Immediate / Emergency (Same Day)</option>
                  <option value="High (24-48 hrs)">High (24-48 hrs)</option>
                  <option value="Standard (3-5 days)">Standard (3-5 days)</option>
                  <option value="Scheduled">Scheduled Batch Pour</option>
                </select>
              </div>
            </div>

            {/* Quick date buttons */}
            <div className="flex items-center gap-2 pt-1 text-[11px] font-mono">
              <span className="text-[10px] text-[var(--text-subtle)]">Quick:</span>
              <button
                type="button"
                onClick={() => setQuickDate(1, 'Immediate / Emergency')}
                className="px-2 py-0.5 rounded bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)] text-[var(--text-main)]"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(3, 'High (24-48 hrs)')}
                className="px-2 py-0.5 rounded bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)] text-[var(--text-main)]"
              >
                In 3 Days
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(7, 'Standard (3-5 days)')}
                className="px-2 py-0.5 rounded bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)] text-[var(--text-main)]"
              >
                In 1 Week
              </button>
            </div>
          </div>

          {/* Source Dispatch Depot */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Source Central Depot *</label>
            <select
              value={fromLocation}
              onChange={e => setFromLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
            >
              <option value="Vadodara Central Depot (Makarpura GIDC)">Vadodara Central Depot (Makarpura GIDC)</option>
              <option value="Ahmedabad Regional Depot (S.G. Highway)">Ahmedabad Regional Depot (S.G. Highway)</option>
              <option value="Surat South Gujarat Stockyard (Ring Road)">Surat South Gujarat Stockyard (Ring Road)</option>
              <option value="Mumbai BKC Hub Depot">Mumbai BKC Hub Depot</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Engineering Justification & Site Pour Details</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Required for upcoming floor slab casting batch or column reinforcement cage fabrication..."
              rows={2}
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] placeholder:text-[var(--text-subtle)]"
            />
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-[11px] text-[var(--text-muted)] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              This requisition will be instantly routed to the <strong>Accounts & Finance Department</strong> for PO verification and to the <strong>Admin / Managing Director</strong> for dispatch clearance.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
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
              Submit Material Request
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
