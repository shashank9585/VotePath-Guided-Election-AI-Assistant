import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import GuidedJourney from './components/GuidedJourney';
import BoothFinder from './components/BoothFinder';
import Candidates from './components/Candidates';
import Timeline from './components/Timeline';
import ChatWidget from './components/ChatWidget';
import { useState } from 'react';

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home onOpenChat={() => setChatOpen(true)} />} />
            <Route path="/guide" element={<GuidedJourney />} />
            <Route path="/booth" element={<BoothFinder />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/timeline" element={<Timeline />} />
            {/* Catch-all redirect to home */}
            <Route path="*" element={<Home onOpenChat={() => setChatOpen(true)} />} />
          </Routes>
        </main>
        <ChatWidget forceOpen={chatOpen} onClose={() => setChatOpen(false)} />
      </div>
    </BrowserRouter>
  );
}
