import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  UserPlus, 
  Users, 
  Settings, 
  KeyRound, 
  Layers, 
  Target, 
  Plus, 
  Check, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  TrendingUp,
  AlertCircle,
  Edit3,
  AlertTriangle,
  X,
  Save,
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  Banknote,
  Clock,
  BarChart3,
  FolderArchive,
  CalendarClock,
  Calculator
} from 'lucide-react';
import { NewEmployeeModal } from '../modals/NewEmployeeModal';
import { UserRole, ModuleKey, User, HrSubSection } from '../../types';

export const AdminConsoleView: React.FC = () => {
  const { 
    users, 
    rolePermissions, 
    updatePermission, 
    updateHrSubPermission,
    updateRoleStaffScope,
    updateRoleFinancialsScope,
    canUserViewFinancials,
    canUserViewAllStaff,
    modules, 
    toggleModule, 
    addCustomModule, 
    updateMarketingTarget, 
    branches,
    currentUser,
    updateEmployee,
    deleteEmployee
  } = useApp();

  const [activeTab, setActiveTab] = useState<'employees' | 'permissions' | 'targets' | 'modules'>('employees');
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('SITE_ENGINEER');

  // Employee Edit & Delete states
  const [editingEmployee, setEditingEmployee] = useState<User | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<User | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'EMPLOYEE' as UserRole,
    branchId: 'ALL',
    department: '',
    designation: '',
    salaryBase: 35000,
    canViewAllStaffData: false,
    canViewFinancials: false
  });

  // Custom module creation states
  const [newModuleName, setNewModuleName] = useState('');
  const [newModuleDesc, setNewModuleDesc] = useState('');
  const [newModuleKey, setNewModuleKey] = useState('');

  // Target editing state
  const [editingTargetUserId, setEditingTargetUserId] = useState<string | null>(null);
  const [targetInput, setTargetInput] = useState(6000000);
  const [commRateInput, setCommRateInput] = useState(4.5);

  const currentRolePerm = rolePermissions.find(r => r.roleId === selectedRole);

  const handleOpenEditEmployee = (emp: User) => {
    setEditingEmployee(emp);
    const isAcctOrMkt = emp.role === 'ADMIN' || emp.role === 'MARKETING' || (emp.department?.toLowerCase().includes('account') || emp.department?.toLowerCase().includes('finance'));
    setEditForm({
      fullName: emp.fullName,
      email: emp.email,
      phone: emp.phone,
      role: emp.role,
      branchId: emp.branchId,
      department: emp.department,
      designation: emp.designation,
      salaryBase: emp.salaryBase,
      canViewAllStaffData: emp.canViewAllStaffData ?? (emp.role === 'ADMIN'),
      canViewFinancials: emp.canViewFinancials ?? isAcctOrMkt,
    });
  };

  const handleSaveEmployeeEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    updateEmployee(editingEmployee.id, {
      fullName: editForm.fullName,
      email: editForm.email,
      phone: editForm.phone,
      role: editForm.role,
      branchId: editForm.branchId,
      department: editForm.department,
      designation: editForm.designation,
      salaryBase: Number(editForm.salaryBase),
      canViewAllStaffData: editForm.canViewAllStaffData,
      canViewFinancials: editForm.canViewFinancials
    });

    setEditingEmployee(null);
  };

  const handleConfirmDeleteEmployee = () => {
    if (!employeeToDelete) return;
    const result = deleteEmployee(employeeToDelete.id);
    if (!result.success) {
      setDeleteError(result.message || 'Cannot delete this account.');
      return;
    }
    setEmployeeToDelete(null);
    setDeleteError(null);
  };

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleName.trim()) return;
    addCustomModule(
      newModuleName.trim(),
      newModuleDesc.trim() || 'Custom operational module configured by admin.',
      newModuleKey.trim() || newModuleName.toLowerCase().replace(/\s+/g, '_')
    );
    setNewModuleName('');
    setNewModuleDesc('');
    setNewModuleKey('');
  };

  const handleSaveTarget = (userId: string) => {
    updateMarketingTarget(userId, Number(targetInput), Number(commRateInput));
    setEditingTargetUserId(null);
  };

  const moduleKeys: { key: ModuleKey; label: string }[] = [
    { key: 'dashboard', label: 'BI Analytics Dashboard' },
    { key: 'projects', label: 'Multi-Site Projects' },
    { key: 'dpr', label: 'Daily Progress Reports (DPR)' },
    { key: 'labor', label: 'Employees Hours & Digital Timesheets' },
    { key: 'inventory', label: 'Material Inventory' },
    { key: 'crm', label: 'Marketing CRM & Leads' },
    { key: 'designs', label: 'Design Blueprints & CAD' },
    { key: 'collaboration', label: 'Cross-Team Tasks' },
    { key: 'salarybox', label: 'Salary Box & HR' },
    { key: 'admin_settings', label: 'Admin Configuration' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[var(--text-main)] tracking-tight">Super Admin Console & Security Hub</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
              Root Level Control
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Manage employee directories, RBAC module rights, dynamic tabs, sales targets and credentials
          </p>
        </div>

        <button
          onClick={() => setIsEmployeeModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg transition-colors shadow-md cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision New Employee</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 border-b border-[var(--border-subtle)] pb-2 overflow-x-auto text-xs font-mono">
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'employees'
              ? 'bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)] font-bold border border-[var(--primary-accent-border)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Employee Directory ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'permissions'
              ? 'bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)] font-bold border border-[var(--primary-accent-border)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>RBAC Permissions Grid</span>
        </button>

        <button
          onClick={() => setActiveTab('targets')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'targets'
              ? 'bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)] font-bold border border-[var(--primary-accent-border)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Marketing Sales Targets</span>
        </button>

        <button
          onClick={() => setActiveTab('modules')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'modules'
              ? 'bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)] font-bold border border-[var(--primary-accent-border)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Custom Modules ({modules.length})</span>
        </button>
      </div>

      {/* TAB 1: User Accounts & Temporary Passwords */}
      {activeTab === 'employees' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-[var(--text-main)] tracking-tight">Active Employee & Staff Directory</h2>
              <p className="text-[11px] text-[var(--text-muted)]">
                All registered system personnel across Pixar World Construction branches with edit and deletion controls
              </p>
            </div>
            <span className="text-xs text-[var(--primary-accent-text)] font-mono font-semibold">
              Default Auth: 0102 / Temporary Verification
            </span>
          </div>

          <div className="border border-[var(--border-subtle)] rounded-xl overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[850px]">
              <thead className="bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] text-[11px] font-mono border-b border-[var(--border-subtle)]">
                <tr>
                  <th className="py-3 px-4 font-semibold">User Profile</th>
                  <th className="py-3 px-4 font-semibold">Login ID</th>
                  <th className="py-3 px-4 font-semibold">Role</th>
                  <th className="py-3 px-4 font-semibold">Branch Hub</th>
                  <th className="py-3 px-4 font-semibold">Designation</th>
                  <th className="py-3 px-4 text-right font-semibold">Base Salary</th>
                  <th className="py-3 px-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] font-mono text-[11px]">
                {users.map(u => {
                  const branch = branches.find(b => b.id === u.branchId);
                  const isPrimaryAdmin = u.id === 'USR-001' || u.username === 'siteadmin';

                  return (
                    <tr key={u.id} className="hover:bg-[var(--bg-surface-subtle)] transition-colors">
                      <td className="py-3 px-4 font-sans font-medium text-[var(--text-main)]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)] flex items-center justify-center font-bold text-xs shrink-0">
                            {u.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold">{u.fullName}</div>
                            <div className="text-[10px] text-[var(--text-muted)] font-mono">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[var(--primary-accent-text)] font-bold">{u.username}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${
                          u.role === 'ADMIN'
                            ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                            : u.role === 'SITE_ENGINEER'
                              ? 'bg-blue-500/15 text-blue-500 border-blue-500/30'
                              : 'bg-[var(--bg-surface-subtle)] text-[var(--text-main)] border-[var(--border-subtle)]'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans text-[var(--text-muted)]">{branch?.name || 'All Branches'}</td>
                      <td className="py-3 px-4 font-sans text-[var(--text-muted)]">{u.designation}</td>
                      <td className="py-3 px-4 text-right font-bold text-[var(--text-main)]">
                        ₹{u.salaryBase.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditEmployee(u)}
                            className="p-1.5 text-slate-400 hover:text-[var(--primary-accent-text)] hover:bg-[var(--bg-surface)] rounded transition-colors cursor-pointer"
                            title="Edit employee profile"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete button (protected for primary admin) */}
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteError(null);
                              setEmployeeToDelete(u);
                            }}
                            disabled={isPrimaryAdmin}
                            className={`p-1.5 rounded transition-colors ${
                              isPrimaryAdmin
                                ? 'text-slate-600 opacity-40 cursor-not-allowed'
                                : 'text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer'
                            }`}
                            title={isPrimaryAdmin ? 'Primary admin cannot be deleted' : 'Delete employee profile'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: RBAC Permissions Matrix */}
      {activeTab === 'permissions' && (
        <div className="space-y-6">
          {/* Header & Target Role Selector */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[var(--text-main)] tracking-tight">Granular Role Permissions Editor</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded">
                  Admin Security Console
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Configure module CRUD rights, HR & Payroll 8 sub-modules, staff data scope (Own Data Only), and financial portfolio restrictions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-muted)] font-mono font-semibold">Configuring Role:</span>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value as UserRole)}
                className="px-3.5 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-strong)] rounded-xl text-[var(--primary-accent-text)] font-bold focus:outline-none cursor-pointer"
              >
                <option value="SITE_ENGINEER">Site Engineer (Field Civil)</option>
                <option value="MARKETING">Marketing & Business Development</option>
                <option value="DESIGNER">Architect & BIM Designer</option>
                <option value="EMPLOYEE">Field Labor & Staff (General)</option>
                <option value="ADMIN">System Administrator (Root Admin)</option>
              </select>
            </div>
          </div>

          {/* TWO CORE SECURITY & PRIVACY CONTROLS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Control 1: Staff Data Scope & Privacy Policy */}
            <div className="p-4 bg-[var(--bg-surface)] border border-amber-500/30 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[var(--text-main)]">Staff Data Scope & Privacy Policy</h3>
                    <p className="text-[10px] text-[var(--text-muted)]">Rule: Particular employee only can see his/her data only</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="staffScopeToggle"
                    checked={currentRolePerm?.canViewAllStaffData ?? (selectedRole === 'ADMIN')}
                    disabled={selectedRole === 'ADMIN'}
                    onChange={e => updateRoleStaffScope(selectedRole, e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span>Current Setting:</span>
                  <span className={(currentRolePerm?.canViewAllStaffData ?? (selectedRole === 'ADMIN')) ? 'text-amber-600 font-bold' : 'text-emerald-600 font-bold'}>
                    {(currentRolePerm?.canViewAllStaffData ?? (selectedRole === 'ADMIN')) ? 'All Staff Records Visible' : 'Restricted: Own Data Only (Protected)'}
                  </span>
                </div>
                <p className="text-[10px] text-[var(--text-subtle)] leading-relaxed">
                  {(currentRolePerm?.canViewAllStaffData ?? (selectedRole === 'ADMIN'))
                    ? 'Staff in this role can inspect company-wide staff records across branches.'
                    : 'Employees in this role can strictly view only their own personal attendance, timesheet, payslips, KYC, and letters.'}
                </p>
              </div>
            </div>

            {/* Control 2: Financial Information & Total Portfolio Budget Policy */}
            <div className="p-4 bg-[var(--bg-surface)] border border-emerald-500/30 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[var(--text-main)]">Total Portfolio Budget & Financial Info</h3>
                    <p className="text-[10px] text-[var(--text-muted)]">Rule: Accessible by Account / Marketing / Admin only</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="financialsScopeToggle"
                    checked={currentRolePerm?.canViewFinancials ?? (selectedRole === 'ADMIN' || selectedRole === 'MARKETING')}
                    disabled={selectedRole === 'ADMIN'}
                    onChange={e => updateRoleFinancialsScope(selectedRole, e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span>Current Setting:</span>
                  <span className={(currentRolePerm?.canViewFinancials ?? (selectedRole === 'ADMIN' || selectedRole === 'MARKETING')) ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                    {(currentRolePerm?.canViewFinancials ?? (selectedRole === 'ADMIN' || selectedRole === 'MARKETING')) ? 'Financial Information Authorized' : 'Confidential / Locked (Masked)'}
                  </span>
                </div>
                <p className="text-[10px] text-[var(--text-subtle)] leading-relaxed">
                  {(currentRolePerm?.canViewFinancials ?? (selectedRole === 'ADMIN' || selectedRole === 'MARKETING'))
                    ? 'Total portfolio values, incurred project budgets, and company-wide salary totals are visible.'
                    : 'Portfolio budget amounts, project costs, and financial analytics are strictly hidden and masked.'}
                </p>
              </div>
            </div>

          </div>

          {/* HR & PAYROLL 8 SUB-SECTIONS GRANULAR PERMISSIONS */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)]">
                  HR & Payroll Sub-Sections Access Matrix (8 Modules)
                </h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Admin granular permission editor: Enable or disable individual sub-sections for {selectedRole}
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold">
                Salary Box Detailed Rights
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {[
                { id: 'team', label: '1. My Team', desc: 'Workforce Directory & Staff Dossiers', icon: <Users className="w-4 h-4 text-amber-500" /> },
                { id: 'attendance', label: '2. Attendance', desc: 'Punch In/Out Clocks & Holiday Calendar', icon: <Clock className="w-4 h-4 text-blue-500" /> },
                { id: 'payroll', label: '3. Payroll', desc: 'Monthly Payroll Register & Payslip Generation', icon: <Banknote className="w-4 h-4 text-emerald-500" /> },
                { id: 'reports', label: '4. Report', desc: 'Workforce Outlay (Lakhs/Cr) & HR Analytics', icon: <BarChart3 className="w-4 h-4 text-purple-500" /> },
                { id: 'verification', label: '5. Verification', desc: 'KYC Checks: Aadhaar, PAN, DL, Degree', icon: <ShieldCheck className="w-4 h-4 text-teal-500" /> },
                { id: 'docs', label: '6. Employee Details', desc: 'Official Letters: Joining, Appointment, NDA', icon: <FolderArchive className="w-4 h-4 text-indigo-500" /> },
                { id: 'timesheets', label: '7. Time Sheet', desc: 'Shift Schedules, Break Duration & Overtime', icon: <CalendarClock className="w-4 h-4 text-orange-500" /> },
                { id: 'salary_calc', label: '8. Salary Calculation', desc: 'Basic Pay + Allowances Configurator', icon: <Calculator className="w-4 h-4 text-rose-500" /> },
              ].map(sub => {
                const isAllowed = selectedRole === 'ADMIN' ? true : (currentRolePerm?.hrSubPermissions?.[sub.id as HrSubSection] ?? false);

                return (
                  <div 
                    key={sub.id} 
                    className={`p-3 rounded-xl border transition-all ${
                      isAllowed 
                        ? 'bg-[var(--bg-surface-subtle)] border-[var(--border-strong)]' 
                        : 'bg-[var(--bg-surface-subtle)]/40 border-[var(--border-subtle)] opacity-70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {sub.icon}
                        <span className="text-xs font-bold text-[var(--text-main)]">{sub.label}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isAllowed}
                        disabled={selectedRole === 'ADMIN'}
                        onChange={e => updateHrSubPermission(selectedRole, sub.id as HrSubSection, e.target.checked)}
                        className="w-4 h-4 accent-amber-500 rounded cursor-pointer disabled:cursor-not-allowed"
                      />
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1.5 line-clamp-1">{sub.desc}</p>
                    <div className="mt-2 pt-1 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px]">
                      <span className="text-[var(--text-subtle)]">Access State:</span>
                      <span className={isAllowed ? 'text-emerald-600 font-bold font-mono' : 'text-slate-400 font-mono'}>
                        {isAllowed ? 'Allowed' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PRIMARY SYSTEM MODULES CRUD TABLE */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)]">System Modules CRUD Rights</h3>
                <p className="text-[11px] text-[var(--text-muted)]">Configure View, Create, Edit, Delete, and Approval permissions</p>
              </div>
            </div>

            <div className="border border-[var(--border-subtle)] rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[650px]">
                <thead className="bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] text-[11px] font-mono border-b border-[var(--border-subtle)]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">System Module</th>
                    <th className="py-3 px-4 text-center font-semibold">View</th>
                    <th className="py-3 px-4 text-center font-semibold">Create</th>
                    <th className="py-3 px-4 text-center font-semibold">Edit</th>
                    <th className="py-3 px-4 text-center font-semibold">Delete</th>
                    <th className="py-3 px-4 text-center font-semibold">Approve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] font-mono text-[11px]">
                  {moduleKeys.map(mod => {
                    const perm = currentRolePerm?.permissions[mod.key] || {
                      view: false, create: false, edit: false, delete: false, approve: false
                    };

                    return (
                      <tr key={mod.key} className="hover:bg-[var(--bg-surface-subtle)]">
                        <td className="py-3 px-4 font-sans font-medium text-[var(--text-main)]">
                          {mod.label}
                        </td>
                        {(['view', 'create', 'edit', 'delete', 'approve'] as const).map(action => (
                          <td key={action} className="py-3 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={perm[action]}
                              disabled={selectedRole === 'ADMIN'}
                              onChange={e => updatePermission(selectedRole, mod.key, action, e.target.checked)}
                              className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 cursor-pointer disabled:cursor-not-allowed"
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Marketing Targets */}
      {activeTab === 'targets' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4 shadow-sm">
          <div>
            <h2 className="text-sm font-bold text-[var(--text-main)] tracking-tight">Marketing Commission & Quarterly Target Settings</h2>
            <p className="text-[11px] text-[var(--text-muted)]">Set targets and commission percentages for business acquisition personnel</p>
          </div>

          <div className="space-y-3">
            {users.filter(u => u.role === 'MARKETING' || u.role === 'ADMIN').map(user => {
              const isEditing = editingTargetUserId === user.id;

              return (
                <div
                  key={user.id}
                  className="p-4 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-xs font-bold text-[var(--text-main)]">{user.fullName}</div>
                    <div className="text-[10px] text-[var(--text-muted)] font-mono">{user.designation} · {user.email}</div>
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <div>
                        <span className="text-[10px] text-[var(--text-subtle)] block">Target (INR ₹)</span>
                        <input
                          type="number"
                          value={targetInput}
                          onChange={e => setTargetInput(Number(e.target.value))}
                          className="px-2 py-1 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded w-32 font-mono"
                          step={500000}
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--text-subtle)] block">Commission (%)</span>
                        <input
                          type="number"
                          value={commRateInput}
                          onChange={e => setCommRateInput(Number(e.target.value))}
                          className="px-2 py-1 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded w-20 font-mono"
                          step={0.5}
                        />
                      </div>
                      <div className="flex items-center gap-1 mt-3">
                        <button
                          onClick={() => handleSaveTarget(user.id)}
                          className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-500 cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTargetUserId(null)}
                          className="px-2 py-1 bg-[var(--bg-surface)] text-[var(--text-muted)] text-xs rounded cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-[10px] text-[var(--text-subtle)] font-mono">QUARTERLY TARGET</div>
                        <div className="text-xs font-bold text-[var(--primary-accent-text)] font-mono">
                          ₹{(user.salesTarget || 6000000).toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-[var(--text-subtle)] font-mono">COMMISSION</div>
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                          {user.targetCommissionRate || 4.5}%
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setEditingTargetUserId(user.id);
                          setTargetInput(user.salesTarget || 6000000);
                          setCommRateInput(user.targetCommissionRate || 4.5);
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] text-[var(--text-main)] border border-[var(--border-subtle)] rounded cursor-pointer"
                      >
                        Edit Target
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: Custom Modules Manager */}
      {activeTab === 'modules' && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-6 shadow-sm">
          <div>
            <h2 className="text-sm font-bold text-[var(--text-main)] tracking-tight">Enterprise Custom Module Configuration</h2>
            <p className="text-[11px] text-[var(--text-muted)]">Enable, disable, or register dynamic operational workflows</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map(mod => (
              <div
                key={mod.id}
                className="p-4 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--text-main)]">{mod.name}</span>
                    {mod.isSystem && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        System Core
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1">{mod.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleModule(mod.key)}
                  className={`text-xl transition-colors cursor-pointer ${
                    mod.isEnabled ? 'text-emerald-500' : 'text-slate-500'
                  }`}
                  title={mod.isEnabled ? 'Disable Module' : 'Enable Module'}
                >
                  {mod.isEnabled ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
              </div>
            ))}
          </div>

          {/* Add Custom Module Form */}
          <form onSubmit={handleAddModule} className="p-4 bg-[var(--bg-surface-subtle)] border border-dashed border-[var(--border-strong)] rounded-xl space-y-3">
            <h3 className="text-xs font-bold text-[var(--text-main)]">Register New Custom Application Module</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Module Display Name"
                value={newModuleName}
                onChange={e => setNewModuleName(e.target.value)}
                className="px-3 py-1.5 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
                required
              />
              <input
                type="text"
                placeholder="Unique Key (e.g. equipment_iot)"
                value={newModuleKey}
                onChange={e => setNewModuleKey(e.target.value)}
                className="px-3 py-1.5 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono"
              />
              <input
                type="text"
                placeholder="Short Purpose Description"
                value={newModuleDesc}
                onChange={e => setNewModuleDesc(e.target.value)}
                className="px-3 py-1.5 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg shadow-sm cursor-pointer"
              >
                Add System Module
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Provision Employee Modal */}
      <NewEmployeeModal isOpen={isEmployeeModalOpen} onClose={() => setIsEmployeeModalOpen(false)} />

      {/* EDIT EMPLOYEE PROFILE MODAL (Admin) */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[var(--primary-accent)]" />
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-main)]">Edit Employee & Staff Profile</h3>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono">User ID: {editingEmployee.username}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingEmployee(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-[var(--text-main)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployeeEdit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Assigned Role *</label>
                  <select
                    value={editForm.role}
                    onChange={e => setEditForm({ ...editForm, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                  >
                    <option value="ADMIN">ADMIN (Managing Director)</option>
                    <option value="SITE_ENGINEER">SITE_ENGINEER (Field Civil)</option>
                    <option value="MARKETING">MARKETING (Sales & CRM)</option>
                    <option value="DESIGNER">DESIGNER (Architect & BIM)</option>
                    <option value="EMPLOYEE">EMPLOYEE (Staff / QC Supervisor)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Branch Hub *</label>
                  <select
                    value={editForm.branchId}
                    onChange={e => setEditForm({ ...editForm, branchId: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                  >
                    <option value="ALL">All Branches (Corporate HQ)</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Department</label>
                  <input
                    type="text"
                    value={editForm.department}
                    onChange={e => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Designation Title</label>
                  <input
                    type="text"
                    value={editForm.designation}
                    onChange={e => setEditForm({ ...editForm, designation: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Monthly Base Salary (₹ INR) *</label>
                <input
                  type="number"
                  value={editForm.salaryBase}
                  onChange={e => setEditForm({ ...editForm, salaryBase: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono font-bold"
                  step={1000}
                  required
                />
              </div>

              {/* Individual Employee Security & Privacy Permissions */}
              <div className="p-3 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl space-y-3">
                <div className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>Granular Staff Security & Privacy Permissions</span>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.canViewAllStaffData}
                    onChange={e => setEditForm({ ...editForm, canViewAllStaffData: e.target.checked })}
                    className="w-4 h-4 mt-0.5 accent-amber-500 rounded cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-semibold text-[var(--text-main)]">
                      View All Staff Records & Directory
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)]">
                      When unchecked (default for staff), this employee can strictly see ONLY their own data in Attendance, Timesheet, Payslips, KYC, and Docs.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.canViewFinancials}
                    onChange={e => setEditForm({ ...editForm, canViewFinancials: e.target.checked })}
                    className="w-4 h-4 mt-0.5 accent-emerald-500 rounded cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-semibold text-[var(--text-main)]">
                      View Total Portfolio Budget & Financial Information
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)]">
                      Rule: Reserved for Account / Marketing / Admin. When unchecked, site budgets and corporate financials are masked as 🔒 Confidential.
                    </div>
                  </div>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setEditingEmployee(null)}
                  className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-surface-subtle)] hover:text-[var(--text-main)] rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE EMPLOYEE CONFIRMATION MODAL */}
      {employeeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-[var(--bg-surface)] border border-rose-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-2 rounded-xl bg-rose-500/10">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-main)]">Delete Employee Profile</h3>
                <p className="text-xs text-[var(--text-muted)]">Revoke system access and remove employee record</p>
              </div>
            </div>

            {deleteError && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-medium">
                {deleteError}
              </div>
            )}

            <div className="p-3 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] text-xs text-[var(--text-main)] space-y-1">
              <div className="font-bold">{employeeToDelete.fullName}</div>
              <div className="text-[var(--text-muted)] font-mono">User ID: {employeeToDelete.username} ({employeeToDelete.role})</div>
              <div className="text-amber-500 font-mono text-[11px]">{employeeToDelete.designation} · {employeeToDelete.department}</div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setEmployeeToDelete(null);
                  setDeleteError(null);
                }}
                className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-surface-subtle)] rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteEmployee}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-md cursor-pointer"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
