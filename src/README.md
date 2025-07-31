# TopLogic ES6 Module Structure

## 📄 Filstruktur
- `index.html` - Redirect til home.html
- `home.html` - **Hovedside/hjemmeside** (tidligere index.html)

## 📁 Mappestruktur

```
src/
├── config/              # Konfigurasjoner
│   ├── index.js        # Hovedkonfigurasjon (samler alt)
│   ├── environment.js  # Miljøinnstillinger
│   ├── webhooks.js     # Make.com webhook URLs
│   ├── app.js          # App-spesifikke innstillinger
│   └── branding.js     # Logoer og navigasjon
├── components/          # Gjenbrukbare komponenter
│   ├── toplogic-app.js # Hovedapp-klasse
│   └── password-manager.js # Passord-beskyttelse
├── utils/              # Hjelpefunksjoner
│   ├── config-helpers.js # Konfigurasjonshjelper
│   └── toplogic-utils.js # Generelle utilities
├── styles/             # CSS-filer
│   └── shared.css      # Delte stiler
├── apps/               # Individuelle apper
│   ├── faktura-opplaster/
│   ├── prisliste-app/
│   ├── dokument-uploader/
│   └── kostnadsanalyse/
├── index.js            # Modern ES6 entry point
└── legacy.js           # Bakoverkompatibilitet
```

## 🚀 Bruk

### Modern ES6 Modules
```javascript
import { TopLogicApp, TopLogicConfig } from './src/index.js';

const app = new TopLogicApp();
```

### Legacy Support (for eksisterende HTML)
```html
<script type="module" src="src/legacy.js"></script>
<script>
    // Globale variabler er tilgjengelige
    const app = new TopLogicApp();
    const config = window.TopLogicConfig;
</script>
```

## ✨ Fordeler med ny struktur

1. **Modularity** - Hver komponent er isolert og gjenbrukbar
2. **Maintainability** - Lettere å finne og oppdatere kode
3. **Scalability** - Enkel å legge til nye apper og komponenter
4. **Modern JavaScript** - Bruker ES6 modules og best practices
5. **Separation of Concerns** - Klar separasjon mellom config, komponenter og utils

## 🔄 Migrering

Alle eksisterende HTML-filer er oppdatert til å bruke:
- CSS: `src/styles/shared.css`
- JS: `src/legacy.js` (for bakoverkompatibilitet)

## 📝 Neste Steg

1. Konverter til TypeScript
2. Legg til testing framework
3. Implementer build-system
4. Legg til linting og formatting