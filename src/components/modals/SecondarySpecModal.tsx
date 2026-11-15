import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Layers, 
  CheckCircle2, 
  IndianRupee, 
  Briefcase, 
  Calendar, 
  Phone, 
  User, 
  Home, 
  Sparkles 
} from 'lucide-react';
import { Inquiry, InquiryServiceType, PaymentPlanningMode, ArchitectPreference } from '../../types';
import { formatLakhsOrCrores } from '../../utils/formatters';

interface SecondarySpecModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: Inquiry | null;
}

export const SecondarySpecModal: React.FC<SecondarySpecModalProps> = ({ isOpen, onClose, inquiry }) => {
  const { updateInquiry, packages } = useApp();

  const [serviceType, setServiceType] = useState<InquiryServiceType>('Planning Civil Construction + Interior Design');
  const [alternateMobile, setAlternateMobile] = useState('');
  const [totalSqFtArea, setTotalSqFtArea] = useState<number>(3500);
  const [paymentMode, setPaymentMode] = useState<PaymentPlanningMode>('Loan');
  const [familyMembersCount, setFamilyMembersCount] = useState<number>(4);
  const [projectStartDate, setProjectStartDate] = useState('');
  const [projectDeadlineDate, setProjectDeadlineDate] = useState('');
  const [architectOption, setArchitectOption] = useState<ArchitectPreference>('Design with us');
  const [floorsCount, setFloorsCount] = useState('G+1 Floor');
  const [selectedPackageId, setSelectedPackageId] = useState(packages[0]?.id || '');

  useEffect(() => {
    if (inquiry) {
      setServiceType(inquiry.serviceType || 'Planning Civil Construction + Interior Design');
      setAlternateMobile(inquiry.alternateMobile || '');
      setTotalSqFtArea(inquiry.totalSqFtArea || 3500);
      setPaymentMode(inquiry.paymentMode || 'Loan');
      setFamilyMembersCount(inquiry.familyMembersCount || 4);
      setProjectStartDate(inquiry.projectStartDate || '');
      setProjectDeadlineDate(inquiry.projectDeadlineDate || '');
      setArchitectOption(inquiry.architectOption || 'Design with us');
      setFloorsCount(inquiry.floorsCount || 'G+1 Floor');
      setSelectedPackageId(inquiry.selectedPackageId || packages[0]?.id || '');
    }
  }, [inquiry, packages]);

  if (!isOpen || !inquiry) return null;

  const selectedPackage = packages.find(p => p.id === selectedPackageId);
  const calculatedCost = selectedPackage && totalSqFtArea ? selectedPackage.ratePerSqFt * totalSqFtArea : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateInquiry(inquiry.id, {
      hasDetailedSpec: true,
      serviceType,
      alternateMobile,
      totalSqFtArea: Number(totalSqFtArea),
      paymentMode,
      familyMembersCount: Number(familyMembersCount),
      projectStartDate: projectStartDate || undefined,
      projectDeadlineDate: projectDeadlineDate || undefined,
      architectOption,
      floorsCount,
      selectedPackageId,
      selectedPackageName: selectedPackage?.name,
      packageEstimatedCost: calculatedCost,
      // If still at New Inquiry, advance to Requirement Assessment
      stage: inquiry.stage === 'New Inquiry' ? 'Requirement Assessment' : inquiry.stage
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                <span>Detailed Project Planning (2nd Form)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                  {inquiry.inquiryNumber}
                </span>
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Customer: <span className="text-[var(--text-main)] font-semibold">{inquiry.customerName}</span> · Budget: <span className="font-mono text-[var(--primary-accent-text)] font-semibold">{formatLakhsOrCrores(inquiry.budget)}</span>
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Quick Primary Context Banner */}
          <div className="p-3 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
              <span>Primary Phone: <b className="text-[var(--text-main)]">{inquiry.contactNumber}</b></span>
              <span>Inquiry Date: <b className="text-[var(--text-main)]">{inquiry.firstInquiryDate}</b></span>
            </div>
            <div className="text-[11px] text-[var(--text-muted)] truncate">
              Site Address: <span className="text-[var(--text-main)]">{inquiry.siteAddress}</span>
            </div>
          </div>

          {/* 1. Service Type */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">
              Select Service Offering *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                'Planning Civil Construction + Interior Design',
                'Only Construction Service',
                'Only Interior Design'
              ].map(srv => (
                <button
                  type="button"
                  key={srv}
                  onClick={() => setServiceType(srv as InquiryServiceType)}
                  className={`p-2.5 text-xs font-semibold rounded-xl border text-left transition-all ${
                    serviceType === srv
                      ? 'bg-[var(--primary-accent)] text-slate-950 border-[var(--primary-accent)] shadow-xs font-bold'
                      : 'bg-[var(--bg-surface-subtle)] text-[var(--text-main)] border-[var(--border-subtle)] hover:bg-[var(--bg-surface)]'
                  }`}
                >
                  {srv}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Alternate Mobile & Total Sqft */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                Alternate Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-2.5" />
                <input
                  type="tel"
                  value={alternateMobile}
                  onChange={e => setAlternateMobile(e.target.value)}
                  placeholder="+91 98250 99881"
                  className="w-full pl-8 pr-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                Total Sqft Area / Plinth Area Plan *
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="100"
                  step="50"
                  value={totalSqFtArea}
                  onChange={e => setTotalSqFtArea(Number(e.target.value))}
                  placeholder="3500"
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono font-semibold focus:outline-none focus:border-[var(--primary-accent)]"
                />
                <span className="absolute right-3 top-2 text-xs text-[var(--text-muted)] font-mono">
                  Sq.Ft
                </span>
              </div>
            </div>
          </div>

          {/* 3. Payment Mode & Family Members */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">
                Payment Planning Mode *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Loan', 'Self Funded'] as PaymentPlanningMode[]).map(mode => (
                  <button
                    type="button"
                    key={mode}
                    onClick={() => setPaymentMode(mode)}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                      paymentMode === mode
                        ? 'bg-[var(--primary-accent)] text-slate-950 border-[var(--primary-accent)] font-bold'
                        : 'bg-[var(--bg-surface-subtle)] text-[var(--text-main)] border-[var(--border-subtle)]'
                    }`}
                  >
                    {mode === 'Loan' ? '🏦 Bank Loan' : '💼 Self Funded'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                Number of Family Members
              </label>
              <input
                type="number"
                min="1"
                max="25"
                value={familyMembersCount}
                onChange={e => setFamilyMembersCount(Number(e.target.value))}
                placeholder="4"
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--primary-accent)]"
              />
            </div>
          </div>

          {/* 4. Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>Project Starting Date</span>
              </label>
              <input
                type="date"
                value={projectStartDate}
                onChange={e => setProjectStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>Project Target Deadline Date</span>
              </label>
              <input
                type="date"
                value={projectDeadlineDate}
                onChange={e => setProjectDeadlineDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
              />
            </div>
          </div>

          {/* 5. Architect Option & Floors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">
                Architect Option *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Design with us', 'Have architect by own'] as ArchitectPreference[]).map(opt => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setArchitectOption(opt)}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                      architectOption === opt
                        ? 'bg-[var(--primary-accent)] text-slate-950 border-[var(--primary-accent)] font-bold'
                        : 'bg-[var(--bg-surface-subtle)] text-[var(--text-main)] border-[var(--border-subtle)]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                How Many Floors? *
              </label>
              <select
                value={floorsCount}
                onChange={e => setFloorsCount(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-semibold focus:outline-none focus:border-[var(--primary-accent)]"
              >
                <option value="Ground Floor Only">Ground Floor Only</option>
                <option value="G+1 Floor">G+1 (Ground + 1 Floor)</option>
                <option value="G+2 Floors">G+2 (Ground + 2 Floors)</option>
                <option value="G+3 Floors">G+3 (Ground + 3 Floors)</option>
                <option value="G+4+ High Rise">G+4+ High Rise Tower</option>
                <option value="Basement + G+2">Basement + G+2</option>
              </select>
            </div>
          </div>

          {/* 6. Packages Selection */}
          <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[var(--primary-accent)]" />
                <span>Select Packages (Admin Managed)</span>
              </label>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">
                {packages.length} Packages Available
              </span>
            </div>

            <div className="space-y-2">
              {packages.filter(p => p.isActive).map(pkg => {
                const isSelected = selectedPackageId === pkg.id;
                const pkgCost = totalSqFtArea * pkg.ratePerSqFt;

                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[var(--primary-accent-bg)] border-[var(--primary-accent)] shadow-xs'
                        : 'bg-[var(--bg-surface-subtle)] border-[var(--border-subtle)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="sec_pkg"
                          checked={isSelected}
                          onChange={() => setSelectedPackageId(pkg.id)}
                          className="text-[var(--primary-accent)]"
                        />
                        <div>
                          <span className="text-xs font-bold text-[var(--text-main)]">{pkg.name}</span>
                          <span className="text-[10px] text-[var(--text-muted)] ml-2">({pkg.serviceType})</span>
                        </div>
                      </div>

                      <div className="text-right font-mono text-xs">
                        <span className="font-bold text-[var(--primary-accent-text)]">₹{pkg.ratePerSqFt.toLocaleString('en-IN')}/sqft</span>
                        <span className="text-[10px] text-[var(--text-muted)] ml-2">
                          ≈ {formatLakhsOrCrores(pkgCost)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Update Detailed Planning Specs (2nd Form)</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
