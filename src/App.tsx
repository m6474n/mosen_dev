import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ReactLenis } from 'lenis/react';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import AboutView from './components/AboutView';
import ServicesView from './components/ServicesView';
import CaseStudyDetailView from './components/CaseStudyDetailView';
import ResourcesView from './components/ResourcesView';
import BlogView from './components/BlogView';
import ContactView from './components/ContactView';
import InitialPreloader from './components/InitialPreloader';
import CustomPointer from './components/CustomPointer';
import AdminDashboardView from './components/AdminDashboardView';

export default function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');
  const [isLoading, setIsLoading] = useState(true);


  // Listen to hash changes for SNAPPY offline-first navigation
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
      // Scroll to top on every page navigation for premium UX
      window.scrollTo({ top: 0, behavior: 'instant' as any });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Simple routing match switch
  const renderCurrentView = () => {
    const hash = currentHash;

    if (hash === '#/' || hash === '' || hash === '#/home') {
      return <HomeView />;
    }
    if (hash.startsWith('#/about')) {
      return <AboutView />;
    }
    if (hash.startsWith('#/services')) {
      return <ServicesView />;
    }
    if (hash.startsWith('#/case-study') || hash === '#/case-studies') {
      return <CaseStudyDetailView currentHash={hash} />;
    }
    if (hash.startsWith('#/resources')) {
      return <ResourcesView />;
    }
    if (hash.startsWith('#/blog')) {
      return <BlogView currentHash={hash} />;
    }
    if (hash.startsWith('#/contact')) {
      return <ContactView />;
    }
    if (hash.startsWith('#/admin')) {
      return <AdminDashboardView />;
    }

    // Default Fallback
    return <HomeView />;
  };

  const isAdminRoute = currentHash.startsWith('#/admin');

  return (
    <DataProvider>
      <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
        <CustomPointer />
        <AnimatePresence mode="wait">
          {isLoading && (
            <InitialPreloader key="app-preloader" onComplete={() => setIsLoading(false)} />
          )}
        </AnimatePresence>

        <div className={`min-h-screen selection:bg-neutral-950 selection:text-white flex flex-col justify-between ${isAdminRoute ? 'bg-neutral-50' : 'bg-white text-neutral-900'}`}>
          {/* Dynamic SEO Meta title updater for simulation page indexations */}
          <MetaTitleUpdater currentHash={currentHash} />

          {/* Persistent global Header */}
          {!isAdminRoute && <Header currentHash={currentHash} />}

          {/* Main Dynamic View wrapper with premium route transition animations */}
          <div className="flex-grow flex flex-col">
            <AnimatePresence mode="wait">
              {!isLoading && (
                <motion.main
                  key={currentHash}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.38, ease: [0.25, 1, 0.5, 1] }}
                  className="flex-grow flex flex-col"
                >
                  {renderCurrentView()}
                </motion.main>
              )}
            </AnimatePresence>
          </div>

          {/* Persistent global Footer */}
          {!isAdminRoute && <Footer />}
        </div>
      </ReactLenis>
    </DataProvider>
  );
}

// Subcomponent to dynamically configure browser titles based on route, optimizing seo metrics
function MetaTitleUpdater({ currentHash }: { currentHash: string }) {
  useEffect(() => {
    let title = "Mosen — Product Engineer · Designer · Automation Builder";
    
    if (currentHash.startsWith('#/about')) {
      title = "About Muhammad Mohsin — Mosen Portfolio";
    } else if (currentHash.startsWith('#/services')) {
      title = "Services & Revenue automation — Mosen Portfolio";
    } else if (currentHash.startsWith('#/case-study/')) {
      const pId = currentHash.replace('#/case-study/', '').toUpperCase().replace(/-/g, ' ');
      title = `${pId} — Case Study | Mosen`;
    } else if (currentHash === '#/case-studies') {
      title = "Case Studies — Selected Work | Mosen";
    } else if (currentHash.startsWith('#/resources')) {
      title = "Open Vault Resources — Copyable scripts & files | Mosen";
    } else if (currentHash.startsWith('#/blog/')) {
      const slugRaw = currentHash.replace('#/blog/', '').toUpperCase().replace(/-/g, ' ');
      title = `${slugRaw} — Thoughts & Essays | Mosen`;
    } else if (currentHash === '#/blog') {
      title = "Thoughts & Tech Essays — Mosen Blog";
    } else if (currentHash.startsWith('#/contact')) {
      title = "Secure Discovery Consultation Booking — contact Mosen";
    }

    document.title = title;
  }, [currentHash]);

  return null;
}
