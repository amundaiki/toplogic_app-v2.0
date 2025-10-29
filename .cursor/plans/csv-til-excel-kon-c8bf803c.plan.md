<!-- c8bf803c-ae27-472a-8752-29bedfee5cf9 01250afa-6d07-47dd-a91e-a049f3bbe128 -->
# Plan: CSV til Standard Excel-mal med Claude AI

## Oversikt

Implementere et nytt system som konverterer CSV/XLSX-filer fra transportører til Toplogic's generiske 133-felts Excel-mal. Systemet skal være fleksibelt nok til å håndtere variasjoner i kolonnestrukturer mellom ulike transportører ved å bruke Claude AI til automatisk mapping.

## Arkitektur

```
Webapp (Ny side) → Node.js Backend → Make.com → Claude API → Excel → E-post
```

Samme flyt som PDF-faktura, men med CSV/XLSX som input i stedet for PDF.

## Hovedkomponenter

### 1. Frontend - Ny webapp-side (`src/apps/csv-konvertering/`)

Lag en ny, separat side som ligner på `faktura-opplaster` men tilpasset CSV/XLS-filer:

**Filstruktur:**

- `src/apps/csv-konvertering/index.html` - Hovedside
- Gjenbruk eksisterende styles og komponenter fra `faktura-opplaster`
- Samme grid-layout (3 kolonner: Input | Upload | Files)

**Endringer fra faktura-opplaster:**

- **Tittel:** "CSV til Standard Excel-mal"
- **Beskrivelse:** "Last opp CSV/XLS-filer fra transportører. Systemet mapper automatisk kolonnene til Toplogic's 133-felts standardmal og genererer Excel-fil."
- **Filtyper:** Akseptér `.csv`, `.xls`, `.xlsx` (i stedet for kun `.pdf`)
- **Input-felt:** 
  - Transportør/Leverandør (valgfritt, for referanse)
  - E-postadresse for utsending (pre-filled fra config)
- **Fjern:** "Opplaster"-felt (ikke relevant for CSV)

**Validering:**

- Maks filstørrelse: 10 MB (større enn PDF siden CSV kan ha mange rader)
- Filtyper: `.csv`, `.xls`, `.xlsx`
- Advarsel hvis fil > 1000 rader (men tillat det)

### 2. Backend - Utvid Node.js API

**Ingen nye ruter nødvendig** - gjenbruk eksisterende `/api/claude` endpoint:

**Endringer:**

- Backend må kunne lese CSV/XLSX og konvertere til tekst
- Legg til bibliotek: `csv-parse` (for CSV) og `xlsx` (for Excel)
- Samme webhook-flyt som PDF-faktura

**Prosessering:**

1. Motta CSV/XLSX fil
2. Parse fil til JSON/array
3. Konverter til lesbar tekstformat for Claude
4. Send til Make.com med samme struktur som PDF-faktura

### 3. Make.com Scenario - Nytt eller duplisert scenario

**To alternativer:**

**Alternativ A (Anbefalt):** Lag nytt Make.com scenario kalt "CSV til Excel"

- Webhook mottak
- HTTP Request til Claude API med spesifikk CSV-prompt
- Excel-generering
- E-postutsending

**Alternativ B:** Utvid eksisterende scenario med router

- Detekter filtype (PDF vs CSV)
- Bruk ulik prompt basert på type
- Samme Excel-output

**Claude Prompt for CSV:**

```
Du er ekspert på å mappe CSV-data til standardiserte formater.

INPUT: CSV-fil med følgende kolonner og data:
[CSV-innhold her]

OUTPUT: Konverter hver rad til Toplogic's 133-felts JSON-mal.

MAPPING-REGLER:
1. Map CSV-kolonner til nærmeste felt i 133-felts malen
2. Kun inkluder felt med faktiske verdier (ikke null/tomme)
3. Datoformat: ÅÅÅÅ-MM-DD
4. Desimaltegn: Komma (,) ikke punktum
5. Returner JSON array med ett objekt per rad

133-FELTS MAL:
{"1":"Forwarder","2":"Purchaser",...,"133":"Currency3RateToInvoiceCurrency"}

Returner BARE gyldig JSON array - ingen markdown.
```

### 4. Excel-generering i Make.com

**Samme modul som PDF-faktura:**

- Google Sheets API eller Excel-modul
- Samme 133-kolonne template
- En rad per sending fra CSV

### 5. E-postutsending

**Konfigurerbar e-postadresse:**

- Legges inn av bruker i webapp
- Sendes som parameter til Make.com
- Make.com sender Excel til denne adressen

### 6. Navigasjon og tilgjengelighet

**Oppdater hovedside (`index.html`):**

- Legg til kort/link til "CSV til Excel-mal" ved siden av "Fakturaopplasting"
- Samme visuell stil som eksisterende kort

## Tekniske detaljer

### Node.js Dependencies (package.json)

```json
{
  "csv-parse": "^5.5.0",
  "xlsx": "^0.18.5"
}
```

### Make.com Webhook Structure

```json
{
  "file": "base64-encoded-csv-data",
  "filename": "transport_report.csv",
  "supplier": "Bring Express",
  "email": "janne@toplogic.se",
  "type": "csv"
}
```

### Feilhåndtering

- Ugyldig CSV-format → Vis tydelig feilmelding
- Tomme filer → Valider minst 1 rad data
- Manglende obligatoriske kolonner → Claude håndterer, men warn bruker
- API-feil → Samme retry-logikk som PDF-faktura

## Testing

1. Test med den 344-raders CSV-filen fra Janne
2. Test med ulike CSV-formater (ulike delimitere: komma, semikolon, tab)
3. Test med XLSX-filer
4. Test med små (< 10 rader) og store (> 500 rader) filer
5. Verifiser at Excel-output matcher forventet 133-felts struktur

## Estimert omfang

- Frontend (ny side): 2-3 timer
- Backend (CSV-parsing): 1-2 timer  
- Make.com scenario: 1-2 timer
- Testing og finjustering: 2-3 timer
- **Totalt: 6-10 timer**

## Fremtidige forbedringer (ikke del av initial versjon)

- Cache kolonnemappings per transportør for raskere prosessering
- Forhåndsvisning av mapping før sending
- Batch-prosessering for filer > 1000 rader
- Støtte for flere output-formater (ikke bare Excel)

### To-dos

- [ ] Lag ny webapp-side src/apps/csv-konvertering/index.html basert på faktura-opplaster
- [ ] Oppdater hovedside (index.html) med link til CSV-konvertering
- [ ] Legg til CSV/XLSX parsing i Node.js backend (csv-parse og xlsx biblioteker)
- [ ] Lag nytt Make.com scenario for CSV til Excel konvertering
- [ ] Utvikle Claude AI prompt for CSV-til-JSON mapping
- [ ] Test med 344-raders CSV-fil fra Janne og verifiser output