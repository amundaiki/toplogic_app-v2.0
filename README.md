# 🏢 TopLogic AI-Apper - Forretningsverktøy Suite

En samling av webbaserte AI-drevne forretningsapplikasjoner for å automatisere og effektivisere daglige arbeidsoppgaver. Med integrert Claude AI backend via async API for fakturaekstraksjon, dokumentanalyse og mer.

## 🚀 Live Demo

**Frontend:** [https://toplogic.aiki.as](https://toplogic.aiki.as)
**Backend API:** Deployed på Railway (async Claude processing)

## 📋 Applikasjoner

### 📄 PDF Faktura til EXCEL (Produksjon)
**Mappe:** `src/apps/faktura-opplaster/`
- **Formål:** AI-drevet konvertering av PDF-fakturaer til strukturert Excel-format
- **Funksjoner:**
  - Multi-fil batch upload (drag & drop)
  - Automatisk 133+ felt ekstraksjon via Claude 3.5 Sonnet
  - Real-time status tracking per faktura
  - Smart batch-prosessering (sortert etter filstørrelse)
  - Google Sheet auto-generering
  - Excel sendt på e-post til riktig bruker
- **Bruksområde:** Økonomi- og regnskapsavdelinger (Janne, Peter, etc.)
- **Arkitektur:** Frontend → Make.com → Railway (Claude API) → Make.com → Excel/Email

### 📊 Prislister til EXCEL
**Mappe:** `src/apps/prisliste-app/`
- **Formål:** Konvertering av prislister til strukturert Excel-format
- **Status:** Integrert med samme backend-arkitektur

## 🏗️ Arkitektur

### **Hybrid System:**
```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐      ┌──────────────┐
│   Frontend  │─────>│  Make.com    │─────>│   Railway   │─────>│  Make.com    │
│  (Static)   │      │  (Webhook)   │      │  (Claude)   │      │  (Excel)     │
└─────────────┘      └──────────────┘      └─────────────┘      └──────────────┘
      │                                            │
      │              Polling for status            │
      └───────────────────────────────────────────┘
```

### **To deployment-modeller:**

#### **Model 1: Frontend Only (GitHub Pages)**
- Statiske HTML/CSS/JS filer
- Direkte Make.com webhooks fra frontend
- Enkel, rask, gratis
- Brukes for: Prisliste-app, andre enkle apper

#### **Model 2: Frontend + Backend (Railway)**
- Frontend: Statisk på GitHub Pages
- Backend: Node.js/Express på Railway
- Claude API integration i backend
- Async processing med status polling
- Brukes for: Faktura-opplaster (kompleks AI-prosessering)

---

## 🛠️ Teknologi Stack

### Frontend
- **HTML5** - Semantisk markup
- **CSS3** - Modular design system med CSS custom properties
- **Vanilla JavaScript (ES6+)** - Ingen frameworks
- **Lucide Icons** - Moderne ikoner
- **Modulær arkitektur** - Delte komponenter (`src/components/`, `src/utils/`)

### Backend (Railway)
- **Node.js 18+** - Runtime
- **Express.js** - Web framework
- **Anthropic SDK** - Claude API integration
- **Winston** - Structured logging
- **Helmet** - Security middleware
- **CORS** - Cross-origin request handling
- **Rate limiting** - API protection

### Infrastructure
- **Docker** - Containerisering for Railway
- **Railway.app** - Backend hosting + CI/CD
- **GitHub Pages** - Frontend hosting (static)
- **Make.com** - Workflow orchestration + Excel generation

### AI & Processing
- **Claude 3.5 Sonnet** - PDF analyse og dataekstraksjon
- **Make.com** - OCR, filhåndtering, Excel-generering, e-post
- **Async architecture** - Non-blocking request/response med polling

---

## 📁 Prosjektstruktur

```
toplogic/
├── 📄 README.md                      # Denne filen
├── 📄 package.json                   # Node.js dependencies
├── 🐳 Dockerfile                     # Railway deployment config
├── 🔐 .env.example                   # Environment variables template
├── 🏠 index.html                     # Hovedside (app-navigasjon)
│
├── 📁 src/
│   ├── 🚀 server.js                  # Express backend (Railway)
│   ├── 📄 index.js                   # Frontend entry point
│   ├── 📄 legacy.js                  # Legacy compatibility
│   │
│   ├── 📁 apps/
│   │   ├── faktura-opplaster/
│   │   │   ├── index.html            # Faktura upload UI
│   │   │   ├── PROMPTS/              # Claude prompts per leverandør
│   │   │   └── blueprint             # Make.com scenario backup
│   │   └── prisliste-app/
│   │       └── index.html
│   │
│   ├── 📁 components/
│   │   ├── toplogic-app.js           # Main app class (file upload, forms, etc.)
│   │   └── password-manager.js       # App locking system
│   │
│   ├── 📁 config/
│   │   ├── index.js                  # Config aggregator
│   │   ├── app.js                    # App settings (users, suppliers, etc.)
│   │   ├── webhooks.js               # Make.com webhook URLs
│   │   ├── branding.js               # Logos, colors
│   │   └── environment.js            # Environment detection
│   │
│   ├── 📁 routes/
│   │   ├── claudeRoutes.js           # /api/process, /api/status
│   │   └── healthRoutes.js           # /health endpoint
│   │
│   ├── 📁 services/
│   │   ├── claudeService.js          # Claude API wrapper
│   │   └── webhookService.js         # Make.com webhook caller
│   │
│   ├── 📁 middleware/
│   │   ├── auth.js                   # API key authentication
│   │   ├── errorHandler.js           # Global error handling
│   │   └── rateLimiter.js            # Rate limiting
│   │
│   ├── 📁 utils/
│   │   ├── logger.js                 # Winston logger
│   │   ├── requestTracker.js         # Request state management
│   │   ├── toplogic-utils.js         # Helper functions
│   │   └── config-helpers.js         # Config validation
│   │
│   └── 📁 styles/
│       ├── shared.css                # Global styles
│       ├── advanced-paths.css        # Animations
│       └── micro-interactions.css    # UI feedback
│
├── 📁 docs/
│   ├── CLAUDE_API_README.md          # Backend API documentation
│   ├── MAKE_SCENARIO_GUIDE.md        # Make.com setup guide
│   └── CHANGELOG.md                  # Version history
│
├── 📁 test/
│   ├── test-frontend.html            # Frontend testing
│   ├── test-faktura-prompt.json      # Prompt examples
│   └── example-133-fields-full.json  # Expected output format
│
├── 📁 blueprints/
│   ├── Toplogic faktura 1.blueprint.json  # Make.com scenario v1
│   └── Toplogic faktura 2.blueprint.json  # Make.com scenario v2
│
└── 📁 archive/
    └── (gamle filer, legacy code)
```

---

## ⚙️ Konfigurasjon

### 🔗 Webhook URLs

**Fil:** `src/config/webhooks.js`

```javascript
export const WEBHOOKS = {
    faktura: 'https://hook.eu2.make.com/YOUR_WEBHOOK_HERE',
    prisliste_bring_transport: 'https://hook.eu2.make.com/YOUR_WEBHOOK_HERE',
    // ... flere webhooks
};
```

**Slik oppdaterer du:**
1. Åpne `src/config/webhooks.js`
2. Erstatt `YOUR_WEBHOOK_HERE` med Make.com webhook URL
3. Commit og push til GitHub
4. Railway rebuilder automatisk (hvis backend)

### 👥 Brukere og Leverandører

**Fil:** `src/config/app.js`

```javascript
export const APP_CONFIG = {
    users: [
        { value: 'janne', label: 'Janne Langås' },
        { value: 'peter', label: 'Peter Nygård' },
        // Legg til flere brukere her
    ],

    suppliers: [
        'Freja', 'FedEx', 'Samtransport', 'NTG Road',
        'Sendify', 'MaserFrakt'
        // Legg til flere leverandører her
    ]
};
```

### 🎨 Branding

**Fil:** `src/config/branding.js`

```javascript
export const BRANDING = {
    logos: {
        toplogic: 'https://www.toplogic.no/.../logo.svg',
        aiki: 'https://images.squarespace-cdn.com/.../logo.png'
    },

    colors: {
        primary: '#c72027',      // TopLogic rød
        secondary: '#3b82f6',    // Blå for AI-apper
    }
};
```

---

## 🚀 Deployment

### **Frontend (GitHub Pages)**

#### Automatisk via GitHub Actions:
```bash
git add .
git commit -m "Update frontend"
git push origin main
```
GitHub Pages deployer automatisk til: `https://toplogic.aiki.as`

---

### **Backend (Railway)**

#### 1. Første gang setup:

**Railway.app:**
1. Gå til [railway.app](https://railway.app)
2. Sign in med GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Velg `amundaiki/toplogic_app`
5. Branch: `test-branch` (for testing) eller `main` (for prod)

#### 2. Environment Variables:

```json
{
  "ANTHROPIC_API_KEY": "sk-ant-api03-...",
  "API_SECRET_KEY": "generer-med-openssl-rand-base64-32",
  "NODE_ENV": "production",
  "PORT": "3000",
  "ALLOWED_ORIGINS": "https://hook.eu2.make.com,https://toplogic.aiki.as",
  "LOG_LEVEL": "info"
}
```

**Generer sterkt API_SECRET_KEY:**
```bash
openssl rand -base64 32
```

#### 3. Deploy:
Railway oppdager `Dockerfile` automatisk og bygger.

#### 4. Test deployment:
```bash
curl https://your-app.up.railway.app/health
# Expected: {"status":"ok","timestamp":"2025-01-XX..."}
```

#### 5. Kontinuerlig deployment:
```bash
git push origin test-branch  # Railway rebuilder automatisk
```

---

## 🧪 Lokal Utvikling

### **Frontend Only (Simple apps):**

```bash
# Python simple server
python3 -m http.server 8000

# Node.js http-server
npx http-server -p 8000 -c-1

# Åpne i browser
open http://localhost:8000
```

### **Frontend + Backend (Faktura-opplaster):**

#### Terminal 1 - Backend:
```bash
# Install dependencies
npm install

# Copy .env template
cp .env.example .env

# Edit .env med dine API keys
nano .env

# Start backend
npm run dev  # eller: npm start
```

#### Terminal 2 - Frontend:
```bash
# Serve static files
python3 -m http.server 8000 --directory ./
```

#### Test full flow:
1. Gå til `http://localhost:8000/src/apps/faktura-opplaster/`
2. Backend kjører på `http://localhost:3000`
3. Upload en test-PDF
4. Sjekk backend logs i terminal 1

---

## 📊 API Dokumentasjon (Backend)

### **Base URL:** `https://your-app.up.railway.app`

### **Endpoints:**

#### `POST /api/process`
**Beskrivelse:** Send PDF til Claude for ekstraksjon

**Headers:**
```
X-API-Key: your-api-secret-key
Content-Type: multipart/form-data
```

**Body:**
```javascript
{
  file: <PDF File>,
  prompt: "Ekstraher fakturafelter...",
  batchId: "batch_12345",
  fileName: "faktura.pdf"
}
```

**Response:**
```json
{
  "jobId": "job_abc123",
  "batchId": "batch_12345",
  "status": "processing",
  "message": "Request queued for processing"
}
```

#### `GET /api/status/:batchId`
**Beskrivelse:** Sjekk status for batch

**Response:**
```json
{
  "batchId": "batch_12345",
  "status": "completed",
  "totalJobs": 5,
  "completedJobs": 5,
  "results": [
    {
      "jobId": "job_abc123",
      "fileName": "faktura.pdf",
      "status": "completed",
      "result": { "fakturaData": "..." }
    }
  ]
}
```

#### `GET /health`
**Beskrivelse:** Health check

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-XX...",
  "uptime": 12345
}
```

Se `docs/CLAUDE_API_README.md` for full API-dokumentasjon.

---

## 🔧 Make.com Integrasjon

### **Scenario-flyt for Faktura-opplaster:**

```
1. [Webhook] Motta PDF + metadata fra frontend
2. [Router] Sjekk action-type:
   ├─ "prepare_batch" → Opprett Google Sheet
   ├─ "upload" → Send til Railway Claude API
   └─ "last_invoice" → Generer Excel + send e-post
3. [HTTP] POST til Railway: /api/process
4. [Wait] Vent på Claude-respons (async)
5. [Parse] Parse JSON fra Claude
6. [Google Sheets] Legg til rad i Sheet
7. [Router] Hvis siste faktura:
   └─ [Excel] Generer Excel fra Sheet
   └─ [Email] Send til bruker
```

**Import scenario:**
1. Gå til Make.com → Create new scenario
2. Import blueprint fra `blueprints/Toplogic faktura 2.blueprint.json`
3. Oppdater webhook URLs
4. Oppdater Railway API URL
5. Test scenario
6. Activate

Se `docs/MAKE_SCENARIO_GUIDE.md` for detaljert guide.

---

## 🐛 Feilsøking

### **Frontend-feil:**

**Problem:** "Feil ved sending av faktura"
- Sjekk: Console i browser (F12)
- Sjekk: Webhook URL i `src/config/webhooks.js` er korrekt
- Sjekk: Make.com scenario er aktivt
- Sjekk: Railway backend er oppe (`/health` endpoint)

**Problem:** "CORS error"
- Sjekk: `ALLOWED_ORIGINS` i Railway environment variables inkluderer frontend URL
- Sjekk: Backend logger for CORS-relaterte feil

### **Backend-feil:**

**Se Railway logs:**
```bash
railway logs  # Hvis du har Railway CLI
```
Eller gå til Railway dashboard → Logs tab

**Vanlige feil:**
- `ANTHROPIC_API_KEY not found` → Sett env variable i Railway
- `Rate limit exceeded` → Vent eller oppgrader Claude API-plan
- `Timeout` → PDF for stor eller kompleks, reduser filstørrelse

---

## 📈 Kostnader & Skalering

### **Nåværende oppsett (2-10 brukere):**

| Tjeneste | Kostnad/mnd | Kommentar |
|----------|-------------|-----------|
| GitHub Pages | Gratis | Frontend hosting |
| Railway | $5-10 | Backend + DB (gratis tier: $5 kreditt) |
| Make.com | $9-29 | Starter/Basic plan |
| Claude API | $0-20 | Pay-as-you-go (~$0.50 per 100 fakturaer) |
| **Total** | **~$15-60** | Avhenger av bruk |

### **Skalering til 50+ brukere:**
- Railway: $20-50/mnd (høyere tier)
- Make.com: $99/mnd (Pro plan)
- Claude API: $50-200/mnd (volumrabatt)
- **Total: ~$170-350/mnd**

---

## 🎯 Status & Roadmap

### ✅ Ferdig (Produksjonsklar):
- [x] Multi-fil batch upload med drag & drop
- [x] Real-time progress tracking per fil
- [x] Smart batch-prosessering (sortert etter størrelse)
- [x] Claude API integration (Railway backend)
- [x] Google Sheet auto-generering
- [x] Excel e-post til riktig bruker
- [x] Docker deployment til Railway
- [x] Health check og logging
- [x] Rate limiting og CORS

### 🔄 Pågående:
- [ ] Test med Janne og Peter (feedback loop)
- [ ] Fine-tune Claude prompts per leverandør
- [ ] Webhook URL oppdatering til prod

### 📋 Kommende (Nice-to-have):
- [ ] Live Excel preview før eksport (se data i app)
- [ ] Smart error messages med recovery options
- [ ] Upload history i LocalStorage
- [ ] Enhanced file metadata per fil
- [ ] Supplier auto-detection via Claude
- [ ] Cost tracking per bruker/batch

---

## 👥 Team & Support

### **Utviklet av:**
- **AIKI** - AI development & integration
- **Amund Rangøy** - Lead developer
- Email: amund@aiki.as

### **For:**
- **TopLogic AS** - Transport & logistikkselskap
- **Sluttbrukere:** Janne Langås, Peter Nygård, m.fl.

### **Support:**
- GitHub Issues: [rapporter bugs her](https://github.com/amundaiki/toplogic_app/issues)
- Email: amund@aiki.as
- Make.com issues: Sjekk scenario execution history

---

## 📄 Lisens

MIT License - fri bruk for TopLogic AS og partnere.

---

## 🔗 Viktige Lenker

- **Frontend:** https://toplogic.aiki.as
- **Backend (Railway):** https://your-app.up.railway.app
- **GitHub Repo:** https://github.com/amundaiki/toplogic_app
- **Make.com Dashboard:** https://eu2.make.com/scenarios
- **Railway Dashboard:** https://railway.app/dashboard
- **Claude Console:** https://console.anthropic.com

---

*🤖 Powered by Claude 3.5 Sonnet - Utviklet av AIKI for TopLogic AS*
*Automatiser fakturabehandling med kunstig intelligens*
