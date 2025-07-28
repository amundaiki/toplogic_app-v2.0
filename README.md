# 🏢 TopLogic AI-Apper - Forretningsverktøy Suite

En samling av webbaserte AI-drevne forretningsapplikasjoner for å automatisere og effektivisere daglige arbeidsoppgaver. Hver applikasjon benytter avansert AI via Make.com webhooks for dokumentprosessering og dataanalyse.

## 🚀 Live Demo

Besøk applikasjonene live på: [https://toplogic.aiki.as](https://toplogic.aiki.as)

## 📋 Applikasjoner

### 📄 PDF Faktura til EXCEL (Åpen)
**Mappe:** `faktura-opplaster/`
- **Formål:** AI-drevet konvertering av PDF-fakturaer til strukturert Excel-format
- **Funksjoner:** Automatisk tekstgjenkjenning, dataekstraksjon, Excel-generering
- **Bruksområde:** Økonomi- og regnskapsavdelinger
- **AI-prosessering:** Make.com webhook for fakturaanalyse

### 📊 Prislister til EXCEL (Låst - Passord: 1)
**Mappe:** `prisliste-app/`
- **Formål:** Konvertering av prislister til strukturert Excel-format
- **Funksjoner:** Prisdata-ekstraksjon, kategorisering, sammenligning
- **Bruksområde:** Innkjøp og salg
- **AI-prosessering:** Make.com webhook for prislisteanalyse

### 🗂️ Dokumentbehandler (Låst - Passord: 1)
**Mappe:** `dokument-uploader/`
- **Formål:** Generell AI-drevet dokumentanalyse og kategorisering
- **Funksjoner:** Automatisk dokumenttype-gjenkjenning, metadata-ekstraksjon
- **Bruksområde:** Generell dokumenthåndtering
- **AI-prosessering:** Make.com webhook for dokumentanalyse

### 💰 Kostnadsanalyse (Låst - Passord: 1)
**Mappe:** `kostnadsanalyse/`
- **Formål:** Avansert AI-drevet kostnadsanalyse og budsjettoptimalisering
- **Funksjoner:** Trend-analyse, kostnadsprediksjon, sammenligning av perioder
- **Bruksområde:** Budsjettplanlegging og kostnadsoptimalisering
- **AI-prosessering:** Make.com webhook for kostnadsmodellering

## 🛠️ Teknologi Stack

### Frontend
- **HTML5** - Semantisk markup og moderne web-standarder
- **CSS3** - Modular design system med CSS custom properties
- **Vanilla JavaScript (ES6+)** - Moderne JavaScript uten rammeverk
- **Modulær arkitektur** - Delte komponenter og utilities

### Backend & AI
- **Make.com** - AI-prosessering og workflow-automatisering
- **Webhook-basert arkitektur** - Asynkron prosessering
- **FileReader API** - Klient-side filhåndtering
- **Drag & Drop API** - Moderne filupload-opplevelse

### Design & UX
- **Responsivt design** - Mobile-first tilnærming
- **TopLogic/AIKI merkevareidentitet** - Konsistent visuell profil
- **Tilgjengelighet** - WCAG 2.1 kompatibel
- **Progressive Enhancement** - Fungerer uten JavaScript

## 📁 Ny Prosjektstruktur (2025)

```
toplogic/
├── 🏠 index.html                 # Hovedside med app-navigasjon
├── 🎨 shared.css                 # Sentralisert design system
├── ⚙️ config.js                  # Sentralisert konfigurasjon
├── 🔧 shared.js                  # Delte JavaScript-utilities
├── 
├── 📄 dokument-uploader/
│   └── index.html               # Dokumentbehandler app
├── 🧾 faktura-opplaster/
│   └── index.html               # Fakturaopplaster app  
├── 📊 kostnadsanalyse/
│   └── index.html               # Kostnadsanalyse app
├── 💰 prisliste-app/
│   └── index.html               # Prisliste-app
├── 
├── 🌐 CNAME                     # GitHub Pages domene
└── 📖 README.md                 # Denne filen
```

## ⚙️ Konfigurasjon og Administrasjon

### 🔗 Webhook-konfigurasjon

Alle webhook-URLer er sentralisert i `config.js`:

```javascript
const WEBHOOKS = {
    faktura: 'https://hook.eu2.make.com/din-faktura-webhook-url',
    prisliste: 'https://hook.eu2.make.com/din-prisliste-webhook-url',
    dokument: 'https://hook.eu2.make.com/din-dokument-webhook-url',
    kostnadsAnalyse: 'https://hook.eu2.make.com/din-kostnad-webhook-url'
};
```

**Slik oppdaterer du webhooks:**

1. **Åpne `config.js` filen**
2. **Finn `WEBHOOKS` objektet** (linje ~20)
3. **Erstatt URL-ene** med dine nye Make.com webhook-endepunkter
4. **Lagre og test** at nye URLer fungerer

### 🏢 Bedriftskonfigurasjon

Oppdater bedriftsinformasjon i `config.js`:

```javascript
const APP_CONFIG = {
    company: {
        name: 'TopLogic',
        supportEmail: 'amund@aiki.as',
        website: 'www.aiki.as'
    },
    // ... mer konfigurasjon
};
```

### 🎨 Logo og Merkevareidentitet

Logoer er sentralisert i `config.js`:

```javascript
const LOGOS = {
    toplogic: 'https://www.toplogic.no/wp-content/uploads/2023/01/Toplogic_norge_logo.svg',
    aiki: 'https://images.squarespace-cdn.com/content/v1/67a10d12887082593bb5d293/d39dc0a0-5a17-4ef9-88a4-2d0edb45fd5e/LOGO+l.png?format=500w'
};
```

**Slik oppdaterer du logoer:**
1. Endre URL-ene i `LOGOS` objektet i `config.js`
2. Oppdater favicon-lenker i alle HTML-filer
3. Test at alle logoer laster korrekt

### 🔐 Passord og Tilgangskontroll

App-passord er konfigurert i `config.js`:

```javascript
const NAVIGATION = {
    apps: {
        fakturaOpplaster: { locked: false },                    // Åpen
        prislisteApp: { locked: true, password: '1' },          // Låst
        dokumentUploader: { locked: true, password: '1' },      // Låst  
        kostnadsAnalyse: { locked: true, password: '1' }        // Låst
    }
};
```

**Slik endrer du passord:**
1. Endre `password` verdien for aktuell app
2. Sett `locked: false` for å gjøre appen åpen
3. Test at ny passord fungerer

### 👥 Bruker og Leverandør-lister

Dropdown-alternativer er konfigurert i `config.js`:

```javascript
const USERS = ['Amund Rangøy', 'Martine Haugen', /* ... flere brukere */];
const SUPPLIERS = ['Uno-X', 'Shell', 'Statoil', /* ... flere leverandører */];
```

**Slik legger du til nye brukere/leverandører:**
1. Legg til navn i respektive arrays
2. Listen oppdateres automatisk i alle apper

## 🚀 Lokal Utvikling

### 1. Klone og Oppsett
```bash
git clone https://github.com/[username]/toplogic.git
cd toplogic
```

### 2. Lokal Server
```bash
# Python 3 (anbefalt)
python3 -m http.server 8000

# Alternativt med Node.js
npx http-server -p 8000 -c-1

# Alternativt med PHP  
php -S localhost:8000
```

### 3. Åpne og Test
```
http://localhost:8000
```

**Testing checklist:**
- [ ] Alle apper laster korrekt
- [ ] Logoer vises riktig
- [ ] Filupload fungerer
- [ ] Navigasjon mellom apper virker
- [ ] Passord-beskyttelse fungerer
- [ ] Responsivt design på mobil

## 🎨 Design System

### Fargepalett (TopLogic)
```css
--color-red: #c72027          /* TopLogic primærfarge */
--color-red-dark: #a51a1e     /* Mørkere rød */
--color-red-light: #ffeaea    /* Lys rød bakgrunn */
```

### Bakgrunner
- **Hjemmeside:** TopLogic transport-bilde med rød overlay
- **Apper:** Animerte sirkel-mønstre med gradient-bakgrunn

### Typografi
- **Hovedfont:** -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **Størrelser:** Definert via CSS custom properties

## 🔄 Deployment til GitHub Pages

### Automatisk Deployment
1. **Push til main branch:**
   ```bash
   git add .
   git commit -m "Oppdatert konfigurasjon"
   git push origin main
   ```

2. **GitHub Pages bygger automatisk** (ingen build-prosess nødvendig)

3. **Tilgjengelig på:** [https://toplogic.aiki.as](https://toplogic.aiki.as)

### Custom Domene
Konfigurert via `CNAME` fil - oppdater denne for å endre domene.

## 🤖 Make.com Integrasjon

### Webhook-flyt
1. **Bruker laster opp fil** i webapp
2. **JavaScript sender fil** til Make.com webhook
3. **Make.com prosesserer** med AI (OCR, analyse, etc.)
4. **Resultat sendes tilbake** via webhook response
5. **Webapp viser resultat** til bruker

### Webhook-format
```javascript
// Eksempel på webhook-forespørsel
{
    "file": "base64-encoded-file-data",
    "filename": "dokument.pdf",
    "user": "Amund Rangøy",
    "documentType": "faktura",
    "outputFormats": ["excel", "json"]
}
```

## 🛠️ Feilsøking

### Vanlige problemer:

**1. Webhooks fungerer ikke:**
- Sjekk at URL-ene i `config.js` er korrekte
- Kontroller Make.com scenario status
- Se nettleser-konsoll for feilmeldinger

**2. Logoer laster ikke:**
- Verifiser URL-er i `config.js` og HTML-filer
- Sjekk CORS-innstillinger på image-serveren

**3. Apper ikke tilgjengelige:**
- Kontroller passord i `config.js`
- Sjekk at `locked` status er korrekt

**4. Styling ser feil ut:**
- Sørg for at `shared.css` laster korrekt
- Sjekk CSS custom properties support

## 📈 Kommende Funksjoner

- [ ] Real-time status for AI-prosessering
- [ ] Batch-upload av flere filer
- [ ] Historikk og logging av prosesserte dokumenter
- [ ] API-nøkkel-basert autentisering
- [ ] Webhook-testing verktøy
- [ ] Utvidet kostnadsprediksjon med ML

## 🤝 Bidrag og Utvikling

### Kodestandard:
- **JavaScript:** ES6+ med moderne syntax
- **CSS:** BEM-metodikk og CSS custom properties
- **HTML:** Semantisk markup
- **Tilgjengelighet:** WCAG 2.1 AA standard

### Git-arbeidsflyt:
```bash
git checkout -b feature/ny-funksjon
# Gjør endringer
git add .
git commit -m "Beskriv endringen"
git push origin feature/ny-funksjon
# Opprett Pull Request
```

## 📞 Support og Kontakt

- **AIKI Support:** amund@aiki.as
- **AIKI Nettside:** www.aiki.as  
- **TopLogic Partner:** TopLogic AS
- **GitHub Issues:** [Rapporter problemer](https://github.com/[username]/toplogic/issues)

## 📄 Lisens

MIT License - Se LICENSE fil for fullstendige detaljer.

---

*🤖 Powered by AI - Utviklet av AIKI for TopLogic AS*  
*Automatiser dine forretningsprosesser med kunstig intelligens*
