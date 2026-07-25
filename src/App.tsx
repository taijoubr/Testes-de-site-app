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
import { ClientPortal } from './views/ClientPortal';
import { MobileAppView } from './views/MobileAppView';
import { ProposalAcceptancePage } from './views/ProposalAcceptancePage';

// Modals
import { QuoteWizardModal } from './components/QuoteWizardModal';

const AppContent: React.FC = () => {
  const { activeView } = useApp();

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
      case 'admin_panel':
        return <AdminPanel />;
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
