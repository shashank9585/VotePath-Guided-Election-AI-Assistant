import { useState } from 'react';
import candidatesData from '../data/candidates.json';

const CONSTITUENCIES = Object.keys(candidatesData);

const PARTY_COLORS = {
  BJP: { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-700', badge: 'bg-orange-500' },
  INC: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700', badge: 'bg-blue-600' },
  AAP: { bg: 'bg-cyan-100', border: 'border-cyan-300', text: 'text-cyan-700', badge: 'bg-cyan-600' },
  'JD(S)': { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700', badge: 'bg-green-600' },
  'Shiv Sena': { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-700', badge: 'bg-yellow-500' },
  Independent: { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-700', badge: 'bg-purple-600' },
};

function CandidateCard({ candidate }) {
  const colors = PARTY_COLORS[candidate.party] || PARTY_COLORS.Independent;

  return (
    <div className={`rounded-2xl border-2 ${colors.border} ${colors.bg} overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}>
      {/* Avatar */}
      <div className="flex flex-col items-center pt-8 pb-4 px-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-lg mb-3"
          style={{ backgroundColor: candidate.color }}
        >
          {candidate.initials}
        </div>
        <h3 className="font-bold text-gray-800 text-center text-lg leading-tight">{candidate.name}</h3>
        <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-bold ${colors.badge}`}>
          <span>{candidate.symbol}</span>
          {candidate.party}
        </div>
      </div>

      {/* Details */}
      <div className="bg-white/70 backdrop-blur-sm px-4 py-3 grid grid-cols-2 gap-3 text-center">
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase">Age</p>
          <p className="font-bold text-gray-800">{candidate.age} yrs</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase">Education</p>
          <p className="font-bold text-gray-800 text-sm">{candidate.education}</p>
        </div>
      </div>

      <div className="px-4 pb-4 pt-2 bg-white/70">
        <button className={`w-full py-2.5 rounded-xl text-sm font-semibold ${colors.text} border-2 ${colors.border} hover:opacity-80 transition-opacity`}>
          View Profile
        </button>
      </div>
    </div>
  );
}

export default function Candidates() {
  const [selectedConstituency, setSelectedConstituency] = useState(CONSTITUENCIES[0]);

  const candidates = candidatesData[selectedConstituency] || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-3xl mb-4 shadow-lg">
            👥
          </div>
          <h1 className="text-3xl font-black text-gray-800 mb-2">Know Your Candidates</h1>
          <p className="text-gray-500">Learn about candidates standing in your constituency</p>
        </div>

        {/* Constituency Selector */}
        <div className="card-flat mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Select Your Constituency</label>
          <div className="flex flex-wrap gap-2">
            {CONSTITUENCIES.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedConstituency(c)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                  selectedConstituency === c
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Constituency Stats */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{selectedConstituency} Constituency</h2>
            <p className="text-gray-500 text-sm mt-1">{candidates.length} candidates in the running</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {candidates.map(c => {
              const colors = PARTY_COLORS[c.party] || PARTY_COLORS.Independent;
              return (
                <span key={c.id} className={`badge ${colors.bg} ${colors.text} ${colors.border} border`}>
                  {c.symbol} {c.party}
                </span>
              );
            })}
          </div>
        </div>

        {/* Candidate Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-10 p-5 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
          <div className="text-3xl">ℹ️</div>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-bold text-gray-800 mb-1">Research Before You Vote</p>
            <p className="text-sm text-gray-600">Check candidates' backgrounds, track records, and manifestos on the official Election Commission Affidavit Portal.</p>
          </div>
          <a
            href="https://affidavit.eci.gov.in"
            target="_blank"
            rel="noreferrer"
            className="btn-primary text-sm whitespace-nowrap flex-shrink-0"
          >
            View Affidavits ↗
          </a>
        </div>
      </div>
    </div>
  );
}
