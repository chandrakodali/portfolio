import { useState } from 'react';
import { ForestBackground } from '@/app/components/ForestBackground';
import { ScrollProgress } from '@/app/components/ScrollProgress';
import { CustomCursor } from '@/app/components/CustomCursor';
import { LoadingScreen } from '@/app/components/LoadingScreen';
import { Navbar } from '@/app/components/Navbar';
import { Hero } from '@/app/components/Hero';
import { About } from '@/app/components/About';
import { TechStack } from '@/app/components/TechStack';
import { Timeline } from '@/app/components/Timeline';
import { Projects } from '@/app/components/Projects';
import { Testimonials } from '@/app/components/Testimonials';
import { Blog } from '@/app/components/Blog';
import { Contact } from '@/app/components/Contact';
import { Footer } from '@/app/components/Footer';
import { ErrorBoundary, SectionErrorBoundary } from '@/app/components/ErrorBoundary';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ErrorBoundary>
      {/* Loading Screen */}
      {isLoading && (
        <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      )}

      <div className="relative min-h-screen bg-[#030014] text-white overflow-x-hidden">
        {/* Custom cursor */}
        {!isLoading && <CustomCursor />}

        {/* Navigation Bar */}
        {!isLoading && <Navbar />}

        {/* Scroll progress indicator */}
        {!isLoading && <ScrollProgress />}

        {/* Forest background */}
        <ForestBackground />

        {/* Grid pattern overlay */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
          aria-hidden="true"
        />

        {/* Main content */}
        <main className="relative z-10">
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
            <Testimonials />
          </SectionErrorBoundary>
          <SectionErrorBoundary>
            <Blog />
          </SectionErrorBoundary>
          <SectionErrorBoundary>
            <Contact />
          </SectionErrorBoundary>
          <Footer />
        </main>

        {/* Noise texture overlay */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />

        {/* Vignette effect */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)',
          }}
          aria-hidden="true"
        />
      </div>
    </ErrorBoundary>
  );
}

