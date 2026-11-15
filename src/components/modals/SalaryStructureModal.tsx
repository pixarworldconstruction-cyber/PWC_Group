import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Banknote, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Calculator, 
  IndianRupee, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { User, SalaryAllowance } from '../../types';
import { formatLakhsOrCrores } from '../../utils/formatters';

interface SalaryStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: User | null;
}

export const SalaryStructureModal: React.FC<SalaryStructureModalProps> = ({ isOpen, onClose, employee }) => {
  const { updateEmployeeAllowances, currentUser } = useApp();

  const [baseSalary, setBaseSalary] = useState<number>(50000);
  const [allowances, setAllowances] = useState<SalaryAllowance[]>([]);
  
  // New / Edit allowance inline form
  const [isAddingAllowance, setIsAddingAllowance] = useState(false);
  const [editingAllowanceId, setEditingAllowanceId] = useState<string | null>(null);
  const [allowanceName, setAllowanceName] = useState('');
  const [allowanceAmount, setAllowanceAmount] = useState<number>(5000);
  const [allowanceType, setAllowanceType] = useState<SalaryAllowance['type']>('Taxable');

  useEffect(() => {
    if (employee) {
      setBaseSalary(employee.salaryBase || 50000);
      const initialAllowances: SalaryAllowance[] = employee.allowances && employee.allowances.length > 0
        ? employee.allowances
        : [
            { id: 'DEF-01', name: 'House Rent Allowance (HRA)', amount: Math.round((employee.salaryBase || 50000) * 0.2), type: 'Taxable', frequency: 'Monthly' },
            { id: 'DEF-02', name: 'Site Hardship / Conveyance', amount: 6000, type: 'Non-Taxable', frequency: 'Monthly' },
            { id: 'DEF-03', name: 'Mobile & High-Speed Internet', amount: 2000, type: 'Non-Taxable', frequency: 'Monthly' }
          ];
      setAllowances(initialAllowances);
      setIsAddingAllowance(false);
      setEditingAllowanceId(null);
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  const totalAllowances = allowances.reduce((acc, a) => acc + (Number(a.amount) || 0), 0);
  const grossMonthlySalary = baseSalary + totalAllowances;
  
  // Statutory Indian Deductions (EPF, PT, TDS)
  const providentFund = Math.round(baseSalary * 0.06); // 6% EPF
  const professionalTax = 200; // Standard PT ₹200/mo
  const taxDeducted = Math.round(grossMonthlySalary > 50000 ? grossMonthlySalary * 0.05 : 0); // 5% TDS above 50k
  const totalDeductions = providentFund + professionalTax + taxDeducted;
  const netTakeHome = grossMonthlySalary - totalDeductions;
  const annualCtc = grossMonthlySalary * 12;

  const handleStartAddAllowance = () => {
    setIsAddingAllowance(true);
    setEditingAllowanceId(null);
    setAllowanceName('');
    setAllowanceAmount(5000);
    setAllowanceType('Taxable');
  };

  const handleStartEditAllowance = (alw: SalaryAllowance) => {
    setIsAddingAllowance(true);
    setEditingAllowanceId(alw.id);
    setAllowanceName(alw.name);
    setAllowanceAmount(alw.amount);
    setAllowanceType(alw.type || 'Taxable');
  };

  const handleSaveAllowance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allowanceName.trim() || allowanceAmount <= 0) return;

    if (editingAllowanceId) {
      setAllowances(prev => prev.map(a => a.id === editingAllowanceId ? {
        ...a,
        name: allowanceName.trim(),
        amount: Number(allowanceAmount),
        type: allowanceType
      } : a));
    } else {
      const newAlw: SalaryAllowance = {
        id: `ALW-${Date.now()}`,
        name: allowanceName.trim(),
        amount: Number(allowanceAmount),
        type: allowanceType,
        frequency: 'Monthly'
      };
      setAllowances(prev => [...prev, newAlw]);
    }

    setIsAddingAllowance(false);
    setEditingAllowanceId(null);
  };

  const handleDeleteAllowance = (alwId: string) => {
    setAllowances(prev => prev.filter(a => a.id !== alwId));
  };

  const handleSaveStructure = () => {
    updateEmployeeAllowances(employee.id, baseSalary, allowances);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                <span>Salary Calculation & Allowances Engine</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)] font-semibold border border-[var(--primary-accent-border)]">
                  {employee.id}
                </span>
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Employee: <b className="text-[var(--text-main)]">{employee.fullName}</b> · {employee.designation} ({employee.department})
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Base Salary Input */}
          <div className="p-4 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5 uppercase tracking-wider">
                <IndianRupee className="w-3.5 h-3.5 text-[var(--primary-accent)]" />
                <span>Base Monthly Salary (Basic Pay) *</span>
              </label>
              <span className="text-xs font-mono font-bold text-[var(--primary-accent-text)]">
                ₹{baseSalary.toLocaleString('en-IN')}/mo
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="5000"
                step="1000"
                value={baseSalary}
                onChange={e => setBaseSalary(Number(e.target.value))}
                placeholder="50000"
                className="flex-1 px-3 py-2 text-xs font-mono font-bold bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
              />
              <span className="text-[11px] text-[var(--text-muted)] font-mono">
                Annual Base: {formatLakhsOrCrores(baseSalary * 12)}
              </span>
            </div>
          </div>

          {/* ALLOWANCES SECTION (ADD / EDIT / DELETE) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
                  Allowance Breakdown ({allowances.length} Heads)
                </span>
                <span className="text-[11px] text-[var(--text-muted)] block">
                  Add, edit, or delete customized company allowances
                </span>
              </div>

              {!isAddingAllowance && (
                <button
                  type="button"
                  onClick={handleStartAddAllowance}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Allowance</span>
                </button>
              )}
            </div>

            {/* Inline Add / Edit Allowance Form */}
            {isAddingAllowance && (
              <form onSubmit={handleSaveAllowance} className="p-4 bg-[var(--primary-accent-bg)] border border-[var(--primary-accent-border)] rounded-xl space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-main)]">
                    {editingAllowanceId ? 'Edit Allowance' : 'Add New Allowance Head'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingAllowance(false)}
                    className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--text-main)] mb-1">
                      Allowance Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={allowanceName}
                      onChange={e => setAllowanceName(e.target.value)}
                      placeholder="e.g. Travel / Hardship Allowance"
                      className="w-full px-2.5 py-1.5 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--text-main)] mb-1">
                      Amount (₹/Month) *
                    </label>
                    <input
                      type="number"
                      required
                      min="100"
                      step="500"
                      value={allowanceAmount}
                      onChange={e => setAllowanceAmount(Number(e.target.value))}
                      placeholder="6000"
                      className="w-full px-2.5 py-1.5 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg font-mono text-[var(--text-main)] font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--text-main)] mb-1">
                      Tax Treatment
                    </label>
                    <select
                      value={allowanceType}
                      onChange={e => setAllowanceType(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
                    >
                      <option value="Taxable">Taxable Allowance</option>
                      <option value="Non-Taxable">Non-Taxable / Reimbursement</option>
                      <option value="Special">Special Site Allowance</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingAllowance(false)}
                    className="px-3 py-1 text-xs text-[var(--text-muted)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] rounded-lg shadow-xs"
                  >
                    {editingAllowanceId ? 'Update Allowance' : 'Save Allowance'}
                  </button>
                </div>
              </form>
            )}

            {/* Allowance List */}
            <div className="space-y-2">
              {allowances.map(alw => (
                <div
                  key={alw.id}
                  className="p-3 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div>
                      <div className="font-bold text-[var(--text-main)]">{alw.name}</div>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">
                        {alw.type || 'Taxable'} · Monthly
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      +₹{alw.amount.toLocaleString('en-IN')}/mo
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStartEditAllowance(alw)}
                        className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded"
                        title="Edit Allowance"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAllowance(alw.id)}
                        className="p-1 text-rose-500 hover:text-rose-600 rounded"
                        title="Delete Allowance"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DEDUCTIONS & SUMMARY SHEET */}
          <div className="p-4 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl space-y-3 font-mono">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-subtle)] block">
              Automated Statutory Deductions & Take-Home Preview
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
                <span className="text-[10px] text-[var(--text-muted)] block">GROSS MONTHLY</span>
                <span className="font-bold text-sm text-[var(--text-main)]">₹{grossMonthlySalary.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg">
                <span className="text-[10px] text-[var(--text-muted)] block">EPF + PT + TDS</span>
                <span className="font-bold text-sm text-rose-600 dark:text-rose-400">-₹{totalDeductions.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-2.5 bg-[var(--primary-accent-bg)] border border-[var(--primary-accent-border)] rounded-lg col-span-2">
                <span className="text-[10px] text-[var(--primary-accent-text)] block font-bold">NET MONTHLY TAKE-HOME</span>
                <span className="font-bold text-base text-[var(--primary-accent-text)]">₹{netTakeHome.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">Annual CTC: {formatLakhsOrCrores(annualCtc)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-[var(--text-muted)]">
            Changes apply to next month's automated payroll slip generation.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveStructure}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Salary Structure</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
