import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Compass, 
  Plus, 
  Send, 
  CheckCircle, 
  MessageSquare, 
  Layers, 
  Building2, 
  Download,
  Eye,
  Clock
} from 'lucide-react';
import { NewDesignDraftModal } from '../modals/NewLeadModal';
import { DesignDraft } from '../../types';

export const DesignDraftsView: React.FC = () => {
  const { drafts, addDraftComment, updateDraftStatus, currentUser } = useApp();
  const [isNewDraftOpen, setIsNewDraftOpen] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<DesignDraft | null>(drafts[0] || null);
  const [commentInput, setCommentInput] = useState('');

  const activeDraft = selectedDraft && drafts.find(d => d.id === selectedDraft.id)
    ? drafts.find(d => d.id === selectedDraft.id)!
    : drafts[0] || null;

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !activeDraft) return;
    addDraftComment(activeDraft.id, commentInput);
    setCommentInput('');
  };

  const statusOptions: DesignDraft['status'][] = [
    'Draft Uploaded',
    'Site Review',
    'Marketing / Client Review',
    'Approved for Execution',
    'Revision Requested'
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-main)] tracking-tight">Architectural & CAD Draft Approvals</h1>
          <p className="text-xs text-[var(--text-muted)]">
            Collaborative blueprints: upload drawings, review engineering specs, and track stakeholder approvals
          </p>
        </div>

        <button
          onClick={() => setIsNewDraftOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg transition-colors shadow-lg shadow-amber-500/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Blueprint / Draft</span>
        </button>
      </div>

      {/* 2-Column Split: Drafts Gallery + Active Draft Inspection & Comments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (5 cols): Draft Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Active Drawing Sets ({drafts.length})
          </div>

          <div className="space-y-3">
            {drafts.map(draft => {
              const isSelected = activeDraft?.id === draft.id;
              return (
                <div
                  key={draft.id}
                  onClick={() => setSelectedDraft(draft)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-500/10 border-purple-500/50 shadow-md ring-1 ring-purple-500/20'
                      : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-subtle)] border-[var(--border-subtle)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold uppercase">{draft.draftCode}</span>
                      <div className="text-xs font-bold text-[var(--text-main)] mt-0.5 line-clamp-1">{draft.title}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">{draft.projectName}</div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono text-purple-700 dark:text-purple-300 bg-purple-500/15 border border-purple-500/30 rounded font-semibold">
                      {draft.version}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-[var(--border-subtle)]">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                      {draft.status}
                    </span>
                    <span className="text-[var(--text-muted)] font-mono flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-[var(--text-subtle)]" />
                      <span>{draft.comments.length} comments</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (7 cols): Draft Inspector & Discussion Channel */}
        <div className="lg:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 space-y-6 shadow-sm">
          {activeDraft ? (
            <>
              {/* Draft Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {activeDraft.draftCode} · {activeDraft.version}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">· {activeDraft.category}</span>
                  </div>
                  <h2 className="text-base font-bold text-[var(--text-main)] mt-1">{activeDraft.title}</h2>
                  <p className="text-xs text-[var(--text-muted)]">{activeDraft.projectName}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--text-muted)] font-mono">Status:</span>
                  <select
                    value={activeDraft.status}
                    onChange={e => updateDraftStatus(activeDraft.id, e.target.value as any)}
                    className="px-2.5 py-1.5 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] font-semibold focus:outline-none focus:border-purple-400"
                  >
                    {statusOptions.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preview Drawing Image Frame */}
              <div className="relative rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-app)] aspect-video group shadow-inner">
                <img
                  src={activeDraft.imageUrl || '/src/assets/images/blueprint_draft_cad_1792597146290.jpg'}
                  alt={activeDraft.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute bottom-2 left-2 right-2 p-2.5 rounded-lg bg-[var(--bg-surface)]/90 backdrop-blur-md border border-[var(--border-subtle)] flex items-center justify-between text-xs shadow-md">
                  <span className="text-[var(--text-main)] font-mono text-[11px]">{activeDraft.dimensions || 'Scale 1:50 High-Res CAD'}</span>
                  <span className="text-purple-600 dark:text-purple-400 text-[11px] font-semibold">By {activeDraft.designerName}</span>
                </div>
              </div>

              {/* Stakeholder Discussion & Feedback Stream */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>Direct Inter-Department Feedback</span>
                  </span>
                  <span className="text-[var(--text-muted)] text-[11px]">Site Engineers · Marketing · Studio</span>
                </div>

                {/* Comments List */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {activeDraft.comments.map(c => (
                    <div key={c.id} className="p-3 bg-[var(--bg-surface-subtle)] rounded-xl border border-[var(--border-subtle)] space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--text-main)]">{c.userName}</span>
                        <span className="text-[10px] text-[var(--text-subtle)] font-mono">{c.timestamp}</span>
                      </div>
                      <p className="text-[var(--text-muted)] text-[11px] leading-relaxed">{c.text}</p>
                    </div>
                  ))}
                </div>

                {/* Comment Input Form */}
                <form onSubmit={handlePostComment} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={e => setCommentInput(e.target.value)}
                    placeholder="Provide revision note, approval remark, or structural query..."
                    className="flex-1 px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-purple-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-[var(--text-muted)]">
              No architectural drafts available
            </div>
          )}
        </div>

      </div>

      <NewDesignDraftModal isOpen={isNewDraftOpen} onClose={() => setIsNewDraftOpen(false)} />

    </div>
  );
};
