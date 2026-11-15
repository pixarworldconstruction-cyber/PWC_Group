import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Boxes, 
  ArrowRightLeft, 
  AlertTriangle, 
  Plus, 
  Search, 
  CheckCircle, 
  Truck, 
  Warehouse,
  ArrowUpRight,
  Calendar,
  Clock,
  ShieldCheck,
  Check,
  X,
  FileCheck2,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { NewMaterialTransferModal } from '../modals/NewMaterialTransferModal';

export const InventoryView: React.FC = () => {
  const { 
    inventory, 
    transfers, 
    approveByAccounts, 
    approveByAdmin, 
    acknowledgeTransferReceived, 
    currentUser, 
    activeBranchId, 
    branches,
    projects
  } = useApp();

  const [activeTab, setActiveTab] = useState<'stock' | 'requisitions'>('stock');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [reviewRemark, setReviewRemark] = useState('');
  const [selectedReqForReview, setSelectedReqForReview] = useState<string | null>(null);

  const isAdmin = currentUser?.role === 'ADMIN';
  const isSiteEngineer = currentUser?.role === 'SITE_ENGINEER';

  const filteredInventory = inventory.filter(item => {
    if (activeBranchId !== 'ALL' && item.branchId !== activeBranchId) return false;
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
    }
    return true;
  });

  const lowStockCount = filteredInventory.filter(i => i.quantityInStock <= i.minThreshold).length;

  const pendingRequisitions = transfers.filter(t => 
    t.status === 'Pending Accounts & Admin Review' || 
    t.status === 'Approved by Accounts' ||
    t.status === 'Admin Cleared'
  );

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[var(--text-main)] tracking-tight">Material & Inventory Management</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">
              INR (₹) Transactions
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Central Depots, Site Yards, and Material Requisitions with Target Needed Dates & Dual Review
          </p>
        </div>

        <button
          onClick={() => setIsTransferModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-[var(--primary-accent)] hover:opacity-90 rounded-lg transition-colors shadow-md"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Request Material for Site</span>
        </button>
      </div>

      {/* Stock Alerts Notice */}
      {lowStockCount > 0 && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-rose-700 dark:text-rose-300">{lowStockCount} Materials Below Reorder Threshold</span>
              <p className="text-[var(--text-muted)] text-[11px] mt-0.5">
                Certain site yards have inventory levels below safe working limits. Expedite supplier PO or warehouse transfer.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold bg-rose-500 hover:bg-rose-400 text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            Create Requisition
          </button>
        </div>
      )}

      {/* Subnavigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2">
        <button
          onClick={() => setActiveTab('stock')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'stock'
              ? 'bg-[var(--primary-accent)] text-slate-950 font-bold shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]'
          }`}
        >
          Warehouse & Site Yard Stock
        </button>

        <button
          onClick={() => setActiveTab('requisitions')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'requisitions'
              ? 'bg-[var(--primary-accent)] text-slate-950 font-bold shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]'
          }`}
        >
          <span>Material Requisitions (Accounts & Admin)</span>
          {pendingRequisitions.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-mono text-[10px] font-bold">
              {pendingRequisitions.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'stock' && (
        <>
          {/* Filter and Search Bar */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-3 rounded-xl shadow-xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search material by name, SKU..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[var(--primary-accent)]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {['ALL', 'Cement & Aggregates', 'Steel & Structural', 'Finishing & Tiles', 'Electrical', 'Plumbing & Sanitary'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    categoryFilter === cat
                      ? 'bg-[var(--primary-accent-bg)] text-[var(--primary-accent-text)] border border-[var(--primary-accent-border)] font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-surface-subtle)]'
                  }`}
                >
                  {cat === 'ALL' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Inventory Stock Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInventory.map(item => {
              const isLow = item.quantityInStock <= item.minThreshold;
              const branch = branches.find(b => b.id === item.branchId);

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all shadow-xs ${
                    isLow 
                      ? 'bg-rose-500/5 border-rose-500/30' 
                      : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-[var(--primary-accent-text)] font-bold uppercase">{item.sku}</span>
                      <div className="text-xs font-bold text-[var(--text-main)] mt-0.5 line-clamp-1">{item.name}</div>
                      <span className="text-[11px] text-[var(--text-muted)]">{item.category}</span>
                    </div>
                    {isLow ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded">
                        LOW STOCK
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded font-semibold">
                        Adequate
                      </span>
                    )}
                  </div>

                  {/* Quantity in stock */}
                  <div className="my-3 py-2 px-3 bg-[var(--bg-surface-subtle)] rounded-lg border border-[var(--border-subtle)] flex items-center justify-between font-mono">
                    <div>
                      <span className="text-[10px] text-[var(--text-subtle)] block">CURRENT STOCK</span>
                      <span className={`text-base font-bold ${isLow ? 'text-rose-600 dark:text-rose-400' : 'text-[var(--text-main)]'}`}>
                        {item.quantityInStock.toLocaleString()} <span className="text-xs text-[var(--text-muted)]">{item.unit}</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[var(--text-subtle)] block">THRESHOLD</span>
                      <span className="text-xs text-[var(--text-muted)]">{item.minThreshold} {item.unit}</span>
                    </div>
                  </div>

                  {/* Location and replenishment info */}
                  <div className="text-[11px] text-[var(--text-muted)] space-y-1">
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="text-[var(--text-main)] font-medium">{item.locationType} ({branch?.city})</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span>Unit Price (INR):</span>
                      <span className="text-[var(--text-main)] font-semibold">₹{item.unitPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Tab 2: Material Requisitions & Dual Accounts / Admin Clearances */}
      {activeTab === 'requisitions' && (
        <div className="space-y-4">
          <div className="p-4 bg-[var(--primary-accent-bg)] border border-[var(--primary-accent-border)] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[var(--primary-accent)] shrink-0" />
              <div>
                <span className="font-bold text-[var(--text-main)]">Dual-Level Financial & Administrative Governance</span>
                <p className="text-[var(--text-muted)] text-[11px] mt-0.5">
                  1. <strong>Accounts Department</strong> reviews budget & vendor PO quotation · 2. <strong>Admin / Director</strong> gives final clearance for depot release.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsTransferModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold bg-[var(--primary-accent)] text-slate-950 rounded-lg hover:opacity-90 shadow-xs whitespace-nowrap self-start sm:self-auto cursor-pointer"
            >
              + New Requisition
            </button>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[var(--text-main)] tracking-tight">Active Material Requisition Slips</h2>
                <p className="text-[11px] text-[var(--text-muted)]">Site engineer requests with target needed dates and approval audit logs</p>
              </div>
              <span className="text-xs text-[var(--primary-accent-text)] font-mono font-bold">
                {transfers.length} Requisitions Total
              </span>
            </div>

            <div className="space-y-3">
              {transfers.map(trf => {
                const isAccountsApproved = trf.status === 'Approved by Accounts' || trf.status === 'Admin Cleared' || trf.status === 'Dispatched' || trf.status === 'Received at Site';
                const isAdminCleared = trf.status === 'Admin Cleared' || trf.status === 'Dispatched' || trf.status === 'Received at Site';
                const isDelivered = trf.status === 'Received at Site';

                return (
                  <div
                    key={trf.id}
                    className="p-4 bg-[var(--bg-surface-subtle)] border border-[var(--border-subtle)] rounded-xl space-y-3 shadow-2xs"
                  >
                    {/* Top Row: Req Number, Urgency, Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[var(--primary-accent-text)] bg-[var(--bg-surface)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                          {trf.reqNumber}
                        </span>
                        <span className="text-xs font-bold text-[var(--text-main)]">{trf.itemName}</span>
                        <span className="text-[11px] text-[var(--text-muted)] font-mono">({trf.quantity} {trf.unit})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {trf.urgency && (
                          <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                            trf.urgency.includes('Immediate') ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30' :
                            trf.urgency.includes('High') ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30' :
                            'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                          }`}>
                            {trf.urgency}
                          </span>
                        )}

                        <span className={`px-2.5 py-0.5 text-[10px] font-semibold rounded font-mono ${
                          trf.status === 'Received at Site' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' :
                          trf.status === 'Admin Cleared' || trf.status === 'Dispatched' ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30' :
                          trf.status === 'Approved by Accounts' ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30' :
                          'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        }`}>
                          {trf.status}
                        </span>
                      </div>
                    </div>

                    {/* Middle Grid: Site, Needed Date, Estimated Cost, Requested By */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[var(--bg-surface)] rounded-lg border border-[var(--border-subtle)] text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-[var(--text-subtle)] block">DESTINATION PROJECT</span>
                        <span className="font-sans font-semibold text-[var(--text-main)] truncate block">{trf.toProjectName}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-[var(--text-subtle)] block flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[var(--primary-accent)]" />
                          <span>MATERIAL NEEDED DATE</span>
                        </span>
                        <span className="font-bold text-[var(--primary-accent-text)]">
                          {trf.materialNeededDate || '2026-10-24'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-[var(--text-subtle)] block">ESTIMATED COST (INR)</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{trf.estimatedCost ? trf.estimatedCost.toLocaleString('en-IN') : '50,000'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-[var(--text-subtle)] block">REQUESTED BY</span>
                        <span className="text-[var(--text-main)] truncate block">{trf.requestedBy}</span>
                      </div>
                    </div>

                    {/* Notes if present */}
                    {trf.notes && (
                      <div className="text-xs text-[var(--text-muted)] bg-[var(--bg-surface)] p-2.5 rounded-lg border border-[var(--border-subtle)]">
                        <strong className="text-[var(--text-main)]">Site Justification:</strong> {trf.notes}
                      </div>
                    )}

                    {/* Dual Approval Status Bar & Action Controls */}
                    <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      
                      {/* Review State Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* 1. Accounts Stage */}
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono ${
                          isAccountsApproved 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        }`}>
                          {isAccountsApproved ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                          <span>Accounts: {isAccountsApproved ? (trf.reviewedByAccounts || 'Approved') : 'Awaiting Review'}</span>
                        </div>

                        {/* 2. Admin Clearance Stage */}
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono ${
                          isAdminCleared 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                            : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                        }`}>
                          {isAdminCleared ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                          <span>Director Clearance: {isAdminCleared ? (trf.clearedByAdmin || 'Cleared') : 'Pending'}</span>
                        </div>
                      </div>

                      {/* Action Buttons for Accounts / Admin / Site Engineer */}
                      <div className="flex items-center gap-2">
                        {/* Accounts Review Button (Visible to Admin or Accounts) */}
                        {trf.status === 'Pending Accounts & Admin Review' && (isAdmin || currentUser?.department?.includes('Account')) && (
                          <button
                            onClick={() => approveByAccounts(trf.id, 'Quotation and GST supplier invoice verified. Budget allocated.')}
                            className="px-3 py-1 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors shadow-xs cursor-pointer"
                          >
                            Approve as Accounts
                          </button>
                        )}

                        {/* Admin Clearance Button */}
                        {trf.status === 'Approved by Accounts' && isAdmin && (
                          <button
                            onClick={() => approveByAdmin(trf.id, 'Admin clearance granted. Dispatch from central depot to site yard.')}
                            className="px-3 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-xs cursor-pointer"
                          >
                            Admin Clearance & Dispatch
                          </button>
                        )}

                        {/* Site Engineer Acknowledge Delivery */}
                        {(trf.status === 'Admin Cleared' || trf.status === 'Dispatched') && (
                          <button
                            onClick={() => acknowledgeTransferReceived(trf.id)}
                            className="px-3 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-xs cursor-pointer"
                          >
                            Acknowledge Received at Site
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <NewMaterialTransferModal isOpen={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)} />

    </div>
  );
};
