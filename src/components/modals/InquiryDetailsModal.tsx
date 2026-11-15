import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Home, 
  Calendar, 
  Layers, 
  FileText, 
  MessageSquare, 
  Bell, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Plus, 
  Edit3, 
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Briefcase,
  Users
} from 'lucide-react';
import { Inquiry, InquiryStage } from '../../types';
import { formatLakhsOrCrores } from '../../utils/formatters';

interface InquiryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: Inquiry | null;
  onOpenSecondarySpec: (inq: Inquiry) => void;
  onOpenAddFollowUp: (inq: Inquiry) => void;
  onOpenAddReminder: (inq: Inquiry) => void;
}

export const InquiryDetailsModal: React.FC<InquiryDetailsModalProps> = ({
  isOpen,
  onClose,
  inquiry,
  onOpenSecondarySpec,
  onOpenAddFollowUp,
  onOpenAddReminder
}) => {
  const { 
    updateInquiryStage, 
    convertInquiryToProject, 
    reminders, 
    toggleReminder,
    setActiveTab
  } = useApp();

  const [convertStatus, setConvertStatus] = useState<string | null>(null);

  if (!isOpen || !inquiry) return null;

  const inquiryReminders = reminders.filter(r => r.inquiryId === inquiry.id);

  const stages: InquiryStage[] = [
    'New Inquiry',
    'Requirement Assessment',
    'Site Visit & Survey',
    'Package Quotation Shared',
    'Negotiation & Financing',
    'Converted to Business',
    'Dropped / Lost'
  ];

  const handleConvertProject = () => {
    const res = convertInquiryToProject(inquiry.id);
    if (res.success) {
      setConvertStatus('Successfully converted to active site project!');
      setTimeout(() => setConvertStatus(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-4xl bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] shrink-0 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[var(--primary-accent-text)] bg-[var(--primary-accent-bg)] px-2.5 py-0.5 rounded-full border border-[var(--primary-accent-border)]">
                {inquiry.inquiryNumber}
              </span>
              <span className="text-xs text-[var(--text-muted)]">· Client Inquiry Dossier</span>
            </div>
            <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
              <span>{inquiry.customerName}</span>
              {inquiry.hasDetailedSpec && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                  2nd Form Spec Complete
                </span>
              )}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Stage Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[var(--text-muted)] font-mono">Stage:</span>
              <select
                value={inquiry.stage}
                onChange={e => updateInquiryStage(inquiry.id, e.target.value as InquiryStage)}
                className="px-2.5 py-1 text-xs font-bold bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--primary-accent-text)] focus:outline-none focus:border-[var(--primary-accent)]"
              >
                {stages.map(stg => (
                  <option key={stg} value={stg}>{stg}</option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Dossier Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Conversion Notification Banner if active */}
          {convertStatus && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{convertStatus}</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  setActiveTab('projects');
                }}
                className="text-[11px] underline font-bold"
              >
                View Active Projects Board &rarr;
              </button>
            </div>
          )}

          {/* Top Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl font-mono">
              <span className="text-[10px] text-[var(--text-subtle)] block uppercase">Budget (Form 1)</span>
              <span className="text-base font-bold text-[var(--text-main)]">{formatLakhsOrCrores(inquiry.budget)}</span>
              <span className="text-[10px] text-[var(--text-muted)] block">Customer Target</span>
            </div>

            <div className="p-3 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl font-mono">
              <span className="text-[10px] text-[var(--text-subtle)] block uppercase">Built-up / Plinth</span>
              <span className="text-base font-bold text-[var(--text-main)]">
                {inquiry.totalSqFtArea ? `${inquiry.totalSqFtArea} Sqft` : 'Pending (Form 2)'}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] block">
                {inquiry.floorsCount || 'Floors TBD'}
              </span>
            </div>

            <div className="p-3 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl font-mono">
              <span className="text-[10px] text-[var(--text-subtle)] block uppercase">Package Quote</span>
              <span className="text-base font-bold text-[var(--primary-accent-text)]">
                {inquiry.packageEstimatedCost ? formatLakhsOrCrores(inquiry.packageEstimatedCost) : 'Select Package'}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] block truncate">
                {inquiry.selectedPackageName || 'Not chosen'}
              </span>
            </div>

            <div className="p-3 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl font-mono">
              <span className="text-[10px] text-[var(--text-subtle)] block uppercase">Assigned Rep</span>
              <span className="text-xs font-bold text-[var(--text-main)] block truncate mt-0.5">
                {inquiry.assignedMarketingName}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
                Marketing CRM
              </span>
            </div>
          </div>

          {/* CONVERT TO PROJECT BANNER (if won or button clicked) */}
          <div className="p-4 bg-[var(--primary-accent-bg)] border border-[var(--primary-accent-border)] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[var(--primary-accent)]" />
                <span className="text-xs font-bold text-[var(--text-main)]">
                  Convert Inquiry to Active Site Project
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                {inquiry.convertedProjectId ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ Already converted to active project {inquiry.convertedProjectId} on {inquiry.convertedAt}.
                  </span>
                ) : (
                  'One-click workflow to transition this client deal into an operational field site project.'
                )}
              </p>
            </div>

            {!inquiry.convertedProjectId && (
              <button
                type="button"
                onClick={handleConvertProject}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Convert to Active Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* TWO MAIN CARDS: FORM 1 & FORM 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1st PRIMARY FORM DATA */}
            <div className="p-4 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5 uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5 text-[var(--primary-accent)]" />
                  <span>1st Primary Intake Form</span>
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">{inquiry.firstInquiryDate}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Contact Number:</span>
                  <a href={`tel:${inquiry.contactNumber}`} className="font-mono font-bold text-[var(--primary-accent-text)] hover:underline flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{inquiry.contactNumber}</span>
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Email:</span>
                  <span className="font-mono text-[var(--text-main)]">{inquiry.email || 'N/A'}</span>
                </div>

                <div className="pt-2 border-t border-[var(--border-subtle)]">
                  <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold mb-0.5">Site Address:</span>
                  <p className="text-[var(--text-main)] text-[11px] leading-relaxed flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{inquiry.siteAddress}</span>
                  </p>
                </div>

                <div>
                  <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold mb-0.5">Resident Address:</span>
                  <p className="text-[var(--text-main)] text-[11px] leading-relaxed flex items-start gap-1.5">
                    <Home className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span>{inquiry.residentAddress || inquiry.siteAddress}</span>
                  </p>
                </div>

                {inquiry.notes && (
                  <div className="pt-2 border-t border-[var(--border-subtle)]">
                    <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold mb-0.5">Inquiry Notes:</span>
                    <p className="text-[var(--text-muted)] text-[11px] leading-relaxed italic bg-[var(--bg-surface)] p-2 rounded-lg border border-[var(--border-subtle)]">
                      "{inquiry.notes}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 2nd SECONDARY DETAILED SPECIFICATIONS */}
            <div className="p-4 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5 uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5 text-purple-500" />
                  <span>2nd Detailed Planning Specs</span>
                </span>
                
                <button
                  type="button"
                  onClick={() => onOpenSecondarySpec(inquiry)}
                  className="text-[10px] text-[var(--primary-accent-text)] hover:underline font-bold flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{inquiry.hasDetailedSpec ? 'Edit Specs' : 'Complete 2nd Form'}</span>
                </button>
              </div>

              {inquiry.hasDetailedSpec ? (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Service Scope:</span>
                    <span className="font-bold text-[var(--text-main)] text-right">{inquiry.serviceType}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Plinth / Total Area:</span>
                    <span className="font-mono font-bold text-[var(--text-main)]">{inquiry.totalSqFtArea} Sq.Ft</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Payment Mode:</span>
                    <span className="font-semibold text-[var(--text-main)]">
                      {inquiry.paymentMode === 'Loan' ? '🏦 Bank Loan' : '💼 Self Funded'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Family Members:</span>
                    <span className="font-mono text-[var(--text-main)]">{inquiry.familyMembersCount || 'N/A'} persons</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Floors Planned:</span>
                    <span className="font-semibold text-[var(--text-main)]">{inquiry.floorsCount}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Architect Preference:</span>
                    <span className="font-semibold text-[var(--primary-accent-text)]">{inquiry.architectOption}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Target Start & Deadline:</span>
                    <span className="font-mono text-[11px] text-[var(--text-main)]">
                      {inquiry.projectStartDate || 'TBD'} &rarr; {inquiry.projectDeadlineDate || 'TBD'}
                    </span>
                  </div>

                  {inquiry.selectedPackageName && (
                    <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                      <span className="text-[var(--text-muted)]">Package Chosen:</span>
                      <span className="font-bold text-[var(--primary-accent-text)]">{inquiry.selectedPackageName}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-6 text-center space-y-2">
                  <p className="text-xs text-[var(--text-muted)]">
                    Only 1st Primary intake form is recorded so far.
                  </p>
                  <button
                    type="button"
                    onClick={() => onOpenSecondarySpec(inquiry)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg shadow-xs"
                  >
                    + Fill 2nd Secondary Form
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* CRM FOLLOW-UPS LOGS TIMELINE */}
          <div className="p-5 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[var(--primary-accent)]" />
                  <span>Call & Meeting CRM Follow-up Logs ({inquiry.followUps?.length || 0})</span>
                </h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Marketing interaction history recorded on call or meeting
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenAddFollowUp(inquiry)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Call / Meeting</span>
              </button>
            </div>

            {inquiry.followUps && inquiry.followUps.length > 0 ? (
              <div className="space-y-3">
                {inquiry.followUps.map(flw => (
                  <div
                    key={flw.id}
                    className="p-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl space-y-2 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[var(--primary-accent-text)] bg-[var(--primary-accent-bg)] px-2 py-0.5 rounded border border-[var(--primary-accent-border)]">
                          {flw.contactType}
                        </span>
                        <span className="text-[var(--text-muted)] font-mono">
                          {flw.date} at {flw.time}
                        </span>
                      </div>
                      <span className="text-[var(--text-muted)]">
                        Logged by: <b className="text-[var(--text-main)]">{flw.loggedByName}</b>
                      </span>
                    </div>

                    <p className="text-[var(--text-main)] leading-relaxed bg-[var(--bg-surface-subtle)] p-2.5 rounded-lg border border-[var(--border-subtle)]">
                      {flw.discussionNotes}
                    </p>

                    {flw.nextActionDate && (
                      <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-2 pt-1 font-mono">
                        <Calendar className="w-3 h-3 text-[var(--primary-accent)]" />
                        <span>Next Action Date: <b className="text-[var(--text-main)]">{flw.nextActionDate}</b></span>
                        {flw.nextActionNotes && <span>— {flw.nextActionNotes}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-[var(--text-subtle)]">
                No call or meeting follow-ups logged yet. Click "Log Call / Meeting" to record interactions.
              </div>
            )}
          </div>

          {/* REMINDERS SECTION */}
          <div className="p-5 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-amber-500" />
                  <span>Scheduled Reminders ({inquiryReminders.length})</span>
                </h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Upcoming call, message/WhatsApp, and meeting deadlines for this client
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenAddReminder(inquiry)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[var(--text-main)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-subtle)] rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Reminder</span>
              </button>
            </div>

            {inquiryReminders.length > 0 ? (
              <div className="space-y-2">
                {inquiryReminders.map(rem => (
                  <div
                    key={rem.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                      rem.isCompleted
                        ? 'bg-[var(--bg-surface)] border-[var(--border-subtle)] opacity-60'
                        : 'bg-[var(--bg-surface)] border-[var(--border-subtle)]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={rem.isCompleted}
                        onChange={() => toggleReminder(rem.id)}
                        className="w-4 h-4 rounded text-[var(--primary-accent)]"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)]">
                            {rem.type}
                          </span>
                          <span className={`font-semibold truncate ${rem.isCompleted ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-main)]'}`}>
                            {rem.title}
                          </span>
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">
                          Due: {rem.dueDate} at {rem.dueTime} · Priority: {rem.priority}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleReminder(rem.id)}
                      className="text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--primary-accent-text)] shrink-0"
                    >
                      {rem.isCompleted ? 'Mark Pending' : 'Mark Done'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-[var(--text-subtle)]">
                No reminders active for this inquiry.
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href={`tel:${inquiry.contactNumber}`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Client</span>
            </a>
            <a
              href={`https://wa.me/${inquiry.contactNumber.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[var(--text-main)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg hover:bg-[var(--bg-surface-subtle)] transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
};
