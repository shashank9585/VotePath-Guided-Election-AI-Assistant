import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Home,
} from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Eligibility', icon: '✅' },
  { id: 2, label: 'Registration', icon: '📋' },
  { id: 3, label: 'Find Booth', icon: '📍' },
  { id: 4, label: 'Voting Day', icon: '🗓️' },
  { id: 5, label: 'After Voting', icon: '🎉' },
];

function OptionButton({ label, selected, onClick, variant = 'default' }) {
  const variants = {
    default: selected
      ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50',
    yes: selected
      ? 'bg-green-500 text-white border-green-500 shadow-lg'
      : 'bg-white text-gray-700 border-gray-200 hover:border-green-400 hover:bg-green-50',
    no: selected
      ? 'bg-red-500 text-white border-red-500 shadow-lg'
      : 'bg-white text-gray-700 border-gray-200 hover:border-red-400 hover:bg-red-50',
  };
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-200 hover:-translate-y-0.5 ${variants[variant]}`}
    >
      {label}
    </button>
  );
}

function Step1({ answers, setAnswers }) {
  const eligible = answers.age === 'yes' && answers.citizen === 'yes';
  const ineligible = answers.age === 'no' || answers.citizen === 'no';

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Are You Eligible to Vote?</h2>
        <p className="text-gray-500">Let's quickly check if you meet the basic criteria.</p>
      </div>

      <div className="space-y-6">
        <div className="card-flat">
          <p className="font-semibold text-gray-700 mb-4">Are you 18 years or older?</p>
          <div className="flex gap-3">
            <OptionButton label="✓ Yes" selected={answers.age === 'yes'} onClick={() => setAnswers(p => ({ ...p, age: 'yes' }))} variant="yes" />
            <OptionButton label="✗ No" selected={answers.age === 'no'} onClick={() => setAnswers(p => ({ ...p, age: 'no' }))} variant="no" />
          </div>
        </div>

        <div className="card-flat">
          <p className="font-semibold text-gray-700 mb-4">Are you an Indian citizen?</p>
          <div className="flex gap-3">
            <OptionButton label="✓ Yes" selected={answers.citizen === 'yes'} onClick={() => setAnswers(p => ({ ...p, citizen: 'yes' }))} variant="yes" />
            <OptionButton label="✗ No" selected={answers.citizen === 'no'} onClick={() => setAnswers(p => ({ ...p, citizen: 'no' }))} variant="no" />
          </div>
        </div>
      </div>

      {eligible && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-2xl text-green-700 animate-fade-in">
          <CheckCircle size={24} className="flex-shrink-0" />
          <div>
            <p className="font-bold">You're eligible to vote!</p>
            <p className="text-sm text-green-600">Great — let's check your registration status next.</p>
          </div>
        </div>
      )}
      {ineligible && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 animate-fade-in">
          <XCircle size={24} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">You need to meet these criteria to vote.</p>
            <ul className="text-sm text-red-600 mt-1 space-y-1">
              <li>• Minimum age: 18 years (as on January 1st of revision year)</li>
              <li>• Must be an Indian citizen</li>
              <li>• Must be ordinarily resident at registered address</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function Step2({ answers, setAnswers }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Are You Registered?</h2>
        <p className="text-gray-500">Check your voter registration status.</p>
      </div>

      <div className="card-flat">
        <p className="font-semibold text-gray-700 mb-5">Do you have a Voter ID card?</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <OptionButton label="✓ Yes, I'm Registered" selected={answers.registered === 'yes'} onClick={() => setAnswers(p => ({ ...p, registered: 'yes' }))} variant="yes" />
          <OptionButton label="✗ No, Need to Register" selected={answers.registered === 'no'} onClick={() => setAnswers(p => ({ ...p, registered: 'no' }))} />
          <OptionButton label="🤔 Don't Know" selected={answers.registered === 'unknown'} onClick={() => setAnswers(p => ({ ...p, registered: 'unknown' }))} />
        </div>
      </div>

      {answers.registered === 'yes' && (
        <div className="p-5 bg-green-50 border-2 border-green-200 rounded-2xl animate-fade-in">
          <div className="flex items-center gap-2 text-green-700 font-bold mb-2">
            <CheckCircle size={20} /> Perfect! Let's find your polling booth.
          </div>
          <p className="text-green-600 text-sm">You're all set. Move to the next step to locate your booth.</p>
        </div>
      )}

      {answers.registered === 'no' && (
        <div className="p-5 bg-blue-50 border-2 border-blue-200 rounded-2xl space-y-4 animate-fade-in">
          <p className="font-bold text-blue-700 flex items-center gap-2"><AlertCircle size={20} /> How to Register Online</p>
          <ol className="space-y-3 text-sm text-gray-700">
            {[
              { step: '1', text: 'Visit', link: 'https://voters.eci.gov.in', label: 'voters.eci.gov.in' },
              { step: '2', text: 'Fill Form 6 (New Voter Registration)', link: null },
              { step: '3', text: 'Upload: Aadhaar card + proof of residence', link: null },
              { step: '4', text: 'Submit and track your application status', link: null },
            ].map(({ step, text, link, label }) => (
              <li key={step} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">{step}</span>
                <span className="pt-1">
                  {text}{' '}
                  {link && <a href={link} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold underline inline-flex items-center gap-1">{label} <ExternalLink size={12} /></a>}
                </span>
              </li>
            ))}
          </ol>
          <p className="text-xs text-gray-500 bg-white rounded-xl p-3 border border-blue-100">⏳ Registration takes 2–4 weeks. Apply before the election deadline!</p>
        </div>
      )}

      {answers.registered === 'unknown' && (
        <div className="p-5 bg-amber-50 border-2 border-amber-200 rounded-2xl animate-fade-in">
          <p className="font-bold text-amber-700 mb-2">Check Your Registration Status</p>
          <p className="text-sm text-gray-600 mb-4">Visit the official portal to search for your name in the electoral roll:</p>
          <a
            href="https://electoralsearch.eci.gov.in"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 btn-primary text-sm"
          >
            electoralsearch.eci.gov.in <ExternalLink size={14} />
          </a>
        </div>
      )}
    </div>
  );
}

function Step3({ onFindBooth }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Where Do You Vote?</h2>
        <p className="text-gray-500">Find your exact polling station.</p>
      </div>

      <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl text-center">
        <div className="text-5xl mb-4">📍</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Find My Polling Station</h3>
        <p className="text-gray-500 text-sm mb-6">Search by Voter ID, PIN code, or address</p>
        <button onClick={onFindBooth} className="btn-primary">
          Open Booth Finder <ChevronRight size={18} />
        </button>
      </div>

      <div className="p-5 bg-amber-50 border-2 border-amber-200 rounded-2xl">
        <div className="flex items-start gap-3">
          <AlertCircle size={22} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-700 mb-1">Important Rule</p>
            <p className="text-sm text-gray-700">You must vote at your <strong>registered</strong> polling station, not where you currently live. If you've moved cities, check the "Registered Elsewhere" tab in the Booth Finder.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
          <p className="font-semibold text-green-700 mb-1">✅ Same city as registration</p>
          <p className="text-sm text-gray-600">Great! Simply find your booth by address or Voter ID.</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
          <p className="font-semibold text-orange-700 mb-1">⚠️ Registered in another city</p>
          <p className="text-sm text-gray-600">Use our special guide for options: travel, transfer, or postal ballot.</p>
        </div>
      </div>
    </div>
  );
}

function Step4() {
  const checklist = [
    {
      title: 'Documents to Bring',
      color: 'blue',
      items: [
        'Voter ID card (EPIC)',
        'OR: Aadhaar, Passport, Driving License, PAN Card',
        'OR: Bank passbook with photo, MNREGA job card',
      ],
    },
    {
      title: 'Timing',
      color: 'green',
      items: ['Polls open: 7:00 AM', 'Polls close: 6:00 PM', 'Arrive early to avoid queues'],
    },
    {
      title: "What to Expect",
      color: 'purple',
      items: ['Queue at the polling station', 'ID verification by officials', 'Ink mark on your left index finger', 'Simple button press on EVM'],
    },
    {
      title: "Don't Bring",
      color: 'red',
      items: ['Mobile phones (not allowed inside booth)', 'Cameras or recording devices', 'Party symbols or political material', 'Large bags'],
    },
  ];

  const colors = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', title: 'text-blue-700', dot: 'bg-blue-500' },
    green: { bg: 'bg-green-50', border: 'border-green-200', title: 'text-green-700', dot: 'bg-green-500' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', title: 'text-purple-700', dot: 'bg-purple-500' },
    red: { bg: 'bg-red-50', border: 'border-red-200', title: 'text-red-700', dot: 'bg-red-400' },
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">What to Bring & Expect</h2>
        <p className="text-gray-500">Be fully prepared for Election Day.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {checklist.map(({ title, color, items }) => {
          const c = colors[color];
          return (
            <div key={title} className={`p-5 ${c.bg} border-2 ${c.border} rounded-2xl`}>
              <h3 className={`font-bold ${c.title} mb-3`}>{title}</h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className={`flex-shrink-0 w-2 h-2 ${c.dot} rounded-full mt-1.5`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* EVM Explainer */}
      <div className="card-flat">
        <h3 className="font-bold text-gray-800 mb-4">⚡ How to Use the EVM</h3>
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div className="flex-shrink-0 w-32 h-48 bg-gray-800 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-xl">
            <div className="text-gray-400 text-xs font-bold mb-2">EVM BALLOT UNIT</div>
            {['🪷 BJP', '✋ INC', '🧹 AAP', '🚲 IND'].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-1 w-24">
                <div className="w-3 h-3 rounded-full bg-blue-400 border-2 border-gray-500 flex-shrink-0" />
                <span className="text-white text-xs">{item}</span>
              </div>
            ))}
            <div className="mt-2 text-green-400 text-xs">✓ NOTA</div>
          </div>
          <div className="flex-1 space-y-3">
            {[
              { step: '1', text: 'Enter the voting booth (curtained area)' },
              { step: '2', text: 'Find your preferred candidate on the Ballot Unit' },
              { step: '3', text: 'Press the blue button next to their name and symbol' },
              { step: '4', text: 'A beep confirms your vote. Red light glows briefly.' },
              { step: '5', text: 'VVPAT printer shows a slip for 7 seconds — verify it' },
              { step: '6', text: 'Exit the booth. Your vote is cast!' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">{step}</span>
                <p className="text-sm text-gray-700 pt-1">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step5({ onFinish }) {
  const timeline = [
    { time: '6:00 PM', event: 'Polls Close', desc: 'Voting ends. EVMs are sealed and secured by officials.', icon: '🔒', color: 'blue' },
    { time: 'Same Night', event: 'Secure Transport', desc: 'EVMs transported to strong rooms under security.', icon: '🚌', color: 'purple' },
    { time: 'Counting Day', event: 'Vote Counting', desc: 'Votes counted under supervision of election officials.', icon: '🗓️', color: 'orange' },
    { time: 'Same Morning', event: 'Counting Begins', desc: 'Postal ballots counted first, EVM counting starts at 8 AM.', icon: '📊', color: 'yellow' },
    { time: 'By Evening', event: 'Results Declared', desc: 'Winners announced constituency by constituency.', icon: '🏆', color: 'green' },
    { time: 'Within Days', event: 'Government Formed', desc: 'Majority party/alliance forms government. Oath ceremony held.', icon: '🤝', color: 'emerald' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">What Happens Next?</h2>
        <p className="text-gray-500">Here's what happens after you cast your vote.</p>
      </div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-green-400" />
        <div className="space-y-6">
          {timeline.map(({ time, event, desc, icon }, idx) => (
            <div key={idx} className="flex items-start gap-5 pl-4">
              <div className="relative z-10 w-8 h-8 bg-white border-2 border-blue-400 rounded-full flex items-center justify-center text-lg flex-shrink-0 shadow-md">
                {icon}
              </div>
              <div className="flex-1 card-flat !p-4 !hover:shadow-md">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-bold text-gray-800">{event}</p>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium whitespace-nowrap">{time}</span>
                </div>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl">
        <div className="flex items-start gap-3">
          <CheckCircle size={22} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-gray-800 mb-1">Your vote is secret and secure</p>
            <p className="text-sm text-gray-600">No one — not even election officials — can track how you voted. The EVM is tamper-proof and your choice is completely private.</p>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">You're Ready to Vote!</h3>
        <p className="text-gray-500 text-sm mb-6">Congratulations on completing the Voting Guide. You now know everything you need.</p>
        <button onClick={onFinish} className="btn-primary">
          <Home size={18} /> Back to Home
        </button>
      </div>
    </div>
  );
}

export default function GuidedJourney() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Answers, setStep1Answers] = useState({ age: null, citizen: null });
  const [step2Answers, setStep2Answers] = useState({ registered: null });

  const canProceed = () => {
    if (currentStep === 1) return step1Answers.age === 'yes' && step1Answers.citizen === 'yes';
    if (currentStep === 2) return step2Answers.registered !== null;
    return true;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1 answers={step1Answers} setAnswers={setStep1Answers} />;
      case 2: return <Step2 answers={step2Answers} setAnswers={setStep2Answers} />;
      case 3: return <Step3 onFindBooth={() => navigate('/booth')} />;
      case 4: return <Step4 />;
      case 5: return <Step5 onFinish={() => navigate('/')} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold text-gray-800">Voting Guide</h1>
            <span className="text-sm text-gray-500 font-medium">Step {currentStep} of {STEPS.length}</span>
          </div>

          {/* Step labels */}
          <div className="flex items-center gap-1 mb-3">
            {STEPS.map((step, idx) => (
              <div
                key={step.id}
                className="flex items-center gap-1 flex-1"
              >
                <button
                  onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-base transition-all duration-300 ${
                    step.id < currentStep
                      ? 'bg-blue-600 cursor-pointer hover:bg-blue-700 shadow-lg'
                      : step.id === currentStep
                      ? 'bg-blue-600 shadow-lg scale-110'
                      : 'bg-gray-200 cursor-default'
                  }`}
                  title={step.label}
                >
                  {step.id < currentStep ? (
                    <CheckCircle size={16} className="text-white" />
                  ) : (
                    <span className={`text-sm ${step.id <= currentStep ? 'text-white' : 'text-gray-400'}`}>{step.icon}</span>
                  )}
                </button>
                {idx < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${step.id < currentStep ? 'bg-blue-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>

          <div className="flex justify-between mt-2">
            {STEPS.map((step) => (
              <span
                key={step.id}
                className={`text-xs font-medium transition-colors ${step.id === currentStep ? 'text-blue-600' : 'text-gray-400'}`}
              >
                {step.label}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="card-flat min-h-96">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
              disabled={currentStep === 1}
              className="inline-flex items-center gap-2 px-5 py-3 text-gray-600 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft size={18} /> Previous
            </button>
            <button
              onClick={() => setCurrentStep(s => Math.min(STEPS.length, s + 1))}
              disabled={!canProceed()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all duration-200"
            >
              {currentStep === 4 ? 'See Results' : 'Next'} <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
