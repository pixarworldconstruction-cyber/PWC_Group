import React, { useState, useEffect } from 'react';
import { X, Clock, Coffee, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LaborTimeLog } from '../../types';

interface TimeSheetEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: LaborTimeLog | null;
  defaultEmployeeId?: string;
}

export const TimeSheetEntryModal: React.FC<TimeSheetEntryModalProps> = ({
  isOpen,
  onClose,
  initialData,
  defaultEmployeeId,
}) => {
  const { users, currentUser, projects, addTimeLog, updateTimeLog, canUserViewAllStaff } = useApp();

  const canViewAll = canUserViewAllStaff ? canUserViewAllStaff(currentUser) : currentUser?.role === 'ADMIN';
  const selectableUsers = canViewAll ? users : users.filter((u) => u.id === currentUser?.id);

  const [employeeId, setEmployeeId] = useState(
    initialData?.employeeId || defaultEmployeeId || selectableUsers[0]?.id || currentUser?.id || ''
  );
  const [projectId, setProjectId] = useState(
    initialData?.projectId || projects[0]?.id || ''
  );
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().split('T')[0]
  );
  const [shiftType, setShiftType] = useState<
    'Morning Shift (08:00 AM - 05:00 PM)' | 'General Shift (09:30 AM - 06:30 PM)' | 'Evening Shift (02:00 PM - 10:30 PM)' | 'Night Shift (08:00 PM - 05:00 AM)' | string
  >(initialData?.shiftType || 'General Shift (09:30 AM - 06:30 PM)');
  const [clockIn, setClockIn] = useState(initialData?.clockIn || '09:30 AM');
  const [clockOut, setClockOut] = useState(initialData?.clockOut || '06:30 PM');
  const [breakDurationMinutes, setBreakDurationMinutes] = useState(
    initialData?.breakDurationMinutes ?? 60
  );
  const [breakNotes, setBreakNotes] = useState(
    initialData?.breakNotes || 'Lunch (45m) + Afternoon Tea (15m)'
  );
  const [overtimeHours, setOvertimeHours] = useState(initialData?.overtimeHours ?? 0);
  const [regularHours, setRegularHours] = useState(initialData?.regularHours ?? 8);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [locationTag, setLocationTag] = useState(initialData?.locationTag || 'Vadodara HQ / Site');

  const handleShiftSelect = (label: string, defaultIn: string, defaultOut: string, breakMins: number) => {
    setShiftType(label);
    setClockIn(defaultIn);
    setClockOut(defaultOut);
    setBreakDurationMinutes(breakMins);
    setRegularHours(8);
  };

  if (!isOpen) return null;

  const totalCalculatedHours = parseFloat(
    (Number(regularHours) + Number(overtimeHours)).toFixed(1)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = users.find((u) => u.id === employeeId);
    if (!emp) return;

    const payload: Partial<LaborTimeLog> = {
      employeeId: emp.id,
      employeeName: emp.fullName,
      branchId: emp.branchId || 'BR-01',
      projectId: projectId || undefined,
      date,
      shiftType,
      clockIn,
      clockOut,
      breakDurationMinutes: Number(breakDurationMinutes) || 0,
      breakNotes: breakNotes || undefined,
      regularHours: Number(regularHours) || 8,
      overtimeHours: Number(overtimeHours) || 0,
      totalWorkingHours: totalCalculatedHours,
      approved: true,
      notes: notes || undefined,
      locationTag: locationTag || 'Vadodara Site',
      status: 'Present',
    };

    if (initialData) {
      updateTimeLog(initialData.id, payload);
    } else {
      addTimeLog(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {initialData ? 'Edit Employee Timesheet' : 'Log Employee Timesheet'}
              </h3>
              <p className="text-xs text-amber-100">
                Shift Schedule, Break Duration, Overtime & Working Hours
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-amber-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-sm">
          {/* Employee Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Employee Name & Role
            </label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white font-medium"
            >
              {selectableUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} — ({u.role.replace('_', ' ').toUpperCase()} / {u.department || 'Staff'})
                </option>
              ))}
            </select>
          </div>

          {/* Project & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Work Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Site / Project Assigned
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-xs"
              >
                <option value="">General Corporate / Office</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Shift Time Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Shift Time Schedule
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Morning', full: 'Morning Shift (08:00 AM - 05:00 PM)', inT: '08:00 AM', outT: '05:00 PM', b: 60 },
                { label: 'General', full: 'General Shift (09:30 AM - 06:30 PM)', inT: '09:30 AM', outT: '06:30 PM', b: 60 },
                { label: 'Evening', full: 'Evening Shift (02:00 PM - 10:30 PM)', inT: '02:00 PM', outT: '10:30 PM', b: 30 },
                { label: 'Night', full: 'Night Shift (08:00 PM - 05:00 AM)', inT: '08:00 PM', outT: '05:00 AM', b: 60 },
              ].map((s) => (
                <button
                  type="button"
                  key={s.label}
                  onClick={() => handleShiftSelect(s.full, s.inT, s.outT, s.b)}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    shiftType === s.full
                      ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold ring-1 ring-amber-500 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-xs">{s.label}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{s.inT}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Shift In / Out Clocks */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Shift Start (In-Time)
              </label>
              <input
                type="text"
                value={clockIn}
                onChange={(e) => setClockIn(e.target.value)}
                placeholder="09:30 AM"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-mono bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Shift End (Out-Time)
              </label>
              <input
                type="text"
                value={clockOut}
                onChange={(e) => setClockOut(e.target.value)}
                placeholder="06:30 PM"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-mono bg-white"
              />
            </div>
          </div>

          {/* Break Time (Minutes & Notes) */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Coffee className="w-4 h-4 text-amber-600" />
                Break Time Duration
              </span>
              <span className="text-xs font-mono text-slate-600">
                {breakDurationMinutes} Minutes ({ (breakDurationMinutes / 60).toFixed(1) } hrs)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[30, 45, 60].map((mins) => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setBreakDurationMinutes(mins)}
                  className={`py-1 rounded-md text-xs font-semibold border cursor-pointer ${
                    breakDurationMinutes === mins
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {mins} Mins
                </button>
              ))}
            </div>
            <div>
              <input
                type="text"
                value={breakNotes}
                onChange={(e) => setBreakNotes(e.target.value)}
                placeholder="Break notes (e.g. Lunch 45m + Tea 15m)"
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
              />
            </div>
          </div>

          {/* Hours Breakdown & Overtime */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <label className="block text-[10px] font-bold text-slate-500 uppercase">
                Regular Hours
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="12"
                value={regularHours}
                onChange={(e) => setRegularHours(parseFloat(e.target.value) || 0)}
                className="w-full mt-1 px-2 py-1 border border-slate-300 rounded font-bold text-sm bg-white"
              />
            </div>
            <div className="p-2.5 bg-orange-50 border border-orange-200 rounded-xl">
              <label className="block text-[10px] font-bold text-orange-700 uppercase">
                Overtime (OT hrs)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="12"
                value={overtimeHours}
                onChange={(e) => setOvertimeHours(parseFloat(e.target.value) || 0)}
                className="w-full mt-1 px-2 py-1 border border-orange-300 text-orange-900 rounded font-bold text-sm bg-white"
              />
            </div>
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col justify-center">
              <label className="block text-[10px] font-bold text-emerald-700 uppercase">
                Total Work Hours
              </label>
              <p className="text-lg font-black text-emerald-800 mt-1 font-mono">
                {totalCalculatedHours} <span className="text-xs font-normal">hrs</span>
              </p>
            </div>
          </div>

          {/* Location & Task Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Location / Site Tag
              </label>
              <input
                type="text"
                value={locationTag}
                onChange={(e) => setLocationTag(e.target.value)}
                placeholder="e.g. Vadodara Vasna Project Site"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Job Work Done
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. 2nd slab inspection, shuttering"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
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
              className="px-5 py-2 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 shadow-md shadow-amber-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              {initialData ? 'Update Timesheet Entry' : 'Save Timesheet Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
