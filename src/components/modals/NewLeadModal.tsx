import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Users, Compass, UploadCloud } from 'lucide-react';

export const NewLeadModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { branches, addLead, users } = useApp();

  const [clientName, setClientName] = useState('');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [branchId, setBranchId] = useState(branches[0]?.id || 'BR-01');
  const [projectTypeInterest, setProjectTypeInterest] = useState<'Residential Tower' | 'Commercial Office' | 'Industrial Shed' | 'Villa Construction' | 'Interior Fitout'>('Commercial Office');
  const [estimatedValue, setEstimatedValue] = useState(65000000);
  const [source, setSource] = useState<'Referral' | 'Website' | 'Architect Tie-up' | 'Tender / Government' | 'Direct Walk-in'>('Website');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      clientName,
      organization: organization || undefined,
      phone,
      email,
      branchId,
      projectTypeInterest,
      estimatedValue: Number(estimatedValue),
      source,
      notes,
      stage: 'New Inquiry'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden my-6">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-main)]">Capture Inbound CRM Lead</h3>
              <p className="text-xs text-[var(--text-muted)]">Marketing & Client Acquisition Pipeline</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Client Contact Person *</label>
              <input
                type="text"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="e.g. Mr. Rajesh Agrawal"
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Company / Organization</label>
              <input
                type="text"
                value={organization}
                onChange={e => setOrganization(e.target.value)}
                placeholder="e.g. Agrawal Logistics Hub"
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Phone Number *</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98000 11223"
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="rajesh@agrawal.in"
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Target Branch *</label>
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
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Project Scope *</label>
              <select
                value={projectTypeInterest}
                onChange={e => setProjectTypeInterest(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
              >
                <option value="Residential Tower">Residential Tower</option>
                <option value="Commercial Office">Commercial Office</option>
                <option value="Industrial Shed">Industrial Shed / PEB</option>
                <option value="Villa Construction">Villa Construction</option>
                <option value="Interior Fitout">Turnkey Interior Fitout</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Estimated Deal Size (₹) *</label>
              <input
                type="number"
                value={estimatedValue}
                onChange={e => setEstimatedValue(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] font-mono"
                step={500000}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Lead Source</label>
            <select
              value={source}
              onChange={e => setSource(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
            >
              <option value="Referral">Client Referral</option>
              <option value="Website">P W Construction Web Portal</option>
              <option value="Architect Tie-up">Architect Partner Tie-up</option>
              <option value="Tender / Government">Tender / RFP</option>
              <option value="Direct Walk-in">Branch Walk-in</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Requirement Notes & Discussion</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Client requested initial meeting with site engineer and preliminary floor plans..."
              rows={3}
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] placeholder:text-[var(--text-subtle)]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-subtle)] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg transition-colors shadow-md cursor-pointer"
            >
              Save Lead & Notify Team
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export const NewDesignDraftModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { projects, addDraft } = useApp();

  const [projectId, setProjectId] = useState(projects[0]?.id || 'PRJ-01');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Architectural Blueprint' | 'Structural Drawing' | '3D Elevation Render' | 'HVAC & MEP Plan' | 'Interior Layout'>('Architectural Blueprint');
  const [version, setVersion] = useState('v1.0');
  const [dimensions, setDimensions] = useState('Scale 1:50 | High Precision CAD');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedProj = projects.find(p => p.id === projectId);
    addDraft({
      projectId,
      projectName: selectedProj?.name || 'Construction Site',
      title,
      category,
      version,
      dimensions,
      imageUrl: '/src/assets/images/blueprint_draft_cad_1792597146290.jpg',
      status: 'Draft Uploaded'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden my-6">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-main)]">Upload Architectural Blueprint / Draft</h3>
              <p className="text-xs text-[var(--text-muted)]">Collaborate with Site Engineers & Marketing for Client Approval</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Target Project *</label>
            <select
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Draft Drawing Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Ground Floor Entrance Canopy & Double-Height Atrium"
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Drawing Classification *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
              >
                <option value="Architectural Blueprint">Architectural Blueprint</option>
                <option value="Structural Drawing">Structural Drawing (Shear/Columns)</option>
                <option value="3D Elevation Render">3D Elevation Render</option>
                <option value="HVAC & MEP Plan">HVAC & MEP Plan</option>
                <option value="Interior Layout">Interior Layout & Fitout</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Revision Number *</label>
              <input
                type="text"
                value={version}
                onChange={e => setVersion(e.target.value)}
                placeholder="e.g. v1.0, v2.1-REV"
                className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Scale / Sheet Dimensions</label>
            <input
              type="text"
              value={dimensions}
              onChange={e => setDimensions(e.target.value)}
              placeholder="e.g. Scale 1:100 A0 Sheet / 4K Render"
              className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
            />
          </div>

          <div className="border-2 border-dashed border-[var(--border-subtle)] rounded-xl p-4 text-center bg-[var(--bg-surface-subtle)]">
            <UploadCloud className="w-8 h-8 text-[var(--primary-accent-text)] mx-auto mb-2" />
            <div className="text-xs font-semibold text-[var(--text-main)]">CAD Blueprint Ready for In-App Review</div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1">Direct feedback channel with Site Engineers & Marketing will open upon upload.</div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-subtle)] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg transition-colors shadow-md cursor-pointer"
            >
              Publish Draft & Notify Engineers
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
