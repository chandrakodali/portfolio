import { useState, useEffect } from 'react';
import { Navbar } from '@/app/components/Navbar';
import { Hero } from '@/app/components/Hero';
import { About } from '@/app/components/About';
import { TechStack } from '@/app/components/TechStack';
import { Timeline } from '@/app/components/Timeline';
import { Projects } from '@/app/components/Projects';
import { Contact } from '@/app/components/Contact';
import { Footer } from '@/app/components/Footer';
import { Articles } from '@/app/components/Articles';
import { ErrorBoundary, SectionErrorBoundary } from '@/app/components/ErrorBoundary';
import { KubernetesGuide } from '@/app/components/kubernetes/KubernetesGuide';

export default function App() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'kubernetes'>('home');

  useEffect(() => {
    setIsMounted(true);

    // Check hash on load
    const checkHash = () => {
      if (window.location.hash === '#/kubernetes') {
        setCurrentPage('kubernetes');
      } else {
        setCurrentPage('home');
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  if (!isMounted) return null;

  // Render Kubernetes guide if on that route
  if (currentPage === 'kubernetes') {
    return (
      <ErrorBoundary>
        <div style={{ position: 'relative' }}>
          {/* Home button */}
          <a
            href="#/"
            style={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              zIndex: 1000,
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
              borderRadius: 12,
              color: 'white',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              boxShadow: '0 4px 20px rgba(129,140,248,0.4)'
            }}
          >
            🏠 Back to Portfolio
          </a>
          <KubernetesGuide />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <Navbar />

        <main className="flex flex-col w-full">
          <SectionErrorBoundary>
            <Hero />
          </SectionErrorBoundary>

          <SectionErrorBoundary>
            <About />
          </SectionErrorBoundary>

          <SectionErrorBoundary>
            <TechStack />
          </SectionErrorBoundary>

          <SectionErrorBoundary>
            <Timeline />
          </SectionErrorBoundary>

          <SectionErrorBoundary>
            <Projects />
          </SectionErrorBoundary>

          <SectionErrorBoundary>
            <Articles />
          </SectionErrorBoundary>

          <SectionErrorBoundary>
            <Contact />
          </SectionErrorBoundary>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}
