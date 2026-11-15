import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Branch,
  BranchAddress,
  Project,
  DailyProgressReport,
  LaborTimeLog,
  InventoryItem,
  MaterialTransferRequest,
  CrmLead,
  DesignDraft,
  CollaborationTask,
  SalarySlip,
  Holiday,
  LeaveRequest,
  CustomAppModule,
  RolePermissions,
  NotificationItem,
  CompanyProfile,
  ModuleKey,
  ThemeMode,
  AccentColor,
  Inquiry,
  ConstructionPackage,
  InquiryFollowUp,
  InquiryReminder,
  ReminderType,
  InquiryStage,
  SalaryAllowance,
  EmployeeVerification,
  EmployeeDocument,
  HrSubSection,
  CrmSubSection,
} from '../types';
import {
  INITIAL_COMPANY_PROFILE,
  INITIAL_BRANCHES,
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_DPR_REPORTS,
  INITIAL_INVENTORY,
  INITIAL_TRANSFERS,
  INITIAL_LEADS,
  INITIAL_DESIGN_DRAFTS,
  INITIAL_COLLAB_TASKS,
  INITIAL_SALARY_SLIPS,
  INITIAL_HOLIDAYS,
  INITIAL_LEAVES,
  INITIAL_TIME_LOGS,
  INITIAL_MODULES,
  INITIAL_ROLE_PERMISSIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PROJECT_CATEGORIES,
  INITIAL_CONSTRUCTION_PACKAGES,
  INITIAL_INQUIRIES,
  INITIAL_REMINDERS,
  INITIAL_VERIFICATIONS,
  INITIAL_EMPLOYEE_DOCS,
} from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  activeBranchId: string; // 'ALL' or branchId
  activeTab: string;
  isMobileSimulated: boolean;
  companyProfile: CompanyProfile;
  branches: Branch[];
  users: User[];
  projects: Project[];
  dprs: DailyProgressReport[];
  timeLogs: LaborTimeLog[];
  inventory: InventoryItem[];
  transfers: MaterialTransferRequest[];
  leads: CrmLead[];
  inquiries: Inquiry[];
  packages: ConstructionPackage[];
  reminders: InquiryReminder[];
  drafts: DesignDraft[];
  tasks: CollaborationTask[];
  salarySlips: SalarySlip[];
  holidays: Holiday[];
  leaves: LeaveRequest[];
  verifications: EmployeeVerification[];
  employeeDocs: EmployeeDocument[];
  modules: CustomAppModule[];
  rolePermissions: RolePermissions[];
  notifications: NotificationItem[];
  theme: ThemeMode;
  accentColor: AccentColor;
  
  // Actions
  setTheme: (t: ThemeMode) => void;
  setAccentColor: (a: AccentColor) => void;
  setActiveBranchId: (id: string) => void;
  setActiveTab: (tab: string) => void;
  hrSubTab: HrSubSection;
  setHrSubTab: (tab: HrSubSection) => void;
  crmSubTab: CrmSubSection;
  setCrmSubTab: (tab: CrmSubSection) => void;
  setIsMobileSimulated: (val: boolean) => void;
  login: (username: string, password: string) => { success: boolean; message?: string; tempPasswordAlert?: boolean };
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updatePassword: (userId: string, newPass: string) => void;
  addEmployee: (emp: Partial<User>) => { tempPassword: string; user: User };
  updateMarketingTarget: (userId: string, target: number, commissionRate: number) => void;
  
  // Employee directory & Salary Calculation management
  updateEmployee: (userId: string, updated: Partial<User>) => void;
  deleteEmployee: (userId: string) => { success: boolean; message?: string };
  updateEmployeeAllowances: (userId: string, baseSalary: number, allowances: SalaryAllowance[]) => void;
  addEmployeeAllowance: (userId: string, allowance: Omit<SalaryAllowance, 'id'>) => void;
  deleteEmployeeAllowance: (userId: string, allowanceId: string) => void;

  // HR Verification (KYC)
  addVerificationDoc: (doc: Omit<EmployeeVerification, 'id'>) => void;
  updateVerificationStatus: (verificationId: string, status: EmployeeVerification['status'], remarks?: string) => void;
  deleteVerificationDoc: (verificationId: string) => void;

  // HR Official Documents
  uploadEmployeeDoc: (doc: Omit<EmployeeDocument, 'id' | 'uploadDate'>) => void;
  deleteEmployeeDoc: (docId: string) => void;

  // Payroll Processing
  generateMonthlyPayroll: (month: string, year: number) => { count: number; totalGross: number };
  updateSalarySlipStatus: (slipId: string, status: SalarySlip['paymentStatus'], transactionRef?: string) => void;

  // Timesheets with Shifts, Overtime, and Break Time
  addTimeLog: (log: Partial<LaborTimeLog>) => void;
  updateTimeLog: (logId: string, updated: Partial<LaborTimeLog>) => void;
  deleteTimeLog: (logId: string) => void;

  // Company Profile & Branch Network
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => void;
  updateStatutoryVisibility: (roles: UserRole[]) => void;
  addBranchAddress: (branch: Partial<BranchAddress>) => void;
  updateBranchAddress: (branchId: string, updated: Partial<BranchAddress>) => void;
  deleteBranchAddress: (branchId: string) => void;

  // Project management
  projectCategories: string[];
  addProjectCategory: (category: string) => void;
  deleteProjectCategory: (category: string) => void;
  addProject: (p: Partial<Project>) => void;
  editProject: (projectId: string, updated: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  toggleProjectHold: (projectId: string) => void;
  allocateEngineersToProject: (projectId: string, engineerIds: string[]) => void;
  
  // Field DPR & photos
  addDpr: (dpr: Partial<DailyProgressReport>) => void;
  
  // CRM, Inquiries & Follow-ups
  addInquiry: (inq: Partial<Inquiry>) => Inquiry;
  updateInquiry: (inquiryId: string, updated: Partial<Inquiry>) => void;
  updateInquiryStage: (inquiryId: string, stage: InquiryStage) => void;
  deleteInquiry: (inquiryId: string) => void;
  addFollowUp: (inquiryId: string, followUp: Omit<InquiryFollowUp, 'id' | 'inquiryId'>) => void;
  addReminder: (reminder: Omit<InquiryReminder, 'id' | 'isCompleted'>) => void;
  toggleReminder: (reminderId: string) => void;
  deleteReminder: (reminderId: string) => void;
  addPackage: (pkg: Omit<ConstructionPackage, 'id'>) => { success: boolean; message?: string };
  updatePackage: (packageId: string, updated: Partial<ConstructionPackage>) => { success: boolean; message?: string };
  deletePackage: (packageId: string) => { success: boolean; message?: string };
  convertInquiryToProject: (inquiryId: string) => { success: boolean; projectId?: string; message?: string };
  
  // Legacy Leads & Designs
  addLead: (lead: Partial<CrmLead>) => void;
  updateLeadStage: (leadId: string, stage: CrmLead['stage']) => void;
  addDraft: (draft: Partial<DesignDraft>) => void;
  addDraftComment: (draftId: string, commentText: string) => void;
  updateDraftStatus: (draftId: string, status: DesignDraft['status']) => void;
  addTask: (task: Partial<CollaborationTask>) => void;
  updateTaskStatus: (taskId: string, status: CollaborationTask['status']) => void;
  
  // Materials Requisitions & dual approvals
  requestMaterialTransfer: (req: Partial<MaterialTransferRequest>) => void;
  approveByAccounts: (transferId: string, remark?: string) => void;
  approveByAdmin: (transferId: string, remark?: string) => void;
  acknowledgeTransferReceived: (transferId: string) => void;
  approveMaterialTransfer: (transferId: string, approved: boolean) => void;

  // Labor & Leave & Holiday Calendar
  clockInSimulator: (locationTag: string) => void;
  clockOutSimulator: () => void;
  applyLeave: (leave: Partial<LeaveRequest>) => void;
  updateLeaveStatus: (leaveId: string, status: 'Approved' | 'Rejected') => void;
  addHoliday: (holiday: Partial<Holiday>) => void;
  updateHoliday: (holidayId: string, updated: Partial<Holiday>) => void;
  deleteHoliday: (holidayId: string) => void;
  
  // Modules & Customization
  toggleModule: (moduleKey: string) => void;
  addCustomModule: (name: string, description: string, key: string) => void;
  updatePermission: (roleId: string, moduleKey: ModuleKey, action: 'view' | 'create' | 'edit' | 'delete' | 'approve', value: boolean) => void;
  updateHrSubPermission: (roleId: string, subSection: HrSubSection, allowed: boolean) => void;
  updateRoleStaffScope: (roleId: string, canViewAllStaffData: boolean) => void;
  updateRoleFinancialsScope: (roleId: string, canViewFinancials: boolean) => void;
  canUserViewFinancials: (user?: User | null) => boolean;
  canUserViewAllStaff: (user?: User | null) => boolean;
  hasHrSubPermission: (subSection: HrSubSection, user?: User | null) => boolean;
  markNotificationRead: (id: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'PWC_PORTAL_V2_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Default logged in as requested Admin "siteadmin"
    return INITIAL_USERS[0];
  });

  const [activeBranchId, setActiveBranchId] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [hrSubTab, setHrSubTab] = useState<HrSubSection>('team');
  const [crmSubTab, setCrmSubTab] = useState<CrmSubSection>('pipeline');
  const [isMobileSimulated, setIsMobileSimulated] = useState<boolean>(false);

  // Theme & Accent customization (default to Light Industrial Day)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'theme');
    return (saved as ThemeMode) || 'light';
  });

  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'accent');
    return (saved as AccentColor) || 'amber';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'theme', theme);
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark', 'theme-navy', 'dark');
    root.classList.add(`theme-${theme}`);
    if (theme === 'dark' || theme === 'navy') {
      root.classList.add('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'accent', accentColor);
    const root = document.documentElement;
    root.classList.remove('accent-amber', 'accent-orange', 'accent-blue', 'accent-emerald');
    root.classList.add(`accent-${accentColor}`);
  }, [accentColor]);

  // Company Profile state
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'company_profile');
    return saved ? JSON.parse(saved) : INITIAL_COMPANY_PROFILE;
  });

  // Load from local storage or defaults
  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'branches');
    return saved ? JSON.parse(saved) : INITIAL_BRANCHES;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [projectCategories, setProjectCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'project_categories');
    return saved ? JSON.parse(saved) : INITIAL_PROJECT_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'project_categories', JSON.stringify(projectCategories));
  }, [projectCategories]);

  const [dprs, setDprs] = useState<DailyProgressReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'dprs');
    return saved ? JSON.parse(saved) : INITIAL_DPR_REPORTS;
  });

  const [timeLogs, setTimeLogs] = useState<LaborTimeLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'timelogs');
    return saved ? JSON.parse(saved) : INITIAL_TIME_LOGS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [transfers, setTransfers] = useState<MaterialTransferRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'transfers');
    return saved ? JSON.parse(saved) : INITIAL_TRANSFERS;
  });

  const [leads, setLeads] = useState<CrmLead[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'inquiries');
    return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
  });

  const [packages, setPackages] = useState<ConstructionPackage[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'packages');
    return saved ? JSON.parse(saved) : INITIAL_CONSTRUCTION_PACKAGES;
  });

  const [reminders, setReminders] = useState<InquiryReminder[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'reminders');
    return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
  });

  const [drafts, setDrafts] = useState<DesignDraft[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'drafts');
    return saved ? JSON.parse(saved) : INITIAL_DESIGN_DRAFTS;
  });

  const [tasks, setTasks] = useState<CollaborationTask[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'tasks');
    return saved ? JSON.parse(saved) : INITIAL_COLLAB_TASKS;
  });

  const [salarySlips, setSalarySlips] = useState<SalarySlip[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'salaryslips');
    return saved ? JSON.parse(saved) : INITIAL_SALARY_SLIPS;
  });

  const [holidays, setHolidays] = useState<Holiday[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'holidays');
    return saved ? JSON.parse(saved) : INITIAL_HOLIDAYS;
  });

  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'leaves');
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [verifications, setVerifications] = useState<EmployeeVerification[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'verifications');
    return saved ? JSON.parse(saved) : INITIAL_VERIFICATIONS;
  });

  const [employeeDocs, setEmployeeDocs] = useState<EmployeeDocument[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'employee_docs');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEE_DOCS;
  });

  const [modules, setModules] = useState<CustomAppModule[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'modules');
    return saved ? JSON.parse(saved) : INITIAL_MODULES;
  });

  const [rolePermissions, setRolePermissions] = useState<RolePermissions[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'permissions');
    return saved ? JSON.parse(saved) : INITIAL_ROLE_PERMISSIONS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'company_profile', JSON.stringify(companyProfile));
  }, [companyProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'branches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'dprs', JSON.stringify(dprs));
  }, [dprs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'timelogs', JSON.stringify(timeLogs));
  }, [timeLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'transfers', JSON.stringify(transfers));
  }, [transfers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'packages', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'drafts', JSON.stringify(drafts));
  }, [drafts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'salaryslips', JSON.stringify(salarySlips));
  }, [salarySlips]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'holidays', JSON.stringify(holidays));
  }, [holidays]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'verifications', JSON.stringify(verifications));
  }, [verifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'employee_docs', JSON.stringify(employeeDocs));
  }, [employeeDocs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'modules', JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'permissions', JSON.stringify(rolePermissions));
  }, [rolePermissions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Auth operations
  const login = (username: string, password: string) => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Special exact requirement check: Admin user ID: "siteadmin", Password: "0102"
    if (cleanUser === 'siteadmin' && cleanPass === '0102') {
      const adminUser = users.find(u => u.username === 'siteadmin') || INITIAL_USERS[0];
      setCurrentUser(adminUser);
      return { success: true };
    }

    // Check other registered or newly added users
    const matchedUser = users.find(u => u.username.toLowerCase() === cleanUser);
    if (!matchedUser) {
      return { success: false, message: 'Invalid User ID. Please check and try again.' };
    }

    // Check password (either custom temp password or standard default "0102")
    if (matchedUser.tempPassword && matchedUser.tempPassword === cleanPass) {
      setCurrentUser(matchedUser);
      return { success: true, tempPasswordAlert: true };
    }

    if (cleanPass === '0102') {
      setCurrentUser(matchedUser);
      return { success: true };
    }

    return { success: false, message: 'Incorrect Password. Use "0102" or your temporary password.' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Quick Role Switcher for instant evaluator testing
  const switchRole = (role: UserRole) => {
    const target = users.find(u => u.role === role);
    if (target) {
      setCurrentUser(target);
      if (role === 'EMPLOYEE') setActiveTab('salarybox');
      else if (role === 'SITE_ENGINEER') setActiveTab('dpr');
      else if (role === 'MARKETING') setActiveTab('crm');
      else if (role === 'DESIGNER') setActiveTab('designs');
      else setActiveTab('dashboard');
    }
  };

  const updatePassword = (userId: string, newPass: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, mustChangePassword: false, tempPassword: undefined };
      }
      return u;
    }));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, mustChangePassword: false, tempPassword: undefined } : null);
    }
  };

  // Admin update Company Profile
  const updateCompanyProfile = (profileUpdate: Partial<CompanyProfile>) => {
    setCompanyProfile(prev => ({
      ...prev,
      ...profileUpdate,
      branches: profileUpdate.branches || prev.branches
    }));

    // If branches were updated in profile, sync them with operational branches
    if (profileUpdate.branches) {
      setBranches(prev => {
        const branchMap = new Map(prev.map(b => [b.id, b]));
        profileUpdate.branches!.forEach(br => {
          if (branchMap.has(br.id)) {
            const existing = branchMap.get(br.id)!;
            branchMap.set(br.id, {
              ...existing,
              name: br.branchName,
              city: br.city,
              state: br.state,
              address: br.address,
              contactNumber: br.phone,
              managerName: br.managerName || existing.managerName,
              code: br.code || existing.code,
            });
          } else {
            branchMap.set(br.id, {
              id: br.id,
              name: br.branchName,
              code: br.code || `BR-${Math.floor(10 + Math.random() * 90)}`,
              city: br.city,
              state: br.state,
              address: br.address,
              contactNumber: br.phone,
              managerName: br.managerName || 'Operations In-Charge',
              activeProjectsCount: 0,
            });
          }
        });
        return Array.from(branchMap.values());
      });
    }

    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: 'Company Profile Updated',
      message: 'Pixar World Construction Private Limited corporate details updated successfully.',
      timestamp: 'Just now',
      type: 'salary',
      isRead: false,
      linkTab: 'company_profile'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Admin add branch with full physical address
  const addBranchAddress = (branch: Partial<BranchAddress>) => {
    const newId = branch.id || `BR-${Date.now().toString().slice(-4)}`;
    const newBranchAddr: BranchAddress = {
      id: newId,
      branchName: branch.branchName || 'Regional Branch Hub',
      city: branch.city || 'Vadodara',
      state: branch.state || 'Gujarat',
      address: branch.address || 'Vadodara Operational Site',
      phone: branch.phone || '+91 265 000 0000',
      email: branch.email || 'branch@pwconstruction.com',
      isHeadquarters: !!branch.isHeadquarters,
      code: branch.code || `BR-${Math.floor(10 + Math.random() * 90)}`,
      managerName: branch.managerName || 'Operations In-Charge',
      pincode: branch.pincode || '',
      type: branch.type || (branch.isHeadquarters ? 'Corporate HQ' : 'Regional Office'),
    };

    setCompanyProfile(prev => ({
      ...prev,
      branches: [...(prev.branches || []), newBranchAddr]
    }));

    setBranches(prev => {
      const exists = prev.some(b => b.id === newId);
      if (exists) return prev;
      const opBranch: Branch = {
        id: newId,
        name: newBranchAddr.branchName,
        code: newBranchAddr.code || `BR-${Math.floor(10 + Math.random() * 90)}`,
        city: newBranchAddr.city,
        state: newBranchAddr.state,
        address: newBranchAddr.address,
        contactNumber: newBranchAddr.phone,
        managerName: newBranchAddr.managerName || 'Operations In-Charge',
        activeProjectsCount: 0,
      };
      return [...prev, opBranch];
    });

    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: `New Branch Added: ${newBranchAddr.branchName}`,
      message: `Full Address: ${newBranchAddr.address}, ${newBranchAddr.city}. Contact: ${newBranchAddr.phone}`,
      timestamp: 'Just now',
      type: 'salary',
      isRead: false,
      linkTab: 'company_profile'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Admin update branch details
  const updateBranchAddress = (branchId: string, updated: Partial<BranchAddress>) => {
    setCompanyProfile(prev => ({
      ...prev,
      branches: (prev.branches || []).map(b => b.id === branchId ? { ...b, ...updated } : b)
    }));

    setBranches(prev => prev.map(b => {
      if (b.id === branchId) {
        return {
          ...b,
          name: updated.branchName || b.name,
          city: updated.city || b.city,
          state: updated.state || b.state,
          address: updated.address || b.address,
          contactNumber: updated.phone || b.contactNumber,
          managerName: updated.managerName || b.managerName,
          code: updated.code || b.code,
        };
      }
      return b;
    }));

    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: 'Branch Address Updated',
      message: `Branch ID ${branchId} updated in corporate registry.`,
      timestamp: 'Just now',
      type: 'salary',
      isRead: false,
      linkTab: 'company_profile'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Admin delete branch
  const deleteBranchAddress = (branchId: string) => {
    setCompanyProfile(prev => ({
      ...prev,
      branches: (prev.branches || []).filter(b => b.id !== branchId)
    }));

    setBranches(prev => prev.filter(b => b.id !== branchId));

    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: 'Branch Removed',
      message: `Branch removed from corporate network.`,
      timestamp: 'Just now',
      type: 'salary',
      isRead: false,
      linkTab: 'company_profile'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Admin add employee with temporary password
  const addEmployee = (emp: Partial<User>) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const tempPassword = `PW#${randomSuffix}`;
    const newId = `USR-${Date.now().toString().slice(-4)}`;

    const newUser: User = {
      id: newId,
      username: emp.username?.toLowerCase().trim() || `emp_${randomSuffix}`,
      fullName: emp.fullName || 'New Employee',
      email: emp.email || `emp${randomSuffix}@pwconstruction.com`,
      phone: emp.phone || '+91 98000 00000',
      role: emp.role || 'EMPLOYEE',
      branchId: emp.branchId || 'BR-01',
      department: emp.department || 'Operations',
      designation: emp.designation || 'Site Staff',
      joiningDate: new Date().toISOString().split('T')[0],
      salaryBase: emp.salaryBase || 45000,
      assignedProjectIds: emp.assignedProjectIds || ['PRJ-01'],
      tempPassword: tempPassword,
      mustChangePassword: true,
      salesTarget: emp.role === 'MARKETING' ? (emp.salesTarget || 5000000) : undefined,
      targetCommissionRate: emp.role === 'MARKETING' ? (emp.targetCommissionRate || 4.0) : undefined,
    };

    setUsers(prev => [newUser, ...prev]);

    // Create automated salary slip baseline for current month
    const newSlip: SalarySlip = {
      id: `SLIP-${Date.now()}`,
      slipNumber: `PWC/SAL/2026-10/${newUser.id}`,
      employeeId: newUser.id,
      employeeName: newUser.fullName,
      month: 'October 2026',
      year: 2026,
      workingDays: 26,
      daysPresent: 22,
      leavesTaken: 0,
      baseSalary: newUser.salaryBase,
      hra: Math.round(newUser.salaryBase * 0.22),
      siteAllowance: 6000,
      overtimePay: 0,
      targetIncentiveCommission: 0,
      grossSalary: Math.round(newUser.salaryBase * 1.22 + 6000),
      deductions: {
        providentFund: Math.round(newUser.salaryBase * 0.06),
        professionalTax: 200,
        advanceDeduction: 0,
        taxDeducted: Math.round(newUser.salaryBase * 0.05),
      },
      netPayable: Math.round((newUser.salaryBase * 1.22 + 6000) - (newUser.salaryBase * 0.11 + 200)),
      paymentStatus: 'Processing',
    };
    setSalarySlips(prev => [newSlip, ...prev]);

    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: `New User Created: ${newUser.fullName}`,
      message: `Role: ${newUser.role}. Generated Temporary Password: ${tempPassword}. First-login verification enabled.`,
      timestamp: 'Just now',
      type: 'salary',
      isRead: false,
    };
    setNotifications(prev => [notif, ...prev]);

    return { tempPassword, user: newUser };
  };

  const updateMarketingTarget = (userId: string, target: number, commissionRate: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, salesTarget: target, targetCommissionRate: commissionRate };
      }
      return u;
    }));
  };

  const updateEmployee = (userId: string, updated: Partial<User>) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, ...updated };
      }
      return u;
    }));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...updated } : null);
    }
  };

  const deleteEmployee = (userId: string): { success: boolean; message?: string } => {
    if (userId === 'USR-001' || userId === currentUser?.id) {
      return { success: false, message: 'Cannot delete primary system administrator account or active session.' };
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
    return { success: true };
  };

  const updateEmployeeAllowances = (userId: string, baseSalary: number, allowances: SalaryAllowance[]) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          salaryBase: baseSalary,
          allowances
        };
      }
      return u;
    }));

    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, salaryBase: baseSalary, allowances } : null);
    }
  };

  const addEmployeeAllowance = (userId: string, allowance: Omit<SalaryAllowance, 'id'>) => {
    const newAllowance: SalaryAllowance = {
      id: `ALW-${Date.now()}`,
      ...allowance
    };
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          allowances: [...(u.allowances || []), newAllowance]
        };
      }
      return u;
    }));
  };

  const deleteEmployeeAllowance = (userId: string, allowanceId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          allowances: (u.allowances || []).filter(a => a.id !== allowanceId)
        };
      }
      return u;
    }));
  };

  const addVerificationDoc = (doc: Omit<EmployeeVerification, 'id'>) => {
    const newDoc: EmployeeVerification = {
      id: `VRF-${Date.now()}`,
      ...doc
    };
    setVerifications(prev => [newDoc, ...prev]);
  };

  const updateVerificationStatus = (verificationId: string, status: EmployeeVerification['status'], remarks?: string) => {
    setVerifications(prev => prev.map(v => {
      if (v.id === verificationId) {
        return {
          ...v,
          status,
          verifiedBy: currentUser?.fullName || 'HR Admin',
          verifiedDate: new Date().toISOString().split('T')[0],
          remarks: remarks || v.remarks
        };
      }
      return v;
    }));
  };

  const deleteVerificationDoc = (verificationId: string) => {
    setVerifications(prev => prev.filter(v => v.id !== verificationId));
  };

  const uploadEmployeeDoc = (doc: Omit<EmployeeDocument, 'id' | 'uploadDate'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newDoc: EmployeeDocument = {
      id: `DOC-${Date.now()}`,
      ...doc,
      uploadDate: today
    };
    setEmployeeDocs(prev => [newDoc, ...prev]);
  };

  const deleteEmployeeDoc = (docId: string) => {
    setEmployeeDocs(prev => prev.filter(d => d.id !== docId));
  };

  const generateMonthlyPayroll = (month: string, year: number): { count: number; totalGross: number } => {
    const slips: SalarySlip[] = users.map(user => {
      const base = user.salaryBase || 40000;
      const totalAllowances = (user.allowances || []).reduce((acc, a) => acc + a.amount, 0);
      const hra = (user.allowances?.find(a => a.name.toLowerCase().includes('hra'))?.amount) || Math.round(base * 0.2);
      const siteAllowance = (user.allowances?.find(a => a.name.toLowerCase().includes('site'))?.amount) || 0;
      const gross = base + totalAllowances;
      const pf = Math.round(base * 0.06);
      const pt = 200;
      const tds = Math.round(gross > 50000 ? gross * 0.05 : 0);
      const net = gross - (pf + pt + tds);

      return {
        id: `SLIP-${year}-${month.slice(0, 3)}-${user.id}`,
        slipNumber: `PWC/SAL/${year}-${month.slice(0, 3).toUpperCase()}/${user.id}`,
        employeeId: user.id,
        employeeName: user.fullName,
        month,
        year,
        workingDays: 26,
        daysPresent: 26,
        leavesTaken: 0,
        baseSalary: base,
        hra,
        siteAllowance,
        overtimePay: 0,
        targetIncentiveCommission: user.role === 'MARKETING' ? 25000 : 0,
        allowances: user.allowances || [],
        grossSalary: gross + (user.role === 'MARKETING' ? 25000 : 0),
        deductions: {
          providentFund: pf,
          professionalTax: pt,
          advanceDeduction: 0,
          taxDeducted: tds
        },
        netPayable: net + (user.role === 'MARKETING' ? 25000 : 0),
        paymentStatus: 'Processing',
      };
    });

    setSalarySlips(prev => {
      const others = prev.filter(s => !(s.month === month && s.year === year));
      return [...slips, ...others];
    });

    const totalGross = slips.reduce((sum, s) => sum + s.grossSalary, 0);
    return { count: slips.length, totalGross };
  };

  const updateSalarySlipStatus = (slipId: string, status: SalarySlip['paymentStatus'], transactionRef?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setSalarySlips(prev => prev.map(s => {
      if (s.id === slipId) {
        return {
          ...s,
          paymentStatus: status,
          paymentDate: status === 'Paid' ? today : s.paymentDate,
          transactionRef: transactionRef || s.transactionRef || (status === 'Paid' ? `NEFT-HDFC-${Math.floor(100000000 + Math.random() * 900000000)}` : undefined)
        };
      }
      return s;
    }));
  };

  const addTimeLog = (log: Partial<LaborTimeLog>) => {
    const newLog: LaborTimeLog = {
      id: `LOG-${Date.now()}`,
      employeeId: log.employeeId || currentUser?.id || 'USR-002',
      employeeName: log.employeeName || currentUser?.fullName || 'Employee',
      branchId: log.branchId || 'BR-01',
      projectId: log.projectId,
      date: log.date || new Date().toISOString().split('T')[0],
      shiftType: log.shiftType || 'General Shift (09:00 AM - 06:00 PM)',
      clockIn: log.clockIn || '09:00 AM',
      clockOut: log.clockOut,
      breakDurationMinutes: log.breakDurationMinutes || 45,
      breakNotes: log.breakNotes || 'Lunch break',
      regularHours: log.regularHours || 8.0,
      overtimeHours: log.overtimeHours || 0,
      totalWorkingHours: (log.regularHours || 8.0) + (log.overtimeHours || 0),
      locationTag: log.locationTag || 'Vadodara Office / Site',
      status: log.status || 'Present',
      approved: log.approved !== undefined ? log.approved : true,
      notes: log.notes
    };
    setTimeLogs(prev => [newLog, ...prev]);
  };

  const updateTimeLog = (logId: string, updated: Partial<LaborTimeLog>) => {
    setTimeLogs(prev => prev.map(l => l.id === logId ? { ...l, ...updated } : l));
  };

  const deleteTimeLog = (logId: string) => {
    setTimeLogs(prev => prev.filter(l => l.id !== logId));
  };

  const updateStatutoryVisibility = (roles: UserRole[]) => {
    setCompanyProfile(prev => ({
      ...prev,
      statutoryVisibilityRoles: roles
    }));
  };

  const addProjectCategory = (category: string) => {
    const trimmed = category.trim();
    if (!trimmed || projectCategories.includes(trimmed)) return;
    setProjectCategories(prev => [...prev, trimmed]);
  };

  const deleteProjectCategory = (category: string) => {
    setProjectCategories(prev => prev.filter(c => c !== category));
  };

  const addProject = (p: Partial<Project>) => {
    const banner = p.bannerUrl || (p.photos && p.photos.length > 0 ? p.photos[0] : '/src/assets/images/hero_construction_site_1792597145952.jpg');
    const photosList = p.photos && p.photos.length > 0 ? p.photos : [banner];

    const newProject: Project = {
      id: `PRJ-${Date.now().toString().slice(-4)}`,
      code: `PWC-${p.branchId?.replace('BR-', '') || 'BDQ'}-${Math.floor(100 + Math.random() * 900)}`,
      name: p.name || 'Untitled Construction Site',
      clientName: p.clientName || 'Valued Client',
      clientContact: p.clientContact || '+91 99000 00000',
      branchId: p.branchId || 'BR-01',
      location: p.location || 'Vadodara Project Site',
      type: p.type || 'Commercial Complex',
      startDate: p.startDate || new Date().toISOString().split('T')[0],
      estimatedCompletionDate: p.estimatedCompletionDate || '2027-12-31',
      status: p.status || 'Active Execution',
      progressPercentage: p.progressPercentage || 10,
      totalBudget: p.totalBudget || 100000000,
      spentBudget: p.spentBudget || 10000000,
      siteEngineerIds: p.siteEngineerIds || ['USR-002'],
      designerIds: p.designerIds || ['USR-004'],
      marketingLeadId: p.marketingLeadId || 'USR-003',
      description: p.description || '',
      floorsCount: p.floorsCount || 12,
      builtUpAreaSqFt: p.builtUpAreaSqFt || 120000,
      bannerUrl: banner,
      photos: photosList
    };
    setProjects(prev => [newProject, ...prev]);

    setBranches(prev => prev.map(b => b.id === newProject.branchId ? { ...b, activeProjectsCount: b.activeProjectsCount + 1 } : b));
  };

  const editProject = (projectId: string, updated: Partial<Project>) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const banner = updated.bannerUrl || (updated.photos && updated.photos.length > 0 ? updated.photos[0] : p.bannerUrl);
        return {
          ...p,
          ...updated,
          bannerUrl: banner,
          photos: updated.photos || p.photos || (banner ? [banner] : [])
        };
      }
      return p;
    }));

    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: 'Project Updated',
      message: `Project ${updated.name || projectId} specifications have been modified.`,
      timestamp: 'Just now',
      type: 'dpr',
      isRead: false,
      linkTab: 'projects'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const deleteProject = (projectId: string) => {
    const projToDelete = projects.find(p => p.id === projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (projToDelete) {
      setBranches(prev => prev.map(b => b.id === projToDelete.branchId ? { ...b, activeProjectsCount: Math.max(0, b.activeProjectsCount - 1) } : b));
    }
  };

  const toggleProjectHold = (projectId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const nextStatus = p.status === 'On Hold' ? 'Active Execution' : 'On Hold';
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  // Admin allocate engineers to project
  const allocateEngineersToProject = (projectId: string, engineerIds: string[]) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, siteEngineerIds: engineerIds };
      }
      return p;
    }));

    // Update users assignedProjectIds
    setUsers(prev => prev.map(u => {
      if (engineerIds.includes(u.id)) {
        const existing = new Set(u.assignedProjectIds || []);
        existing.add(projectId);
        return { ...u, assignedProjectIds: Array.from(existing) };
      } else if (u.role === 'SITE_ENGINEER') {
        return { ...u, assignedProjectIds: (u.assignedProjectIds || []).filter(pid => pid !== projectId) };
      }
      return u;
    }));

    const proj = projects.find(p => p.id === projectId);
    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: 'Site Engineer Allocation Updated',
      message: `Project ${proj?.name || projectId} updated with ${engineerIds.length} assigned site engineers.`,
      timestamp: 'Just now',
      type: 'dpr',
      isRead: false,
      linkTab: 'projects'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const addDpr = (dpr: Partial<DailyProgressReport>) => {
    const newDpr: DailyProgressReport = {
      id: `DPR-${Date.now()}`,
      dprNumber: `DPR/${dpr.branchId?.replace('BR-', 'BR') || 'BDQ'}/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
      projectId: dpr.projectId || 'PRJ-01',
      projectName: dpr.projectName || 'Sayaji Infotech & Commercial Business Park',
      branchId: dpr.branchId || 'BR-01',
      engineerId: currentUser?.id || 'USR-002',
      engineerName: currentUser?.fullName || 'Arunav Sengupta',
      reportDate: dpr.reportDate || new Date().toISOString().split('T')[0],
      weatherCondition: dpr.weatherCondition || 'Sunny / Clear',
      workSummary: dpr.workSummary || 'Daily site activity completed as per schedule.',
      milestoneAchieved: dpr.milestoneAchieved || 'Daily milestone achieved.',
      laborSummary: dpr.laborSummary || [
        { trade: 'Masons', headcount: 10, hoursWorked: 8, overtimeHours: 1 },
        { trade: 'Bar Benders', headcount: 15, hoursWorked: 8.5, overtimeHours: 2 },
        { trade: 'General Helpers', headcount: 25, hoursWorked: 8, overtimeHours: 1.5 }
      ],
      materialsUsed: dpr.materialsUsed || [
        { materialId: 'MAT-01', materialName: 'Ready-Mix Concrete M40 Grade', unit: 'Cum', quantityUsed: 45 }
      ],
      equipmentStatus: dpr.equipmentStatus || 'Heavy machinery operational.',
      safetyObservations: dpr.safetyObservations || 'Zero safety incidents. Toolbox talk conducted.',
      delaysOrBlockers: dpr.delaysOrBlockers,
      photos: dpr.photos && dpr.photos.length > 0 ? dpr.photos : ['/src/assets/images/hero_construction_site_1792597145952.jpg'],
      supervisorSignOff: true,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setDprs(prev => [newDpr, ...prev]);

    if (dpr.projectId) {
      setProjects(prev => prev.map(p => {
        if (p.id === dpr.projectId && p.progressPercentage < 99) {
          return { ...p, progressPercentage: Math.min(100, p.progressPercentage + 1) };
        }
        return p;
      }));
    }

    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: `DPR Filed: ${newDpr.projectName}`,
      message: `${newDpr.engineerName} reported: "${newDpr.milestoneAchieved}". Photos attached: ${newDpr.photos.length}.`,
      timestamp: 'Just now',
      type: 'dpr',
      isRead: false,
      linkTab: 'dpr',
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const addLead = (lead: Partial<CrmLead>) => {
    const newLead: CrmLead = {
      id: `LEAD-${Date.now().toString().slice(-4)}`,
      leadCode: `CRM-26-${Math.floor(400 + Math.random() * 500)}`,
      clientName: lead.clientName || 'Inquiry Contact',
      organization: lead.organization || 'Prospective Enterprise',
      phone: lead.phone || '+91 98000 12345',
      email: lead.email || 'client@inquiry.com',
      branchId: lead.branchId || 'BR-01',
      projectTypeInterest: lead.projectTypeInterest || 'Commercial Office',
      estimatedValue: lead.estimatedValue || 50000000,
      stage: lead.stage || 'New Inquiry',
      assignedMarketingId: currentUser?.id || 'USR-003',
      assignedMarketingName: currentUser?.fullName || 'Pooja Nair',
      linkedSiteEngineerId: lead.linkedSiteEngineerId || 'USR-002',
      linkedDesignerId: lead.linkedDesignerId || 'USR-004',
      source: lead.source || 'Website',
      notes: lead.notes || 'Inbound prospect interested in turnkey construction in Vadodara / Gujarat.',
      nextFollowUpDate: lead.nextFollowUpDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      quotationAmount: lead.quotationAmount,
    };

    setLeads(prev => [newLead, ...prev]);

    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: `CRM: New Lead Assigned (${newLead.leadCode})`,
      message: `${newLead.clientName} (${newLead.organization}) - Budget: ₹${(newLead.estimatedValue / 10000000).toFixed(1)} Cr. Follow-up scheduled.`,
      timestamp: 'Just now',
      type: 'lead',
      isRead: false,
      linkTab: 'crm',
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const updateLeadStage = (leadId: string, stage: CrmLead['stage']) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage } : l));
  };

  const addInquiry = (inq: Partial<Inquiry>): Inquiry => {
    const today = new Date().toISOString().split('T')[0];
    const seq = Math.floor(100 + Math.random() * 900);
    const newInquiry: Inquiry = {
      id: `INQ-${Date.now().toString().slice(-5)}`,
      inquiryNumber: `INQ-2026-${seq}`,
      customerName: inq.customerName || 'Inquiry Client',
      contactNumber: inq.contactNumber || '',
      email: inq.email || '',
      firstInquiryDate: inq.firstInquiryDate || today,
      budget: Number(inq.budget) || 5000000,
      siteAddress: inq.siteAddress || '',
      residentAddress: inq.residentAddress || '',
      notes: inq.notes || '',
      hasDetailedSpec: Boolean(inq.hasDetailedSpec || inq.serviceType || inq.totalSqFtArea),
      serviceType: inq.serviceType,
      alternateMobile: inq.alternateMobile,
      totalSqFtArea: inq.totalSqFtArea ? Number(inq.totalSqFtArea) : undefined,
      paymentMode: inq.paymentMode,
      familyMembersCount: inq.familyMembersCount ? Number(inq.familyMembersCount) : undefined,
      projectStartDate: inq.projectStartDate,
      projectDeadlineDate: inq.projectDeadlineDate,
      architectOption: inq.architectOption,
      floorsCount: inq.floorsCount,
      selectedPackageId: inq.selectedPackageId,
      selectedPackageName: inq.selectedPackageName,
      packageEstimatedCost: inq.packageEstimatedCost,
      stage: inq.stage || 'New Inquiry',
      branchId: inq.branchId || (activeBranchId === 'ALL' ? 'BR-01' : activeBranchId),
      assignedMarketingId: currentUser?.id || 'USR-003',
      assignedMarketingName: currentUser?.fullName || 'Pooja Nair',
      source: inq.source || 'Direct Inquiry Form',
      followUps: inq.followUps || [],
      createdAt: today,
      updatedAt: today,
    };

    setInquiries(prev => [newInquiry, ...prev]);

    // Also sync to legacy leads for backwards compatibility
    const newLead: CrmLead = {
      id: `LEAD-${newInquiry.id}`,
      leadCode: newInquiry.inquiryNumber,
      clientName: newInquiry.customerName,
      organization: newInquiry.serviceType || 'Residential Client',
      phone: newInquiry.contactNumber,
      email: newInquiry.email,
      branchId: newInquiry.branchId,
      projectTypeInterest: newInquiry.serviceType?.includes('Interior') ? 'Interior Fitout' : 'Villa Construction',
      estimatedValue: newInquiry.budget,
      stage: 'New Inquiry',
      assignedMarketingId: newInquiry.assignedMarketingId,
      assignedMarketingName: newInquiry.assignedMarketingName,
      source: 'Direct Walk-in',
      notes: newInquiry.notes,
      nextFollowUpDate: today,
      createdAt: today,
    };
    setLeads(prev => [newLead, ...prev]);

    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: `New Inquiry Logged: ${newInquiry.inquiryNumber}`,
      message: `${newInquiry.customerName} - Budget ₹${(newInquiry.budget / 100000).toFixed(1)} Lakhs.`,
      timestamp: 'Just now',
      type: 'lead',
      isRead: false,
      linkTab: 'crm',
    };
    setNotifications(prev => [notif, ...prev]);

    return newInquiry;
  };

  const updateInquiry = (inquiryId: string, updated: Partial<Inquiry>) => {
    const today = new Date().toISOString().split('T')[0];
    setInquiries(prev => prev.map(inq => {
      if (inq.id === inquiryId) {
        const hasSpec = updated.hasDetailedSpec !== undefined 
          ? updated.hasDetailedSpec 
          : (inq.hasDetailedSpec || Boolean(updated.serviceType || updated.totalSqFtArea));
        return {
          ...inq,
          ...updated,
          hasDetailedSpec: hasSpec,
          updatedAt: today
        };
      }
      return inq;
    }));
  };

  const updateInquiryStage = (inquiryId: string, stage: InquiryStage) => {
    const today = new Date().toISOString().split('T')[0];
    setInquiries(prev => prev.map(inq => {
      if (inq.id === inquiryId) {
        return { ...inq, stage, updatedAt: today };
      }
      return inq;
    }));
  };

  const deleteInquiry = (inquiryId: string) => {
    setInquiries(prev => prev.filter(inq => inq.id !== inquiryId));
    setReminders(prev => prev.filter(r => r.inquiryId !== inquiryId));
  };

  const addFollowUp = (inquiryId: string, followUp: Omit<InquiryFollowUp, 'id' | 'inquiryId'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newFollowUp: InquiryFollowUp = {
      id: `FLW-${Date.now()}`,
      inquiryId,
      ...followUp
    };

    setInquiries(prev => prev.map(inq => {
      if (inq.id === inquiryId) {
        return {
          ...inq,
          followUps: [newFollowUp, ...(inq.followUps || [])],
          updatedAt: today
        };
      }
      return inq;
    }));

    if (followUp.nextActionDate) {
      const targetInq = inquiries.find(i => i.id === inquiryId);
      const reminderType: ReminderType = followUp.contactType === 'In-Person Meeting' || followUp.contactType === 'Site Visit'
        ? (followUp.contactType as ReminderType)
        : followUp.contactType === 'WhatsApp / Message'
        ? 'Message / WhatsApp'
        : 'Call';

      const newRem: InquiryReminder = {
        id: `REM-${Date.now()}`,
        inquiryId,
        customerName: targetInq?.customerName || 'Inquiry Contact',
        contactNumber: targetInq?.contactNumber || '',
        type: reminderType,
        title: `Follow-up: ${followUp.nextActionNotes || 'Call / Contact Customer'}`,
        dueDate: followUp.nextActionDate,
        dueTime: '11:00 AM',
        notes: followUp.nextActionNotes || `Follow-up with customer on discussions regarding ${targetInq?.serviceType || 'project'}.`,
        priority: 'High',
        isCompleted: false,
        assignedToName: followUp.loggedByName || currentUser?.fullName || 'Marketing Rep'
      };
      setReminders(prev => [newRem, ...prev]);
    }
  };

  const addReminder = (reminder: Omit<InquiryReminder, 'id' | 'isCompleted'>) => {
    const newRem: InquiryReminder = {
      id: `REM-${Date.now()}`,
      ...reminder,
      isCompleted: false
    };
    setReminders(prev => [newRem, ...prev]);
  };

  const toggleReminder = (reminderId: string) => {
    setReminders(prev => prev.map(r => {
      if (r.id === reminderId) {
        const nextState = !r.isCompleted;
        return {
          ...r,
          isCompleted: nextState,
          completedAt: nextState ? new Date().toISOString() : undefined
        };
      }
      return r;
    }));
  };

  const deleteReminder = (reminderId: string) => {
    setReminders(prev => prev.filter(r => r.id !== reminderId));
  };

  const addPackage = (pkg: Omit<ConstructionPackage, 'id'>): { success: boolean; message?: string } => {
    if (currentUser?.role !== 'ADMIN') {
      return { success: false, message: 'Access Denied: Only Admin can add construction packages.' };
    }
    const newPackage: ConstructionPackage = {
      id: `PKG-${Date.now().toString().slice(-4)}`,
      ...pkg
    };
    setPackages(prev => [...prev, newPackage]);
    return { success: true };
  };

  const updatePackage = (packageId: string, updated: Partial<ConstructionPackage>): { success: boolean; message?: string } => {
    if (currentUser?.role !== 'ADMIN') {
      return { success: false, message: 'Access Denied: Only Admin can edit construction packages.' };
    }
    setPackages(prev => prev.map(p => p.id === packageId ? { ...p, ...updated } : p));
    return { success: true };
  };

  const deletePackage = (packageId: string): { success: boolean; message?: string } => {
    if (currentUser?.role !== 'ADMIN') {
      return { success: false, message: 'Access Denied: Only Admin can delete construction packages.' };
    }
    setPackages(prev => prev.filter(p => p.id !== packageId));
    return { success: true };
  };

  const convertInquiryToProject = (inquiryId: string): { success: boolean; projectId?: string; message?: string } => {
    const inquiry = inquiries.find(i => i.id === inquiryId);
    if (!inquiry) {
      return { success: false, message: 'Inquiry record not found.' };
    }

    const projectId = `PRJ-${Date.now().toString().slice(-4)}`;
    const branchCode = inquiry.branchId?.replace('BR-', '') || 'BDQ';
    const projectCode = `PWC-${branchCode}-${Math.floor(100 + Math.random() * 900)}`;

    const newProject: Project = {
      id: projectId,
      code: projectCode,
      name: `${inquiry.customerName} - ${inquiry.serviceType?.replace('Planning ', '') || 'Site Project'}`,
      clientName: inquiry.customerName,
      clientContact: inquiry.contactNumber,
      branchId: inquiry.branchId || 'BR-01',
      location: inquiry.siteAddress || 'Vadodara Project Site',
      type: inquiry.serviceType?.includes('Interior') ? 'Residential Villa & Interior' : 'Residential Turnkey',
      startDate: inquiry.projectStartDate || new Date().toISOString().split('T')[0],
      estimatedCompletionDate: inquiry.projectDeadlineDate || '2027-12-31',
      status: 'Active Execution',
      progressPercentage: 5,
      totalBudget: inquiry.budget || inquiry.packageEstimatedCost || 12000000,
      spentBudget: 0,
      siteEngineerIds: ['USR-002'],
      designerIds: ['USR-004'],
      marketingLeadId: inquiry.assignedMarketingId || 'USR-003',
      description: `Client Inquiry: ${inquiry.inquiryNumber}. Package: ${inquiry.selectedPackageName || 'Standard'}. Architect: ${inquiry.architectOption || 'Design with us'}. Floors: ${inquiry.floorsCount || 'G+1'}. Notes: ${inquiry.notes}`,
      floorsCount: inquiry.floorsCount ? parseInt(inquiry.floorsCount.replace(/\D/g, '') || '2', 10) : 2,
      builtUpAreaSqFt: inquiry.totalSqFtArea || 3500,
      bannerUrl: '/src/assets/images/hero_construction_site_1792597145952.jpg',
      photos: ['/src/assets/images/hero_construction_site_1792597145952.jpg']
    };

    setProjects(prev => [newProject, ...prev]);

    const today = new Date().toISOString().split('T')[0];
    setInquiries(prev => prev.map(inq => {
      if (inq.id === inquiryId) {
        return {
          ...inq,
          stage: 'Converted to Business',
          convertedProjectId: projectId,
          convertedAt: today,
          updatedAt: today
        };
      }
      return inq;
    }));

    setBranches(prev => prev.map(b => b.id === newProject.branchId ? { ...b, activeProjectsCount: b.activeProjectsCount + 1 } : b));

    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: `Inquiry Converted to Active Site: ${newProject.name}`,
      message: `${inquiry.customerName} successfully converted to business! Active site project ${newProject.code} registered.`,
      timestamp: 'Just now',
      type: 'lead',
      isRead: false,
      linkTab: 'projects'
    };
    setNotifications(prev => [notif, ...prev]);

    return { success: true, projectId };
  };

  const addDraft = (draft: Partial<DesignDraft>) => {
    const newDraft: DesignDraft = {
      id: `DFT-${Date.now().toString().slice(-4)}`,
      draftCode: `DWG-${Math.floor(100 + Math.random() * 900)}-REV`,
      projectId: draft.projectId || 'PRJ-01',
      projectName: draft.projectName || 'Sayaji Infotech & Commercial Business Park',
      title: draft.title || 'Architectural Floor & Elevation Plan',
      category: draft.category || 'Architectural Blueprint',
      version: draft.version || 'v1.0',
      designerId: currentUser?.id || 'USR-004',
      designerName: currentUser?.fullName || 'Ananya Roy',
      imageUrl: '/src/assets/images/blueprint_draft_cad_1792597146290.jpg',
      status: 'Draft Uploaded',
      uploadedAt: new Date().toISOString().split('T')[0],
      dimensions: draft.dimensions || 'Scale 1:100 | High Res CAD',
      comments: [
        {
          id: `C-${Date.now()}`,
          userName: currentUser?.fullName || 'Ananya Roy (Architect)',
          userRole: currentUser?.role || 'DESIGNER',
          text: 'Initial draft uploaded for engineering & marketing client review.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]
    };

    setDrafts(prev => [newDraft, ...prev]);

    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: `New Design Draft: ${newDraft.draftCode}`,
      message: `${newDraft.designerName} uploaded "${newDraft.title}" (${newDraft.version}) for ${newDraft.projectName}.`,
      timestamp: 'Just now',
      type: 'design',
      isRead: false,
      linkTab: 'designs'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const addDraftComment = (draftId: string, commentText: string) => {
    if (!commentText.trim()) return;
    const newComment = {
      id: `C-${Date.now()}`,
      userName: currentUser ? `${currentUser.fullName} (${currentUser.role})` : 'Anonymous Staff',
      userRole: currentUser?.role || 'SITE_ENGINEER',
      text: commentText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setDrafts(prev => prev.map(d => {
      if (d.id === draftId) {
        return { ...d, comments: [...d.comments, newComment] };
      }
      return d;
    }));
  };

  const updateDraftStatus = (draftId: string, status: DesignDraft['status']) => {
    setDrafts(prev => prev.map(d => d.id === draftId ? { ...d, status } : d));
  };

  const addTask = (task: Partial<CollaborationTask>) => {
    const newTask: CollaborationTask = {
      id: `TSK-${Date.now().toString().slice(-4)}`,
      title: task.title || 'Coordination Action Item',
      projectId: task.projectId || 'PRJ-01',
      projectName: task.projectName || 'Sayaji Infotech & Commercial Business Park',
      assignedToRole: task.assignedToRole || 'SITE_ENGINEER',
      assignedToName: task.assignedToName || 'Site Team',
      createdByRole: currentUser?.role || 'MARKETING',
      createdByName: currentUser?.fullName || 'Pooja Nair',
      priority: task.priority || 'Medium',
      status: 'Todo',
      dueDate: task.dueDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      description: task.description || '',
      commentsCount: 0,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTaskStatus = (taskId: string, status: CollaborationTask['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  // Material Requisition with Material Needed Date & Urgency
  const requestMaterialTransfer = (req: Partial<MaterialTransferRequest>) => {
    const newTransfer: MaterialTransferRequest = {
      id: `TRF-${Date.now().toString().slice(-4)}`,
      reqNumber: `MTR-2026-${Math.floor(100 + Math.random() * 900)}`,
      itemId: req.itemId,
      itemName: req.itemName || 'Raw Material',
      category: req.category || 'Cement & Aggregates',
      quantity: req.quantity || 10,
      unit: req.unit || 'Units',
      fromLocation: req.fromLocation || 'Vadodara Central Depot (Makarpura GIDC)',
      toProjectId: req.toProjectId || 'PRJ-01',
      toProjectName: req.toProjectName || 'Sayaji Infotech & Commercial Business Park',
      requestedBy: currentUser?.fullName || 'Arunav Sengupta (Site Eng)',
      requestedById: currentUser?.id,
      requestedDate: new Date().toISOString().split('T')[0],
      materialNeededDate: req.materialNeededDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      urgency: req.urgency || 'Standard (3-5 days)',
      estimatedCost: req.estimatedCost || 50000,
      status: 'Pending Accounts & Admin Review',
      notes: req.notes || 'Site construction requirement.',
    };

    setTransfers(prev => [newTransfer, ...prev]);

    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: `Material Requisition: ${newTransfer.reqNumber}`,
      message: `${newTransfer.requestedBy} requested ${newTransfer.quantity} ${newTransfer.unit} of ${newTransfer.itemName} for ${newTransfer.toProjectName}. Needed Date: ${newTransfer.materialNeededDate}.`,
      timestamp: 'Just now',
      type: 'inventory',
      isRead: false,
      linkTab: 'inventory'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Accounts & Finance Review
  const approveByAccounts = (transferId: string, remark?: string) => {
    setTransfers(prev => prev.map(t => {
      if (t.id === transferId) {
        return {
          ...t,
          status: 'Approved by Accounts',
          reviewedByAccounts: currentUser?.fullName || 'Accounts Dept (Finance)',
          accountsRemark: remark || 'Budget allocation and PO quotation cleared by Accounts.'
        };
      }
      return t;
    }));

    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: 'Material Requisition Approved by Accounts',
      message: `Requisition ${transferId} verified by Accounts & Finance. Awaiting Director / Admin clearance.`,
      timestamp: 'Just now',
      type: 'inventory',
      isRead: false,
      linkTab: 'inventory'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Director / Admin Clearance
  const approveByAdmin = (transferId: string, remark?: string) => {
    setTransfers(prev => prev.map(t => {
      if (t.id === transferId) {
        return {
          ...t,
          status: 'Admin Cleared',
          clearedByAdmin: currentUser?.fullName || 'Prashant Wadhwa (Director)',
          adminRemark: remark || 'Approved for depot dispatch to site yard.'
        };
      }
      return t;
    }));

    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: 'Material Requisition Admin Cleared',
      message: `Requisition ${transferId} cleared by Admin. Material dispatched from central stockyard.`,
      timestamp: 'Just now',
      type: 'inventory',
      isRead: false,
      linkTab: 'inventory'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Site Engineer Acknowledgment
  const acknowledgeTransferReceived = (transferId: string) => {
    setTransfers(prev => prev.map(t => {
      if (t.id === transferId) {
        return { ...t, status: 'Received at Site' };
      }
      return t;
    }));
  };

  const approveMaterialTransfer = (transferId: string, approved: boolean) => {
    setTransfers(prev => prev.map(t => {
      if (t.id === transferId) {
        return { ...t, status: approved ? 'Dispatched' : 'Rejected' };
      }
      return t;
    }));
  };

  // Holiday Management (Admin / HR)
  const addHoliday = (holiday: Partial<Holiday>) => {
    const newHol: Holiday = {
      id: `HOL-${Date.now()}`,
      title: holiday.title || 'Official Company Holiday',
      date: holiday.date || new Date().toISOString().split('T')[0],
      type: holiday.type || 'Public Holiday',
      applicableBranchIds: holiday.applicableBranchIds || ['ALL'],
      isMandatory: holiday.isMandatory !== undefined ? holiday.isMandatory : true,
      description: holiday.description || 'Approved festival & company holiday for site and office staff.'
    };
    setHolidays(prev => [...prev, newHol].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));

    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: `Holiday Added: ${newHol.title}`,
      message: `Scheduled on ${newHol.date} (${newHol.type}) for all company branches.`,
      timestamp: 'Just now',
      type: 'salary',
      isRead: false,
      linkTab: 'salarybox'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const updateHoliday = (holidayId: string, updated: Partial<Holiday>) => {
    setHolidays(prev => prev.map(h => h.id === holidayId ? { ...h, ...updated } : h).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };

  const deleteHoliday = (holidayId: string) => {
    setHolidays(prev => prev.filter(h => h.id !== holidayId));
  };

  const clockInSimulator = (locationTag: string) => {
    if (!currentUser) return;
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newLog: LaborTimeLog = {
      id: `LOG-${Date.now()}`,
      employeeId: currentUser.id,
      employeeName: currentUser.fullName,
      branchId: currentUser.branchId === 'ALL' ? 'BR-01' : currentUser.branchId,
      projectId: currentUser.assignedProjectIds[0],
      date: today,
      clockIn: nowTime,
      regularHours: 8.0,
      overtimeHours: 0,
      locationTag: locationTag || 'P W Construction Vadodara Site (GPS: 22.3072° N, 73.1812° E)',
      status: 'Present',
      approved: true,
    };

    setTimeLogs(prev => [newLog, ...prev]);
  };

  const clockOutSimulator = () => {
    if (!currentUser) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTimeLogs(prev => prev.map(log => {
      if (log.employeeId === currentUser.id && !log.clockOut) {
        return { ...log, clockOut: nowTime };
      }
      return log;
    }));
  };

  const applyLeave = (leave: Partial<LeaveRequest>) => {
    if (!currentUser) return;
    const newLeave: LeaveRequest = {
      id: `LV-${Date.now().toString().slice(-4)}`,
      employeeId: currentUser.id,
      employeeName: currentUser.fullName,
      leaveType: leave.leaveType || 'Casual Leave',
      startDate: leave.startDate || new Date().toISOString().split('T')[0],
      endDate: leave.endDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      daysCount: leave.daysCount || 1,
      reason: leave.reason || 'Personal / Site Rest',
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };

    setLeaves(prev => [newLeave, ...prev]);
  };

  const updateLeaveStatus = (leaveId: string, status: 'Approved' | 'Rejected') => {
    setLeaves(prev => prev.map(l => l.id === leaveId ? { ...l, status, approvedBy: currentUser?.fullName } : l));
  };

  const toggleModule = (moduleKey: string) => {
    setModules(prev => prev.map(m => m.key === moduleKey ? { ...m, isEnabled: !m.isEnabled } : m));
  };

  const addCustomModule = (name: string, description: string, key: string) => {
    const newMod: CustomAppModule = {
      id: `MOD-${Date.now()}`,
      key: key.toLowerCase().replace(/\s+/g, '_'),
      name,
      description,
      iconName: 'FolderKanban',
      isEnabled: true,
      isSystem: false,
      requiredRole: ['ADMIN', 'SITE_ENGINEER', 'MARKETING', 'DESIGNER', 'EMPLOYEE'],
    };
    setModules(prev => [...prev, newMod]);
  };

  const updatePermission = (roleId: string, moduleKey: ModuleKey, action: 'view' | 'create' | 'edit' | 'delete' | 'approve', value: boolean) => {
    setRolePermissions(prev => prev.map(r => {
      if (r.roleId === roleId) {
        const modPerm = r.permissions[moduleKey] || { view: false, create: false, edit: false, delete: false, approve: false };
        return {
          ...r,
          permissions: {
            ...r.permissions,
            [moduleKey]: {
              ...modPerm,
              [action]: value,
            }
          }
        };
      }
      return r;
    }));
  };

  const updateHrSubPermission = (roleId: string, subSection: HrSubSection, allowed: boolean) => {
    setRolePermissions(prev => prev.map(r => {
      if (r.roleId === roleId) {
        return {
          ...r,
          hrSubPermissions: {
            ...(r.hrSubPermissions || {
              team: false,
              attendance: true,
              payroll: true,
              reports: false,
              verification: true,
              docs: true,
              timesheets: true,
              salary_calc: false,
            }),
            [subSection]: allowed
          }
        };
      }
      return r;
    }));
  };

  const updateRoleStaffScope = (roleId: string, canViewAllStaffData: boolean) => {
    setRolePermissions(prev => prev.map(r => {
      if (r.roleId === roleId) {
        return { ...r, canViewAllStaffData };
      }
      return r;
    }));
  };

  const updateRoleFinancialsScope = (roleId: string, canViewFinancials: boolean) => {
    setRolePermissions(prev => prev.map(r => {
      if (r.roleId === roleId) {
        return { ...r, canViewFinancials };
      }
      return r;
    }));
  };

  const canUserViewFinancials = (user?: User | null): boolean => {
    const target = user || currentUser;
    if (!target) return false;
    if (target.role === 'ADMIN' || target.role === 'MARKETING') return true;
    const dept = (target.department || '').toLowerCase();
    if (dept.includes('account') || dept.includes('finance')) return true;
    if (target.canViewFinancials !== undefined) return target.canViewFinancials;
    const perm = rolePermissions.find(r => r.roleId === target.role);
    return perm?.canViewFinancials ?? false;
  };

  const canUserViewAllStaff = (user?: User | null): boolean => {
    const target = user || currentUser;
    if (!target) return false;
    if (target.role === 'ADMIN') return true;
    if (target.canViewAllStaffData !== undefined) return target.canViewAllStaffData;
    const perm = rolePermissions.find(r => r.roleId === target.role);
    return perm?.canViewAllStaffData ?? false;
  };

  const hasHrSubPermission = (subSection: HrSubSection, user?: User | null): boolean => {
    const target = user || currentUser;
    if (!target) return false;
    if (target.role === 'ADMIN') return true;
    if (target.customHrPermissions && target.customHrPermissions[subSection] !== undefined) {
      return !!target.customHrPermissions[subSection];
    }
    const perm = rolePermissions.find(r => r.roleId === target.role);
    if (!perm?.hrSubPermissions) return true;
    return !!perm.hrSubPermissions[subSection];
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const resetAllData = () => {
    localStorage.clear();
    setCompanyProfile(INITIAL_COMPANY_PROFILE);
    setBranches(INITIAL_BRANCHES);
    setUsers(INITIAL_USERS);
    setProjects(INITIAL_PROJECTS);
    setDprs(INITIAL_DPR_REPORTS);
    setTimeLogs(INITIAL_TIME_LOGS);
    setInventory(INITIAL_INVENTORY);
    setTransfers(INITIAL_TRANSFERS);
    setLeads(INITIAL_LEADS);
    setInquiries(INITIAL_INQUIRIES);
    setPackages(INITIAL_CONSTRUCTION_PACKAGES);
    setReminders(INITIAL_REMINDERS);
    setDrafts(INITIAL_DESIGN_DRAFTS);
    setTasks(INITIAL_COLLAB_TASKS);
    setSalarySlips(INITIAL_SALARY_SLIPS);
    setHolidays(INITIAL_HOLIDAYS);
    setLeaves(INITIAL_LEAVES);
    setVerifications(INITIAL_VERIFICATIONS);
    setEmployeeDocs(INITIAL_EMPLOYEE_DOCS);
    setModules(INITIAL_MODULES);
    setRolePermissions(INITIAL_ROLE_PERMISSIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUser(INITIAL_USERS[0]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeBranchId,
        activeTab,
        hrSubTab,
        setHrSubTab,
        crmSubTab,
        setCrmSubTab,
        isMobileSimulated,
        companyProfile,
        branches,
        users,
        projects,
        dprs,
        timeLogs,
        inventory,
        transfers,
        leads,
        inquiries,
        packages,
        reminders,
        drafts,
        tasks,
        salarySlips,
        holidays,
        leaves,
        verifications,
        employeeDocs,
        modules,
        rolePermissions,
        notifications,
        theme,
        accentColor,
        setTheme,
        setAccentColor,
        setActiveBranchId,
        setActiveTab,
        setIsMobileSimulated,
        login,
        logout,
        switchRole,
        updatePassword,
        addEmployee,
        updateMarketingTarget,
        updateCompanyProfile,
        updateStatutoryVisibility,
        addBranchAddress,
        updateBranchAddress,
        deleteBranchAddress,
        projectCategories,
        addProjectCategory,
        deleteProjectCategory,
        addProject,
        editProject,
        deleteProject,
        toggleProjectHold,
        updateEmployee,
        deleteEmployee,
        updateEmployeeAllowances,
        addEmployeeAllowance,
        deleteEmployeeAllowance,
        addVerificationDoc,
        updateVerificationStatus,
        deleteVerificationDoc,
        uploadEmployeeDoc,
        deleteEmployeeDoc,
        generateMonthlyPayroll,
        updateSalarySlipStatus,
        addTimeLog,
        updateTimeLog,
        deleteTimeLog,
        allocateEngineersToProject,
        addDpr,
        addInquiry,
        updateInquiry,
        updateInquiryStage,
        deleteInquiry,
        addFollowUp,
        addReminder,
        toggleReminder,
        deleteReminder,
        addPackage,
        updatePackage,
        deletePackage,
        convertInquiryToProject,
        addLead,
        updateLeadStage,
        addDraft,
        addDraftComment,
        updateDraftStatus,
        addTask,
        updateTaskStatus,
        requestMaterialTransfer,
        approveByAccounts,
        approveByAdmin,
        acknowledgeTransferReceived,
        approveMaterialTransfer,
        clockInSimulator,
        clockOutSimulator,
        applyLeave,
        updateLeaveStatus,
        addHoliday,
        updateHoliday,
        deleteHoliday,
        toggleModule,
        addCustomModule,
        updatePermission,
        updateHrSubPermission,
        updateRoleStaffScope,
        updateRoleFinancialsScope,
        canUserViewFinancials,
        canUserViewAllStaff,
        hasHrSubPermission,
        markNotificationRead,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
