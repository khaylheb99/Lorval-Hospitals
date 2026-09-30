/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, useRouter } from './lib/router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { WaitlistPage } from './pages/WaitlistPage';
import { JoinPage } from './pages/JoinPage';

// Create a stable TanStack query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent: React.FC = () => {
  const { currentPath } = useRouter();

  // Route selector
  const renderCurrentRoute = () => {
    if (currentPath === '/waitlist') {
      return <WaitlistPage />;
    }
    if (currentPath === '/join') {
      return <JoinPage />;
    }
    return <LandingPage />;
  };

  return (
    <div className="min-h-screen bg-[#0A1628] text-[#F0F9FF] flex flex-col relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background medical grid pattern overlay */}
      <div className="fixed inset-0 bg-medical-grid opacity-35 pointer-events-none z-0" />

      {/* Top glowing cyan halo effect */}
      <div
        className="fixed -top-48 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(34,211,238,0.14),transparent)] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Navigation */}
      <Navbar />

      {/* Main Page Viewport */}
      <main className="flex-1 relative z-10">
        {renderCurrentRoute()}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </QueryClientProvider>
  );
}
