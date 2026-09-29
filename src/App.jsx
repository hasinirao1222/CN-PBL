import React from 'react';
import Navbar from './components/Navbar';
import NetworkBackground from './components/NetworkBackground';
import HeroSection from './components/HeroSection';
import TheoryGrid from './components/TheoryGrid';
import RoutingSimulator from './components/RoutingSimulator';
import LayerAccordion from './components/LayerAccordion';
import PblFooter from './components/PblFooter';
import { ModalProvider } from './context/ModalContext';

export default function App() {
  return (
    <ModalProvider>
      <div className="min-h-screen bg-[#090d16] text-slate-100 relative selection:bg-sky-500 selection:text-black">
        {/* Minimalist Realistic Topology Canvas */}
        <NetworkBackground />

        {/* Sticky Clean Header */}
        <Navbar />

        {/* Main Content */}
        <main className="relative z-10">
          <HeroSection />
          <TheoryGrid />
          <RoutingSimulator />
          <LayerAccordion />
        </main>

        {/* Footer */}
        <PblFooter />
      </div>
    </ModalProvider>
  );
}
