import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Briefcase, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  ShieldAlert, 
  IndianRupee, 
  Layers,
  Calculator,
  Lock
} from 'lucide-react';
import { ConstructionPackage, InquiryServiceType } from '../../types';
import { formatLakhsOrCrores } from '../../utils/formatters';

interface PackageManageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PackageManageModal: React.FC<PackageManageModalProps> = ({ isOpen, onClose }) => {
  const { packages, addPackage, updatePackage, deletePackage, currentUser } = useApp();

  const isAdmin = currentUser?.role === 'ADMIN';

  // Calculator helper
  const [calcSqFt, setCalcSqFt] = useState<number>(3500);

  // Edit / Add state
  const [isEditing, setIsEditing] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [serviceType, setServiceType] = useState<InquiryServiceType>('Planning Civil Construction + Interior Design');
  const [ratePerSqFt, setRatePerSqFt] = useState<number>(2200);
  const [description, setDescription] = useState('');
  const [inclusionsText, setInclusionsText] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const startCreate = () => {
    setIsEditing(true);
    setEditingPackageId(null);
    setName('');
    setServiceType('Planning Civil Construction + Interior Design');
    setRatePerSqFt(2200);
    setDescription('');
    setInclusionsText('');
    setFormError(null);
  };

  const startEdit = (pkg: ConstructionPackage) => {
    setIsEditing(true);
    setEditingPackageId(pkg.id);
    setName(pkg.name);
    setServiceType(pkg.serviceType);
    setRatePerSqFt(pkg.ratePerSqFt);
    setDescription(pkg.description);
    setInclusionsText(pkg.inclusions.join('\n'));
    setFormError(null);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingPackageId(null);
    setFormError(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setFormError('Access Denied: Only Admin can add or edit construction packages.');
      return;
    }

    if (!name.trim() || !ratePerSqFt) {
      setFormError('Please enter valid package name and rate per sqft.');
      return;
    }

    const inclusions = inclusionsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingPackageId) {
      const res = updatePackage(editingPackageId, {
        name: name.trim(),
        serviceType,
        ratePerSqFt: Number(ratePerSqFt),
        description: description.trim(),
        inclusions,
        isActive: true
      });
      if (!res.success) {
        setFormError(res.message || 'Failed to update package');
        return;
      }
    } else {
      const res = addPackage({
        name: name.trim(),
        serviceType,
        ratePerSqFt: Number(ratePerSqFt),
        description: description.trim(),
        inclusions,
        isActive: true
      });
      if (!res.success) {
        setFormError(res.message || 'Failed to add package');
        return;
      }
    }

    cancelEdit();
  };

  const handleDelete = (pkgId: string, pkgName: string) => {
    if (!isAdmin) {
      alert('Access Denied: Only Admin can delete packages.');
      return;
    }
    if (confirm(`Are you sure you want to delete package "${pkgName}"?`)) {
      deletePackage(pkgId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/15 text-[var(--primary-accent-text)] border border-[var(--primary-accent-border)]">
              <Briefcase className="w-5 h-5 text-[var(--primary-accent)]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                <span>Construction & Turnkey Packages</span>
                {isAdmin ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                    Admin Governance Active
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> View Only (Admin Managed)
                  </span>
                )}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Manage rates per sqft, inclusions, and turnkey specifications
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Quick Client Cost Calculator tool */}
          <div className="p-4 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-[var(--primary-accent)]" />
                <span>Instant Client Quotation Estimator</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-muted)] font-mono">Total Built-Up Area:</span>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={calcSqFt}
                  onChange={e => setCalcSqFt(Number(e.target.value))}
                  className="w-24 px-2 py-1 text-xs font-mono font-bold bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-md text-[var(--text-main)] text-right"
                />
                <span className="text-xs text-[var(--text-muted)] font-mono">Sq.Ft</span>
              </div>
            </div>
          </div>

          {/* ADMIN ADD/EDIT FORM (WHEN ACTIVE) */}
          {isEditing && (
            <form onSubmit={handleSave} className="p-5 bg-[var(--primary-accent-bg)] border border-[var(--primary-accent-border)] rounded-2xl space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                <h3 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">
                  {editingPackageId ? 'Edit Construction Package' : 'Add New Construction Package (Admin Only)'}
                </h3>
                <span className="text-[10px] text-[var(--primary-accent-text)] font-mono font-bold">
                  Admin Privileged Action
                </span>
              </div>

              {formError && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    Package Title / Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Ultra Luxury Living Turnkey"
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    Rate per Sq.Ft (in ₹) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="100"
                      step="50"
                      value={ratePerSqFt}
                      onChange={e => setRatePerSqFt(Number(e.target.value))}
                      placeholder="2450"
                      className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono font-bold focus:outline-none focus:border-[var(--primary-accent)]"
                    />
                    <span className="absolute right-3 top-2 text-xs text-[var(--text-muted)] font-mono">
                      / Sq.Ft
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Service Category *
                </label>
                <select
                  value={serviceType}
                  onChange={e => setServiceType(e.target.value as InquiryServiceType)}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-semibold focus:outline-none focus:border-[var(--primary-accent)]"
                >
                  <option value="Planning Civil Construction + Interior Design">Planning Civil Construction + Interior Design</option>
                  <option value="Only Construction Service">Only Construction Service</option>
                  <option value="Only Interior Design">Only Interior Design</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Package Summary Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Short marketing summary of what is covered in this package..."
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Key Inclusions & Specifications (One per line)
                </label>
                <textarea
                  rows={4}
                  value={inclusionsText}
                  onChange={e => setInclusionsText(e.target.value)}
                  placeholder="Fe-550D TMT & UltraTech 53 grade cement&#10;Italian marble in living room&#10;Modular kitchen with Hafele fittings&#10;10-year structural warranty"
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono leading-relaxed focus:outline-none focus:border-[var(--primary-accent)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg shadow-xs"
                >
                  {editingPackageId ? 'Update Package' : 'Save New Package'}
                </button>
              </div>
            </form>
          )}

          {/* PACKAGE LIST HEADER */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
              Configured Packages ({packages.length})
            </span>

            {isAdmin && !isEditing && (
              <button
                type="button"
                onClick={startCreate}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg shadow-xs cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Package</span>
              </button>
            )}
          </div>

          {/* PACKAGE CARDS */}
          <div className="space-y-3">
            {packages.map(pkg => {
              const estimatedTotal = calcSqFt * pkg.ratePerSqFt;

              return (
                <div
                  key={pkg.id}
                  className="p-4 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-2xl hover:border-[var(--border-strong)] transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[var(--primary-accent-text)] bg-[var(--primary-accent-bg)] px-2 py-0.5 rounded border border-[var(--primary-accent-border)]">
                          {pkg.id}
                        </span>
                        <h4 className="text-sm font-bold text-[var(--text-main)]">{pkg.name}</h4>
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)]">{pkg.serviceType}</div>
                      <p className="text-xs text-[var(--text-main)] leading-relaxed max-w-xl">
                        {pkg.description}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 font-mono shrink-0">
                      <div className="text-sm font-bold text-[var(--primary-accent-text)]">
                        ₹{pkg.ratePerSqFt.toLocaleString('en-IN')}/sqft
                      </div>
                      {calcSqFt > 0 && (
                        <div className="text-[11px] text-[var(--text-muted)] font-semibold">
                          For {calcSqFt} sqft: <span className="text-[var(--text-main)] font-bold">{formatLakhsOrCrores(estimatedTotal)}</span>
                        </div>
                      )}

                      {/* Admin edit & delete controls */}
                      {isAdmin && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <button
                            type="button"
                            onClick={() => startEdit(pkg)}
                            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] rounded-md transition-colors"
                            title="Edit Package"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(pkg.id, pkg.name)}
                            className="p-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-md transition-colors"
                            title="Delete Package"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Inclusions checklist */}
                  {pkg.inclusions && pkg.inclusions.length > 0 && (
                    <div className="pt-3 border-t border-[var(--border-subtle)]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">
                        Inclusions & Specifications
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[var(--text-main)]">
                        {pkg.inclusions.map((inc, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-[11px]">{inc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!isAdmin && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0" />
              <span>
                Package rates and inclusions are regulated centrally by P W Construction Admin. Marketing representatives can reference these rates for preparing client quotes.
              </span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[var(--text-main)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg hover:bg-[var(--bg-surface-subtle)] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
