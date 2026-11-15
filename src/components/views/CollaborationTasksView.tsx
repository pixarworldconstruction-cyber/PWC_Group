import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Clock, 
  UserCheck, 
  AlertCircle, 
  Building2,
  HardHat,
  TrendingUp,
  Compass,
  ArrowRight
} from 'lucide-react';
import { CollaborationTask, UserRole } from '../../types';

export const CollaborationTasksView: React.FC = () => {
  const { tasks, addTask, updateTaskStatus, projects, currentUser } = useApp();
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [filterRole, setFilterRole] = useState('ALL');

  // Form states for new task
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || 'PRJ-01');
  const [assignedToRole, setAssignedToRole] = useState<UserRole>('SITE_ENGINEER');
  const [assignedToName, setAssignedToName] = useState('Arunav Sengupta (Site Eng)');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const filteredTasks = tasks.filter(t => {
    if (filterRole !== 'ALL' && t.assignedToRole !== filterRole) return false;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === projectId);
    addTask({
      title,
      projectId,
      projectName: proj?.name || 'Site Project',
      assignedToRole,
      assignedToName,
      priority,
      dueDate,
      description
    });
    setTitle('');
    setDescription('');
    setIsNewTaskOpen(false);
  };

  const getRoleIcon = (role: UserRole) => {
    if (role === 'SITE_ENGINEER') return <HardHat className="w-3.5 h-3.5 text-emerald-400" />;
    if (role === 'MARKETING') return <TrendingUp className="w-3.5 h-3.5 text-blue-400" />;
    if (role === 'DESIGNER') return <Compass className="w-3.5 h-3.5 text-purple-400" />;
    return <UserCheck className="w-3.5 h-3.5 text-amber-400" />;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-main)] tracking-tight">Cross-Team Coordination & Task Board</h1>
          <p className="text-xs text-[var(--text-muted)]">
            Synchronize Marketing deliverables, Site Engineering checks, and Architectural Design revisions
          </p>
        </div>

        <button
          onClick={() => setIsNewTaskOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg transition-colors shadow-lg shadow-amber-500/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Assign Coordination Task</span>
        </button>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-2 rounded-xl overflow-x-auto shadow-sm">
        <span className="text-xs text-[var(--text-muted)] px-2 font-mono">Assigned To:</span>
        {[
          { key: 'ALL', label: 'All Tasks' },
          { key: 'SITE_ENGINEER', label: 'Site Engineers' },
          { key: 'MARKETING', label: 'Marketing Team' },
          { key: 'DESIGNER', label: 'Architects & Design' },
          { key: 'ADMIN', label: 'Executive Admin' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterRole(tab.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              filterRole === tab.key
                ? 'bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)] border border-[var(--primary-accent-border)] font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-surface-subtle)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map(task => {
          const isDone = task.status === 'Completed';

          return (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between shadow-sm ${
                isDone 
                  ? 'bg-[var(--bg-surface-subtle)]/70 border-[var(--border-subtle)] opacity-75' 
                  : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--primary-accent-border)]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                    task.priority === 'High' 
                      ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/25' 
                      : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25'
                  }`}>
                    {task.priority} Priority
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[var(--text-subtle)]" />
                    <span>Due {task.dueDate}</span>
                  </span>
                </div>

                <div className={`text-xs font-bold text-[var(--text-main)] mb-1 ${isDone ? 'line-through text-[var(--text-muted)]' : ''}`}>
                  {task.title}
                </div>
                <div className="text-[11px] text-[var(--primary-accent-text)] font-mono mb-2">{task.projectName}</div>

                <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-3">
                  {task.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-[var(--text-main)]">
                    {getRoleIcon(task.assignedToRole)}
                    <span className="font-medium">{task.assignedToName}</span>
                  </div>
                  <span className="text-[var(--text-subtle)] text-[10px]">By {task.createdByName.split(' ')[0]}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">Status:</span>
                  <select
                    value={task.status}
                    onChange={e => updateTaskStatus(task.id, e.target.value as any)}
                    className="px-2 py-1 text-[11px] bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Task Inline Modal */}
      {isNewTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden my-6">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]">
              <h3 className="text-base font-bold text-[var(--text-main)]">Create Coordination Action Item</h3>
              <button onClick={() => setIsNewTaskOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Task Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Conduct soil load inspection for Singhania deal"
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Project Site *</label>
                  <select
                    value={projectId}
                    onChange={e => setProjectId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Assignee Role *</label>
                  <select
                    value={assignedToRole}
                    onChange={e => {
                      const r = e.target.value as UserRole;
                      setAssignedToRole(r);
                      if (r === 'SITE_ENGINEER') setAssignedToName('Arunav Sengupta (Site Eng)');
                      else if (r === 'MARKETING') setAssignedToName('Pooja Nair (Marketing)');
                      else if (r === 'DESIGNER') setAssignedToName('Ananya Roy (Architect)');
                      else setAssignedToName('Prashant Wadhwa (Admin)');
                    }}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
                  >
                    <option value="SITE_ENGINEER">Site Engineer</option>
                    <option value="MARKETING">Marketing Team</option>
                    <option value="DESIGNER">Architect / Designer</option>
                    <option value="ADMIN">Executive Admin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">Description & Next Steps</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Detail client specifications or engineering clearance required..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsNewTaskOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-surface-subtle)] hover:bg-[var(--border-subtle)] rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg transition-colors cursor-pointer"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
