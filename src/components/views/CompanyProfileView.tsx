import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  ShieldCheck, 
  Edit3, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Award, 
  FileText, 
  ExternalLink,
  Layers,
  Lock,
  Building,
  Image as ImageIcon,
  Save,
  X,
  User,
  Check,
  AlertTriangle,
  Briefcase,
  Eye,
  EyeOff,
  Sliders
} from 'lucide-react';
import { BranchAddress, UserRole } from '../../types';

export const CompanyProfileView: React.FC = () => {
  const { 
    companyProfile, 
    updateCompanyProfile, 
    updateStatutoryVisibility,
    addBranchAddress, 
    updateBranchAddress, 
    deleteBranchAddress, 
    currentUser 
  } = useApp();
  
  const isAdmin = currentUser?.role === 'ADMIN';

  // Overall Profile edit mode
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Dedicated section edit modes
  const [isEditingExecutive, setIsEditingExecutive] = useState(false);
  const [isEditingStatutory, setIsEditingStatutory] = useState(false);
  const [isConfiguringVisibility, setIsConfiguringVisibility] = useState(false);

  // Edit profile form state
  const [profileForm, setProfileForm] = useState({
    companyName: companyProfile.companyName,
    brandName: companyProfile.brandName,
    tagline: companyProfile.tagline,
    cin: companyProfile.cin,
    gstin: companyProfile.gstin,
    pan: companyProfile.pan,
    reraRegistration: companyProfile.reraRegistration,
    legalStatus: companyProfile.legalStatus || 'Private Limited Company (RoC Ahmedabad, Gujarat)',
    headOfficeCity: companyProfile.headOfficeCity,
    headOfficeAddress: companyProfile.headOfficeAddress,
    phone: companyProfile.phone,
    altPhone: companyProfile.altPhone,
    email: companyProfile.email,
    website: companyProfile.website,
    bannerUrl: companyProfile.bannerUrl,
    logoUrl: companyProfile.logoUrl,
    establishedYear: companyProfile.establishedYear,
    aboutCompany: companyProfile.aboutCompany,
    executiveManagingDirector: companyProfile.executiveManagingDirector || 'Prashant Wadhwa, Managing Director & CEO',
    executiveDirector: companyProfile.executiveDirector || 'Nirav J. Pandya, Executive Director & COO',
    executivePhilosophy: companyProfile.executivePhilosophy || 'Precision engineering, zero structural compromise, and transparent DPR accounting in Indian Rupees (₹).',
  });

  // Executive Section edit form
  const [executiveForm, setExecutiveForm] = useState({
    aboutCompany: companyProfile.aboutCompany,
    executiveManagingDirector: companyProfile.executiveManagingDirector || 'Prashant Wadhwa, Managing Director & CEO',
    executiveDirector: companyProfile.executiveDirector || 'Nirav J. Pandya, Executive Director & COO',
    executivePhilosophy: companyProfile.executivePhilosophy || 'Precision engineering, zero structural compromise, and transparent DPR accounting in Indian Rupees (₹).',
  });

  // Statutory Credentials edit form
  const [statutoryForm, setStatutoryForm] = useState({
    cin: companyProfile.cin,
    gstin: companyProfile.gstin,
    pan: companyProfile.pan,
    reraRegistration: companyProfile.reraRegistration,
    legalStatus: companyProfile.legalStatus || 'Private Limited Company (RoC Ahmedabad, Gujarat)',
  });

  // Statutory section access control list
  const allRoles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'ADMIN', label: 'Admin', desc: 'Managing Director & Super Admin' },
    { role: 'SITE_ENGINEER', label: 'Site Engineer', desc: 'Civil & Resident Site Engineers' },
    { role: 'MARKETING', label: 'Marketing', desc: 'CRM, Client Acquisition & Sales' },
    { role: 'DESIGNER', label: 'Designer / Architect', desc: 'BIM & Structural Drafters' },
    { role: 'EMPLOYEE', label: 'Employees & Staff', desc: 'Site Supervisors & Field Workforce' },
  ];

  const currentVisibilityRoles: UserRole[] = companyProfile.statutoryVisibilityRoles || [
    'ADMIN', 'SITE_ENGINEER', 'MARKETING', 'DESIGNER', 'EMPLOYEE'
  ];

  const [visibilityRoles, setVisibilityRoles] = useState<UserRole[]>(currentVisibilityRoles);

  // Dedicated Branch Modal state (for Add or Edit branch)
  const [branchModal, setBranchModal] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    branch: Partial<BranchAddress>;
  }>({
    isOpen: false,
    mode: 'add',
    branch: {
      branchName: '',
      code: '',
      city: 'Vadodara',
      state: 'Gujarat',
      address: '',
      pincode: '',
      phone: '',
      email: '',
      managerName: '',
      type: 'Regional Office',
      isHeadquarters: false
    }
  });

  // Branch delete confirmation state
  const [branchToDelete, setBranchToDelete] = useState<BranchAddress | null>(null);

  // Success alert indicator
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const triggerAlert = (msg: string) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(null), 3500);
  };

  const openAddBranchModal = () => {
    setBranchModal({
      isOpen: true,
      mode: 'add',
      branch: {
        branchName: '',
        code: `BR-0${(companyProfile.branches?.length || 0) + 1}`,
        city: 'Vadodara',
        state: 'Gujarat',
        address: '',
        pincode: '',
        phone: '+91 ',
        email: 'branch@pwconstruction.com',
        managerName: '',
        type: 'Regional Office',
        isHeadquarters: false
      }
    });
  };

  const openEditBranchModal = (branch: BranchAddress) => {
    setBranchModal({
      isOpen: true,
      mode: 'edit',
      branch: { ...branch }
    });
  };

  const handleBranchModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchModal.branch.branchName || !branchModal.branch.address) return;

    if (branchModal.mode === 'add') {
      addBranchAddress(branchModal.branch);
      triggerAlert('New branch address added successfully.');
    } else if (branchModal.branch.id) {
      updateBranchAddress(branchModal.branch.id, branchModal.branch);
      triggerAlert('Branch address details updated successfully.');
    }

    setBranchModal(prev => ({ ...prev, isOpen: false }));
  };

  const confirmDeleteBranch = () => {
    if (branchToDelete) {
      deleteBranchAddress(branchToDelete.id);
      setBranchToDelete(null);
      triggerAlert('Branch removed from company directory.');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyProfile(profileForm);
    setIsEditingProfile(false);
    triggerAlert('Corporate company profile saved successfully.');
  };

  const handleSaveExecutive = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyProfile(executiveForm);
    setIsEditingExecutive(false);
    triggerAlert('Company Overview & Executive Profile updated successfully.');
  };

  const handleSaveStatutory = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyProfile(statutoryForm);
    setIsEditingStatutory(false);
    triggerAlert('Statutory Credentials & Legal Registrations updated successfully.');
  };

  const handleToggleRoleVisibility = (role: UserRole) => {
    const updated = visibilityRoles.includes(role)
      ? visibilityRoles.filter(r => r !== role)
      : [...visibilityRoles, role];
    
    // Always keep ADMIN allowed
    if (!updated.includes('ADMIN')) {
      updated.push('ADMIN');
    }
    setVisibilityRoles(updated);
  };

  const handleSaveVisibilitySettings = () => {
    updateStatutoryVisibility(visibilityRoles);
    setIsConfiguringVisibility(false);
    triggerAlert('Statutory Credentials access permissions saved.');
  };

  // Determine if current user can view Statutory Credentials
  const canViewStatutory = isAdmin || (
    companyProfile.statutoryVisibilityRoles 
      ? companyProfile.statutoryVisibilityRoles.includes(currentUser?.role || 'EMPLOYEE')
      : true
  );

  return (
    <div className="space-y-6">
      
      {/* Top Header & Role Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[var(--text-main)] tracking-tight">Corporate Company Profile</h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 rounded">
              Vadodara Corporate Hub
            </span>
            <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 rounded">
              ₹ INR
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Legal identity, branch addresses with full physical location, statutory registrations & governance
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {isAdmin ? (
            <>
              <button
                onClick={openAddBranchModal}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--primary-accent-border)] text-[var(--primary-accent-text)] hover:bg-[var(--primary-accent-bg)] transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[var(--primary-accent)]" />
                <span>Add Branch Address</span>
              </button>

              <button
                onClick={() => {
                  setProfileForm({
                    companyName: companyProfile.companyName,
                    brandName: companyProfile.brandName,
                    tagline: companyProfile.tagline,
                    cin: companyProfile.cin,
                    gstin: companyProfile.gstin,
                    pan: companyProfile.pan,
                    reraRegistration: companyProfile.reraRegistration,
                    legalStatus: companyProfile.legalStatus || 'Private Limited Company (RoC Ahmedabad, Gujarat)',
                    headOfficeCity: companyProfile.headOfficeCity,
                    headOfficeAddress: companyProfile.headOfficeAddress,
                    phone: companyProfile.phone,
                    altPhone: companyProfile.altPhone,
                    email: companyProfile.email,
                    website: companyProfile.website,
                    bannerUrl: companyProfile.bannerUrl,
                    logoUrl: companyProfile.logoUrl,
                    establishedYear: companyProfile.establishedYear,
                    aboutCompany: companyProfile.aboutCompany,
                    executiveManagingDirector: companyProfile.executiveManagingDirector || 'Prashant Wadhwa, Managing Director & CEO',
                    executiveDirector: companyProfile.executiveDirector || 'Nirav J. Pandya, Executive Director & COO',
                    executivePhilosophy: companyProfile.executivePhilosophy || 'Precision engineering, zero structural compromise, and transparent DPR accounting in Indian Rupees (₹).',
                  });
                  setIsEditingProfile(!isEditingProfile);
                }}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors shadow-md cursor-pointer ${
                  isEditingProfile 
                    ? 'bg-slate-700 text-white hover:bg-slate-600' 
                    : 'bg-[var(--primary-accent)] text-slate-950 hover:opacity-90'
                }`}
              >
                {isEditingProfile ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                <span>{isEditingProfile ? 'Close Master Editor' : 'Edit Company Profile (Admin)'}</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg">
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>Read-Only Corporate View (Admin Controlled)</span>
            </div>
          )}
        </div>
      </div>

      {/* Floating Alert */}
      {alertMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-xl flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold">{alertMessage}</span>
          </div>
          <button onClick={() => setAlertMessage(null)} className="text-slate-400 hover:text-slate-200">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Master Admin Edit Profile Form */}
      {isEditingProfile && isAdmin && (
        <form onSubmit={handleSaveProfile} className="bg-[var(--bg-surface)] border border-[var(--primary-accent-border)] rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-[var(--primary-accent-text)]" />
              <div>
                <h2 className="text-base font-bold text-[var(--text-main)]">Edit Pixar World Construction Corporate Profile</h2>
                <p className="text-xs text-[var(--text-muted)]">Update registered business details, branding, and Vadodara corporate headquarters</p>
              </div>
            </div>
            <span className="text-xs text-[var(--text-muted)] font-mono bg-[var(--bg-surface-subtle)] px-2.5 py-1 rounded border border-[var(--border-subtle)]">
              Admin Mode (siteadmin)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Company Legal Entity Name *</label>
              <input
                type="text"
                value={profileForm.companyName}
                onChange={e => setProfileForm({ ...profileForm, companyName: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] font-medium"
                required
              />
              <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">Official Registered RoC Name</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Brand Name *</label>
              <input
                type="text"
                value={profileForm.brandName}
                onChange={e => setProfileForm({ ...profileForm, brandName: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] font-bold text-amber-500"
                required
              />
              <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">Trade mark & public facing brand name</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Corporate Tagline / Motto</label>
              <input
                type="text"
                value={profileForm.tagline}
                onChange={e => setProfileForm({ ...profileForm, tagline: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Established Year</label>
              <input
                type="number"
                value={profileForm.establishedYear}
                onChange={e => setProfileForm({ ...profileForm, establishedYear: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">About Company / Corporate Overview</label>
            <textarea
              value={profileForm.aboutCompany}
              onChange={e => setProfileForm({ ...profileForm, aboutCompany: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] leading-relaxed"
            />
          </div>

          {/* Executive Leadership Inputs */}
          <div className="p-4 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] space-y-3">
            <label className="block text-xs font-bold text-[var(--primary-accent-text)] uppercase tracking-wider font-mono">
              Executive Profile & Key Leadership
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-main)] mb-1">Managing Director / CEO</label>
                <input
                  type="text"
                  value={profileForm.executiveManagingDirector}
                  onChange={e => setProfileForm({ ...profileForm, executiveManagingDirector: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded text-[var(--text-main)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-main)] mb-1">Executive Director & COO</label>
                <input
                  type="text"
                  value={profileForm.executiveDirector}
                  onChange={e => setProfileForm({ ...profileForm, executiveDirector: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded text-[var(--text-main)]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-[var(--text-main)] mb-1">Corporate Quality & Engineering Philosophy</label>
                <input
                  type="text"
                  value={profileForm.executivePhilosophy}
                  onChange={e => setProfileForm({ ...profileForm, executivePhilosophy: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded text-[var(--text-main)]"
                />
              </div>
            </div>
          </div>

          {/* Statutory Registration Details */}
          <div>
            <label className="block text-xs font-bold text-[var(--primary-accent-text)] uppercase tracking-wider mb-2 font-mono">
              Statutory Government & Tax Registrations
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)]">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-subtle)] mb-1 uppercase font-mono">CIN Number</label>
                <input
                  type="text"
                  value={profileForm.cin}
                  onChange={e => setProfileForm({ ...profileForm, cin: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded font-mono text-[var(--text-main)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-subtle)] mb-1 uppercase font-mono">GSTIN (Gujarat: 24)</label>
                <input
                  type="text"
                  value={profileForm.gstin}
                  onChange={e => setProfileForm({ ...profileForm, gstin: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded font-mono text-[var(--text-main)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-subtle)] mb-1 uppercase font-mono">Income Tax PAN</label>
                <input
                  type="text"
                  value={profileForm.pan}
                  onChange={e => setProfileForm({ ...profileForm, pan: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded font-mono text-[var(--text-main)]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-subtle)] mb-1 uppercase font-mono">Gujarat RERA Reg.</label>
                <input
                  type="text"
                  value={profileForm.reraRegistration}
                  onChange={e => setProfileForm({ ...profileForm, reraRegistration: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded font-mono text-[var(--text-main)]"
                />
              </div>
              <div className="sm:col-span-2 md:col-span-4">
                <label className="block text-[11px] font-semibold text-[var(--text-subtle)] mb-1 uppercase font-mono">Legal Entity Classification</label>
                <input
                  type="text"
                  value={profileForm.legalStatus}
                  onChange={e => setProfileForm({ ...profileForm, legalStatus: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded font-mono text-[var(--text-main)]"
                />
              </div>
            </div>
          </div>

          {/* Vadodara Head Office & Contacts */}
          <div>
            <label className="block text-xs font-bold text-[var(--primary-accent-text)] uppercase tracking-wider mb-2 font-mono">
              Vadodara Corporate Headquarters & Official Contact
            </label>
            <div className="space-y-4 p-4 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Head Office City</label>
                  <input
                    type="text"
                    value={profileForm.headOfficeCity}
                    onChange={e => setProfileForm({ ...profileForm, headOfficeCity: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Primary Phone (HQ)</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Alternate / Mobile Phone</label>
                  <input
                    type="text"
                    value={profileForm.altPhone}
                    onChange={e => setProfileForm({ ...profileForm, altPhone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Head Office Full Street Address (Vadodara HQ) *</label>
                <input
                  type="text"
                  value={profileForm.headOfficeAddress}
                  onChange={e => setProfileForm({ ...profileForm, headOfficeAddress: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Official Email Address</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Website URL</label>
                  <input
                    type="text"
                    value={profileForm.website}
                    onChange={e => setProfileForm({ ...profileForm, website: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Banner URL */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Corporate Profile Banner URL</label>
            <input
              type="text"
              value={profileForm.bannerUrl}
              onChange={e => setProfileForm({ ...profileForm, bannerUrl: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono text-[11px]"
              placeholder="/src/assets/images/hero_construction_site_1792597145952.jpg"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-surface-subtle)] rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Corporate Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* Main Corporate Profile Card View */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-xs">
        
        {/* Hero Banner with Scrim */}
        <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-950">
          <img
            src={companyProfile.bannerUrl || '/src/assets/images/hero_construction_site_1792597145952.jpg'}
            alt={companyProfile.companyName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-md bg-slate-900/85 backdrop-blur-md text-amber-400 font-bold border border-slate-700 font-mono shadow-md">
                BRAND: {companyProfile.brandName}
              </span>
              <span className="px-3 py-1 rounded-md bg-slate-900/85 backdrop-blur-md text-emerald-400 font-mono text-[11px] border border-slate-700 hidden sm:inline-block">
                Registered in Gujarat
              </span>
            </div>
            
            <span className="px-3 py-1 rounded-md bg-slate-900/85 backdrop-blur-md text-emerald-400 font-semibold border border-slate-700 flex items-center gap-1.5 shadow-md">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Corporate Active (Est. {companyProfile.establishedYear})
            </span>
          </div>

          {/* Banner bottom details */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-13 h-13 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xl shadow-xl border-2 border-white/20 shrink-0">
                  PW
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm">
                    {companyProfile.companyName}
                  </h2>
                  <p className="text-xs text-amber-300 font-medium drop-shadow-sm">
                    {companyProfile.tagline}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-300 font-mono bg-slate-900/70 p-2 rounded-lg border border-slate-800 backdrop-blur-xs">
              <div>Headquarters: Vadodara, Gujarat (INDIA)</div>
              <div className="text-amber-400 font-bold">Transaction Currency: Indian Rupee (₹ INR)</div>
            </div>
          </div>
        </div>

        {/* Profile Content Body */}
        <div className="p-6 space-y-6">
          
          {/* SECTION 1: Company Overview & Executive Profile */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[var(--border-subtle)]">
              <h3 className="text-xs font-bold text-[var(--primary-accent-text)] uppercase tracking-wider font-mono flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[var(--primary-accent)]" />
                <span>Company Overview & Executive Profile</span>
              </h3>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setExecutiveForm({
                      aboutCompany: companyProfile.aboutCompany,
                      executiveManagingDirector: companyProfile.executiveManagingDirector || 'Prashant Wadhwa, Managing Director & CEO',
                      executiveDirector: companyProfile.executiveDirector || 'Nirav J. Pandya, Executive Director & COO',
                      executivePhilosophy: companyProfile.executivePhilosophy || 'Precision engineering, zero structural compromise, and transparent DPR accounting in Indian Rupees (₹).',
                    });
                    setIsEditingExecutive(true);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[var(--primary-accent-text)] bg-[var(--primary-accent-bg)] border border-[var(--primary-accent-border)] rounded-md hover:opacity-90 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Section</span>
                </button>
              )}
            </div>

            <p className="text-xs text-[var(--text-main)] leading-relaxed bg-[var(--bg-surface-subtle)] p-4 rounded-xl border border-[var(--border-subtle)]">
              {companyProfile.aboutCompany}
            </p>

            {/* Executive Leadership Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)]">
                <span className="text-[10px] text-[var(--text-subtle)] uppercase font-mono block">Managing Director & CEO</span>
                <span className="text-xs font-bold text-[var(--text-main)] block mt-0.5">
                  {companyProfile.executiveManagingDirector || 'Prashant Wadhwa, Managing Director & CEO'}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">Corporate Governance & Capital Allocation</span>
              </div>

              <div className="p-3 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)]">
                <span className="text-[10px] text-[var(--text-subtle)] uppercase font-mono block">Executive Director & COO</span>
                <span className="text-xs font-bold text-[var(--text-main)] block mt-0.5">
                  {companyProfile.executiveDirector || 'Nirav J. Pandya, Executive Director & COO'}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">Site Operations, Safety & DPR Execution</span>
              </div>

              <div className="p-3 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)]">
                <span className="text-[10px] text-[var(--text-subtle)] uppercase font-mono block">Quality & Safety Philosophy</span>
                <span className="text-xs font-medium text-[var(--primary-accent-text)] block mt-0.5 line-clamp-2">
                  {companyProfile.executivePhilosophy || 'Precision engineering and automated DPR transparency.'}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">ISO 9001:2015 & OHSAS Certified</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: Statutory Credentials & Legal Registrations */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-[var(--primary-accent-text)] uppercase tracking-wider font-mono flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[var(--primary-accent)]" />
                  <span>Statutory Credentials & Legal Registrations</span>
                </h3>
                {isAdmin && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                    Audited Records
                  </span>
                )}
              </div>

              {/* Admin Access Control & Edit Trigger */}
              {isAdmin && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setVisibilityRoles(companyProfile.statutoryVisibilityRoles || [
                        'ADMIN', 'SITE_ENGINEER', 'MARKETING', 'DESIGNER', 'EMPLOYEE'
                      ]);
                      setIsConfiguringVisibility(true);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[var(--text-muted)] bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-md hover:text-[var(--text-main)] cursor-pointer"
                    title="Control who can see this section"
                  >
                    <Sliders className="w-3 h-3 text-amber-500" />
                    <span>Control Visibility</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStatutoryForm({
                        cin: companyProfile.cin,
                        gstin: companyProfile.gstin,
                        pan: companyProfile.pan,
                        reraRegistration: companyProfile.reraRegistration,
                        legalStatus: companyProfile.legalStatus || 'Private Limited Company (RoC Ahmedabad, Gujarat)',
                      });
                      setIsEditingStatutory(true);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[var(--primary-accent-text)] bg-[var(--primary-accent-bg)] border border-[var(--primary-accent-border)] rounded-md hover:opacity-90 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Section</span>
                  </button>
                </div>
              )}
            </div>

            {/* Role-based Visibility Check */}
            {canViewStatutory ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)]">
                  <span className="text-[10px] text-[var(--text-subtle)] block uppercase">Corporate Identity (CIN)</span>
                  <span className="text-xs font-bold text-[var(--text-main)] break-all">{companyProfile.cin}</span>
                  <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">RoC Ahmedabad (Gujarat)</span>
                </div>

                <div className="p-3 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)]">
                  <span className="text-[10px] text-[var(--text-subtle)] block uppercase">GSTIN Identification</span>
                  <span className="text-xs font-bold text-[var(--primary-accent-text)]">{companyProfile.gstin}</span>
                  <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">State Code: 24 (Gujarat)</span>
                </div>

                <div className="p-3 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)]">
                  <span className="text-[10px] text-[var(--text-subtle)] block uppercase">Income Tax Permanent Acc (PAN)</span>
                  <span className="text-xs font-bold text-[var(--text-main)]">{companyProfile.pan}</span>
                  <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">
                    {companyProfile.legalStatus || 'Private Limited Company'}
                  </span>
                </div>

                <div className="p-3 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)]">
                  <span className="text-[10px] text-[var(--text-subtle)] block uppercase">Gujarat RERA Certificate</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 break-all">{companyProfile.reraRegistration}</span>
                  <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">Approved Developer & Contractor</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 text-[var(--text-muted)]">
                  <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    Confidential Statutory Credentials & Registrations are restricted to authorized administrative personnel by corporate policy.
                  </span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-500/10 text-amber-500 rounded border border-amber-500/20">
                  Restricted View
                </span>
              </div>
            )}
          </div>

          {/* Primary Vadodara Head Office Card */}
          <div className="p-5 rounded-xl border-2 border-[var(--primary-accent-border)] bg-[var(--primary-accent-bg)] space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[var(--primary-accent)] text-slate-950">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[var(--text-main)]">Vadodara Corporate Headquarters & Central Depot</h4>
                  <p className="text-[11px] text-[var(--text-muted)]">Registered Principal Place of Business</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-mono font-bold bg-[var(--primary-accent)] text-slate-950 rounded-md shadow-xs">
                HEADQUARTERS (BDQ-01)
              </span>
            </div>

            <div className="text-xs text-[var(--text-main)] flex items-start gap-2 pt-2">
              <MapPin className="w-4 h-4 text-[var(--primary-accent)] shrink-0 mt-0.5" />
              <span className="font-medium">{companyProfile.headOfficeAddress}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
              <a href={`tel:${companyProfile.phone}`} className="flex items-center gap-2 text-[var(--text-main)] hover:text-[var(--primary-accent-text)] transition-colors">
                <Phone className="w-3.5 h-3.5 text-[var(--primary-accent)] shrink-0" />
                <span>{companyProfile.phone}</span>
              </a>
              <a href={`mailto:${companyProfile.email}`} className="flex items-center gap-2 text-[var(--text-main)] hover:text-[var(--primary-accent-text)] transition-colors">
                <Mail className="w-3.5 h-3.5 text-[var(--primary-accent)] shrink-0" />
                <span className="truncate">{companyProfile.email}</span>
              </a>
              <a href={companyProfile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--text-main)] hover:text-[var(--primary-accent-text)] transition-colors">
                <Globe className="w-3.5 h-3.5 text-[var(--primary-accent)] shrink-0" />
                <span className="truncate">{companyProfile.website}</span>
              </a>
            </div>
          </div>

          {/* Multiple Branch Addresses Network */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--border-subtle)]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider font-mono">
                    Multiple Branch Addresses & Regional Depots ({companyProfile.branches?.length || 0})
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-[var(--bg-surface-subtle)] text-[var(--primary-accent-text)] border border-[var(--border-subtle)] rounded">
                    Gujarat & Western India
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Complete branch network with physical street addresses, local contact numbers, and operational facilities
                </p>
              </div>

              {isAdmin && (
                <button
                  type="button"
                  onClick={openAddBranchModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[var(--primary-accent)] text-slate-950 rounded-lg hover:opacity-90 transition-opacity shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Branch Address</span>
                </button>
              )}
            </div>

            {/* Branch Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {companyProfile.branches?.map(branch => (
                <div
                  key={branch.id}
                  className="p-4 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] rounded-xl transition-all shadow-xs flex flex-col justify-between relative group"
                >
                  <div>
                    {/* Top Row: Name and Badges */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <div className="text-xs sm:text-sm font-bold text-[var(--text-main)] flex items-center gap-2 flex-wrap">
                          <Building2 className="w-4 h-4 text-[var(--primary-accent)] shrink-0" />
                          <span>{branch.branchName}</span>
                        </div>
                        {branch.code && (
                          <span className="text-[10px] text-[var(--text-muted)] font-mono block mt-0.5">
                            Branch Code: {branch.code}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {branch.isHeadquarters ? (
                          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/15 text-amber-500 border border-amber-500/25 rounded">
                            HQ & Central Depot
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-mono font-medium text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded">
                            {branch.city}, {branch.state}
                          </span>
                        )}

                        {/* Admin Action Buttons */}
                        {isAdmin && (
                          <div className="flex items-center gap-1 ml-1">
                            <button
                              type="button"
                              onClick={() => openEditBranchModal(branch)}
                              className="p-1.5 text-slate-400 hover:text-[var(--primary-accent-text)] hover:bg-[var(--bg-surface)] rounded transition-colors cursor-pointer"
                              title="Edit branch details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            {!branch.isHeadquarters && (
                              <button
                                type="button"
                                onClick={() => setBranchToDelete(branch)}
                                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                                title="Remove branch"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Full Physical Address */}
                    <div className="text-xs text-[var(--text-main)] flex items-start gap-2 mt-2 leading-relaxed bg-[var(--bg-surface)] p-2.5 rounded-lg border border-[var(--border-subtle)]">
                      <MapPin className="w-4 h-4 text-[var(--primary-accent)] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">{branch.address}</div>
                        <div className="text-[11px] text-[var(--text-muted)] mt-0.5 font-mono">
                          {branch.city}, {branch.state} {branch.pincode ? `- ${branch.pincode}` : ''}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Manager Row */}
                  <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-[var(--text-muted)]">
                    <a 
                      href={`tel:${branch.phone}`}
                      className="flex items-center gap-1.5 text-[var(--text-main)] hover:text-[var(--primary-accent-text)] transition-colors truncate"
                    >
                      <Phone className="w-3 h-3 text-[var(--primary-accent)] shrink-0" />
                      <span className="truncate">{branch.phone || '+91 265 000 0000'}</span>
                    </a>
                    
                    <a 
                      href={`mailto:${branch.email}`}
                      className="flex items-center gap-1.5 text-[var(--text-main)] hover:text-[var(--primary-accent-text)] transition-colors truncate justify-start sm:justify-end"
                    >
                      <Mail className="w-3 h-3 text-[var(--primary-accent)] shrink-0" />
                      <span className="truncate">{branch.email || 'info@pwconstruction.com'}</span>
                    </a>

                    {branch.managerName && (
                      <div className="flex items-center gap-1.5 text-[var(--text-muted)] col-span-1 sm:col-span-2 pt-1 border-t border-dashed border-[var(--border-subtle)]">
                        <User className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>Branch In-Charge: <strong className="text-[var(--text-main)] font-sans">{branch.managerName}</strong></span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* EDIT MODAL 1: Company Overview & Executive Profile */}
      {isEditingExecutive && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[var(--primary-accent)]" />
                <h3 className="text-sm font-bold text-[var(--text-main)]">
                  Edit Company Overview & Executive Profile
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingExecutive(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-[var(--text-main)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExecutive} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Company Overview & Corporate Summary *
                </label>
                <textarea
                  rows={4}
                  value={executiveForm.aboutCompany}
                  onChange={e => setExecutiveForm({ ...executiveForm, aboutCompany: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    Managing Director & CEO *
                  </label>
                  <input
                    type="text"
                    value={executiveForm.executiveManagingDirector}
                    onChange={e => setExecutiveForm({ ...executiveForm, executiveManagingDirector: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    Executive Director & COO
                  </label>
                  <input
                    type="text"
                    value={executiveForm.executiveDirector}
                    onChange={e => setExecutiveForm({ ...executiveForm, executiveDirector: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Quality & Engineering Philosophy
                </label>
                <textarea
                  rows={2}
                  value={executiveForm.executivePhilosophy}
                  onChange={e => setExecutiveForm({ ...executiveForm, executivePhilosophy: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsEditingExecutive(false)}
                  className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-surface-subtle)] hover:text-[var(--text-main)] rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Overview & Executive Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL 2: Statutory Credentials & Legal Registrations */}
      {isEditingStatutory && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[var(--primary-accent)]" />
                <h3 className="text-sm font-bold text-[var(--text-main)]">
                  Edit Statutory Credentials & Legal Registrations
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingStatutory(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-[var(--text-main)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStatutory} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    Corporate Identity Number (CIN) *
                  </label>
                  <input
                    type="text"
                    value={statutoryForm.cin}
                    onChange={e => setStatutoryForm({ ...statutoryForm, cin: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--primary-accent)]"
                    required
                  />
                  <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">RoC Ahmedabad (Gujarat)</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    GSTIN Identification (Gujarat: 24) *
                  </label>
                  <input
                    type="text"
                    value={statutoryForm.gstin}
                    onChange={e => setStatutoryForm({ ...statutoryForm, gstin: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--primary-accent)]"
                    required
                  />
                  <span className="text-[10px] text-[var(--text-muted)] mt-0.5 block">State Code: 24</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    Income Tax PAN *
                  </label>
                  <input
                    type="text"
                    value={statutoryForm.pan}
                    onChange={e => setStatutoryForm({ ...statutoryForm, pan: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--primary-accent)]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                    Gujarat RERA Registration *
                  </label>
                  <input
                    type="text"
                    value={statutoryForm.reraRegistration}
                    onChange={e => setStatutoryForm({ ...statutoryForm, reraRegistration: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--primary-accent)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Legal Entity Classification / Description
                </label>
                <input
                  type="text"
                  value={statutoryForm.legalStatus}
                  onChange={e => setStatutoryForm({ ...statutoryForm, legalStatus: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsEditingStatutory(false)}
                  className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-surface-subtle)] hover:text-[var(--text-main)] rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Statutory Credentials</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Statutory Credentials Visibility Access Control (Admin Only) */}
      {isConfiguringVisibility && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-main)]">
                    Statutory Credentials Visibility Control
                  </h3>
                  <p className="text-[10px] text-[var(--text-muted)]">Control which roles can view CIN, GSTIN, PAN and RERA details</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsConfiguringVisibility(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-[var(--text-main)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="text-xs text-[var(--text-muted)]">
                Select which system user roles are permitted to see the <strong className="text-[var(--text-main)]">"Statutory Credentials & Legal Registrations"</strong> section. Unselected roles will only see a confidential restricted notice.
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVisibilityRoles(['ADMIN'])}
                  className="px-2 py-1 text-[10px] font-semibold bg-[var(--bg-surface-subtle)] hover:bg-[var(--primary-accent-bg)] hover:text-[var(--primary-accent-text)] border border-[var(--border-subtle)] rounded transition-colors"
                >
                  Admin Only
                </button>
                <button
                  type="button"
                  onClick={() => setVisibilityRoles(['ADMIN', 'SITE_ENGINEER'])}
                  className="px-2 py-1 text-[10px] font-semibold bg-[var(--bg-surface-subtle)] hover:bg-[var(--primary-accent-bg)] hover:text-[var(--primary-accent-text)] border border-[var(--border-subtle)] rounded transition-colors"
                >
                  Admin & Engineers
                </button>
                <button
                  type="button"
                  onClick={() => setVisibilityRoles(['ADMIN', 'SITE_ENGINEER', 'MARKETING', 'DESIGNER', 'EMPLOYEE'])}
                  className="px-2 py-1 text-[10px] font-semibold bg-[var(--bg-surface-subtle)] hover:bg-[var(--primary-accent-bg)] hover:text-[var(--primary-accent-text)] border border-[var(--border-subtle)] rounded transition-colors"
                >
                  All Roles (Public)
                </button>
              </div>

              {/* Roles Checkbox List */}
              <div className="space-y-2 border border-[var(--border-subtle)] rounded-xl p-3 bg-[var(--bg-surface-subtle)]">
                {allRoles.map(item => {
                  const isChecked = visibilityRoles.includes(item.role);
                  const isMandatoryAdmin = item.role === 'ADMIN';

                  return (
                    <label
                      key={item.role}
                      className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        isChecked ? 'bg-[var(--bg-surface)] border border-[var(--border-strong)]' : 'hover:bg-[var(--bg-surface)]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isMandatoryAdmin}
                        onChange={() => handleToggleRoleVisibility(item.role)}
                        className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                      />
                      <div className="flex-1">
                        <div className="text-xs font-bold text-[var(--text-main)] flex items-center justify-between">
                          <span>{item.label}</span>
                          {isMandatoryAdmin && (
                            <span className="text-[10px] font-mono text-[var(--text-muted)]">Always Required</span>
                          )}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)]">{item.desc}</div>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsConfiguringVisibility(false)}
                  className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-surface-subtle)] hover:text-[var(--text-main)] rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveVisibilitySettings}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Apply Visibility Policy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Branch Modal (Admin Only) */}
      {branchModal.isOpen && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[var(--primary-accent)]" />
                <h3 className="text-sm font-bold text-[var(--text-main)]">
                  {branchModal.mode === 'add' ? 'Add New Branch Address' : 'Edit Branch Address Details'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBranchModal(prev => ({ ...prev, isOpen: false }))}
                className="p-1 rounded-lg text-slate-400 hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBranchModalSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Branch / Depot Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rajkot Saurashtra Regional Hub"
                  value={branchModal.branch.branchName || ''}
                  onChange={e => setBranchModal(prev => ({
                    ...prev,
                    branch: { ...prev.branch, branchName: e.target.value }
                  }))}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Branch Code</label>
                  <input
                    type="text"
                    placeholder="e.g. RJK-06"
                    value={branchModal.branch.code || ''}
                    onChange={e => setBranchModal(prev => ({
                      ...prev,
                      branch: { ...prev.branch, code: e.target.value }
                    }))}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Branch Type / Facility</label>
                  <select
                    value={branchModal.branch.type || 'Regional Office'}
                    onChange={e => setBranchModal(prev => ({
                      ...prev,
                      branch: { ...prev.branch, type: e.target.value }
                    }))}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
                  >
                    <option value="Regional Office">Regional Office</option>
                    <option value="Central Depot">Central Depot & Warehouse</option>
                    <option value="Site Logistics Yard">Site Logistics Yard</option>
                    <option value="Satellite Project Office">Satellite Project Office</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                  Full Physical Street Address & Landmark *
                </label>
                <textarea
                  placeholder="e.g. Survey No. 48, GIDC Phase II, Near Aji Dam, National Highway 27, Rajkot"
                  rows={2}
                  value={branchModal.branch.address || ''}
                  onChange={e => setBranchModal(prev => ({
                    ...prev,
                    branch: { ...prev.branch, address: e.target.value }
                  }))}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">City *</label>
                  <input
                    type="text"
                    placeholder="e.g. Rajkot"
                    value={branchModal.branch.city || ''}
                    onChange={e => setBranchModal(prev => ({
                      ...prev,
                      branch: { ...prev.branch, city: e.target.value }
                    }))}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">State *</label>
                  <input
                    type="text"
                    placeholder="e.g. Gujarat"
                    value={branchModal.branch.state || ''}
                    onChange={e => setBranchModal(prev => ({
                      ...prev,
                      branch: { ...prev.branch, state: e.target.value }
                    }))}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Pincode</label>
                  <input
                    type="text"
                    placeholder="e.g. 360003"
                    value={branchModal.branch.pincode || ''}
                    onChange={e => setBranchModal(prev => ({
                      ...prev,
                      branch: { ...prev.branch, pincode: e.target.value }
                    }))}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 281 245 8890"
                    value={branchModal.branch.phone || ''}
                    onChange={e => setBranchModal(prev => ({
                      ...prev,
                      branch: { ...prev.branch, phone: e.target.value }
                    }))}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. rajkot@pwconstruction.com"
                    value={branchModal.branch.email || ''}
                    onChange={e => setBranchModal(prev => ({
                      ...prev,
                      branch: { ...prev.branch, email: e.target.value }
                    }))}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Branch In-Charge / Manager</label>
                <input
                  type="text"
                  placeholder="e.g. Bhavesh K. Patel"
                  value={branchModal.branch.managerName || ''}
                  onChange={e => setBranchModal(prev => ({
                    ...prev,
                    branch: { ...prev.branch, managerName: e.target.value }
                  }))}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setBranchModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-surface-subtle)] hover:text-[var(--text-main)] rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{branchModal.mode === 'add' ? 'Add Branch' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Branch Confirmation Modal */}
      {branchToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-[var(--bg-surface)] border border-rose-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-2 rounded-xl bg-rose-500/10">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--text-main)]">Delete Branch Address</h3>
                <p className="text-xs text-[var(--text-muted)]">Are you sure you want to remove this branch?</p>
              </div>
            </div>

            <div className="p-3 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] text-xs text-[var(--text-main)] space-y-1">
              <div className="font-bold">{branchToDelete.branchName}</div>
              <div className="text-[var(--text-muted)]">{branchToDelete.address}</div>
              <div className="text-amber-500 font-mono text-[11px]">{branchToDelete.city}, {branchToDelete.state}</div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBranchToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-surface-subtle)] rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteBranch}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-md cursor-pointer"
              >
                Delete Branch
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
