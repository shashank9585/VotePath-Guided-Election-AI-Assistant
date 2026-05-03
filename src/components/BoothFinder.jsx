import { useState } from 'react';
import { Search, MapPin, AlertTriangle, CheckCircle, ExternalLink, Navigation, Copy, Check } from 'lucide-react';
import boothsData from '../data/booths.json';
import { getCityDistance } from '../utils/distanceCalculator';
import { validateVoterId, validatePinCode, sanitizeInput } from '../utils/apiHelper';

const TABS = ['By Voter ID', 'By PIN / Location', '⭐ Registered Elsewhere'];

const CITY_BOOTHS = {
  '560102': [
    { boothName: 'Govt High School, HSR Layout', boothNumber: '145', address: 'Sector 7, HSR Layout, Bangalore - 560102', timings: '7:00 AM - 6:00 PM' },
    { boothName: 'St. Joseph\'s Community Hall', boothNumber: '146', address: 'Sector 8, HSR Layout, Bangalore - 560102', timings: '7:00 AM - 6:00 PM' },
    { boothName: 'BDA Complex Meeting Hall', boothNumber: '147', address: 'Sector 12, HSR Layout, Bangalore - 560102', timings: '7:00 AM - 6:00 PM' },
  ],
  '570005': [
    { boothName: 'MCC College Main Building', boothNumber: '078', address: 'JLB Road, Mysore - 570005', timings: '7:00 AM - 6:00 PM' },
    { boothName: 'Mysore Corporation Office', boothNumber: '079', address: 'Shivarampet, Mysore - 570005', timings: '7:00 AM - 6:00 PM' },
  ],
  '400028': [
    { boothName: 'Mumbai Municipal School', boothNumber: '232', address: 'Dadar West, Mumbai - 400028', timings: '7:00 AM - 6:00 PM' },
  ],
  '110092': [
    { boothName: 'Delhi Govt Boys School', boothNumber: '310', address: 'Preet Vihar, East Delhi - 110092', timings: '7:00 AM - 6:00 PM' },
  ],
};

function BoothResultCard({ booth, sameCity = true, copiedId, onCopy }) {
  return (
    <div className={`rounded-2xl border-2 overflow-hidden shadow-lg animate-fade-in ${sameCity ? 'border-green-200' : 'border-orange-200'}`}>
      <div className={`px-5 py-3 flex items-center gap-2 text-white font-bold ${sameCity ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-orange-500 to-amber-600'}`}>
        <MapPin size={18} />
        YOUR POLLING STATION
        <span className={`ml-auto text-xs px-2 py-1 rounded-full ${sameCity ? 'bg-green-400/30' : 'bg-orange-400/30'}`}>
          {sameCity ? '✓ Same City' : '⚠ Different City'}
        </span>
      </div>
      <div className="bg-white p-5 space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Booth Name</p>
            <p className="font-bold text-gray-800 mt-0.5">{booth.boothName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Booth Number</p>
            <p className="font-bold text-gray-800 mt-0.5">#{booth.boothNumber}</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Address</p>
          <p className="font-medium text-gray-700 mt-0.5">{booth.address}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">🕐 Timings</p>
          <p className="font-semibold text-blue-600 mt-0.5">{booth.timings}</p>
        </div>
        <div className="flex gap-3 pt-2">
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(booth.address)}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl font-semibold text-sm hover:bg-blue-100 transition-colors"
          >
            <Navigation size={15} /> View on Map
          </a>
          <button
            onClick={() => onCopy(booth.address)}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors"
          >
            {copiedId === booth.address ? <Check size={15} className="text-green-600" /> : <Copy size={15} />}
            {copiedId === booth.address ? 'Copied!' : 'Copy Address'}
          </button>
        </div>
      </div>
    </div>
  );
}

function RegisteredElsewhereCard({ currentCity, registeredCity, distance }) {
  return (
    <div className="rounded-2xl border-2 border-orange-300 overflow-hidden shadow-xl animate-fade-in">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-5 py-3 text-white">
        <div className="flex items-center gap-2 font-bold text-lg">
          <AlertTriangle size={22} /> IMPORTANT NOTICE
        </div>
      </div>
      <div className="bg-white p-5">
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="p-4 bg-red-50 rounded-xl border border-red-100">
            <p className="text-xs text-gray-400 font-semibold uppercase">Registered Booth In</p>
            <p className="font-bold text-gray-800 mt-1">📍 {registeredCity}</p>
            <p className="text-sm text-orange-600 font-semibold">{distance} km away</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-gray-400 font-semibold uppercase">You Currently Live In</p>
            <p className="font-bold text-gray-800 mt-1">📍 {currentCity}</p>
          </div>
        </div>

        <h3 className="font-bold text-gray-800 mb-4 text-lg">Your Options:</h3>
        <div className="space-y-4">
          {/* Option 1 */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-2 font-bold text-blue-700 mb-2">
              <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
              Travel to Vote
            </div>
            <ul className="text-sm text-gray-600 space-y-1 ml-9">
              <li>• Plan a trip to {registeredCity} on voting day</li>
              <li>• Many political parties offer free transport</li>
              <li>• Trains and buses are often crowded — book early</li>
            </ul>
          </div>

          {/* Option 2 */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
            <div className="flex items-center gap-2 font-bold text-purple-700 mb-2">
              <span className="w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
              Transfer Your Registration
            </div>
            <ul className="text-sm text-gray-600 space-y-1 ml-9">
              <li>• Apply online at <a href="https://voters.eci.gov.in" target="_blank" rel="noreferrer" className="text-purple-600 font-semibold underline">voters.eci.gov.in</a></li>
              <li>• Fill Form 8 (Change of Address)</li>
              <li>• Takes 2–4 weeks to process</li>
              <li>• Must apply 30 days before election deadline</li>
            </ul>
            <a
              href="https://voters.eci.gov.in"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-purple-600 hover:underline"
            >
              Start Transfer Process <ExternalLink size={13} />
            </a>
          </div>

          {/* Option 3 */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2 font-bold text-green-700 mb-2">
              <span className="w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
              Postal Ballot
            </div>
            <ul className="text-sm text-gray-600 space-y-1 ml-9">
              <li>• Only for: Govt employees, Armed forces, Persons with Disabilities (40%+)</li>
              <li>• Senior citizens above 85 years (some states)</li>
              <li>• Apply via Form 12D to your Returning Officer</li>
            </ul>
            <a
              href="https://eci.gov.in/postal-ballot/"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-green-600 hover:underline"
            >
              Check Eligibility <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BoothFinder() {
  const [activeTab, setActiveTab] = useState(0);
  const [voterId, setVoterId] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [currentCity, setCurrentCity] = useState('Bangalore');
  const [registeredCity, setRegisteredCity] = useState('Mysore');
  const [result, setResult] = useState(null);
  const [pinResults, setPinResults] = useState(null);
  const [elsewhereResult, setElsewhereResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const searchByVoterId = () => {
    setError('');
    setResult(null);
    const clean = sanitizeInput(voterId).toUpperCase();
    if (!clean) { setError('Please enter your Voter ID number.'); return; }
    if (clean.length < 6 || clean.length > 12) { setError('Voter ID should be 6–12 characters.'); return; }

    setLoading(true);
    setTimeout(() => {
      const booth = boothsData.find(b => b.voterId.toUpperCase() === clean);
      if (booth) setResult(booth);
      else setError('No booth found for this Voter ID. Try "KAR1234567" or "KAR7654321" for demo.');
      setLoading(false);
    }, 800);
  };

  const searchByPin = () => {
    setError('');
    setPinResults(null);
    const clean = sanitizeInput(pinCode);
    if (!clean) { setError('Please enter a PIN code or address.'); return; }
    if (!/^\d+$/.test(clean) || clean.length !== 6) { setError('Please enter a valid 6-digit PIN code.'); return; }

    setLoading(true);
    setTimeout(() => {
      const booths = CITY_BOOTHS[clean];
      if (booths && booths.length > 0) setPinResults(booths);
      else setError('No booths found for this PIN. Try 560102 (Bangalore) or 570005 (Mysore).');
      setLoading(false);
    }, 800);
  };

  const searchElsewhere = () => {
    setError('');
    setElsewhereResult(null);
    if (!currentCity.trim() || !registeredCity.trim()) { setError('Please fill in both cities.'); return; }

    setLoading(true);
    setTimeout(() => {
      const distance = getCityDistance(currentCity, registeredCity) || 127;
      setElsewhereResult({ currentCity, registeredCity, distance });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl text-3xl mb-4 shadow-lg">
            📍
          </div>
          <h1 className="text-3xl font-black text-gray-800 mb-2">Find Your Polling Booth</h1>
          <p className="text-gray-500">Search by Voter ID, PIN code, or use our special tool for out-of-city voters</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-2xl shadow-sm border border-gray-200 p-1.5 mb-8 gap-1">
          {TABS.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => { setActiveTab(idx); setError(''); setResult(null); setPinResults(null); setElsewhereResult(null); }}
              className={`flex-1 py-3 px-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === idx
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab 1: By Voter ID */}
        {activeTab === 0 && (
          <div className="card-flat space-y-5 animate-fade-in">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter Your Voter ID (EPIC Number)
              </label>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={voterId}
                  onChange={e => setVoterId(e.target.value.toUpperCase().slice(0, 12))}
                  onKeyDown={e => e.key === 'Enter' && searchByVoterId()}
                  placeholder="e.g. KAR1234567"
                  className="input-field pl-11 uppercase tracking-widest font-mono"
                  maxLength={12}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Demo IDs: <span className="font-mono text-blue-600 cursor-pointer" onClick={() => setVoterId('KAR1234567')}>KAR1234567</span> (Bangalore) · <span className="font-mono text-blue-600 cursor-pointer" onClick={() => setVoterId('KAR7654321')}>KAR7654321</span> (Mysore)</p>
            </div>

            {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

            <button onClick={searchByVoterId} disabled={loading} className="btn-primary w-full">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Searching...</>
              ) : (
                <><Search size={18} /> Search Booth</>
              )}
            </button>

            {result && (
              <BoothResultCard
                booth={result}
                sameCity={result.city?.toLowerCase() !== 'mysore'}
                copiedId={copiedId}
                onCopy={handleCopy}
              />
            )}
          </div>
        )}

        {/* Tab 2: By PIN */}
        {activeTab === 1 && (
          <div className="card-flat space-y-5 animate-fade-in">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter PIN Code
              </label>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={pinCode}
                  onChange={e => setPinCode(e.target.value.replace(/\D/, '').slice(0, 6))}
                  onKeyDown={e => e.key === 'Enter' && searchByPin()}
                  placeholder="e.g. 560102"
                  className="input-field pl-11 font-mono tracking-widest"
                  maxLength={6}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Demo PINs: <span className="font-mono text-blue-600 cursor-pointer" onClick={() => setPinCode('560102')}>560102</span> (Bangalore HSR) · <span className="font-mono text-blue-600 cursor-pointer" onClick={() => setPinCode('570005')}>570005</span> (Mysore)</p>
            </div>

            {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

            <button onClick={searchByPin} disabled={loading} className="btn-primary w-full">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Searching...</>
              ) : (
                <><Search size={18} /> Find Booths in Area</>
              )}
            </button>

            {pinResults && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-sm font-semibold text-gray-500">{pinResults.length} polling station(s) found in this area:</p>
                {pinResults.map((booth, idx) => (
                  <BoothResultCard key={idx} booth={booth} copiedId={copiedId} onCopy={handleCopy} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Registered Elsewhere — HERO FEATURE */}
        {activeTab === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="card-flat border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
              <div className="flex items-start gap-3 mb-6">
                <div className="text-3xl">🏙️</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Living Away From Registered Address?</h2>
                  <p className="text-gray-600 text-sm mt-1">Many students and working professionals face this. We'll help you navigate your options.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Where do you currently live? <span className="text-orange-500">*</span></label>
                  <select
                    value={currentCity}
                    onChange={e => setCurrentCity(e.target.value)}
                    className="input-field"
                  >
                    {['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Mysore'].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Where are you registered to vote? <span className="text-orange-500">*</span></label>
                  <select
                    value={registeredCity}
                    onChange={e => setRegisteredCity(e.target.value)}
                    className="input-field"
                  >
                    {['Mysore', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

                <button onClick={searchElsewhere} disabled={loading || currentCity === registeredCity} className="btn-primary w-full">
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Calculating...</>
                  ) : currentCity === registeredCity ? (
                    <><CheckCircle size={18} /> Same City — No Issue!</>
                  ) : (
                    <><MapPin size={18} /> Find My Options</>
                  )}
                </button>

                {currentCity === registeredCity && (
                  <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl animate-fade-in">
                    <div className="flex items-center gap-2 text-green-700 font-bold">
                      <CheckCircle size={20} /> Great news! You live and are registered in the same city.
                    </div>
                    <p className="text-sm text-green-600 mt-1">Use the "By Voter ID" tab to find your exact polling booth.</p>
                  </div>
                )}
              </div>
            </div>

            {elsewhereResult && (
              <RegisteredElsewhereCard
                currentCity={elsewhereResult.currentCity}
                registeredCity={elsewhereResult.registeredCity}
                distance={elsewhereResult.distance}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
