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

export default function App() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

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

