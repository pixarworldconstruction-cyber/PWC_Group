import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LoginScreen } from './components/LoginScreen';

// Views
import { DashboardView } from './components/views/DashboardView';
import { ProjectsView } from './components/views/ProjectsView';
import { DprView } from './components/views/DprView';
import { LaborHoursView } from './components/views/LaborHoursView';
import { InventoryView } from './components/views/InventoryView';
import { CrmView } from './components/views/CrmView';
import { DesignDraftsView } from './components/views/DesignDraftsView';
import { CollaborationTasksView } from './components/views/CollaborationTasksView';
import { SalaryBoxView } from './components/views/SalaryBoxView';
import { CompanyProfileView } from './components/views/CompanyProfileView';
import { AdminConsoleView } from './components/views/AdminConsoleView';

const MainPortal: React.FC = () => {
  const { currentUser, activeTab, isMobileSimulated } = useApp();

  if (!currentUser) {
    return <LoginScreen />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'projects':
        return <ProjectsView />;
      case 'dpr':
        return <DprView />;
      case 'labor':
        return <LaborHoursView />;
      case 'inventory':
        return <InventoryView />;
      case 'crm':
        return <CrmView />;
      case 'designs':
        return <DesignDraftsView />;
      case 'collaboration':
        return <CollaborationTasksView />;
      case 'salarybox':
        return <SalaryBoxView />;
      case 'company_profile':
        return <CompanyProfileView />;
      case 'admin_settings':
        return <AdminConsoleView />;
      default:
        return <DashboardView />;
    }
  };

  // If mobile simulated, render inside an Android device viewport frame
  if (isMobileSimulated) {
    return (
      <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col items-center justify-start py-6 px-2 transition-colors">
        <div className="mb-3 flex items-center justify-between w-full max-w-[430px] px-2 text-xs text-[var(--text-muted)] font-mono">
          <span className="flex items-center gap-1.5 text-[var(--primary-accent-text)] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Android Mobile Simulation (PWA)
          </span>
          <span>P W Construction · Vadodara</span>
        </div>

        {/* Android Device Shell */}
        <div className="w-full max-w-[430px] h-[860px] bg-[var(--bg-app)] border-4 border-[var(--border-strong)] rounded-[38px] shadow-2xl overflow-hidden flex flex-col relative">
          
          {/* Top Notch & Speaker */}
          <div className="w-full bg-[var(--header-bg)] py-1.5 flex justify-center items-center border-b border-[var(--border-subtle)] shrink-0">
            <div className="w-20 h-3.5 bg-[var(--bg-surface-subtle)] rounded-full flex items-center justify-center border border-[var(--border-subtle)]">
              <div className="w-2 h-2 bg-[var(--border-strong)] rounded-full" />
            </div>
          </div>

          <Header />

          {/* Scrollable Mobile Viewport */}
          <main className="flex-1 overflow-y-auto p-4 pb-24">
            {renderActiveView()}
          </main>

          {/* Android Bottom Navigation */}
          <MobileBottomNav />
        </div>
      </div>
    );
  }

  // Standard Desktop / Tablet Layout
  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col transition-colors duration-200">
      
      {/* Top Application Bar */}
      <Header />

      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar (hidden on mobile) */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>

      </div>

      {/* Mobile Bottom Navigation (shown on small screens) */}
      <div className="lg:hidden">
        <MobileBottomNav />
      </div>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainPortal />
    </AppProvider>
  );
}
