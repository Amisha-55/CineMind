import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TasteProvider } from './context/TasteContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Footer } from './components/layout/Footer';
import { AmbientGlow } from './components/layout/AmbientGlow';
import { PendingTasteToast } from './components/ui/Toast';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { WhyThisModal } from './components/recommendations/WhyThisModal';
import { MovieDetailModal } from './pages/MovieDetailPage';
import { AuthModal } from './pages/AuthModal';

import { HomePage } from './pages/HomePage';
import { ForYouPage } from './pages/ForYouPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { MoodExplorerPage } from './pages/MoodExplorerPage';
import { MyListPage } from './pages/MyListPage';
import { ProfilePage } from './pages/ProfilePage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TasteProvider>
          <div className="min-h-screen bg-[#080B10] text-slate-100 flex flex-col relative selection:bg-brand-500/30 selection:text-brand-200">
            {/* Ambient Background Lighting */}
            <AmbientGlow />

            {/* Desktop Navigation */}
            <Navbar />

            {/* Main Application Routes */}
            <main className="flex-1 relative z-10">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/for-you" element={<ForYouPage />} />
                <Route path="/discover" element={<DiscoverPage />} />
                <Route path="/moods" element={<MoodExplorerPage />} />
                <Route path="/my-list" element={<MyListPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </main>

            {/* Global Modals & Toasts */}
            <OnboardingModal />
            <WhyThisModal />
            <MovieDetailModal />
            <AuthModal />
            <PendingTasteToast />

            {/* Footer */}
            <Footer />

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav />
          </div>
        </TasteProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
