import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const TIMELINE_EVENTS = [
  {
    id: 1,
    date: 'Jan 15, 2025',
    title: 'Election Announcement',
    icon: '📢',
    color: 'blue',
    what: 'Election Commission announces poll schedule, including dates for each phase, nomination deadlines, and counting day.',
    voters: 'Start preparing your documents. Check your name on the electoral roll at voters.eci.gov.in',
    status: 'done',
  },
  {
    id: 2,
    date: 'Feb 1–10, 2025',
    title: 'Nomination Period',
    icon: '📝',
    color: 'indigo',
    what: 'Candidates file their nomination papers with the Returning Officer, along with security deposits and affidavits.',
    voters: 'Verify your voter registration. Deadline for transfer applications is approaching.',
    status: 'done',
  },
  {
    id: 3,
    date: 'Feb 10 – Mar 15',
    title: 'Campaign Period',
    icon: '📣',
    color: 'purple',
    what: 'Political parties hold rallies, issue manifestos, and run ads. Model Code of Conduct is in effect.',
    voters: 'Research candidates and their track records. Attend local events. Form your opinion.',
    status: 'done',
  },
  {
    id: 4,
    date: 'Mar 20, 2025',
    title: 'Voting Day',
    icon: '🗳️',
    color: 'orange',
    what: 'Citizens across India exercise their franchise. Polling booths open 7 AM – 6 PM. EVMs are used.',
    voters: 'Go to your registered polling booth! Carry your Voter ID (or alternate photo ID). Mark left index finger with ink.',
    status: 'active',
  },
  {
    id: 5,
    date: 'Mar 23, 2025',
    title: 'Counting Day',
    icon: '📊',
    color: 'teal',
    what: 'Votes counted under supervision of Returning Officers. Postal ballots counted first, then EVMs.',
    voters: 'Watch live results on news channels, ECI website, or the Voter Helpline App.',
    status: 'upcoming',
  },
  {
    id: 6,
    date: 'Mar 23 Evening',
    title: 'Results Declaration',
    icon: '🏆',
    color: 'green',
    what: 'Winners declared constituency by constituency. President invited to form government.',
    voters: 'Your vote shaped the result! Government formed within days. Oath ceremony follows.',
    status: 'upcoming',
  },
];

const COLOR_MAP = {
  blue: { node: 'bg-blue-600 border-blue-300', line: 'bg-blue-200', badge: 'bg-blue-100 text-blue-700', card: 'border-blue-200', header: 'bg-blue-600' },
  indigo: { node: 'bg-indigo-600 border-indigo-300', line: 'bg-indigo-200', badge: 'bg-indigo-100 text-indigo-700', card: 'border-indigo-200', header: 'bg-indigo-600' },
  purple: { node: 'bg-purple-600 border-purple-300', line: 'bg-purple-200', badge: 'bg-purple-100 text-purple-700', card: 'border-purple-200', header: 'bg-purple-600' },
  orange: { node: 'bg-orange-500 border-orange-300', line: 'bg-orange-200', badge: 'bg-orange-100 text-orange-700', card: 'border-orange-300', header: 'bg-orange-500' },
  teal: { node: 'bg-teal-600 border-teal-300', line: 'bg-teal-200', badge: 'bg-teal-100 text-teal-700', card: 'border-teal-200', header: 'bg-teal-600' },
  green: { node: 'bg-green-600 border-green-300', line: 'bg-green-200', badge: 'bg-green-100 text-green-700', card: 'border-green-200', header: 'bg-green-600' },
};

export default function Timeline() {
  const [expandedId, setExpandedId] = useState(4); // Voting day open by default

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl text-3xl mb-4 shadow-lg">
            📅
          </div>
          <h1 className="text-3xl font-black text-gray-800 mb-2">Election Timeline</h1>
          <p className="text-gray-500">The complete roadmap from announcement to results — tap each milestone to learn more.</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm">
          <span className="flex items-center gap-1.5 text-gray-500"><span className="w-3 h-3 bg-gray-400 rounded-full" /> Completed</span>
          <span className="flex items-center gap-1.5 text-orange-600 font-semibold"><span className="w-3 h-3 bg-orange-500 rounded-full timeline-active" /> Active / Current</span>
          <span className="flex items-center gap-1.5 text-gray-400"><span className="w-3 h-3 bg-gray-200 border-2 border-gray-300 rounded-full" /> Upcoming</span>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical gradient line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 via-orange-400 to-green-400 opacity-30" />

          <div className="space-y-4">
            {TIMELINE_EVENTS.map((event, idx) => {
              const colors = COLOR_MAP[event.color];
              const isExpanded = expandedId === event.id;
              const isDone = event.status === 'done';
              const isActive = event.status === 'active';
              const isUpcoming = event.status === 'upcoming';

              return (
                <div key={event.id} className="flex items-start gap-5 pl-2 animate-fade-in">
                  {/* Node */}
                  <div
                    className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl border-4 border-white shadow-lg transition-transform duration-300 ${
                      isDone ? 'bg-gray-400 opacity-70' :
                      isActive ? `${colors.node} timeline-active scale-110` :
                      'bg-gray-200 border-gray-300'
                    }`}
                  >
                    {event.icon}
                  </div>

                  {/* Card */}
                  <div
                    className={`flex-1 rounded-2xl border-2 overflow-hidden shadow-sm transition-all duration-300 cursor-pointer ${
                      isActive ? `${colors.card} shadow-lg` :
                      isDone ? 'border-gray-200 opacity-75' :
                      'border-gray-200'
                    }`}
                    onClick={() => setExpandedId(isExpanded ? null : event.id)}
                  >
                    {/* Card Header */}
                    <div className={`px-5 py-3.5 flex items-center justify-between ${isActive ? colors.header + ' text-white' : isDone ? 'bg-gray-100' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        <div>
                          <p className={`font-bold text-base ${isActive ? 'text-white' : 'text-gray-800'}`}>{event.title}</p>
                          <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-400'} font-medium`}>{event.date}</p>
                        </div>
                        {isActive && (
                          <span className="px-2 py-0.5 bg-white/20 text-white text-xs font-bold rounded-full">CURRENT</span>
                        )}
                        {isDone && (
                          <span className="px-2 py-0.5 bg-gray-200 text-gray-500 text-xs font-bold rounded-full">DONE</span>
                        )}
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                      ) : (
                        <ChevronDown size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                      )}
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="bg-white px-5 py-4 space-y-4 animate-fade-in">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase mb-1.5">What's Happening</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{event.what}</p>
                        </div>
                        <div className={`p-3 rounded-xl ${isDone ? 'bg-gray-50' : isActive ? 'bg-orange-50 border border-orange-200' : 'bg-blue-50 border border-blue-100'}`}>
                          <p className={`text-xs font-bold uppercase mb-1.5 ${isActive ? 'text-orange-600' : 'text-blue-600'}`}>👤 For Voters</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{event.voters}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 card-flat text-center">
          <p className="text-2xl mb-3">🗓️</p>
          <h3 className="font-bold text-gray-800 mb-1">Stay Updated</h3>
          <p className="text-sm text-gray-500 mb-4">Get real-time election schedules and updates directly from the source.</p>
          <a href="https://eci.gov.in" target="_blank" rel="noreferrer" className="btn-primary text-sm">
            Visit Election Commission ↗
          </a>
        </div>
      </div>
    </div>
  );
}
