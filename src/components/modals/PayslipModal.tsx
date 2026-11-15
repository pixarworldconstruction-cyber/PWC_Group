import React from 'react';
import { X, Printer, CheckCircle, Download, Building } from 'lucide-react';
import { SalarySlip } from '../../types';

export const PayslipModal: React.FC<{ slip: SalarySlip | null; onClose: () => void }> = ({ slip, onClose }) => {
  if (!slip) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalDeductions = 
    slip.deductions.providentFund + 
    slip.deductions.professionalTax + 
    slip.deductions.advanceDeduction + 
    slip.deductions.taxDeducted;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Controls (Not printed) */}
        <div className="no-print flex items-center justify-between px-6 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[var(--primary-accent-text)]">{slip.slipNumber}</span>
            <span className="text-xs text-[var(--text-muted)]">· {slip.month}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[var(--primary-accent)] hover:opacity-90 text-slate-950 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Payslip Document Canvas */}
        <div className="p-6 md:p-8 bg-[var(--bg-surface)] text-[var(--text-main)] print:text-black print:bg-white text-xs space-y-6">
          
          {/* Company Letterhead */}
          <div className="flex items-start justify-between border-b border-[var(--border-subtle)] print:border-black pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[var(--primary-accent)] text-slate-950 font-black flex items-center justify-center text-sm shadow-sm">
                  PW
                </div>
                <h2 className="text-lg font-black tracking-tight text-[var(--text-main)] print:text-black">
                  P W CONSTRUCTION PVT. LTD.
                </h2>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] print:text-gray-600 mt-1">
                Civil Infrastructure, Commercial & Luxury Residential Developers
              </p>
              <p className="text-[10px] text-[var(--text-subtle)] print:text-gray-500">
                Corporate HQ: Plot 42, Bandra-Kurla Complex, Mumbai 400051 · ISO 9001:2015
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono font-bold text-[var(--primary-accent-text)] print:text-black uppercase">
                Pay Statement
              </div>
              <div className="text-xs font-mono text-[var(--text-muted)] print:text-gray-700 mt-0.5">{slip.month}</div>
              <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 print:text-emerald-800 border border-emerald-500/20">
                <CheckCircle className="w-3 h-3" /> Status: {slip.paymentStatus}
              </div>
            </div>
          </div>

          {/* Employee & Attendance Meta */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-[var(--bg-surface-subtle)] print:bg-gray-100 rounded-xl border border-[var(--border-subtle)] print:border-gray-300 text-[11px]">
            <div>
              <span className="text-[var(--text-muted)] print:text-gray-600 block">Employee Name:</span>
              <span className="font-bold text-[var(--text-main)] print:text-black">{slip.employeeName}</span>
            </div>
            <div>
              <span className="text-[var(--text-muted)] print:text-gray-600 block">Employee ID:</span>
              <span className="font-mono text-[var(--text-main)] print:text-black">{slip.employeeId}</span>
            </div>
            <div>
              <span className="text-[var(--text-muted)] print:text-gray-600 block">Working Days:</span>
              <span className="font-mono text-[var(--text-main)] print:text-black">{slip.workingDays} Days</span>
            </div>
            <div>
              <span className="text-[var(--text-muted)] print:text-gray-600 block">Days Present:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 print:text-emerald-700 font-bold">{slip.daysPresent} Days</span>
            </div>
          </div>

          {/* Earnings & Deductions Breakdown Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Earnings Column */}
            <div className="border border-[var(--border-subtle)] print:border-gray-300 rounded-xl overflow-hidden">
              <div className="px-3 py-2 bg-[var(--bg-surface-subtle)] print:bg-gray-200 font-bold text-[var(--text-main)] print:text-black text-xs border-b border-[var(--border-subtle)] print:border-gray-300 flex justify-between">
                <span>EARNINGS</span>
                <span>AMOUNT (₹)</span>
              </div>
              <div className="p-3 space-y-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)] print:text-gray-600">Basic Monthly Pay:</span>
                  <span className="tabular-nums font-semibold text-[var(--text-main)] print:text-black">₹{slip.baseSalary.toLocaleString('en-IN')}</span>
                </div>
                {slip.allowances && slip.allowances.length > 0 ? (
                  slip.allowances.map((allowance) => (
                    <div key={allowance.id} className="flex justify-between">
                      <span className="text-[var(--text-muted)] print:text-gray-600">{allowance.name}:</span>
                      <span className="tabular-nums text-[var(--text-main)] print:text-black">
                        ₹{allowance.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)] print:text-gray-600">House Rent Allowance (HRA):</span>
                      <span className="tabular-nums text-[var(--text-main)] print:text-black">₹{slip.hra.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)] print:text-gray-600">Site & Travel Allowance:</span>
                      <span className="tabular-nums text-[var(--text-main)] print:text-black">₹{slip.siteAllowance.toLocaleString('en-IN')}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)] print:text-gray-600">Overtime Wages:</span>
                  <span className="tabular-nums text-[var(--text-main)] print:text-black">₹{slip.overtimePay.toLocaleString('en-IN')}</span>
                </div>
                {slip.targetIncentiveCommission > 0 && (
                  <div className="flex justify-between text-[var(--primary-accent-text)] print:text-amber-800 font-bold">
                    <span>Performance / Commission:</span>
                    <span className="tabular-nums">+₹{slip.targetIncentiveCommission.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[var(--border-subtle)] print:border-gray-300 font-bold text-xs text-[var(--text-main)] print:text-black">
                  <span>Gross Earnings:</span>
                  <span className="tabular-nums">₹{slip.grossSalary.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Deductions Column */}
            <div className="border border-[var(--border-subtle)] print:border-gray-300 rounded-xl overflow-hidden">
              <div className="px-3 py-2 bg-[var(--bg-surface-subtle)] print:bg-gray-200 font-bold text-[var(--text-main)] print:text-black text-xs border-b border-[var(--border-subtle)] print:border-gray-300 flex justify-between">
                <span>DEDUCTIONS</span>
                <span>AMOUNT (₹)</span>
              </div>
              <div className="p-3 space-y-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)] print:text-gray-600">Provident Fund (EPF):</span>
                  <span className="tabular-nums text-[var(--text-main)] print:text-black">₹{slip.deductions.providentFund.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)] print:text-gray-600">Professional Tax (PT):</span>
                  <span className="tabular-nums text-[var(--text-main)] print:text-black">₹{slip.deductions.professionalTax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)] print:text-gray-600">Income Tax (TDS):</span>
                  <span className="tabular-nums text-[var(--text-main)] print:text-black">₹{slip.deductions.taxDeducted.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)] print:text-gray-600">Advance / Other:</span>
                  <span className="tabular-nums text-[var(--text-main)] print:text-black">₹{slip.deductions.advanceDeduction.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[var(--border-subtle)] print:border-gray-300 font-bold text-xs text-rose-600 dark:text-rose-400 print:text-rose-700">
                  <span>Total Deductions:</span>
                  <span className="tabular-nums">-₹{totalDeductions.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Net Salary Payable Banner */}
          <div className="p-4 bg-[var(--primary-accent-bg)] print:bg-amber-50 border border-[var(--primary-accent-border)] print:border-amber-300 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-[var(--primary-accent-text)] print:text-amber-900">
                Net Take-Home Salary
              </span>
              <p className="text-[10px] text-[var(--text-muted)] print:text-gray-600">
                Transferred to employee bank account on record
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black font-mono tabular-nums text-[var(--primary-accent-text)] print:text-amber-900">
                ₹{slip.netPayable.toLocaleString('en-IN')}
              </span>
              {slip.transactionRef && (
                <div className="text-[10px] font-mono text-[var(--text-muted)] print:text-gray-500">
                  Ref: {slip.transactionRef}
                </div>
              )}
            </div>
          </div>

          {/* Signoff stamps */}
          <div className="pt-4 border-t border-[var(--border-subtle)] print:border-gray-300 flex justify-between items-end text-[10px] text-[var(--text-subtle)] print:text-gray-500">
            <div>
              <p>Generated by P W Construction HR & Payroll Gateway</p>
              <p>This is a computer-verified digital salary statement.</p>
            </div>
            <div className="text-right border-t border-dashed border-[var(--border-subtle)] print:border-black pt-1 px-4">
              <span>Authorized Signature / HR Department</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
