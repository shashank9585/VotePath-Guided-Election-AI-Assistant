# VoteFlow AI 🗳️

> **Your Personal Election Companion** — An AI-powered guide to help Indian voters navigate elections, find their polling booth, and get instant answers.

Built for **H2C Hackathon 2025** | React + Vite + Tailwind CSS + Claude AI

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🧭 **Guided Journey** | 5-step interactive wizard from eligibility to post-voting |
| 📍 **Booth Finder** | Search by Voter ID, PIN code, or **registered elsewhere** scenario |
| 👥 **Candidates** | Browse candidates by constituency with party-colored cards |
| 📅 **Timeline** | Interactive election timeline with expandable milestones |
| 💬 **AI Chat** | Claude-powered assistant with 10 pre-loaded FAQ answers |

### ⭐ Key Differentiator: "Registered Elsewhere" Feature
Millions of students and working professionals are registered in one city but live in another. VoteFlow AI handles this with 3 clear options:
1. **Travel to Vote** — Plan your trip
2. **Transfer Registration** — Form 8 on voters.eci.gov.in
3. **Postal Ballot** — For eligible citizens

---

## 🛠️ Tech Stack

- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS v3
- **Routing:** React Router v6
- **Icons:** Lucide React
- **AI:** Anthropic Claude API (with offline fallback)
- **Data:** Local JSON mock database

---

## ⚙️ Setup & Running

### Prerequisites
- Node.js 18+
- npm 8+

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment (optional — app works without API key)
```bash
cp .env.example .env
# Edit .env and add your Anthropic API key
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### 4. Production build
```bash
npm run build
npm run preview
```

---

## 🐳 Docker

```bash
# Build image
docker build -t voteflow-ai .

# Run container
docker run -p 3000:3000 voteflow-ai

# With API key
docker run -p 3000:3000 -e VITE_ANTHROPIC_API_KEY=your_key voteflow-ai
```

Access at [http://localhost:3000](http://localhost:3000)

---

## 🎯 Demo Script (2 minutes)

1. **Home** (10s) — Show hero, quick action cards
2. **Guided Journey** (30s) — Step through eligibility → registration
3. **Booth Finder → "Registered Elsewhere" tab** (45s) ⭐ HERO MOMENT
   - Current: Bangalore | Registered: Mysore → Shows 127km + 3 options
4. **Chat Widget** (20s) — Ask "What is NOTA?" → Instant answer
5. **Timeline** (10s) — Show visual election roadmap

---

## 🔐 Demo Test Data

| Type | Value | Result |
|---|---|---|
| Voter ID | `KAR1234567` | Bangalore booth (HSR Layout) |
| Voter ID | `KAR7654321` | Mysore booth (MCC College) |
| PIN Code | `560102` | 3 Bangalore HSR booths |
| PIN Code | `570005` | 2 Mysore booths |
| Elsewhere | Bangalore → Mysore | 127km + 3 options card |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navigation.jsx     # Sticky nav with mobile menu
│   ├── Home.jsx           # Landing page with hero + cards
│   ├── GuidedJourney.jsx  # 5-step voting wizard
│   ├── BoothFinder.jsx    # Booth search + registered elsewhere
│   ├── Candidates.jsx     # Constituency candidate browser
│   ├── Timeline.jsx       # Interactive election timeline
│   └── ChatWidget.jsx     # Floating AI chat assistant
├── data/
│   ├── booths.json        # Mock polling booth database
│   ├── candidates.json    # Mock candidate database
│   └── faqs.json          # Pre-loaded chat responses
├── utils/
│   ├── distanceCalculator.js   # Haversine formula
│   └── apiHelper.js            # Claude API + validation + sanitization
├── App.jsx                # Router + layout
├── main.jsx               # React entry point
└── index.css              # Tailwind + custom animations
```

---

## 🔒 Security

- ✅ Input validation on all fields
- ✅ XSS sanitization on user inputs
- ✅ API key via environment variables (never hardcoded)
- ✅ Timeout handling on API calls (8 seconds)
- ✅ Rate limiting via debounce (300ms)
- ✅ Graceful fallback if API unavailable

---

## 🌐 Deployment

**Vercel / Netlify:**
```bash
npm run build
# Deploy the `dist/` folder
```

Add `VITE_ANTHROPIC_API_KEY` as an environment variable in your hosting dashboard.

---

*Making democracy accessible for every Indian voter. 🇮🇳*
