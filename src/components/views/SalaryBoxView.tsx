import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Clock, 
  Banknote, 
  BarChart3, 
  ShieldCheck, 
  FolderArchive, 
  CalendarClock, 
  Calculator, 
  Search, 
  Plus, 
  Printer, 
  FileText, 
  Download, 
  UploadCloud, 
  Edit3, 
  Trash2, 
  MapPin, 
  Coffee, 
  X,
  TrendingUp,
  Save,
  PartyPopper,
  Lock,
  ShieldAlert
} from 'lucide-react';
import { PayslipModal } from '../modals/PayslipModal';
import { SalaryStructureModal } from '../modals/SalaryStructureModal';
import { VerificationModal } from '../modals/VerificationModal';
import { EmployeeDocUploadModal } from '../modals/EmployeeDocUploadModal';
import { TimeSheetEntryModal } from '../modals/TimeSheetEntryModal';
import { 
  SalarySlip, 
  LeaveRequest, 
  Holiday, 
  User, 
  EmployeeVerification, 
  LaborTimeLog,
  VerificationDocType,
  OfficialDocCategory,
  HrSubSection
} from '../../types';

export const formatLakhsOrCrores = (val: number): string => {
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(2)} Lakhs`;
  }
  return `₹${val.toLocaleString('en-IN')}`;
};

export const SalaryBoxView: React.FC = () => {
  const { 
    salarySlips, 
    holidays, 
    addHoliday,
    updateHoliday,
    deleteHoliday,
    leaves, 
    applyLeave, 
    updateLeaveStatus, 
    currentUser, 
    users,
    verifications,
    employeeDocs,
    timeLogs,
    updateVerificationStatus,
    deleteVerificationDoc,
    deleteEmployeeDoc,
    generateMonthlyPayroll,
    updateSalarySlipStatus,
    deleteTimeLog,
    projects,
    hrSubTab: activeTab,
    setHrSubTab: setActiveTab,
    hasHrSubPermission,
    canUserViewAllStaff,
    canUserViewFinancials
  } = useApp();

  const canViewAllStaff = canUserViewAllStaff(currentUser);
  const canViewFinancials = canUserViewFinancials(currentUser);
  const isSubPermitted = hasHrSubPermission(activeTab, currentUser);

  // Modals state
  const [selectedSlip, setSelectedSlip] = useState<SalarySlip | null>(null);
  const [salaryStructureEmployee, setSalaryStructureEmployee] = useState<User | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [editingVerification, setEditingVerification] = useState<EmployeeVerification | null>(null);
  const [verificationDefaultEmpId, setVerificationDefaultEmpId] = useState<string>('');
  
  const [isDocUploadModalOpen, setIsDocUploadModalOpen] = useState(false);
  const [docUploadDefaultEmpId, setDocUploadDefaultEmpId] = useState<string>('');

  const [isTimeSheetModalOpen, setIsTimeSheetModalOpen] = useState(false);
  const [editingTimeLog, setEditingTimeLog] = useState<LaborTimeLog | null>(null);

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [holidayTitle, setHolidayTitle] = useState('');
  const [holidayDate, setHolidayDate] = useState(new Date().toISOString().split('T')[0]);
  const [holidayType, setHolidayType] = useState<Holiday['type']>('National Holiday');
  const [holidayDesc, setHolidayDesc] = useState('');
  const [isMandatory, setIsMandatory] = useState(true);

  // Leave form
  const [leaveType, setLeaveType] = useState<LeaveRequest['leaveType']>('Casual Leave');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [reason, setReason] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedVerificationDocType, setSelectedVerificationDocType] = useState<string>('ALL');
  const [selectedDocCategory, setSelectedDocCategory] = useState<string>('ALL');
  const [payrollMonth, setPayrollMonth] = useState('February 2026');

  const isElevated = currentUser?.role === 'ADMIN';

  // --- Handlers ---
  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    applyLeave({
      leaveType,
      startDate,
      endDate,
      daysCount: 2,
      reason
    });
    setReason('');
    setIsLeaveModalOpen(false);
  };

  const openAddHoliday = () => {
    setEditingHoliday(null);
    setHolidayTitle('');
    setHolidayDate(new Date().toISOString().split('T')[0]);
    setHolidayType('Regional / State Festival');
    setHolidayDesc('');
    setIsMandatory(true);
    setIsHolidayModalOpen(true);
  };

  const openEditHoliday = (hol: Holiday) => {
    setEditingHoliday(hol);
    setHolidayTitle(hol.title);
    setHolidayDate(hol.date);
    setHolidayType(hol.type);
    setHolidayDesc(hol.description || '');
    setIsMandatory(hol.isMandatory);
    setIsHolidayModalOpen(true);
  };

  const handleSaveHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayTitle.trim() || !holidayDate) return;

    if (editingHoliday) {
      updateHoliday(editingHoliday.id, {
        title: holidayTitle.trim(),
        date: holidayDate,
        type: holidayType,
        description: holidayDesc.trim(),
        isMandatory
      });
    } else {
      addHoliday({
        title: holidayTitle.trim(),
        date: holidayDate,
        type: holidayType,
        description: holidayDesc.trim(),
        isMandatory,
        applicableBranchIds: ['ALL']
      });
    }
    setIsHolidayModalOpen(false);
  };

  // Data Isolation: Scoped collections based on admin permission
  // Rule: Particular employee only can see his/her data only unless granted view all permission
  const scopedUsers = useMemo(() => {
    if (canViewAllStaff) return users;
    return users.filter(u => u.id === currentUser?.id);
  }, [users, canViewAllStaff, currentUser]);

  const scopedSlips = useMemo(() => {
    if (canViewAllStaff) return salarySlips;
    return salarySlips.filter(s => s.employeeId === currentUser?.id);
  }, [salarySlips, canViewAllStaff, currentUser]);

  const scopedVerifications = useMemo(() => {
    if (canViewAllStaff) return verifications;
    return verifications.filter(v => v.employeeId === currentUser?.id);
  }, [verifications, canViewAllStaff, currentUser]);

  const scopedDocs = useMemo(() => {
    if (canViewAllStaff) return employeeDocs;
    return employeeDocs.filter(d => d.employeeId === currentUser?.id);
  }, [employeeDocs, canViewAllStaff, currentUser]);

  const scopedTimeLogs = useMemo(() => {
    if (canViewAllStaff) return timeLogs;
    return timeLogs.filter(t => t.employeeId === currentUser?.id);
  }, [timeLogs, canViewAllStaff, currentUser]);

  const scopedLeaves = useMemo(() => {
    if (canViewAllStaff) return leaves;
    return leaves.filter(l => l.employeeId === currentUser?.id);
  }, [leaves, canViewAllStaff, currentUser]);

  // --- Derived Calculations for Reports ---
  const payrollStats = useMemo(() => {
    const slipsForMonth = scopedSlips.filter(s => s.month === payrollMonth || payrollMonth === 'ALL');
    const totalGross = slipsForMonth.reduce((acc, s) => acc + s.grossSalary, 0);
    const totalDeductions = slipsForMonth.reduce(
      (acc, s) => acc + s.deductions.providentFund + s.deductions.professionalTax + s.deductions.taxDeducted + s.deductions.advanceDeduction, 
      0
    );
    const totalNet = slipsForMonth.reduce((acc, s) => acc + s.netPayable, 0);
    const paidCount = slipsForMonth.filter(s => s.paymentStatus === 'Paid').length;
    const pendingCount = slipsForMonth.length - paidCount;

    return { totalGross, totalDeductions, totalNet, paidCount, pendingCount, slipsForMonth };
  }, [scopedSlips, payrollMonth]);

  const timesheetStats = useMemo(() => {
    const totalRegularHours = scopedTimeLogs.reduce((acc, t) => acc + (t.regularHours || 0), 0);
    const totalOtHours = scopedTimeLogs.reduce((acc, t) => acc + (t.overtimeHours || 0), 0);
    const totalBreakMinutes = scopedTimeLogs.reduce((acc, t) => acc + (t.breakDurationMinutes || 0), 0);
    const avgBreakMinutes = scopedTimeLogs.length ? Math.round(totalBreakMinutes / scopedTimeLogs.length) : 0;
    return { totalRegularHours, totalOtHours, avgBreakMinutes, totalBreakMinutes };
  }, [scopedTimeLogs]);

  const kycComplianceStats = useMemo(() => {
    const totalUsers = scopedUsers.length;
    const usersWithAadhaar = scopedUsers.filter(u => u.aadhaarNumber || scopedVerifications.some(v => v.employeeId === u.id && v.docType === 'Aadhaar Card' && v.status === 'Verified')).length;
    const usersWithPan = scopedUsers.filter(u => u.panNumber || scopedVerifications.some(v => v.employeeId === u.id && v.docType === 'PAN Card' && v.status === 'Verified')).length;
    const usersWithDegree = scopedUsers.filter(u => u.highestDegree || scopedVerifications.some(v => v.employeeId === u.id && v.docType === 'Degree / Educational Certificate' && v.status === 'Verified')).length;
    const usersWithDocs = scopedUsers.filter(u => scopedDocs.some(d => d.employeeId === u.id)).length;

    const overallRate = totalUsers ? Math.round(((usersWithAadhaar + usersWithPan + usersWithDegree) / (totalUsers * 3)) * 100) : 0;
    return { totalUsers, usersWithAadhaar, usersWithPan, usersWithDegree, usersWithDocs, overallRate };
  }, [scopedUsers, scopedVerifications, scopedDocs]);

  // Tab navigation items with live permission status
  const navTabs: { id: HrSubSection; label: string; icon: any; badge: string; isPermitted: boolean }[] = [
    { id: 'team', label: '1. My Team', icon: Users, badge: `${scopedUsers.length} Staff`, isPermitted: hasHrSubPermission('team', currentUser) },
    { id: 'attendance', label: '2. Attendance', icon: Clock, badge: 'Live Clocks', isPermitted: hasHrSubPermission('attendance', currentUser) },
    { id: 'payroll', label: '3. Payroll', icon: Banknote, badge: `${scopedSlips.length} Slips`, isPermitted: hasHrSubPermission('payroll', currentUser) },
    { id: 'reports', label: '4. Reports', icon: BarChart3, badge: 'Analytics', isPermitted: hasHrSubPermission('reports', currentUser) },
    { id: 'verification', label: '5. Verification', icon: ShieldCheck, badge: `${scopedVerifications.length} KYC`, isPermitted: hasHrSubPermission('verification', currentUser) },
    { id: 'docs', label: '6. Employees Doc', icon: FolderArchive, badge: `${scopedDocs.length} Docs`, isPermitted: hasHrSubPermission('docs', currentUser) },
    { id: 'timesheets', label: '7. Time Sheet', icon: CalendarClock, badge: 'OT & Breaks', isPermitted: hasHrSubPermission('timesheets', currentUser) },
    { id: 'salary_calc', label: '8. Salary Calculation', icon: Calculator, badge: 'Basic + Allow', isPermitted: hasHrSubPermission('salary_calc', currentUser) },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[var(--bg-surface)] p-5 rounded-2xl border border-[var(--border-subtle)] shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[var(--primary-accent)] text-slate-950 rounded-xl shadow-xs">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-[var(--text-main)] tracking-tight">
                  HR & Payroll Management System
                </h1>
                <span className="px-2 py-0.5 text-xs font-mono font-bold rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  HR / Admin Portal
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Vadodara Headquarters · Full-spectrum workforce directory, biometric attendance, KYC verification & salary calculations
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const mySlip = salarySlips.find(s => s.employeeId === currentUser?.id) || salarySlips[0];
              if (mySlip) setSelectedSlip(mySlip);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>My Latest Payslip</span>
          </button>
        </div>
      </div>

      {/* 8-Section Sub Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-1.5 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-2xl">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isPermitted = tab.isPermitted;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[var(--bg-surface)] text-[var(--text-main)] shadow-sm border border-[var(--border-strong)] font-bold'
                  : isPermitted
                  ? 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]/50'
                  : 'text-slate-400 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--primary-accent-text)]' : isPermitted ? 'text-[var(--text-subtle)]' : 'text-slate-400'}`} />
                {!isPermitted && <Lock className="w-3 h-3 text-amber-500" />}
              </div>
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                isActive 
                  ? 'bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)] font-bold'
                  : 'bg-[var(--border-subtle)] text-[var(--text-subtle)]'
              }`}>
                {isPermitted ? tab.badge : 'Locked'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Staff Data Isolation Banner */}
      {!canViewAllStaff && isSubPermitted && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs animate-fadeIn">
          <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold">Staff Data Privacy Policy Active:</span>
              <span className="text-[11px] text-[var(--text-muted)] ml-1">
                Displaying only your individual records ({currentUser?.fullName} · {currentUser?.username}). Full organization staff records require Admin permission.
              </span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-full border border-amber-500/30 self-start sm:self-auto shrink-0">
            Own Records Only
          </span>
        </div>
      )}

      {/* ACCESS RESTRICTED SCREEN (If current active sub-section is disabled by Admin Granular Permissions) */}
      {!isSubPermitted && (
        <div className="p-10 bg-[var(--bg-surface)] border border-amber-500/30 rounded-2xl text-center space-y-4 shadow-sm animate-fadeIn">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20 shadow-xs">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-base font-bold text-[var(--text-main)]">
              Module Access Restricted: {navTabs.find(t => t.id === activeTab)?.label}
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Your role ({currentUser?.role}) has not been granted permission to access this HR & Payroll sub-section. 
              The System Administrator can configure this in the <strong>Granular Role Permissions Editor</strong> under the Admin Console.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3">
            {navTabs.filter(t => t.isPermitted).length > 0 && (
              <button
                type="button"
                onClick={() => {
                  const firstPermitted = navTabs.find(t => t.isPermitted);
                  if (firstPermitted) setActiveTab(firstPermitted.id);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-xl shadow-xs cursor-pointer"
              >
                Go to Allowed Module ({navTabs.find(t => t.isPermitted)?.label})
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION 1: MY TEAM SECTION
         ======================================================== */}
      {isSubPermitted && activeTab === 'team' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-subtle)]" />
                <input
                  type="text"
                  placeholder="Search staff by name, role, mobile, PAN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] w-64 md:w-80"
                />
              </div>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-3 py-1.5 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
              >
                <option value="ALL">All Departments</option>
                <option value="Executive / Leadership">Executive / Leadership</option>
                <option value="Civil Engineering & Construction">Civil Construction</option>
                <option value="Architecture & Interior Design">Interior Design</option>
                <option value="Sales & Business Development">Sales & Marketing</option>
                <option value="Finance & Accounts">Finance & Accounts</option>
              </select>
            </div>

            <div className="text-xs text-[var(--text-muted)] font-mono">
              Showing {scopedUsers.filter(u => (selectedDept === 'ALL' || u.department === selectedDept) && (u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())))).length} of {scopedUsers.length} Employees
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scopedUsers
              .filter(u => (selectedDept === 'ALL' || u.department === selectedDept) && (u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))))
              .map(emp => {
                const empVerifications = verifications.filter(v => v.employeeId === emp.id);
                const isVerified = empVerifications.some(v => v.status === 'Verified') || (emp.panNumber && emp.aadhaarNumber);
                const docsCount = employeeDocs.filter(d => d.employeeId === emp.id).length;

                return (
                  <div 
                    key={emp.id} 
                    className="p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] rounded-2xl shadow-xs transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold flex items-center justify-center text-sm shadow-sm uppercase">
                            {emp.fullName.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-[var(--text-main)] leading-tight">{emp.fullName}</h3>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">{emp.designation || emp.role.replace('_', ' ')}</p>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--bg-surface-subtle)] text-[var(--text-subtle)] border border-[var(--border-subtle)]">
                              {emp.department || 'Operations'}
                            </span>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                          isVerified 
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        }`}>
                          {isVerified ? 'KYC Verified' : 'KYC Pending'}
                        </span>
                      </div>

                      {/* Details Grid */}
                      <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] space-y-1.5 text-xs">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[var(--text-muted)]">Employee Code:</span>
                          <span className="font-mono font-semibold text-[var(--text-main)]">{emp.id.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[var(--text-muted)]">Contact / Phone:</span>
                          <span className="font-mono text-[var(--text-main)]">{emp.phone || '+91 98250 11223'}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[var(--text-muted)]">PAN / Aadhaar:</span>
                          <span className="font-mono text-[var(--text-subtle)]">
                            {emp.panNumber || 'PAN Pending'} · {emp.aadhaarNumber ? `****${emp.aadhaarNumber.slice(-4)}` : 'Aadhaar Pending'}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[var(--text-muted)]">Qualification:</span>
                          <span className="text-[var(--text-main)] truncate max-w-[170px]" title={emp.highestDegree || 'B.E. Civil Engineering'}>
                            {emp.highestDegree || 'Degree on record'}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[var(--text-muted)]">Allowances Configured:</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {emp.allowances?.length || 2} Allowance(s)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setSalaryStructureEmployee(emp)}
                        className="p-2 text-center rounded-lg bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-subtle)] text-[var(--text-main)] border border-[var(--border-subtle)] text-[11px] font-semibold transition-colors flex flex-col items-center gap-1 cursor-pointer"
                        title="Manage Basic Salary & Allowances"
                      >
                        <Calculator className="w-3.5 h-3.5 text-amber-500" />
                        <span>Salary Calc</span>
                      </button>

                      <button
                        onClick={() => {
                          setVerificationDefaultEmpId(emp.id);
                          setEditingVerification(null);
                          setIsVerificationModalOpen(true);
                        }}
                        className="p-2 text-center rounded-lg bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-subtle)] text-[var(--text-main)] border border-[var(--border-subtle)] text-[11px] font-semibold transition-colors flex flex-col items-center gap-1 cursor-pointer"
                        title="Add or review KYC Documents"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>KYC Status</span>
                      </button>

                      <button
                        onClick={() => {
                          setDocUploadDefaultEmpId(emp.id);
                          setIsDocUploadModalOpen(true);
                        }}
                        className="p-2 text-center rounded-lg bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-subtle)] text-[var(--text-main)] border border-[var(--border-subtle)] text-[11px] font-semibold transition-colors flex flex-col items-center gap-1 cursor-pointer"
                        title="View or upload official documents"
                      >
                        <FolderArchive className="w-3.5 h-3.5 text-blue-500" />
                        <span>Docs ({docsCount})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION 2: ATTENDANCE SECTION
         ======================================================== */}
      {isSubPermitted && activeTab === 'attendance' && (
        <div className="space-y-6">
          {/* Quick Attendance Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">Total On Duty Today</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                {scopedUsers.length - scopedLeaves.filter(l => l.status === 'Approved').length} / {scopedUsers.length}
              </p>
              <span className="text-[11px] text-[var(--text-muted)]">Active site & HQ staff</span>
            </div>

            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">On Approved Leave</span>
              <p className="text-2xl font-black text-amber-500 mt-1 font-mono">
                {scopedLeaves.filter(l => l.status === 'Approved').length}
              </p>
              <span className="text-[11px] text-[var(--text-muted)]">Casual & Medical leaves</span>
            </div>

            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">Avg Punch-In Time</span>
              <p className="text-2xl font-black text-[var(--text-main)] mt-1 font-mono">
                09:18 AM
              </p>
              <span className="text-[11px] text-emerald-600">Within grace period</span>
            </div>

            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">Upcoming Holiday</span>
              <p className="text-base font-bold text-[var(--primary-accent-text)] mt-1 truncate">
                {holidays[0]?.title || 'Gujarat Day'}
              </p>
              <span className="text-[11px] text-[var(--text-muted)] font-mono">{holidays[0]?.date || '01 May 2026'}</span>
            </div>
          </div>

          {/* Today's Punch Clock In/Out Roster */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-[var(--text-main)]">Daily Biometric & GPS Punch In / Punch Out Log</h3>
                <p className="text-xs text-[var(--text-muted)]">Geo-tagged timestamps verified against Vadodara Site Geofence coordinates</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTimeSheetModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold bg-[var(--primary-accent)] text-slate-950 rounded-lg hover:opacity-90 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Manual Supervisor Punch</span>
                </button>
              </div>
            </div>

            <div className="border border-[var(--border-subtle)] rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] text-[11px] font-mono border-b border-[var(--border-subtle)]">
                  <tr>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Shift Schedule</th>
                    <th className="py-3 px-4">Punch In Time</th>
                    <th className="py-3 px-4">Punch Out Time</th>
                    <th className="py-3 px-4">GPS Geo-Tag Location</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] font-mono text-[11px]">
                  {scopedUsers.map((u, i) => {
                    const sampleTime = timeLogs.find(t => t.employeeId === u.id);
                    const inTime = sampleTime?.clockIn || (i % 2 === 0 ? '09:15 AM' : '09:28 AM');
                    const outTime = sampleTime?.clockOut || (i % 3 === 0 ? '18:45 PM' : 'On-Duty (Active)');
                    const shift = sampleTime?.shiftType || 'General Shift (09:30 AM - 06:30 PM)';
                    const loc = sampleTime?.locationTag || (i % 2 === 0 ? 'Vadodara Vasna Project Site' : 'Corporate HQ Depot');

                    return (
                      <tr key={u.id} className="hover:bg-[var(--bg-surface-subtle)]">
                        <td className="py-3 px-4 font-sans font-semibold text-[var(--text-main)]">
                          {u.fullName}
                          <span className="block text-[10px] font-normal text-[var(--text-muted)] font-mono">{u.role.replace('_', ' ')}</span>
                        </td>
                        <td className="py-3 px-4 text-[var(--text-main)] font-sans">{shift}</td>
                        <td className="py-3 px-4 text-emerald-600 font-bold">{inTime}</td>
                        <td className="py-3 px-4 text-[var(--text-main)]">{outTime}</td>
                        <td className="py-3 px-4 text-[var(--text-muted)] font-sans flex items-center gap-1.5 mt-2">
                          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{loc}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 rounded">
                            Present / Geofenced
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Leave Management & Holiday Calendar Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Leaves Section */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[var(--text-main)]">Leave Management</h3>
                  <p className="text-xs text-[var(--text-muted)]">Casual, Sick & Comp-Off applications</p>
                </div>
                <button
                  onClick={() => setIsLeaveModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold bg-[var(--primary-accent)] text-slate-950 rounded-lg hover:opacity-90 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Apply Leave</span>
                </button>
              </div>

              <div className="space-y-2 mt-2">
                {scopedLeaves.map((lv) => (
                  <div key={lv.id} className="p-3 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[var(--text-main)]">{lv.employeeName}</div>
                      <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        {lv.leaveType} · {lv.startDate} to {lv.endDate} ({lv.daysCount}d)
                      </div>
                      <p className="text-[11px] text-[var(--text-subtle)] italic mt-1 font-sans">"{lv.reason}"</p>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1.5">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        lv.status === 'Approved'
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : lv.status === 'Rejected'
                          ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      }`}>
                        {lv.status}
                      </span>
                      {isElevated && lv.status === 'Pending' && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateLeaveStatus(lv.id, 'Approved')}
                            className="px-2 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded hover:bg-emerald-700 cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateLeaveStatus(lv.id, 'Rejected')}
                            className="px-2 py-0.5 text-[10px] font-bold bg-rose-600 text-white rounded hover:bg-rose-700 cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Holiday Calendar */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[var(--text-main)]">Company Holiday Calendar</h3>
                  <p className="text-xs text-[var(--text-muted)]">Gujarat State Festivals & National Holidays</p>
                </div>
                {isElevated && (
                  <button
                    onClick={openAddHoliday}
                    className="px-3 py-1.5 text-xs font-semibold bg-[var(--primary-accent)] text-slate-950 rounded-lg hover:opacity-90 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Holiday</span>
                  </button>
                )}
              </div>

              <div className="space-y-2 mt-2 max-h-[340px] overflow-y-auto pr-1">
                {holidays.map((hol) => (
                  <div key={hol.id} className="p-3 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--primary-accent-bg)] border border-[var(--primary-accent-border)] text-center flex flex-col justify-center">
                        <span className="text-[9px] font-bold text-[var(--primary-accent-text)] uppercase">{new Date(hol.date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-sm font-black text-[var(--text-main)] leading-none">{new Date(hol.date).getDate()}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[var(--text-main)]">{hol.title}</h4>
                        <p className="text-[11px] text-[var(--text-muted)]">{hol.type}</p>
                      </div>
                    </div>

                    {isElevated && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => openEditHoliday(hol)}
                          className="p-1 text-[var(--text-subtle)] hover:text-[var(--text-main)] rounded cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteHoliday(hol.id)}
                          className="p-1 text-[var(--text-subtle)] hover:text-rose-500 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          SECTION 3: PAYROLL SECTION
         ======================================================== */}
      {isSubPermitted && activeTab === 'payroll' && (
        <div className="space-y-6">
          {/* Payroll Control Banner */}
          <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-[var(--text-main)]">Monthly Payroll Register</h3>
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-amber-500/10 text-amber-600 rounded">
                  {payrollMonth}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Calculate earnings, allowances, statutory deductions (PF/PT/TDS) and disburse net salaries
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={payrollMonth}
                onChange={(e) => setPayrollMonth(e.target.value)}
                className="px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-semibold"
              >
                <option value="February 2026">February 2026</option>
                <option value="January 2026">January 2026</option>
                <option value="October 2026">October 2026</option>
                <option value="ALL">All Recorded Months</option>
              </select>

              {isElevated && (
                <button
                  onClick={() => generateMonthlyPayroll(payrollMonth.split(' ')[0] || 'February', 2026)}
                  className="px-4 py-2 text-xs font-bold bg-[var(--primary-accent)] text-slate-950 rounded-lg hover:opacity-90 flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Generate / Re-calculate Month Payroll</span>
                </button>
              )}
            </div>
          </div>

          {/* Aggregate KPI Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">
                {canViewAllStaff ? 'Total Gross Wages' : 'My Gross Earnings'}
              </span>
              <p className="text-2xl font-black text-[var(--text-main)] font-mono mt-1">
                {canViewFinancials || !canViewAllStaff
                  ? `₹${payrollStats.totalGross.toLocaleString('en-IN')}`
                  : '🔒 Confidential'}
              </p>
              <span className="text-[11px] text-[var(--text-muted)]">
                {canViewFinancials || !canViewAllStaff
                  ? formatLakhsOrCrores(payrollStats.totalGross)
                  : 'Restricted to Accounts / Marketing / Admin'}
              </span>
            </div>

            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">
                {canViewAllStaff ? 'Statutory Deductions' : 'My Total Deductions'}
              </span>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono mt-1">
                {canViewFinancials || !canViewAllStaff
                  ? `-₹${payrollStats.totalDeductions.toLocaleString('en-IN')}`
                  : '🔒 Confidential'}
              </p>
              <span className="text-[11px] text-[var(--text-muted)]">PF, PT & TDS remittances</span>
            </div>

            <div className="p-4 bg-[var(--primary-accent-bg)] border border-[var(--primary-accent-border)] rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono text-[var(--primary-accent-text)] uppercase font-bold">
                {canViewAllStaff ? 'Net Payout Disbursement' : 'My Net Take-Home'}
              </span>
              <p className="text-2xl font-black text-[var(--primary-accent-text)] font-mono mt-1">
                {canViewFinancials || !canViewAllStaff
                  ? `₹${payrollStats.totalNet.toLocaleString('en-IN')}`
                  : '🔒 Confidential'}
              </p>
              <span className="text-[11px] text-[var(--text-muted)]">
                {canViewFinancials || !canViewAllStaff
                  ? `${formatLakhsOrCrores(payrollStats.totalNet)} net take-home`
                  : 'Financial access restricted'}
              </span>
            </div>

            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">Settlement Status</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                {payrollStats.paidCount} / {payrollStats.slipsForMonth.length} Paid
              </p>
              <span className="text-[11px] text-[var(--text-muted)]">
                {payrollStats.pendingCount > 0 ? `${payrollStats.pendingCount} pending release` : '100% Disbursed'}
              </span>
            </div>
          </div>

          {/* Payroll Slips Table */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="border border-[var(--border-subtle)] rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[750px]">
                <thead className="bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] text-[11px] font-mono border-b border-[var(--border-subtle)]">
                  <tr>
                    <th className="py-3 px-4">Slip ID</th>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4 text-center">Days (Att/Total)</th>
                    <th className="py-3 px-4 text-right">Basic Pay</th>
                    <th className="py-3 px-4 text-right">Allowances</th>
                    <th className="py-3 px-4 text-right">Deductions</th>
                    <th className="py-3 px-4 text-right">Net Take-Home</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] font-mono text-[11px]">
                  {payrollStats.slipsForMonth.map((slip) => {
                    const allowanceSum = slip.grossSalary - slip.baseSalary - (slip.overtimePay || 0) - (slip.targetIncentiveCommission || 0);
                    const totalDeds = slip.deductions.providentFund + slip.deductions.professionalTax + slip.deductions.taxDeducted + slip.deductions.advanceDeduction;

                    return (
                      <tr key={slip.id} className="hover:bg-[var(--bg-surface-subtle)]">
                        <td className="py-3 px-4 font-bold text-[var(--primary-accent-text)]">{slip.slipNumber}</td>
                        <td className="py-3 px-4 font-sans font-semibold text-[var(--text-main)]">
                          {slip.employeeName}
                        </td>
                        <td className="py-3 px-4 text-center text-[var(--text-main)]">
                          {slip.daysPresent} / {slip.workingDays}
                        </td>
                        <td className="py-3 px-4 text-right text-[var(--text-main)]">
                          ₹{slip.baseSalary.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right text-emerald-600">
                          +₹{Math.max(0, allowanceSum).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right text-rose-600">
                          -₹{totalDeds.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                          ₹{slip.netPayable.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isElevated ? (
                            <button
                              onClick={() => {
                                const newStatus: SalarySlip['paymentStatus'] = slip.paymentStatus === 'Paid' ? 'Processing' : 'Paid';
                                updateSalarySlipStatus(
                                  slip.id, 
                                  newStatus, 
                                  newStatus === 'Paid' ? `CMS/NEFT/${Date.now().toString().slice(-6)}` : undefined
                                );
                              }}
                              className={`px-2.5 py-1 text-[10px] font-bold rounded cursor-pointer transition-colors ${
                                slip.paymentStatus === 'Paid'
                                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                              }`}
                            >
                              {slip.paymentStatus}
                            </button>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-600 rounded">
                              {slip.paymentStatus}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedSlip(slip)}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-subtle)] text-[var(--text-main)] border border-[var(--border-subtle)] rounded transition-colors cursor-pointer"
                          >
                            Payslip PDF
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION 4: REPORT SECTION
         ======================================================== */}
      {isSubPermitted && activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-surface)] p-5 rounded-2xl border border-[var(--border-subtle)] shadow-xs">
            <div>
              <h3 className="font-black text-lg text-[var(--text-main)]">HR & Payroll Executive Analytics</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Workforce expenditures in Indian Lakhs/Crores, manhour utilization, statutory PF/TDS and KYC compliance
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 text-xs font-semibold bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-subtle)] text-[var(--text-main)] border border-[var(--border-subtle)] rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Export HR Audit Report</span>
            </button>
          </div>

          {/* High-level KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">Total Monthly Salary Outlay</span>
              <p className="text-2xl font-black text-[var(--text-main)] font-mono mt-1">
                {canViewFinancials ? formatLakhsOrCrores(payrollStats.totalGross) : '🔒 Confidential'}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{canViewFinancials ? `Across ${scopedUsers.length} active positions` : 'Restricted to Accounts / Mktg / Admin'}</span>
              </div>
            </div>

            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">Total Man-Hours Logged</span>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono mt-1">
                {timesheetStats.totalRegularHours + timesheetStats.totalOtHours} <span className="text-sm font-normal">hrs</span>
              </p>
              <span className="text-[11px] text-[var(--text-muted)] font-mono">
                {timesheetStats.totalOtHours} hrs overtime utilization
              </span>
            </div>

            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">Overall KYC Verification Rate</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                {kycComplianceStats.overallRate}%
              </p>
              <span className="text-[11px] text-[var(--text-muted)] font-mono">
                {kycComplianceStats.usersWithAadhaar} Aadhaar · {kycComplianceStats.usersWithPan} PAN Verified
              </span>
            </div>

            <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">Official Document Vault</span>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono mt-1">
                {scopedDocs.length} <span className="text-sm font-normal">Docs</span>
              </p>
              <span className="text-[11px] text-[var(--text-muted)]">
                Appointment, Joining & NDAs
              </span>
            </div>
          </div>

          {/* Department Breakdown & Compliance Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Department Salary Distribution */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4 shadow-xs">
              <h4 className="font-bold text-sm text-[var(--text-main)]">Departmental Salary Expenditure</h4>
              
              {canViewFinancials ? (
                <div className="space-y-3">
                  {[
                    { dept: 'Civil Engineering & Construction', budget: 145000, color: 'bg-amber-500' },
                    { dept: 'Architecture & Interior Design', budget: 75000, color: 'bg-indigo-500' },
                    { dept: 'Executive / Leadership', budget: 135000, color: 'bg-emerald-500' },
                    { dept: 'Sales & Business Development', budget: 45000, color: 'bg-blue-500' },
                    { dept: 'Finance & Accounts', budget: 48000, color: 'bg-rose-500' },
                  ].map((item) => {
                    const total = 448000;
                    const pct = Math.round((item.budget / total) * 100);
                    return (
                      <div key={item.dept} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-[var(--text-main)]">{item.dept}</span>
                          <span className="font-mono text-[var(--text-main)]">₹{item.budget.toLocaleString('en-IN')} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-[var(--bg-surface-subtle)] h-2 rounded-full overflow-hidden border border-[var(--border-subtle)]">
                          <div className={`h-full ${item.color}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center space-y-2 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)]">
                  <Lock className="w-5 h-5 text-amber-500 mx-auto" />
                  <div className="text-xs font-bold text-[var(--text-main)]">Departmental Financials Confidential</div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    Corporate salary outlay and payroll distributions are restricted to Accounts, Marketing & Admin.
                  </div>
                </div>
              )}
            </div>

            {/* Statutory & Regulatory Audit Summary */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4 shadow-xs">
              <h4 className="font-bold text-sm text-[var(--text-main)]">Statutory & Verification Compliance Matrix</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-[var(--text-main)]">
                    <span>Aadhaar Cards</span>
                    <span className="text-emerald-600 font-mono">{kycComplianceStats.usersWithAadhaar} / {users.length}</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">UIDAI 12-digit verified</p>
                </div>

                <div className="p-3 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-[var(--text-main)]">
                    <span>Income Tax PAN</span>
                    <span className="text-emerald-600 font-mono">{kycComplianceStats.usersWithPan} / {users.length}</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">TDS Form 16 matching</p>
                </div>

                <div className="p-3 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-[var(--text-main)]">
                    <span>Degree Certificates</span>
                    <span className="text-indigo-600 font-mono">{kycComplianceStats.usersWithDegree} / {users.length}</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">Engineering & Diploma credentials</p>
                </div>

                <div className="p-3 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-[var(--text-main)]">
                    <span>Official Documents</span>
                    <span className="text-amber-600 font-mono">{kycComplianceStats.usersWithDocs} / {users.length}</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">Signed employment contracts</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                <span className="font-bold block">Vadodara Labor Commissionerate Audit Ready</span>
                <p className="text-[11px] mt-0.5">
                  All Provident Fund (EPF), Gujarat Professional Tax (PT), and site labor insurance coverage entries are synced.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          SECTION 5: VERIFICATION SECTION (Employees ID, Aadhaar, PAN, DL, Degree)
         ======================================================== */}
      {isSubPermitted && activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <select
                value={selectedVerificationDocType}
                onChange={(e) => setSelectedVerificationDocType(e.target.value)}
                className="px-3 py-1.5 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] font-medium"
              >
                <option value="ALL">All Verification Doc Types</option>
                <option value="Aadhaar Card">Aadhaar Card (UIDAI)</option>
                <option value="PAN Card">PAN Card (Income Tax)</option>
                <option value="Driving License">Driving License</option>
                <option value="Degree / Educational Certificate">Educational Degree / Diploma</option>
                <option value="Employee ID Card">Company Employee ID Card</option>
                <option value="Police Verification">Police Verification</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingVerification(null);
                  setVerificationDefaultEmpId(scopedUsers[0]?.id || '');
                  setIsVerificationModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-[var(--primary-accent)] text-slate-950 rounded-lg hover:opacity-90 flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add KYC Verification</span>
              </button>
            </div>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="border border-[var(--border-subtle)] rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[750px]">
                <thead className="bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] text-[11px] font-mono border-b border-[var(--border-subtle)]">
                  <tr>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Document Type</th>
                    <th className="py-3 px-4">Document Number</th>
                    <th className="py-3 px-4">Issuing Authority</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4">Verified By / Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-xs">
                  {scopedVerifications
                    .filter(v => selectedVerificationDocType === 'ALL' || v.docType === selectedVerificationDocType)
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-[var(--bg-surface-subtle)]">
                        <td className="py-3 px-4 font-semibold text-[var(--text-main)]">
                          {item.employeeName}
                        </td>
                        <td className="py-3 px-4 font-medium text-[var(--text-main)]">
                          <span>{item.docType}</span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-[var(--primary-accent-text)]">
                          {item.docNumber}
                        </td>
                        <td className="py-3 px-4 text-[var(--text-muted)]">
                          {item.issuedBy || 'Government of India'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            item.status === 'Verified'
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                              : item.status === 'Rejected'
                              ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          }`}>
                            {item.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[var(--text-muted)] font-mono text-[11px]">
                          {item.verifiedBy ? `${item.verifiedBy} (${item.verifiedDate})` : 'Awaiting Review'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {item.status !== 'Verified' && (
                              <button
                                onClick={() => updateVerificationStatus(item.id, 'Verified', 'Physical certificate verified by HR')}
                                className="px-2 py-1 text-[11px] font-bold bg-emerald-600 text-white rounded hover:bg-emerald-700 cursor-pointer"
                              >
                                Verify
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setEditingVerification(item);
                                setIsVerificationModalOpen(true);
                              }}
                              className="p-1 text-[var(--text-subtle)] hover:text-[var(--text-main)] rounded cursor-pointer"
                              title="Edit record"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteVerificationDoc(item.id)}
                              className="p-1 text-[var(--text-subtle)] hover:text-rose-500 rounded cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION 6: EMPLOYEES DOC. SECTION (Joining, Appointment letters, etc.)
         ======================================================== */}
      {isSubPermitted && activeTab === 'docs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <select
                value={selectedDocCategory}
                onChange={(e) => setSelectedDocCategory(e.target.value)}
                className="px-3 py-1.5 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] font-medium"
              >
                <option value="ALL">All Document Vault Categories</option>
                <option value="Joining Letter">Joining Report / Letter</option>
                <option value="Appointment Letter">Appointment Letter</option>
                <option value="Offer Letter">Offer Letter</option>
                <option value="Salary Increment Letter">Salary Increment Letter</option>
                <option value="NDA & Code of Conduct">NDA & Code of Conduct</option>
                <option value="Experience / Relieving Letter">Experience / Relieving Letter</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setDocUploadDefaultEmpId(scopedUsers[0]?.id || '');
                  setIsDocUploadModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-[var(--primary-accent)] text-slate-950 rounded-lg hover:opacity-90 flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload Employee Document</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scopedDocs
              .filter(d => selectedDocCategory === 'ALL' || d.category === selectedDocCategory)
              .map((doc) => (
                <div 
                  key={doc.id}
                  className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] rounded-2xl shadow-xs transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)] uppercase">
                        {doc.category}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-[var(--text-main)] mt-3 leading-snug">
                      {doc.title}
                    </h4>
                    <p className="text-xs text-[var(--primary-accent-text)] font-semibold mt-0.5">
                      {doc.employeeName}
                    </p>

                    <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] space-y-1 text-[11px] text-[var(--text-muted)] font-mono">
                      <div>Uploaded: {doc.uploadDate} · {doc.fileSize || '1.2 MB'}</div>
                      <div>Uploaded By: {doc.uploadedBy}</div>
                      {doc.notes && <div className="italic text-[10px] font-sans">"{doc.notes}"</div>}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                    <button
                      onClick={() => alert(`Simulated document viewer for: ${doc.title}\nStored in safe vault: ${doc.fileUrl || '/vault/docs'}`)}
                      className="text-xs font-semibold text-[var(--text-main)] hover:text-[var(--primary-accent-text)] flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download / View</span>
                    </button>

                    <button
                      onClick={() => deleteEmployeeDoc(doc.id)}
                      className="p-1 text-[var(--text-subtle)] hover:text-rose-500 rounded cursor-pointer"
                      title="Remove file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION 7: EMPLOYEE TIME SHEET (Shift time / Over Time / Break Time)
         ======================================================== */}
      {isSubPermitted && activeTab === 'timesheets' && (
        <div className="space-y-4">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">Regular Duty Hours</span>
              <p className="text-2xl font-black text-[var(--text-main)] font-mono mt-1">
                {timesheetStats.totalRegularHours} <span className="text-sm font-normal">hrs</span>
              </p>
              <span className="text-[11px] text-[var(--text-muted)]">Standard shift allocations</span>
            </div>

            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">Total Overtime (OT Hours)</span>
              <p className="text-2xl font-black text-amber-500 font-mono mt-1">
                {timesheetStats.totalOtHours} <span className="text-sm font-normal">hrs</span>
              </p>
              <span className="text-[11px] text-[var(--text-muted)]">Evening and concrete pour extensions</span>
            </div>

            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono text-[var(--text-subtle)] uppercase">Avg Break Duration</span>
              <p className="text-2xl font-black text-indigo-500 font-mono mt-1">
                {timesheetStats.avgBreakMinutes} <span className="text-sm font-normal">Mins</span>
              </p>
              <span className="text-[11px] text-[var(--text-muted)]">Lunch and tea allowances</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[var(--text-main)]">Daily Timesheet Register</h3>
              <span className="text-xs text-[var(--text-muted)] font-mono">({scopedTimeLogs.length} Entries)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingTimeLog(null);
                  setIsTimeSheetModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-[var(--primary-accent)] text-slate-950 rounded-lg hover:opacity-90 flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Shift Timesheet</span>
              </button>
            </div>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="border border-[var(--border-subtle)] rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[800px]">
                <thead className="bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] text-[11px] font-mono border-b border-[var(--border-subtle)]">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Shift Schedule</th>
                    <th className="py-3 px-4">Clock In / Out</th>
                    <th className="py-3 px-4">Break Time</th>
                    <th className="py-3 px-4 text-center">Regular</th>
                    <th className="py-3 px-4 text-center">Overtime (OT)</th>
                    <th className="py-3 px-4 text-center">Total Hours</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] font-mono text-[11px]">
                  {scopedTimeLogs.map((log) => {
                    const linkedProj = projects.find(p => p.id === log.projectId);
                    return (
                      <tr key={log.id} className="hover:bg-[var(--bg-surface-subtle)]">
                        <td className="py-3 px-4 text-[var(--text-main)]">{log.date}</td>
                        <td className="py-3 px-4 font-sans font-semibold text-[var(--text-main)]">
                          {log.employeeName}
                          {linkedProj && (
                            <span className="block text-[10px] text-[var(--text-subtle)] font-sans">{linkedProj.name}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-sans text-[var(--text-main)]">
                          <span className="px-2 py-0.5 rounded bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[10px] font-semibold">
                            {log.shiftType || 'General Shift'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[var(--text-main)]">
                          {log.clockIn} - {log.clockOut || 'Active'}
                        </td>
                        <td className="py-3 px-4 text-[var(--text-muted)] font-sans">
                          <div className="flex items-center gap-1">
                            <Coffee className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>{log.breakDurationMinutes || 60}m</span>
                          </div>
                          {log.breakNotes && (
                            <span className="text-[10px] text-[var(--text-subtle)] block truncate max-w-[150px]">{log.breakNotes}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center text-[var(--text-main)]">{log.regularHours} hrs</td>
                        <td className="py-3 px-4 text-center text-amber-600 font-bold">
                          {log.overtimeHours ? `+${log.overtimeHours} hrs` : '-'}
                        </td>
                        <td className="py-3 px-4 text-center font-black text-emerald-600 dark:text-emerald-400">
                          {log.totalWorkingHours || (log.regularHours + log.overtimeHours)} hrs
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingTimeLog(log);
                                setIsTimeSheetModalOpen(true);
                              }}
                              className="p-1 text-[var(--text-subtle)] hover:text-[var(--text-main)] rounded cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteTimeLog(log.id)}
                              className="p-1 text-[var(--text-subtle)] hover:text-rose-500 rounded cursor-pointer"
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
        </div>
      )}

      {/* ========================================================
          SECTION 8: SALARY CALCULATION (Basic + All Allowances Add/Edit/Delete)
         ======================================================== */}
      {isSubPermitted && activeTab === 'salary_calc' && (
        <div className="space-y-6">
          <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-[var(--text-main)]">Salary Structure & Allowance Configurator</h3>
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 rounded">
                  Basic + Custom Allowances
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Formula: Basic Salary + (HRA + Site Hardship + Conveyance + Medical + Mobile) - (PF + PT + TDS) = Net Salary
              </p>
            </div>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="border border-[var(--border-subtle)] rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[850px]">
                <thead className="bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] text-[11px] font-mono border-b border-[var(--border-subtle)]">
                  <tr>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Role & Dept</th>
                    <th className="py-3 px-4 text-right">Basic Monthly Pay</th>
                    <th className="py-3 px-4">Configured Allowances (Add/Edit/Delete)</th>
                    <th className="py-3 px-4 text-right">Total Allowances</th>
                    <th className="py-3 px-4 text-right">Monthly Gross</th>
                    <th className="py-3 px-4 text-right">Est. Net Take-Home</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] font-mono text-[11px]">
                  {scopedUsers.map((emp) => {
                    const basic = emp.salaryBase || 35000;
                    const allowList = emp.allowances || [];
                    const allowTotal = allowList.reduce((acc, a) => acc + a.amount, 0);
                    const gross = basic + allowTotal;
                    // Standard statutory deductions
                    const pf = Math.round(basic * 0.06);
                    const pt = 200;
                    const tds = gross > 50000 ? Math.round(gross * 0.05) : 0;
                    const net = gross - (pf + pt + tds);

                    return (
                      <tr key={emp.id} className="hover:bg-[var(--bg-surface-subtle)]">
                        <td className="py-3 px-4 font-sans font-semibold text-[var(--text-main)]">
                          {emp.fullName}
                        </td>
                        <td className="py-3 px-4 font-sans text-[var(--text-muted)] text-[11px]">
                          {emp.designation || emp.role.replace('_', ' ')}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-[var(--text-main)]">
                          ₹{basic.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 font-sans">
                          <div className="flex flex-wrap gap-1 max-w-[280px]">
                            {allowList.map((a) => (
                              <span 
                                key={a.id} 
                                className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                                title={a.type || 'Allowance'}
                              >
                                {a.name}: ₹{a.amount}
                              </span>
                            ))}
                            {allowList.length === 0 && (
                              <span className="text-[10px] text-slate-400 italic">No custom allowances</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-600">
                          +₹{allowTotal.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-[var(--text-main)]">
                          ₹{gross.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right font-black text-emerald-600 dark:text-emerald-400 text-xs">
                          ₹{net.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right font-sans">
                          {(isElevated || emp.id === currentUser?.id) && (
                            <button
                              onClick={() => setSalaryStructureEmployee(emp)}
                              className="px-3 py-1 text-xs font-semibold bg-[var(--primary-accent)] text-slate-950 rounded-lg hover:opacity-90 transition-all shadow-xs cursor-pointer"
                            >
                              Configure Allowances
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          GLOBAL MODALS
         ======================================================== */}
      {/* 1. Salary Structure Configuration Modal */}
      {salaryStructureEmployee && (
        <SalaryStructureModal
          isOpen={!!salaryStructureEmployee}
          onClose={() => setSalaryStructureEmployee(null)}
          employee={salaryStructureEmployee}
        />
      )}

      {/* 2. Verification KYC Modal */}
      {isVerificationModalOpen && (
        <VerificationModal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          initialData={editingVerification}
          defaultEmployeeId={verificationDefaultEmpId}
        />
      )}

      {/* 3. Official Employee Document Upload Modal */}
      {isDocUploadModalOpen && (
        <EmployeeDocUploadModal
          isOpen={isDocUploadModalOpen}
          onClose={() => setIsDocUploadModalOpen(false)}
          defaultEmployeeId={docUploadDefaultEmpId}
        />
      )}

      {/* 4. Timesheet Entry Modal */}
      {isTimeSheetModalOpen && (
        <TimeSheetEntryModal
          isOpen={isTimeSheetModalOpen}
          onClose={() => setIsTimeSheetModalOpen(false)}
          initialData={editingTimeLog}
        />
      )}

      {/* 5. Printable Payslip Modal */}
      <PayslipModal slip={selectedSlip} onClose={() => setSelectedSlip(null)} />

      {/* 6. Leave Application Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden my-6">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
              <h3 className="text-base font-bold text-[var(--text-main)]">Apply for Time Off / Leave</h3>
              <button onClick={() => setIsLeaveModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleApplyLeave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Leave Classification</label>
                <select
                  value={leaveType}
                  onChange={e => setLeaveType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
                >
                  <option value="Casual Leave">Casual Leave (CL)</option>
                  <option value="Sick Leave">Sick Leave (SL)</option>
                  <option value="Earned Site Leave">Earned Site Leave (Post Milestone)</option>
                  <option value="Compensatory Off">Compensatory Off (Weekend pour shift)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Reason for Leave</label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Provide personal or family reason..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-surface-subtle)] rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg shadow-sm cursor-pointer"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Add / Edit Holiday Modal */}
      {isHolidayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden my-6">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]">
              <div className="flex items-center gap-2">
                <PartyPopper className="w-5 h-5 text-[var(--primary-accent-text)]" />
                <h3 className="text-base font-bold text-[var(--text-main)]">
                  {editingHoliday ? 'Edit Company Holiday' : 'Add New Company Holiday'}
                </h3>
              </div>
              <button onClick={() => setIsHolidayModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHoliday} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Holiday Title *</label>
                <input
                  type="text"
                  value={holidayTitle}
                  onChange={e => setHolidayTitle(e.target.value)}
                  placeholder="e.g. Uttarayan / Makar Sankranti, Diwali, Republic Day"
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Date *</label>
                  <input
                    type="date"
                    value={holidayDate}
                    onChange={e => setHolidayDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Festival / Type</label>
                  <select
                    value={holidayType}
                    onChange={e => setHolidayType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                  >
                    <option value="Regional / State Festival">Regional / State Festival (Gujarat)</option>
                    <option value="National Holiday">National Holiday</option>
                    <option value="Company Foundation Day">Company Foundation Day</option>
                    <option value="Public Holiday">Public Holiday</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Description / Notes</label>
                <textarea
                  value={holidayDesc}
                  onChange={e => setHolidayDesc(e.target.value)}
                  placeholder="e.g. Gujarat International Kite festival celebration across Vadodara & regional offices..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                />
              </div>

              <div className="flex items-center gap-2 p-2 bg-[var(--bg-surface-subtle)] rounded-lg border border-[var(--border-subtle)]">
                <input
                  type="checkbox"
                  id="mandatoryCheck"
                  checked={isMandatory}
                  onChange={e => setIsMandatory(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
                <label htmlFor="mandatoryCheck" className="text-xs text-[var(--text-main)] cursor-pointer">
                  Mandatory Paid Holiday for All Branches (Site & Corporate)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsHolidayModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-surface-subtle)] rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingHoliday ? 'Save Holiday Changes' : 'Add to Calendar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
