export type UserRole = 'ADMIN' | 'SITE_ENGINEER' | 'MARKETING' | 'DESIGNER' | 'EMPLOYEE';

export type ThemeMode = 'light' | 'dark' | 'navy';
export type AccentColor = 'amber' | 'orange' | 'blue' | 'emerald';

export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  address: string;
  contactNumber: string;
  managerName: string;
  activeProjectsCount: number;
}

export interface Permission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
}

export type ModuleKey = 
  | 'dashboard' 
  | 'projects' 
  | 'dpr' 
  | 'labor' 
  | 'inventory' 
  | 'crm' 
  | 'designs' 
  | 'salarybox' 
  | 'collaboration' 
  | 'company_profile'
  | 'admin_settings';

export type HrSubSection = 
  | 'team' 
  | 'attendance' 
  | 'payroll' 
  | 'reports' 
  | 'verification' 
  | 'docs' 
  | 'timesheets' 
  | 'salary_calc';

export type CrmSubSection = 
  | 'pipeline' 
  | 'followups' 
  | 'reminders' 
  | 'packages';

export interface BranchAddress {
  id: string;
  branchName: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  isHeadquarters?: boolean;
  code?: string;
  managerName?: string;
  pincode?: string;
  type?: string;
}

export interface CompanyProfile {
  companyName: string; // "Pixar World Construction Private Limited"
  brandName: string;   // "P W Construction"
  tagline: string;
  cin: string;
  gstin: string;
  pan: string;
  reraRegistration: string;
  legalStatus?: string;
  headOfficeCity: string;
  headOfficeAddress: string;
  phone: string;
  altPhone: string;
  email: string;
  website: string;
  logoUrl: string;
  bannerUrl: string;
  establishedYear: number;
  aboutCompany: string;
  executiveManagingDirector?: string;
  executiveDirector?: string;
  executivePhilosophy?: string;
  statutoryVisibilityRoles?: UserRole[];
  branches: BranchAddress[];
}

export interface RolePermissions {
  roleId: string;
  roleName: string;
  description: string;
  permissions: Record<ModuleKey, Permission>;
  hrSubPermissions?: Record<HrSubSection, boolean>;
  canViewAllStaffData?: boolean; // false = see his/her own data only; true = can see all staff data
  canViewFinancials?: boolean; // false = cannot see budget/financials; true = can see total portfolio budget
}

export interface SalaryAllowance {
  id: string;
  name: string; // e.g., 'HRA', 'Site Allowance', 'Travel / Conveyance', 'Medical', 'Mobile & Internet', 'Performance Allowance'
  amount: number; // in INR ₹
  type?: 'Taxable' | 'Non-Taxable' | 'Special';
  frequency?: 'Monthly' | 'Quarterly' | 'Annual';
}

export interface User {
  id: string;
  username: string; // e.g., 'siteadmin', 'engineer1', 'marketing1'
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  branchId: string; // 'ALL' for corporate/superadmin or specific branch code
  department: string;
  designation: string;
  avatarUrl?: string;
  tempPassword?: string;
  mustChangePassword?: boolean;
  joiningDate: string;
  salaryBase: number;
  assignedProjectIds: string[];
  allowances?: SalaryAllowance[];
  panNumber?: string;
  aadhaarNumber?: string;
  drivingLicense?: string;
  highestDegree?: string;
  canViewAllStaffData?: boolean; // Employee-level override: only sees own data if false
  canViewFinancials?: boolean; // Employee-level override: only Accounts/Marketing/Admin can see portfolio budget
  customHrPermissions?: Partial<Record<HrSubSection, boolean>>;
  // For marketing
  salesTarget?: number;
  targetCommissionRate?: number; // e.g. 3.5%
}

export interface Project {
  id: string;
  code: string;
  name: string;
  clientName: string;
  clientContact: string;
  branchId: string;
  location: string;
  type: string; // e.g. 'Residential', 'Commercial', 'Industrial', 'Infrastructure' or custom category
  startDate: string;
  estimatedCompletionDate: string;
  status: 'Planning' | 'Active Execution' | 'Finishing' | 'Handover' | 'On Hold';
  progressPercentage: number;
  totalBudget: number;
  spentBudget: number;
  siteEngineerIds: string[];
  designerIds: string[];
  marketingLeadId?: string;
  description: string;
  floorsCount?: number;
  builtUpAreaSqFt?: number;
  bannerUrl?: string;
  photos?: string[];
}

export interface DailyLaborBreakdown {
  trade: 'Masons' | 'Carpenters' | 'Bar Benders' | 'Electricians' | 'Plumbers' | 'General Helpers';
  headcount: number;
  hoursWorked: number;
  overtimeHours: number;
}

export interface DailyMaterialConsumption {
  materialId: string;
  materialName: string;
  unit: string;
  quantityUsed: number;
}

export interface DailyProgressReport {
  id: string;
  dprNumber: string;
  projectId: string;
  projectName: string;
  branchId: string;
  engineerId: string;
  engineerName: string;
  reportDate: string;
  weatherCondition: 'Sunny / Clear' | 'Partly Cloudy' | 'Rainy / Wet Site' | 'Extreme Heat' | 'Windy / Dust';
  workSummary: string;
  milestoneAchieved: string;
  laborSummary: DailyLaborBreakdown[];
  materialsUsed: DailyMaterialConsumption[];
  equipmentStatus: string;
  safetyObservations: string;
  delaysOrBlockers?: string;
  photos: string[];
  supervisorSignOff: boolean;
  submittedAt: string;
}

export interface LaborTimeLog {
  id: string;
  employeeId: string;
  employeeName: string;
  branchId: string;
  projectId?: string;
  date: string;
  shiftType?: string; // e.g. 'Morning Shift (08:00 AM - 05:00 PM)', 'General Shift (09:00 AM - 06:00 PM)', 'Night Cast Shift'
  clockIn: string;
  clockOut?: string;
  breakDurationMinutes?: number; // Break Time in minutes e.g. 45 or 60
  breakNotes?: string;
  regularHours: number;
  overtimeHours: number;
  totalWorkingHours?: number;
  locationTag: string;
  status: 'Present' | 'Late' | 'Half Day' | 'On Leave';
  approved: boolean;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'Cement & Aggregates' | 'Steel & Structural' | 'Finishing & Tiles' | 'Plumbing & Sanitary' | 'Electrical' | 'Machinery Tools';
  unit: string;
  unitPrice: number;
  branchId: string;
  locationType: 'Central Warehouse' | 'Site Yard';
  projectId?: string;
  quantityInStock: number;
  minThreshold: number;
  reorderQuantity: number;
  lastRestockedDate: string;
}

export interface MaterialTransferRequest {
  id: string;
  reqNumber: string;
  itemId?: string;
  itemName: string;
  category?: string;
  quantity: number;
  unit: string;
  fromLocation: string;
  toProjectId: string;
  toProjectName: string;
  requestedBy: string;
  requestedById?: string;
  requestedDate: string;
  materialNeededDate: string; // Target needed date requested by site engineer
  urgency?: 'Immediate / Emergency' | 'High (24-48 hrs)' | 'Standard (3-5 days)' | 'Scheduled';
  estimatedCost?: number; // In Indian Rupees (₹)
  status: 'Pending Accounts & Admin Review' | 'Approved by Accounts' | 'Admin Cleared' | 'Dispatched' | 'Received at Site' | 'Rejected';
  accountsRemark?: string;
  adminRemark?: string;
  reviewedByAccounts?: string;
  clearedByAdmin?: string;
  notes?: string;
}

export type VerificationDocType = 
  | 'Employee ID Card' 
  | 'Aadhaar Card' 
  | 'PAN Card' 
  | 'Driving License' 
  | 'Degree / Educational Certificate' 
  | 'Police Verification';

export interface EmployeeVerification {
  id: string;
  employeeId: string;
  employeeName: string;
  docType: VerificationDocType;
  docNumber: string;
  status: 'Verified' | 'Pending Verification' | 'Rejected';
  issuedBy?: string;
  verifiedBy?: string;
  verifiedDate?: string;
  documentFileUrl?: string;
  remarks?: string;
}

export type OfficialDocCategory = 
  | 'Joining Letter' 
  | 'Appointment Letter' 
  | 'Offer Letter' 
  | 'Salary Increment Letter' 
  | 'NDA & Code of Conduct' 
  | 'Experience / Relieving Letter' 
  | 'Other Document';

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  category: OfficialDocCategory;
  uploadDate: string;
  fileSize?: string;
  fileUrl?: string;
  uploadedBy: string;
  notes?: string;
}

export interface SalarySlip {
  id: string;
  slipNumber: string;
  employeeId: string;
  employeeName: string;
  month: string; // e.g. "October 2026"
  year: number;
  workingDays: number;
  daysPresent: number;
  leavesTaken: number;
  baseSalary: number;
  hra: number;
  siteAllowance: number;
  overtimePay: number;
  targetIncentiveCommission: number;
  allowances?: SalaryAllowance[]; // Added / custom allowances (add/edit/delete)
  grossSalary: number;
  deductions: {
    providentFund: number;
    professionalTax: number;
    advanceDeduction: number;
    taxDeducted: number;
  };
  netPayable: number;
  paymentStatus: 'Paid' | 'Processing' | 'Held';
  paymentDate?: string;
  transactionRef?: string;
}

export interface Holiday {
  id: string;
  date: string;
  title: string;
  type: 'National Holiday' | 'Regional / State Festival' | 'Company Foundation Day' | 'Public Holiday';
  applicableBranchIds: string[]; // 'ALL' or array of branch IDs
  isMandatory: boolean;
  description?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'Casual Leave' | 'Sick Leave' | 'Earned Site Leave' | 'Compensatory Off';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
  approvedBy?: string;
}

export type InquiryServiceType = 
  | 'Planning Civil Construction + Interior Design'
  | 'Only Construction Service'
  | 'Only Interior Design';

export type PaymentPlanningMode = 'Loan' | 'Self Funded';

export type ArchitectPreference = 'Have architect by own' | 'Design with us';

export interface ConstructionPackage {
  id: string;
  name: string;
  serviceType: InquiryServiceType;
  ratePerSqFt: number; // in INR / sqft
  description: string;
  inclusions: string[];
  isActive: boolean;
}

export type FollowUpContactType = 'Phone Call' | 'Call' | 'In-Person Meeting' | 'Site Visit' | 'Video Call' | 'WhatsApp / Message';

export interface InquiryFollowUp {
  id: string;
  inquiryId: string;
  contactType: FollowUpContactType;
  date: string;
  time: string;
  loggedByName: string;
  loggedById?: string;
  discussionNotes: string;
  nextActionDate?: string;
  nextActionNotes?: string;
}

export type ReminderType = 'Call' | 'Message / WhatsApp' | 'In-Person Meeting' | 'Site Visit';

export interface InquiryReminder {
  id: string;
  inquiryId?: string;
  customerName: string;
  contactNumber: string;
  type: ReminderType;
  title: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:MM
  notes: string;
  priority: 'Urgent' | 'High' | 'Normal';
  isCompleted: boolean;
  completedAt?: string;
  assignedToName: string;
}

export type InquiryStage = 
  | 'New Inquiry'
  | 'Requirement Assessment'
  | 'Site Visit & Survey'
  | 'Package Quotation Shared'
  | 'Negotiation & Financing'
  | 'Converted to Business'
  | 'Dropped / Lost';

export interface Inquiry {
  id: string;
  inquiryNumber: string; // e.g. "INQ-2026-081"
  
  // 1st Primary Form
  customerName: string;
  contactNumber: string;
  email: string;
  firstInquiryDate: string;
  budget: number; // in INR
  siteAddress: string;
  residentAddress: string;
  notes: string;
  
  // 2nd Secondary Form (Planning specs)
  hasDetailedSpec: boolean;
  serviceType?: InquiryServiceType;
  alternateMobile?: string;
  totalSqFtArea?: number; // Total Sqft area / Plinth area plan
  paymentMode?: PaymentPlanningMode;
  familyMembersCount?: number;
  projectStartDate?: string;
  projectDeadlineDate?: string;
  architectOption?: ArchitectPreference;
  floorsCount?: string; // e.g. "Ground Only", "G+1", "G+2", "G+3", "G+4+"
  selectedPackageId?: string;
  selectedPackageName?: string;
  packageEstimatedCost?: number;
  
  // Pipeline & CRM
  stage: InquiryStage;
  branchId: string;
  assignedMarketingId: string;
  assignedMarketingName: string;
  source?: string;
  followUps: InquiryFollowUp[];
  convertedProjectId?: string;
  convertedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrmLead {
  id: string;
  leadCode: string;
  clientName: string;
  organization?: string;
  phone: string;
  email: string;
  branchId: string;
  projectTypeInterest: 'Residential Tower' | 'Commercial Office' | 'Industrial Shed' | 'Villa Construction' | 'Interior Fitout';
  estimatedValue: number;
  stage: 'New Inquiry' | 'Site Inspection Scheduled' | 'Design & Estimation' | 'Quotation Sent' | 'Negotiation' | 'Contract Won' | 'Lost';
  assignedMarketingId: string;
  assignedMarketingName: string;
  linkedSiteEngineerId?: string;
  linkedDesignerId?: string;
  source: 'Referral' | 'Website' | 'Architect Tie-up' | 'Tender / Government' | 'Direct Walk-in';
  notes: string;
  nextFollowUpDate: string;
  createdAt: string;
  quotationAmount?: number;
}

export interface DesignDraft {
  id: string;
  draftCode: string;
  projectId: string;
  projectName: string;
  title: string;
  category: 'Architectural Blueprint' | 'Structural Drawing' | '3D Elevation Render' | 'HVAC & MEP Plan' | 'Interior Layout';
  version: string; // e.g. "v1.2"
  designerId: string;
  designerName: string;
  imageUrl?: string;
  status: 'Draft Uploaded' | 'Site Review' | 'Marketing / Client Review' | 'Approved for Execution' | 'Revision Requested';
  uploadedAt: string;
  dimensions?: string;
  comments: Array<{
    id: string;
    userName: string;
    userRole: UserRole;
    text: string;
    timestamp: string;
  }>;
}

export interface CollaborationTask {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  assignedToRole: UserRole;
  assignedToName: string;
  createdByRole: UserRole;
  createdByName: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Todo' | 'In Progress' | 'Under Review' | 'Completed';
  dueDate: string;
  description: string;
  commentsCount: number;
}

export interface CustomAppModule {
  id: string;
  key: ModuleKey | string;
  name: string;
  description: string;
  iconName: string;
  isEnabled: boolean;
  isSystem: boolean;
  requiredRole: UserRole[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'dpr' | 'lead' | 'design' | 'salary' | 'inventory';
  isRead: boolean;
  linkTab?: string;
}
