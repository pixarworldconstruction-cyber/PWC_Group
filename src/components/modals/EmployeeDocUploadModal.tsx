import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OfficialDocCategory } from '../../types';

interface EmployeeDocUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmployeeId?: string;
}

export const EmployeeDocUploadModal: React.FC<EmployeeDocUploadModalProps> = ({
  isOpen,
  onClose,
  defaultEmployeeId,
}) => {
  const { users, uploadEmployeeDoc, currentUser, canUserViewAllStaff } = useApp();
  const canViewAll = canUserViewAllStaff ? canUserViewAllStaff(currentUser) : currentUser?.role === 'ADMIN';
  const selectableUsers = canViewAll ? users : users.filter(u => u.id === currentUser?.id);

  const [employeeId, setEmployeeId] = useState(defaultEmployeeId || selectableUsers[0]?.id || currentUser?.id || '');
  const [category, setCategory] = useState<OfficialDocCategory>('Appointment Letter');
  const [title, setTitle] = useState('Offer & Terms of Employment');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('1.2 MB');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const categoryPresets: { category: OfficialDocCategory; label: string; defaultTitle: string }[] = [
    { category: 'Joining Letter', label: 'Joining Report / Letter', defaultTitle: 'Official Joining Report & Declaration' },
    { category: 'Appointment Letter', label: 'Appointment Letter', defaultTitle: 'Offer & Terms of Employment' },
    { category: 'Offer Letter', label: 'Offer Letter', defaultTitle: 'Formal Employment Offer' },
    { category: 'Salary Increment Letter', label: 'Salary Increment / Revision Letter', defaultTitle: 'Annual Performance Appraisal & CTC Revision' },
    { category: 'NDA & Code of Conduct', label: 'NDA & Code of Conduct', defaultTitle: 'Non-Disclosure & Intellectual Property Agreement' },
    { category: 'Experience / Relieving Letter', label: 'Experience & Relieving Certificate', defaultTitle: 'Experience & Service Certificate' },
    { category: 'Other Document', label: 'Other Official Policy / Document', defaultTitle: 'General Staff Undertaking' },
  ];

  const handleCategoryChange = (newCat: OfficialDocCategory) => {
    setCategory(newCat);
    const preset = categoryPresets.find((p) => p.category === newCat);
    if (preset) {
      setTitle(preset.defaultTitle);
    }
  };

  const handleSimulateFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = users.find((u) => u.id === employeeId);
    if (!emp) return;

    uploadEmployeeDoc({
      employeeId: emp.id,
      employeeName: emp.fullName,
      category,
      title: title || `${category} - ${emp.fullName}`,
      fileUrl: `/vault/docs/${category.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${emp.id}_${Date.now()}.pdf`,
      fileSize: fileSize || '1.4 MB',
      uploadedBy: currentUser?.fullName || 'HR Admin',
      notes: notes || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
              <UploadCloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Upload Employee Document</h3>
              <p className="text-xs text-blue-100">Joining Letter, Appointment Letter, NDA & Appraisals</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-sm">
          {/* Employee Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Employee
            </label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white font-medium"
            >
              {selectableUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} — ({u.role.replace('_', ' ').toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Document Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Document Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categoryPresets.slice(0, 6).map((item) => (
                <button
                  type="button"
                  key={item.category}
                  onClick={() => handleCategoryChange(item.category)}
                  className={`text-left p-2.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                    category === item.category
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold ring-1 ring-indigo-500 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Document Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Document Title / Subject <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Offer & Appointment Letter - Executive Engineer"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
            />
          </div>

          {/* File Upload Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Upload PDF or Scanned Document
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-indigo-400 bg-slate-50/50 transition-colors">
              <input
                type="file"
                id="doc-file-upload"
                accept=".pdf,.png,.jpg,.jpeg,.docx"
                onChange={handleSimulateFileSelect}
                className="hidden"
              />
              <label htmlFor="doc-file-upload" className="cursor-pointer block">
                <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                <span className="text-xs font-semibold text-indigo-600 hover:underline">
                  Click to choose file
                </span>
                <span className="text-xs text-slate-500"> or drag and drop</span>
                <p className="text-[11px] text-slate-400 mt-1">PDF, DOCX, PNG or JPG up to 10MB</p>
              </label>

              {fileName && (
                <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center space-x-2 truncate">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="font-semibold truncate">{fileName}</span>
                    <span className="text-slate-400 text-[10px]">({fileSize})</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Internal HR Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Signed physical copy stored in HR File Folder #3B."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              Save & Store Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
