import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Clock, 
  MapPin, 
  CheckCircle, 
  Calendar, 
  Search, 
  UserCheck, 
  Timer,
  Play,
  Square
} from 'lucide-react';

export const LaborHoursView: React.FC = () => {
  const { 
    timeLogs, 
    currentUser, 
    clockInSimulator, 
    clockOutSimulator, 
    branches, 
    activeBranchId 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [siteLocationTag, setSiteLocationTag] = useState('Worli Skyline Construction Site (GPS Verified: 18.998° N, 72.815° E)');

  // Check if current user has an active clock-in today
  const today = new Date().toISOString().split('T')[0];
  const myTodayLog = timeLogs.find(l => l.employeeId === currentUser?.id && l.date === today);
  const isClockedIn = !!myTodayLog && !myTodayLog.clockOut;

  const filteredLogs = timeLogs.filter(log => {
    if (activeBranchId !== 'ALL' && log.branchId !== activeBranchId) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        log.employeeName.toLowerCase().includes(q) ||
        log.locationTag.toLowerCase().includes(q) ||
        log.status.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalRegularHours = filteredLogs.reduce((acc, l) => acc + l.regularHours, 0);
  const totalOvertimeHours = filteredLogs.reduce((acc, l) => acc + l.overtimeHours, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-main)] tracking-tight">Employees Hours & Digital Timesheets</h1>
          <p className="text-xs text-[var(--text-muted)]">
            Field workforce and employee attendance, automated hours aggregation, and geotagged check-ins
          </p>
        </div>

        {/* Quick Punch In / Out Card */}
        <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl flex items-center gap-3 shadow-xs">
          <div className="text-xs">
            <span className="text-[var(--text-subtle)] block text-[10px]">MY ATTENDANCE STATUS</span>
            <span className={`font-bold font-mono ${isClockedIn ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--text-main)]'}`}>
              {isClockedIn ? `Checked In: ${myTodayLog?.clockIn}` : 'Not Punched Today'}
            </span>
          </div>

          {isClockedIn ? (
            <button
              onClick={() => clockOutSimulator()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-500 hover:bg-rose-400 text-white rounded-lg transition-colors shadow-xs"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Clock Out</span>
            </button>
          ) : (
            <button
              onClick={() => clockInSimulator(siteLocationTag)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors shadow-xs"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Punch Clock In</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-xs">
          <div className="text-xs text-[var(--text-muted)]">Logged Man-Days Today</div>
          <div className="text-2xl font-bold font-mono text-[var(--text-main)] mt-1">{filteredLogs.length} Records</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-1 font-semibold">100% Geo-fence verified</div>
        </div>

        <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-xs">
          <div className="text-xs text-[var(--text-muted)]">Regular Labor Hours</div>
          <div className="text-2xl font-bold font-mono text-[var(--text-main)] mt-1">{totalRegularHours.toFixed(1)} hrs</div>
          <div className="text-[11px] text-[var(--text-muted)] font-mono mt-1">Standard shift (8h)</div>
        </div>

        <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-xs">
          <div className="text-xs text-[var(--text-muted)]">Overtime (OT) Logged</div>
          <div className="text-2xl font-bold font-mono text-[var(--primary-accent-text)] mt-1">+{totalOvertimeHours.toFixed(1)} hrs</div>
          <div className="text-[11px] text-[var(--primary-accent-text)] font-mono mt-1">Approved for payroll extra</div>
        </div>
      </div>

      {/* Timesheet Data Table */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search employee, site location..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[var(--primary-accent)]"
            />
          </div>

          <div className="text-xs text-[var(--text-muted)] font-mono">
            {filteredLogs.length} Attendance Entries
          </div>
        </div>

        <div className="border border-[var(--border-subtle)] rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] text-[11px] font-mono border-b border-[var(--border-subtle)]">
              <tr>
                <th className="py-3 px-4">Employee Name</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Clock In / Out</th>
                <th className="py-3 px-4 text-center">Regular</th>
                <th className="py-3 px-4 text-center">Overtime</th>
                <th className="py-3 px-4">Geotagged Site Location</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] font-mono text-[11px]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-[var(--bg-surface-subtle)]">
                  <td className="py-3 px-4 font-sans font-medium text-[var(--text-main)]">
                    <div>{log.employeeName}</div>
                    <div className="text-[10px] text-[var(--text-subtle)] font-mono">{log.employeeId}</div>
                  </td>
                  <td className="py-3 px-4 text-[var(--text-muted)]">{log.date}</td>
                  <td className="py-3 px-4 text-[var(--text-main)]">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{log.clockIn}</span>
                    <span className="text-[var(--text-subtle)]"> → </span>
                    <span className="text-[var(--text-main)]">{log.clockOut || 'Active'}</span>
                  </td>
                  <td className="py-3 px-4 text-center text-[var(--text-main)]">{log.regularHours} hrs</td>
                  <td className="py-3 px-4 text-center text-[var(--primary-accent-text)] font-semibold">+{log.overtimeHours} hrs</td>
                  <td className="py-3 px-4 font-sans text-[var(--text-muted)] text-[11px]">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[var(--primary-accent)] shrink-0" />
                      <span className="truncate max-w-xs">{log.locationTag}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 rounded">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
