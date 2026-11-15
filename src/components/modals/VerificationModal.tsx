import React, { useState } from 'react';
import { X, ShieldCheck, FileCheck, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VerificationDocType, EmployeeVerification } from '../../types';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: EmployeeVerification | null;
  defaultEmployeeId?: string;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  initialData,
  defaultEmployeeId,
}) => {
  const { users, currentUser, addVerificationDoc, updateVerificationStatus, canUserViewAllStaff } = useApp();
  const canViewAll = canUserViewAllStaff ? canUserViewAllStaff(currentUser) : currentUser?.role === 'ADMIN';
  const selectableUsers = canViewAll ? users : users.filter(u => u.id === currentUser?.id);

  const [employeeId, setEmployeeId] = useState(
    initialData?.employeeId || defaultEmployeeId || (selectableUsers[0]?.id ?? currentUser?.id ?? '')
  );
  const [docType, setDocType] = useState<VerificationDocType>(
    initialData?.docType || 'Aadhaar Card'
  );
  const [docNumber, setDocNumber] = useState(initialData?.docNumber || '');
  const [issuedBy, setIssuedBy] = useState(initialData?.issuedBy || '');
  const [status, setStatus] = useState<'Verified' | 'Pending Verification' | 'Rejected'>(
    initialData?.status || 'Pending Verification'
  );
  const [remarks, setRemarks] = useState(initialData?.remarks || '');
  const [documentFileUrl, setDocumentFileUrl] = useState(initialData?.documentFileUrl || '');

  if (!isOpen) return null;

  const docTypeOptions: { value: VerificationDocType; label: string; placeholder: string; helper: string }[] = [
    { value: 'Aadhaar Card', label: 'Aadhaar Card (UIDAI)', placeholder: 'e.g. 4521 8901 2345', helper: '12-digit UID number' },
    { value: 'PAN Card', label: 'PAN Card (Income Tax Dept)', placeholder: 'e.g. ABCDE1234F', helper: '10-character alphanumeric PAN' },
    { value: 'Driving License', label: 'Driving License (RTO)', placeholder: 'e.g. GJ-06-2020-0019283', helper: 'State RTO issued license' },
    { value: 'Degree / Educational Certificate', label: 'Educational Degree / Diploma', placeholder: 'e.g. B.E. Civil - MSU Baroda - Roll 2018-092', helper: 'Highest professional/technical qualification' },
    { value: 'Employee ID Card', label: 'Company Employee ID Card', placeholder: 'e.g. EMP-VAD-004', helper: 'Official company badge / code' },
    { value: 'Police Verification', label: 'Police Verification Clearance', placeholder: 'e.g. POL/VAD/2023/8892', helper: 'Local police verification report number' },
  ];

  const currentOption = docTypeOptions.find((o) => o.value === docType) || docTypeOptions[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = users.find((u) => u.id === employeeId);
    if (!emp) return;

    if (initialData) {
      updateVerificationStatus(initialData.id, status, remarks);
    } else {
      addVerificationDoc({
        employeeId: emp.id,
        employeeName: emp.fullName,
        docType,
        docNumber,
        status,
        issuedBy: issuedBy || 'Government of India',
        documentFileUrl: documentFileUrl || `https://docs.local/kyc/${docType.toLowerCase().replace(/\s+/g, '_')}_${emp.id}.pdf`,
        remarks: remarks || undefined,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {initialData ? 'Update KYC Verification' : 'Add Employee Verification'}
              </h3>
              <p className="text-xs text-emerald-100">
                Aadhaar, PAN, DL, Educational Degree & ID Records
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-sm">
          {/* Employee Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Employee Name & Designation
            </label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              disabled={!!initialData}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white disabled:bg-slate-100 disabled:text-slate-500 font-medium"
            >
              {selectableUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} — ({u.role.replace('_', ' ').toUpperCase()} / {u.department || 'Operations'})
                </option>
              ))}
            </select>
          </div>

          {/* Document Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Verification Document Category
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as VerificationDocType)}
              disabled={!!initialData}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white disabled:bg-slate-100 font-medium"
            >
              {docTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">{currentOption.helper}</p>
          </div>

          {/* Document Identification Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Document Number / Registration ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              placeholder={currentOption.placeholder}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono tracking-wide"
            />
          </div>

          {/* Issuing Authority */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Issuing Authority
            </label>
            <input
              type="text"
              value={issuedBy}
              onChange={(e) => setIssuedBy(e.target.value)}
              placeholder="e.g. UIDAI / Income Tax Dept / RTO Gujarat"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs"
            />
          </div>

          {/* Document Attachment Mock */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Document File / Reference Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={documentFileUrl}
                onChange={(e) => setDocumentFileUrl(e.target.value)}
                placeholder="https://drive.google.com/... or /docs/aadhaar_scan.pdf"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setDocumentFileUrl(`/vault/kyc_${docType.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-200 cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5" />
                Attach
              </button>
            </div>
          </div>

          {/* Verification Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Compliance Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('Pending Verification')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  status === 'Pending Verification'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Pending
              </button>
              <button
                type="button"
                onClick={() => setStatus('Verified')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  status === 'Verified'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </button>
              <button
                type="button"
                onClick={() => setStatus('Rejected')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  status === 'Rejected'
                    ? 'bg-rose-600 text-white border-rose-700 shadow-sm'
                    : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                }`}
              >
                <X className="w-3.5 h-3.5" />
                Rejected
              </button>
            </div>
          </div>

          {/* Audit Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Verification / Audit Remarks
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Cross-verified with physical original copy / biometric Aadhaar authenticated."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              {initialData ? 'Save Verification Status' : 'Save KYC Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
