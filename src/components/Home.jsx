import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Users,
  MessageCircle,
  Compass,
  ArrowRight,
  Shield,
  Clock,
  CheckCircle,
  ChevronRight,
} from 'lucide-react';

const quickActions = [
  {
    icon: Compass,
    emoji: '🧭',
    title: 'Guided Journey',
    desc: 'Step-by-step walkthrough of the entire voting process',
    btn: 'Start Guide',
    route: '/guide',
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: MapPin,
    emoji: '📍',
    title: 'Find My Booth',
    desc: 'Locate your polling station — even if you\'re registered elsewhere',
    btn: 'Find Booth',
    route: '/booth',
    gradient: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    icon: Users,
    emoji: '👥',
    title: 'Know Your Candidates',
    desc: 'See who\'s standing in your constituency',
    btn: 'View Candidates',
    route: '/candidates',
    gradient: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: MessageCircle,
    emoji: '💬',
    title: 'Ask Anything',
    desc: 'AI assistant for all your election questions',
    btn: 'Chat Now',
    route: null,
    action: 'chat',
    gradient: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
];

const stats = [
  { icon: Shield, label: 'Secure EVMs', value: '100%' },
  { icon: Clock, label: 'Voting Hours', value: '11 hrs' },
  { icon: CheckCircle, label: 'Free & Fair', value: 'Since 1951' },
];

export default function Home({ onOpenChat }) {
  const navigate = useNavigate();

  const handleAction = (item) => {
    if (item.route) navigate(item.route);
    else if (item.action === 'chat') onOpenChat?.();
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-sm font-medium mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              India General Elections 2025
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 animate-fade-in">
              Confused About Voting?
              <br />
              <span className="text-yellow-300">We'll Guide You.</span>
            </h1>

            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10 animate-fade-in">
              Step-by-step help from registration to results — your personal AI-powered election companion 🗳️
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <button
                onClick={() => navigate('/guide')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-2xl shadow-2xl hover:shadow-white/30 hover:-translate-y-1 transition-all duration-300 text-lg"
              >
                Start Your Voting Journey
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigate('/booth')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-2xl hover:bg-white/25 hover:-translate-y-1 transition-all duration-300 text-lg"
              >
                <MapPin size={20} />
                Find My Booth
              </button>
            </div>

            {/* Stats bar */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-16 pt-10 border-t border-white/20">
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                    <Icon size={20} className="text-yellow-300" />
                  </div>
                  <div className="text-left">
                    <div className="text-xl font-bold">{value}</div>
                    <div className="text-blue-200 text-sm">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">What would you like to do?</h2>
          <p className="text-gray-500 text-lg">Choose your path — we'll make it easy</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group card cursor-pointer flex flex-col"
                onClick={() => handleAction(item)}
              >
                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{item.emoji}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-5">{item.desc}</p>
                <button
                  className={`w-full py-3 rounded-xl text-white font-semibold text-sm bg-gradient-to-r ${item.gradient} hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2`}
                >
                  {item.btn}
                  <ChevronRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pain Point Banner */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 border-y border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="text-6xl">⚠️</div>
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Registered in one city, living in another?
              </h2>
              <p className="text-gray-600 text-lg">
                Millions of students and working professionals face this exact problem. Our Booth Finder handles the "registered elsewhere" scenario with clear options — travel, transfer, or postal ballot.
              </p>
            </div>
            <button
              onClick={() => navigate('/booth')}
              className="btn-primary whitespace-nowrap flex-shrink-0"
            >
              Solve This Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">How VoteFlow AI Works</h2>
          <p className="text-gray-500 text-lg">Three simple steps to informed voting</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Check & Learn', desc: 'Understand eligibility, registration status, and what to expect on voting day through our guided wizard.' },
            { step: '02', title: 'Find Your Booth', desc: 'Enter your Voter ID or address to locate your exact polling station — with special support for out-of-city voters.' },
            { step: '03', title: 'Get AI Help', desc: 'Ask any election question and get instant, accurate answers — powered by Claude AI with expert Indian election knowledge.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-5">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                {step}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-white font-bold text-lg mb-3">
            🗳️ VoteFlow AI
          </div>
          <p className="text-sm mb-4">Making democracy accessible for every Indian voter.</p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <a href="https://eci.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Election Commission</a>
            <a href="https://voters.eci.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Voter Registration</a>
            <a href="https://nvsp.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">NVSP</a>
          </div>
          <p className="text-xs mt-6 text-gray-600">Built for H2C Hackathon 2025 · For educational purposes only</p>
        </div>
      </footer>
    </div>
  );
}
