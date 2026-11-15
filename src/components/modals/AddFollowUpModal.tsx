import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  MessageSquare, 
  Phone, 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Send, 
  CheckCircle2 
} from 'lucide-react';
import { Inquiry, FollowUpContactType } from '../../types';

interface AddFollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: Inquiry | null;
}

export const AddFollowUpModal: React.FC<AddFollowUpModalProps> = ({ isOpen, onClose, inquiry }) => {
  const { addFollowUp, currentUser, inquiries } = useApp();

  const [selectedInquiryId, setSelectedInquiryId] = useState(inquiry?.id || (inquiries[0]?.id || ''));
  const [contactType, setContactType] = useState<FollowUpContactType>('Phone Call');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  );
  const [discussionNotes, setDiscussionNotes] = useState('');
  const [nextActionDate, setNextActionDate] = useState('');
  const [nextActionNotes, setNextActionNotes] = useState('');

  // Sync if inquiry changes
  React.useEffect(() => {
    if (inquiry) {
      setSelectedInquiryId(inquiry.id);
    }
  }, [inquiry]);

  if (!isOpen) return null;

  const activeInq = inquiry || inquiries.find(i => i.id === selectedInquiryId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiryId || !discussionNotes.trim()) return;

    addFollowUp(selectedInquiryId, {
      contactType,
      date,
      time,
      loggedByName: currentUser?.fullName || 'Marketing Rep',
      loggedById: currentUser?.id,
      discussionNotes: discussionNotes.trim(),
      nextActionDate: nextActionDate || undefined,
      nextActionNotes: nextActionNotes.trim() || undefined
    });

    onClose();
    setDiscussionNotes('');
    setNextActionNotes('');
    setNextActionDate('');
  };

  const contactOptions: { type: FollowUpContactType; icon: React.ReactNode; label: string }[] = [
    { type: 'Phone Call', icon: <Phone className="w-3.5 h-3.5" />, label: 'Phone Call' },
    { type: 'In-Person Meeting', icon: <Users className="w-3.5 h-3.5" />, label: 'In-Person Meeting' },
    { type: 'Site Visit', icon: <MapPin className="w-3.5 h-3.5" />, label: 'Site Inspection' },
    { type: 'Video Call', icon: <Video className="w-3.5 h-3.5" />, label: 'Video Call' },
    { type: 'WhatsApp / Message', icon: <MessageSquare className="w-3.5 h-3.5" />, label: 'WhatsApp / Message' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-main)]">
                Log CRM Follow-up & Discussion
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Record details of calls, meetings, or site discussions with client
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Inquiry Selection (if not pre-selected) */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
              Select Client Inquiry *
            </label>
            <select
              value={selectedInquiryId}
              onChange={e => setSelectedInquiryId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-semibold focus:outline-none focus:border-[var(--primary-accent)]"
            >
              {inquiries.map(inq => (
                <option key={inq.id} value={inq.id}>
                  {inq.inquiryNumber} - {inq.customerName} ({inq.contactNumber}) · {inq.stage}
                </option>
              ))}
            </select>
          </div>

          {activeInq && (
            <div className="p-3 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl text-xs flex items-center justify-between">
              <div>
                <span className="text-[var(--text-muted)] block text-[10px]">CLIENT & SITE</span>
                <span className="font-bold text-[var(--text-main)]">{activeInq.customerName}</span>
                <span className="text-[11px] text-[var(--text-muted)] block truncate max-w-xs">{activeInq.siteAddress}</span>
              </div>
              <div className="text-right">
                <span className="text-[var(--text-muted)] block text-[10px]">STAGE</span>
                <span className="text-xs font-mono font-bold text-[var(--primary-accent-text)] bg-[var(--primary-accent-bg)] px-2 py-0.5 rounded border border-[var(--primary-accent-border)]">
                  {activeInq.stage}
                </span>
              </div>
            </div>
          )}

          {/* Contact Type selector */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">
              Contact / Interaction Type *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {contactOptions.map(opt => (
                <button
                  type="button"
                  key={opt.type}
                  onClick={() => setContactType(opt.type)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    contactType === opt.type
                      ? 'bg-[var(--primary-accent)] text-slate-950 border-[var(--primary-accent)] font-bold shadow-xs'
                      : 'bg-[var(--bg-surface-subtle)] text-[var(--text-main)] border-[var(--border-subtle)] hover:bg-[var(--bg-surface)]'
                  }`}
                >
                  {opt.icon}
                  <span className="truncate">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>Interaction Date *</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>Interaction Time *</span>
              </label>
              <input
                type="text"
                required
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="e.g. 11:30 AM"
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
              />
            </div>
          </div>

          {/* Detailed Call / Meeting Discussions */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
              Call / Meeting Discussion Details & Points Discussed *
            </label>
            <textarea
              rows={4}
              required
              value={discussionNotes}
              onChange={e => setDiscussionNotes(e.target.value)}
              placeholder="Record details of what was discussed, client objections or questions, package modifications, site requirements, family approvals..."
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] leading-relaxed focus:outline-none focus:border-[var(--primary-accent)]"
            />
          </div>

          {/* Next Action & Auto-Reminder Scheduling */}
          <div className="p-4 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[var(--primary-accent)]" />
                <span>Next Follow-up Action (Auto-schedules Reminder)</span>
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">Optional</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">
                  Next Action Due Date
                </label>
                <input
                  type="date"
                  value={nextActionDate}
                  onChange={e => setNextActionDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">
                  Next Action Title / Description
                </label>
                <input
                  type="text"
                  value={nextActionNotes}
                  onChange={e => setNextActionNotes(e.target.value)}
                  placeholder="e.g. Call to finalize 3D elevation & advance"
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3 shrink-0">
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
              <span>Save CRM Follow-up Log</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
