import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UserPlus, KeyRound, Copy, Check, ShieldCheck } from 'lucide-react';
import { UserRole } from '../../types';

export const NewEmployeeModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { branches, projects, addEmployee } = useApp();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('SITE_ENGINEER');
  const [branchId, setBranchId] = useState(branches[0]?.id || 'BR-01');
  const [department, setDepartment] = useState('Civil Field Operations');
  const [designation, setDesignation] = useState('Assistant Project Engineer');
  const [salaryBase, setSalaryBase] = useState(65000);
  const [assignedProjectIds, setAssignedProjectIds] = useState<string[]>([projects[0]?.id || 'PRJ-01']);
  
  // Marketing target fields
  const [salesTarget, setSalesTarget] = useState(5000000); // 50 Lakhs
  const [targetCommissionRate, setTargetCommissionRate] = useState(4.0); // 4%

  // Created credential banner state
  const [createdResult, setCreatedResult] = useState<{ tempPassword: string; user: any } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = addEmployee({
      fullName,
      username: username.toLowerCase().trim() || fullName.toLowerCase().replace(/\s+/g, '_'),
      email,
      phone,
      role,
      branchId,
      department,
      designation,
      salaryBase: Number(salaryBase),
      assignedProjectIds,
      salesTarget: role === 'MARKETING' ? Number(salesTarget) : undefined,
      targetCommissionRate: role === 'MARKETING' ? Number(targetCommissionRate) : undefined,
    });
    setCreatedResult(result);
  };

  const copyCredentials = () => {
    if (!createdResult) return;
    const text = `P W Construction Portal Login:\nUser ID: ${createdResult.user.username}\nTemporary Password: ${createdResult.tempPassword}\nRole: ${createdResult.user.role}\n(Please reset your password upon first login)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setCreatedResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-main)]">Create Employee Account & Credentials</h3>
              <p className="text-xs text-[var(--text-muted)]">Generate ID with temporary password for first login</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {createdResult ? (
          /* Result Screen showing Generated Temporary Password */
          <div className="p-6 space-y-5 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-[var(--text-main)]">Employee Account Provisioned</h4>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                A secure temporary password has been assigned. The employee will be required to choose a new permanent password on first login.
              </p>
            </div>

            <div className="bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl p-4 text-left font-mono space-y-2 max-w-md mx-auto shadow-inner">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-muted)]">Full Name:</span>
                <span className="text-[var(--text-main)] font-bold">{createdResult.user.fullName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-muted)]">Login User ID:</span>
                <span className="text-[var(--primary-accent-text)] font-bold">{createdResult.user.username}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-muted)]">Assigned Role:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{createdResult.user.role}</span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Temporary Password:</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold text-sm tracking-wider">{createdResult.tempPassword}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={copyCredentials}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-subtle)] text-[var(--text-main)] border border-[var(--border-subtle)] rounded-lg transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied to Clipboard' : 'Copy Credentials'}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2 text-xs font-semibold bg-[var(--primary-accent)] hover:opacity-90 text-slate-950 rounded-lg transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Input Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => {
                    setFullName(e.target.value);
                    if (!username) {
                      setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                    }
                  }}
                  placeholder="e.g. Vikramaditya Solanki"
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Login User ID (Unique) *</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="e.g. vikram_site or engineer2"
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. vikram@pwconstruction.com"
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Phone Number *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Assigned Role *</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] font-medium"
                >
                  <option value="SITE_ENGINEER">Site Engineer</option>
                  <option value="MARKETING">Marketing & Business Dev</option>
                  <option value="DESIGNER">Architect / Designer</option>
                  <option value="EMPLOYEE">Field Labor / HR Staff</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Operating Branch *</label>
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
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Base Monthly Salary (₹) *</label>
                <input
                  type="number"
                  value={salaryBase}
                  onChange={e => setSalaryBase(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] font-mono"
                  step={1000}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  placeholder="e.g. Civil Field Ops, BIM, Sales"
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Job Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={e => setDesignation(e.target.value)}
                  placeholder="e.g. Senior Project Engineer"
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                />
              </div>
            </div>

            {/* If Marketing Role: Target & Commission Setting */}
            {role === 'MARKETING' && (
              <div className="bg-[var(--primary-accent-bg)] border border-[var(--primary-accent-border)] rounded-xl p-4 space-y-3">
                <div className="text-xs font-bold text-[var(--primary-accent-text)] uppercase tracking-wider">
                  Marketing Performance Target & Commission Setup
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-main)] mb-1">Monthly Booking Target (₹)</label>
                    <input
                      type="number"
                      value={salesTarget}
                      onChange={e => setSalesTarget(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded text-[var(--text-main)] font-mono"
                      step={100000}
                    />
                    <span className="text-[10px] text-[var(--text-muted)]">e.g. ₹50,00,000 (50 Lakhs)</span>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-main)] mb-1">Target Base Commission Rate (%)</label>
                    <input
                      type="number"
                      value={targetCommissionRate}
                      onChange={e => setTargetCommissionRate(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded text-[var(--text-main)] font-mono"
                      step={0.25}
                    />
                    <span className="text-[10px] text-[var(--text-muted)]">e.g. 4.0% of closed contract value</span>
                  </div>
                </div>
              </div>
            )}

            <div className="p-3 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[var(--primary-accent-text)] shrink-0" />
              <span>A temporary password will be automatically generated upon creation.</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-subtle)] rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg transition-colors shadow-md cursor-pointer"
              >
                Create Account & Generate Password
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
