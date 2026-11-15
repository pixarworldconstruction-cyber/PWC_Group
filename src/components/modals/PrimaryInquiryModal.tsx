import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Users, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  Home, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  Building,
  Layers,
  IndianRupee,
  Briefcase
} from 'lucide-react';
import { InquiryServiceType, PaymentPlanningMode, ArchitectPreference } from '../../types';
import { formatLakhsOrCrores } from '../../utils/formatters';

interface PrimaryInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (inquiryId: string) => void;
}

export const PrimaryInquiryModal: React.FC<PrimaryInquiryModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { addInquiry, branches, activeBranchId, packages } = useApp();

  // 1st Primary Form Fields
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [firstInquiryDate, setFirstInquiryDate] = useState(new Date().toISOString().split('T')[0]);
  const [budgetLakhs, setBudgetLakhs] = useState<number>(75); // In Lakhs for easy input
  const [siteAddress, setSiteAddress] = useState('');
  const [residentAddress, setResidentAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [branchId, setBranchId] = useState(activeBranchId === 'ALL' ? (branches[0]?.id || 'BR-01') : activeBranchId);

  // Toggle for 2nd Secondary Form
  const [includeSecondarySpec, setIncludeSecondarySpec] = useState(false);

  // 2nd Secondary Form Fields
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

  if (!isOpen) return null;

  // Selected package details & calculated cost
  const selectedPackage = packages.find(p => p.id === selectedPackageId);
  const calculatedCost = selectedPackage && totalSqFtArea ? selectedPackage.ratePerSqFt * totalSqFtArea : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const budgetInRupees = Number(budgetLakhs) * 100000;

    const newInq = addInquiry({
      customerName,
      contactNumber,
      email,
      firstInquiryDate,
      budget: budgetInRupees,
      siteAddress,
      residentAddress: residentAddress || siteAddress,
      notes,
      branchId,
      hasDetailedSpec: includeSecondarySpec,
      ...(includeSecondarySpec ? {
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
        stage: 'Requirement Assessment'
      } : {
        stage: 'New Inquiry'
      })
    });

    if (onSuccess) {
      onSuccess(newInq.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/15 text-[var(--primary-accent-text)] border border-[var(--primary-accent-border)]">
              <Users className="w-5 h-5 text-[var(--primary-accent)]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                <span>Capture New Client Inquiry</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)] font-semibold border border-[var(--primary-accent-border)]">
                  1st Primary Form
                </span>
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Marketing CRM lead acquisition & client project intake
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* SECTION 1: PRIMARY INQUIRY FORM */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--primary-accent-text)] flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Primary Customer & Site Information (Form 1)</span>
              </h3>
              <span className="text-[11px] text-[var(--text-muted)]">* Mandatory fields</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Mr. Rajesh Agrawal"
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Contact Number *
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={contactNumber}
                    onChange={e => setContactNumber(e.target.value)}
                    placeholder="+91 98250 12345"
                    className="w-full pl-8 pr-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Email ID
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="client@gmail.com"
                    className="w-full pl-8 pr-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  First Inquiry Date *
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-2.5" />
                  <input
                    type="date"
                    required
                    value={firstInquiryDate}
                    onChange={e => setFirstInquiryDate(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Target Branch *
                </label>
                <div className="relative">
                  <Building className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-2.5" />
                  <select
                    value={branchId}
                    onChange={e => setBranchId(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Budget input with Lakhs / Cr converter */}
            <div className="p-3.5 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-[var(--primary-accent)]" />
                  <span>Estimated Client Budget (in ₹ Lakhs) *</span>
                </label>
                <span className="text-xs font-mono font-bold text-[var(--primary-accent-text)] bg-[var(--primary-accent-bg)] px-2.5 py-0.5 rounded-full border border-[var(--primary-accent-border)]">
                  Formatted: {formatLakhsOrCrores(budgetLakhs * 100000)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  required
                  value={budgetLakhs}
                  onChange={e => setBudgetLakhs(Number(e.target.value))}
                  placeholder="e.g. 75 (for ₹75 Lakhs) or 150 (for ₹1.5 Cr)"
                  className="flex-1 px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono font-semibold focus:outline-none focus:border-[var(--primary-accent)]"
                />
                <div className="text-[11px] text-[var(--text-muted)]">
                  {budgetLakhs >= 100 ? `₹${(budgetLakhs / 100).toFixed(2)} Crores` : `₹${budgetLakhs} Lakhs`}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Site Address (Proposed Construction Location) *</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={siteAddress}
                  onChange={e => setSiteAddress(e.target.value)}
                  placeholder="e.g. Plot No 48, Near Billabong School, Gotri-Sevasi Road, Vadodara"
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-blue-500" />
                  <span>Resident Address (Current Residence)</span>
                </label>
                <textarea
                  rows={2}
                  value={residentAddress}
                  onChange={e => setResidentAddress(e.target.value)}
                  placeholder="e.g. Flat 301, Alkapuri Heights, Vadodara 390007 (Leave blank if same as site)"
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                Inquiry Notes & Initial Remarks
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Mention customer preferences, initial interaction summary, special architecture requests..."
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
              />
            </div>
          </div>

          {/* TOGGLE TO INCLUDE 2ND SECONDARY FORM SPECIFICATIONS */}
          <div className="p-4 bg-[var(--primary-accent-bg)] border border-[var(--primary-accent-border)] rounded-2xl flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--primary-accent)]" />
                <span className="text-xs font-bold text-[var(--text-main)]">
                  Add 2nd Secondary Form (Detailed Project Planning Specs)
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Service type, alternate mobile, plinth area, loan mode, family size, dates, architect, floors & package selection.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeSecondarySpec}
                onChange={e => setIncludeSecondarySpec(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-400/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-accent)]"></div>
            </label>
          </div>

          {/* SECTION 2: SECONDARY SPECIFICATIONS FORM (IF TOGGLED) */}
          {includeSecondarySpec && (
            <div className="space-y-4 p-5 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-2xl animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--primary-accent-text)] flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>2nd Form: Detailed Planning & Construction Specifications</span>
                </h3>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  Stage 2 Assessment
                </span>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">
                  Required Service Scope *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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
                          : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-subtle)] hover:bg-[var(--bg-surface-subtle)]'
                      }`}
                    >
                      {srv}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alternate Mobile & Total Sqft Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    Alternate Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={alternateMobile}
                    onChange={e => setAlternateMobile(e.target.value)}
                    placeholder="e.g. +91 98250 99881 (Spouse / Partner)"
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    Total Sq.ft Area / Plinth Area Plan *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="100"
                      step="50"
                      value={totalSqFtArea}
                      onChange={e => setTotalSqFtArea(Number(e.target.value))}
                      placeholder="e.g. 3500"
                      className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono font-semibold focus:outline-none focus:border-[var(--primary-accent)]"
                    />
                    <span className="absolute right-3 top-2 text-xs text-[var(--text-muted)] font-mono">
                      Sq.Ft
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Planning Mode & Family Members */}
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
                            : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-subtle)]'
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
                    max="30"
                    value={familyMembersCount}
                    onChange={e => setFamilyMembersCount(Number(e.target.value))}
                    placeholder="e.g. 4"
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--primary-accent)]"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    Project Starting Date
                  </label>
                  <input
                    type="date"
                    value={projectStartDate}
                    onChange={e => setProjectStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    Project Target Deadline Date
                  </label>
                  <input
                    type="date"
                    value={projectDeadlineDate}
                    onChange={e => setProjectDeadlineDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                  />
                </div>
              </div>

              {/* Architect Option & Floors */}
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
                        className={`py-2 px-2.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                          architectOption === opt
                            ? 'bg-[var(--primary-accent)] text-slate-950 border-[var(--primary-accent)] font-bold'
                            : 'bg-[var(--bg-surface)] text-[var(--text-main)] border-[var(--border-subtle)]'
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
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-semibold focus:outline-none focus:border-[var(--primary-accent)]"
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

              {/* Packages Selection (Configured by Admin) */}
              <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[var(--primary-accent)]" />
                    <span>Select Construction Package (Admin Managed)</span>
                  </label>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    Packages editable by Admin only
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {packages.filter(p => p.isActive).map(pkg => {
                    const isSelected = selectedPackageId === pkg.id;
                    const pkgCost = totalSqFtArea * pkg.ratePerSqFt;

                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[var(--primary-accent-bg)] border-[var(--primary-accent)] shadow-2xs'
                            : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="package_selection"
                              checked={isSelected}
                              onChange={() => setSelectedPackageId(pkg.id)}
                              className="text-[var(--primary-accent)]"
                            />
                            <div>
                              <div className="text-xs font-bold text-[var(--text-main)]">{pkg.name}</div>
                              <div className="text-[10px] text-[var(--text-muted)]">{pkg.serviceType}</div>
                            </div>
                          </div>

                          <div className="text-right sm:text-right font-mono">
                            <span className="text-xs font-bold text-[var(--primary-accent-text)]">
                              ₹{pkg.ratePerSqFt.toLocaleString('en-IN')}/sqft
                            </span>
                            {totalSqFtArea > 0 && (
                              <div className="text-[10px] text-[var(--text-muted)] font-semibold">
                                Total: {formatLakhsOrCrores(pkgCost)}
                              </div>
                            )}
                          </div>
                        </div>

                        {isSelected && pkg.inclusions && pkg.inclusions.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] grid grid-cols-1 sm:grid-cols-2 gap-1">
                            {pkg.inclusions.slice(0, 4).map((inc, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 truncate">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                                <span className="truncate">{inc}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface-subtle)] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{includeSecondarySpec ? 'Submit Inquiry & Detailed Spec' : 'Save 1st Primary Inquiry'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
