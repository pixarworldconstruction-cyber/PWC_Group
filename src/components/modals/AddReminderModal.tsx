import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Bell, 
  Phone, 
  MessageSquare, 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { ReminderType, Inquiry } from '../../types';

interface AddReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry?: Inquiry | null;
}

export const AddReminderModal: React.FC<AddReminderModalProps> = ({ isOpen, onClose, inquiry }) => {
  const { addReminder, inquiries, currentUser } = useApp();

  const [selectedInquiryId, setSelectedInquiryId] = useState(inquiry?.id || '');
  const [customerName, setCustomerName] = useState(inquiry?.customerName || '');
  const [contactNumber, setContactNumber] = useState(inquiry?.contactNumber || '');
  const [type, setType] = useState<ReminderType>('Call');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('11:00 AM');
  const [priority, setPriority] = useState<'Urgent' | 'High' | 'Normal'>('High');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (inquiry) {
      setSelectedInquiryId(inquiry.id);
      setCustomerName(inquiry.customerName);
      setContactNumber(inquiry.contactNumber);
    }
  }, [inquiry]);

  if (!isOpen) return null;

  const handleInquiryChange = (id: string) => {
    setSelectedInquiryId(id);
    const target = inquiries.find(i => i.id === id);
    if (target) {
      setCustomerName(target.customerName);
      setContactNumber(target.contactNumber);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !customerName.trim()) return;

    addReminder({
      inquiryId: selectedInquiryId || undefined,
      customerName: customerName.trim(),
      contactNumber: contactNumber.trim(),
      type,
      title: title.trim(),
      dueDate,
      dueTime,
      priority,
      notes: notes.trim(),
      assignedToName: currentUser?.fullName || 'Marketing Rep'
    });

    onClose();
    setTitle('');
    setNotes('');
  };

  const reminderTypes: { type: ReminderType; icon: React.ReactNode; label: string }[] = [
    { type: 'Call', icon: <Phone className="w-3.5 h-3.5" />, label: 'Phone Call' },
    { type: 'Message / WhatsApp', icon: <MessageSquare className="w-3.5 h-3.5" />, label: 'WhatsApp / Message' },
    { type: 'In-Person Meeting', icon: <Users className="w-3.5 h-3.5" />, label: 'In-Person Meeting' },
    { type: 'Site Visit', icon: <MapPin className="w-3.5 h-3.5" />, label: 'Site Visit Survey' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-main)]">
                Create CRM Reminder Alert
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Schedule follow-up call, message/WhatsApp, or in-person meeting
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
          
          {/* Link to Inquiry (optional) */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
              Link to Existing Inquiry (Optional)
            </label>
            <select
              value={selectedInquiryId}
              onChange={e => handleInquiryChange(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
            >
              <option value="">-- Standalone Reminder or Select Inquiry --</option>
              {inquiries.map(inq => (
                <option key={inq.id} value={inq.id}>
                  {inq.inquiryNumber} - {inq.customerName} ({inq.contactNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Customer Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <input
                type="tel"
                required
                value={contactNumber}
                onChange={e => setContactNumber(e.target.value)}
                placeholder="+91 98250 12345"
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
              />
            </div>
          </div>

          {/* Reminder Type */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">
              Reminder Action Type *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {reminderTypes.map(rt => (
                <button
                  type="button"
                  key={rt.type}
                  onClick={() => setType(rt.type)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    type === rt.type
                      ? 'bg-[var(--primary-accent)] text-slate-950 border-[var(--primary-accent)] font-bold shadow-xs'
                      : 'bg-[var(--bg-surface-subtle)] text-[var(--text-main)] border-[var(--border-subtle)]'
                  }`}
                >
                  {rt.icon}
                  <span>{rt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reminder Title / Subject */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
              Reminder Subject / Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Call client to discuss package quotation & 3D renders"
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
            />
          </div>

          {/* Due Date, Time, Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                Due Date *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                Due Time
              </label>
              <input
                type="text"
                value={dueTime}
                onChange={e => setDueTime(e.target.value)}
                placeholder="11:30 AM"
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-semibold focus:outline-none focus:border-[var(--primary-accent)]"
              >
                <option value="Urgent">🔥 Urgent</option>
                <option value="High">⚡ High</option>
                <option value="Normal">🟢 Normal</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
              Reminder Notes & Context
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add key talking points, questions to ask, or preparation notes..."
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
            />
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
              <span>Schedule Reminder</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
