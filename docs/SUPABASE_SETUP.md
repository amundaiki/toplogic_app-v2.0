# Supabase Setup Guide - Dashboard Metrics

## Database Setup

### 1. Opprett Supabase-prosjekt

1. Gå til [supabase.com](https://supabase.com)
2. Opprett nytt prosjekt
3. Noter ned:
   - Project URL
   - Anon (public) key

### 2. Opprett automation_logs tabell

Kjør følgende SQL i Supabase SQL Editor:

```sql
-- Opprett automation_logs tabell
CREATE TABLE automation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  automation_type TEXT NOT NULL,  -- 'faktura', 'prisliste_bring_transport', etc.
  user_name TEXT NOT NULL,        -- hvem som kjørte (filtrert: ikke 'Amund')
  batch_id TEXT,                  -- batchId fra frontend
  request_id TEXT,                -- requestId fra Claude API
  supplier TEXT,                  -- leverandør (hvis faktura)
  file_count INTEGER DEFAULT 1,   -- antall filer prosessert
  status TEXT DEFAULT 'completed', -- 'completed', 'failed'
  time_saved_minutes DECIMAL,     -- estimert tidsbesparelse
  metadata JSONB DEFAULT '{}'     -- ekstra data
);

-- Opprett indekser for bedre ytelse
CREATE INDEX idx_automation_logs_created_at ON automation_logs(created_at);
CREATE INDEX idx_automation_logs_automation_type ON automation_logs(automation_type);
CREATE INDEX idx_automation_logs_user_name ON automation_logs(user_name);
CREATE INDEX idx_automation_logs_status ON automation_logs(status);

-- Opprett Row Level Security (RLS)
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

-- Tillat lesing for alle (for dashboard)
CREATE POLICY "Allow read access for dashboard" ON automation_logs
  FOR SELECT USING (true);

-- Tillat insert fra Make.com (bruk API key authentication)
CREATE POLICY "Allow insert from Make.com" ON automation_logs
  FOR INSERT WITH CHECK (true);
```

### 3. Oppdater Supabase config ✅

Supabase-credentials er allerede konfigurert i `src/config/supabase.js`:

```javascript
const SUPABASE_URL = 'https://rbdxfleejaqtmordcdot.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiZHhmbGVlamFxdG1vcmRjZG90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NDk0MjQsImV4cCI6MjA3NjQyNTQyNH0.LXAm8mEm8E0aUd1bH-PfXW2527OtU-JIZYxgNrjJ0pc'

export const supabase = window.supabase?.createClient ? 
    window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : 
    null
```

## Make.com Integration

### 1. Legg til Supabase-modul i Make.com scenarioer

For hver automation (faktura, prisliste), legg til "Supabase - Insert a Record" modul på slutten:

**Supabase modul konfigurasjon:**
- **Connection:** Opprett ny Supabase connection med:
  - URL: Din Supabase project URL
  - API Key: Din Supabase service_role key (ikke anon key)
- **Table:** automation_logs
- **Data mapping:**

```json
{
  "automation_type": "{{webhook.automation_type}}",
  "user_name": "{{webhook.user_name}}",
  "batch_id": "{{webhook.batch_id}}",
  "request_id": "{{webhook.request_id}}",
  "supplier": "{{webhook.supplier}}",
  "file_count": "{{webhook.file_count}}",
  "status": "completed",
  "time_saved_minutes": "{{webhook.time_saved_minutes}}",
  "metadata": {}
}
```

### 2. Beregn tidsbesparelse

Legg til beregning av `time_saved_minutes` basert på automation-type:

- **Faktura:** 5 minutter per dokument
- **Prisliste:** 10 minutter per prisliste

### 3. Filtrer ut Amund's automations

Sørg for at kun automations fra andre brukere (ikke 'Amund') logges til dashboard.

## Testing

### 1. Test med mock data

Dashboard viser mock data som standard. Test at:
- KPI-kort viser riktige verdier
- Grafer laster og oppdaterer seg
- Aktivitetstabell fungerer med sortering og paginering
- Søkefunksjon virker

### 2. Test med ekte data

Etter Supabase-setup:
- Kjør en automation fra Make.com
- Sjekk at data dukker opp i Supabase
- Verifiser at dashboard oppdaterer seg

## Sikkerhet

### Row Level Security (RLS)

RLS er aktivert for å:
- Tillate lesing for dashboard (alle)
- Tillate insert fra Make.com (med service_role key)
- Forhindre uautorisert tilgang

### API Keys

- **Anon key:** Brukes av frontend (kun lesing)
- **Service role key:** Brukes av Make.com (insert/update)
- **Never expose service role key in frontend!**

## Monitoring

### Dashboard metrics

Dashboard viser:
- Total tidsbesparelse
- Antall automations
- Mest brukte automation-type
- Aktivitet over tid
- Siste aktiviteter

### Auto-refresh

Dashboard oppdaterer seg automatisk hver 30. sekund.

## Feilsøking

### Vanlige problemer

1. **Dashboard viser ikke data:**
   - Sjekk Supabase connection
   - Verifiser at data eksisterer i tabellen
   - Sjekk browser console for errors

2. **Make.com kan ikke insert data:**
   - Sjekk service_role key
   - Verifiser RLS policies
   - Sjekk Make.com logs

3. **Grafer viser ikke data:**
   - Sjekk at Chart.js lastes
   - Verifiser data-format
   - Sjekk browser console for JavaScript errors

### Logs

Sjekk følgende for feilsøking:
- Browser console (F12)
- Supabase dashboard logs
- Make.com scenario logs
