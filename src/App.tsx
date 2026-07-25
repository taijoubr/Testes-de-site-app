import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Views
import { InstitutionalHome } from './views/InstitutionalHome';
import { ServicesPage } from './views/ServicesPage';
import { PortfolioPage } from './views/PortfolioPage';
import { AboutPage } from './views/AboutPage';
import { ContactPage } from './views/ContactPage';
import { AdminPanel } from './views/AdminPanel';
import { AdminLoginPage } from './views/AdminLoginPage';
import { ClientPortal } from './views/ClientPortal';
import { ClientAuthPage } from './views/ClientAuthPage';
import { MobileAppView } from './views/MobileAppView';
import { ProposalAcceptancePage } from './views/ProposalAcceptancePage';

// Modals
import { QuoteWizardModal } from './components/QuoteWizardModal';

const AppContent: React.FC = () => {
  const { activeView, isAdminAuthenticated, isClientAuthenticated } = useApp();

  // Render Admin views in a dedicated standalone page layout
  if (activeView === 'admin_login') {
    return <AdminLoginPage />;
  }

  if (activeView === 'admin_panel') {
    return isAdminAuthenticated ? <AdminPanel /> : <AdminLoginPage />;
  }

  // Render Client views in a dedicated standalone page layout
  if (activeView === 'client_auth') {
    return <ClientAuthPage />;
  }

  if (activeView === 'client_portal') {
    return isClientAuthenticated ? <ClientPortal /> : <ClientAuthPage />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
      case 'institutional':
        return <InstitutionalHome />;
      case 'services':
        return <ServicesPage />;
      case 'portfolio':
        return <PortfolioPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'client_portal':
        return <ClientPortal />;
      case 'mobile_app':
      case 'mobile_sim':
        return <MobileAppView />;
      case 'proposal_accept':
        return <ProposalAcceptancePage />;
      case 'quote_wizard':
        return <QuoteWizardModal />;
      default:
        return <InstitutionalHome />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* Sticky Top Navigation */}
      <Navbar />

      {/* Main View Display */}
      <main className="flex-1">
        {renderActiveView()}
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
