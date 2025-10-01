# Make.com Scenario Guide - Faktura til Excel med Claude API

## 📋 Oversikt

Dette scenarioet prosesserer fakturaer fra webappen, bruker Mistral OCR for tekstgjenkjenning, sender til Claude API for strukturering, og genererer Excel-fil.

## 🔄 Komplett Flyt

```
Webapp → Make Webhook → Mistral OCR → Node.js Claude API → Callback Webhook → Excel → Send til kunde
```

## 🛠️ Make.com Scenario Oppsett (Steg-for-Steg)

### **Modul 1: Webhook - Motta faktura fra webapp**

1. **Legg til**: Custom Webhook
2. **Navn**: "Motta faktura"
3. **Webhook URL**: `https://hook.eu2.make.com/21gnx15xohwcp5adfhg7o53dioz9zrtn`
4. **Data structure**:
   ```json
   {
     "file": "base64-encoded-file-data",
     "filename": "faktura.pdf",
     "user": "Amund Rangøy",
     "supplier": "Uno-X"
   }
   ```

---

### **Modul 2: Mistral OCR - Ekstraher tekst**

1. **Legg til**: HTTP Request eller Mistral API-modul
2. **Method**: POST
3. **URL**: Mistral OCR endpoint
4. **Body**:
   ```json
   {
     "file": "{{1.file}}",
     "filename": "{{1.filename}}"
   }
   ```
5. **Output**:
   ```json
   {
     "text": "Rå OCR-tekst fra fakturaen..."
   }
   ```

**Tips**: Lagre OCR-output i en variabel: `{{2.text}}`

---

### **Modul 3: HTTP Request - Send til Node.js Claude API**

1. **Legg til**: HTTP Request
2. **Method**: POST
3. **URL**:
   - Lokal: `http://localhost:3000/api/claude`
   - Railway: `https://your-app.railway.app/api/claude`

4. **Headers**:
   ```
   Content-Type: application/json
   X-API-Key: toplogic_secure_key_2025
   ```

5. **Body** (JSON):
   ```json
   {
     "prompt": "# PDF-FAKTURA STRUKTURERING\n\nDU ER en EKSPERT I DOKUMENTFORSTÅELSE. Din jobb er å lese en PDF-faktura og strukturere **hver separat sending/transportoppdrag** inn i **eksakt 133 nummererte JSON-nøkler**.\n\n## STANDARD MALL (133 felt):\n{\"1\":\"Forwarder\",\"2\":\"Purchaser\",\"3\":\"Bill-toAddrNo\",\"4\":\"InvoiceDate\",\"5\":\"InvoiceNo\",\"6\":\"InvoiceCurrency\",\"7\":\"Debit/Credit\",\"8\":\"PartnerNo\",\"9\":\"Departure Date\",\"10\":\"Destination Date\",\"11\":\"Transport Mode\",\"12\":\"TermsOfDelivery\",\"13\":\"DeptCountry\",\"14\":\"DeptZip\",\"15\":\"DeptCity\",\"16\":\"DeptName\",\"17\":\"DeptZone\",\"18\":\"DestCountry\",\"19\":\"DestZip\",\"20\":\"DestCity\",\"21\":\"DestName\",\"22\":\"DestZone\",\"23\":\"Net\",\"24\":\"Gross\",\"25\":\"Volume\",\"26\":\"LoadingMeters\",\"27\":\"PayWeight\",\"28\":\"HandlingUnits\",\"29\":\"Distance\",\"30\":\"CalcHours\",\"31\":\"CalcDays\",\"32\":\"Trans1\",\"33\":\"Trans2\",\"34\":\"ADR\",\"35\":\"CustomerRef\",\"36\":\"ReceiverRef\",\"37\":\"KI_TELEMATIK_NR\",\"38\":\"CostName1\",\"39\":\"CostAmount1\",\"40\":\"CostCurr1\",\"41-127\":\"CostName2-30, CostAmount2-30, CostCurr2-30\",\"128\":\"Currency1\",\"129\":\"Currency1RateToInvoiceCurrency\",\"130\":\"Currency2\",\"131\":\"Currency2RateToInvoiceCurrency\",\"132\":\"Currency3\",\"133\":\"Currency3RateToInvoiceCurrency\"}\n\n## KRITISKE REGLER:\n\n1. **EN RAD PER SENDING** - Hvis faktura har flere sendinger, returner JSON-array med ett objekt per sending\n2. **DATOFORMAT**: ÅÅÅÅ-MM-DD (f.eks. \"2025-03-16\")\n3. **DECIMALAVGRÄNSARE**: Bruk ALLTID \",\" (f.eks. \"125,50\" IKKE \"125.50\")\n4. **TELEMATIK (felt 37)**: Skal ALLTID være null\n5. **MOMS/MVA**: ALDRI inkluder kostnader med \"MOMS\", \"MVA\", \"VAT\", \"Tax\", \"25%\", etc.\n6. **KUN FELT MED VERDI**: Ta kun med nøkler (1-133) som har faktisk verdi - ikke inkluder null eller tomme felt\n7. **INGEN MARKDOWN**: Returner BARE ren JSON - ALDRI start med ```json\n8. **FELTNAMN**: Returner faktiske VERDIER, IKKE feltnamn som \"Forwarder\" - det skal være \"Hurtig-Gutta Transport AS\"\n\n## TRANSPORTØR-VARIATIONER (viktige synonymer):\n- Departure Date = \"Avgang\", \"Pickup Date\", \"Hentedato\", \"Sendingsdato\"\n- PartnerNo = \"Fraktsedelsnr\", \"Waybill Number\", \"Tracking Number\", \"Fraktbrevnr\"\n- PayWeight = \"Fakturavekt\", \"Chargeable Weight\", \"Betalingsvekt\"\n- CustomerRef = \"Kundenummer\", \"Reference\", \"Order No\", \"Bestilling\"\n\n## OCR-TEKST:\n\n{{2.text}}\n\n## OUTPUT:\nReturner BARE gyldig JSON (ett objekt hvis 1 sending, array hvis flere sendinger). Start DIREKTE med { eller [ - INGEN annen tekst.",
     "webhookUrl": "https://hook.eu2.make.com/j33kho9fjjo54nk6aqqk5alndg5evplt",
     "requestId": "{{1.filename}}-{{now}}",
     "options": {
       "model": "claude-3-5-sonnet-20241022",
       "maxTokens": 8192,
       "temperature": 0.1
     }
   }
   ```

6. **Response** (202 Accepted):
   ```json
   {
     "message": "Request accepted and processing",
     "requestId": "faktura-123-2025-01-15",
     "status": "pending",
     "timestamp": "2025-01-15T10:30:00.000Z"
   }
   ```

**VIKTIG**: Lagre `requestId` for tracking: `{{3.requestId}}`

---

### **Modul 4: Webhook - Motta Claude respons**

1. **Legg til**: Custom Webhook (NY)
2. **Navn**: "Claude callback"
3. **Create a new webhook**
4. **Kopier webhook URL** - dette er URL-en du bruker i Modul 3 som `webhookUrl`

**Eksempel webhook URL**: `https://hook.eu2.make.com/abc123xyz456`

5. **Data structure** (callback fra Node.js):
   ```json
   {
     "requestId": "faktura-123-2025-01-15",
     "response": "{\"invoiceNumber\": \"123\", ...}",
     "status": "completed",
     "timestamp": "2025-01-15T10:35:00.000Z",
     "usage": {
       "input_tokens": 500,
       "output_tokens": 300
     },
     "model": "claude-3-5-sonnet-20241022"
   }
   ```

**VIKTIG**: `response` er en JSON-streng, ikke et objekt!

---

### **Modul 5: Router - Sjekk status**

1. **Legg til**: Router
2. **Route 1**: Status = "completed"
   - Filter: `{{4.status}}` = `completed`
   - Fortsett til Excel-generering

3. **Route 2**: Status = "failed"
   - Filter: `{{4.status}}` = `failed`
   - Send feilmelding til bruker

---

### **Modul 6A: Parse JSON (Success Route)**

1. **Legg til**: Parse JSON
2. **JSON string**: `{{4.response}}`
3. **Output**: Strukturert JSON-objekt

**Tilgjengelige felt etter parsing**:
- `{{6.invoiceNumber}}`
- `{{6.invoiceDate}}`
- `{{6.totalAmount}}`
- `{{6.lineItems[].description}}`
- etc.

---

### **Modul 7A: Lag Excel-fil**

**Alternativ A: Microsoft Excel-modul**

1. **Legg til**: Microsoft Excel > Create a Workbook
2. **Workbook name**: `Faktura_{{6.invoiceNumber}}_{{formatDate(now, 'YYYY-MM-DD')}}.xlsx`
3. **Sheet 1 - Fakturainfo**:
   - A1: "Fakturanummer", B1: `{{6.invoiceNumber}}`
   - A2: "Fakturadato", B2: `{{6.invoiceDate}}`
   - A3: "Forfallsdato", B3: `{{6.dueDate}}`
   - A4: "Leverandør", B4: `{{6.supplier.name}}`
   - A5: "Totalbeløp", B5: `{{6.totalWithVAT}}`

4. **Sheet 2 - Linjer**:
   ```
   A1: Beskrivelse
   B1: Antall
   C1: Enhetspris
   D1: MVA
   E1: Beløp

   Iterate over {{6.lineItems}}:
   A2: {{item.description}}
   B2: {{item.quantity}}
   C2: {{item.unitPrice}}
   D2: {{item.vat}}
   E2: {{item.amount}}
   ```

**Alternativ B: Google Sheets-modul**

1. **Legg til**: Google Sheets > Create a Spreadsheet
2. Følg samme struktur som over

---

### **Modul 8A: Send Excel til kunde**

**Alternativ 1: Email**
1. **Legg til**: Email > Send an Email
2. **To**: `{{1.user}}@toplogic.no`
3. **Subject**: `Faktura {{6.invoiceNumber}} - Prosessert`
4. **Attachments**: `{{7.file}}`

**Alternativ 2: Webhook tilbake til webapp**
1. **Legg til**: HTTP Request
2. **Method**: POST
3. **URL**: Webapp callback endpoint
4. **Body**:
   ```json
   {
     "requestId": "{{4.requestId}}",
     "excelFile": "{{7.file}}",
     "status": "completed",
     "invoiceData": {{6}}
   }
   ```

---

### **Modul 6B: Send feilmelding (Error Route)**

1. **Legg til**: Email > Send an Email
2. **To**: `amund@aiki.as`
3. **Subject**: `Faktura-prosessering feilet - {{4.requestId}}`
4. **Body**:
   ```
   Faktura-prosessering feilet for:

   Request ID: {{4.requestId}}
   Feilmelding: {{4.error}}
   Timestamp: {{4.timestamp}}

   Originalfil: {{1.filename}}
   Bruker: {{1.user}}
   ```

---

## 🧪 Testing

### Test Steg-for-Steg

1. **Test Webhook (Modul 1)**:
   ```bash
   curl -X POST https://hook.eu2.make.com/21gnx15xohwcp5adfhg7o53dioz9zrtn \
     -H "Content-Type: application/json" \
     -d '{
       "file": "base64-data-here",
       "filename": "test.pdf",
       "user": "Test User",
       "supplier": "Test Supplier"
     }'
   ```

2. **Test Node.js API direkte**:
   ```bash
   curl -X POST http://localhost:3000/api/claude \
     -H "Content-Type: application/json" \
     -H "X-API-Key: toplogic_secure_key_2025" \
     -d '{
       "prompt": "Hva er 2+2?",
       "webhookUrl": "https://webhook.site/your-test-url",
       "requestId": "test-123"
     }'
   ```

3. **Overvåk Make.com scenario**:
   - Se execution history i Make.com
   - Sjekk at alle moduler kjører uten feil
   - Verifiser at webhook callback mottas

---

## ⚙️ Viktige Konfigurasjoner

### Node.js API Endpoints

| Endpoint | Method | Beskrivelse |
|----------|--------|-------------|
| `/api/claude` | POST | Asynkron Claude API-kall |
| `/api/status/:requestId` | GET | Sjekk status på request |
| `/health` | GET | Health check |

### Timeouts

- **Node.js → Claude**: 30 minutter
- **Node.js → Make webhook**: 30 sekunder (3 retries)
- **Make.com scenario**: Ubegrenset (venter på webhook)

### Rate Limits

- **Node.js API**: 100 requests/15 min per IP
- **Claude API**: Avhenger av din Anthropic-plan

---

## 🔍 Troubleshooting

### Problem: Webhook callback kommer aldri tilbake

**Løsning**:
1. Sjekk at webhook URL i Modul 3 er korrekt
2. Test webhook URL med webhook.site først
3. Se Node.js logs: `railway logs --follow`

### Problem: Claude returnerer ugyldig JSON

**Løsning**:
1. Legg til JSON-validering før Excel-generering
2. Be Claude om å returnere "BARE gyldig JSON, ingen ekstra tekst"
3. Bruk `temperature: 0.3` for mer konsistent output

### Problem: Mistral OCR gir dårlig tekst

**Løsning**:
1. Sjekk bildekvalitet
2. Pre-process bilde (konverter til sort/hvitt, øk kontrast)
3. Gi Claude mer kontekst i prompten

---

## 📊 Monitorering

### Make.com
- Gå til scenario → History
- Se execution log for hver kjøring
- Sjekk data flow mellom moduler

### Node.js API
```bash
# Se logs
railway logs --follow

# Sjekk status
curl http://localhost:3000/health

# Sjekk spesifikk request
curl http://localhost:3000/api/status/REQUEST_ID \
  -H "X-API-Key: toplogic_secure_key_2025"
```

---

## 🚀 Deploy til Produksjon

### 1. Deploy Node.js til Railway

```bash
# Fra project root
railway login
railway init
railway variables set ANTHROPIC_API_KEY=sk-ant-xxxxx
railway variables set API_SECRET_KEY=toplogic_secure_key_2025
railway variables set NODE_ENV=production
railway up
```

### 2. Få Railway URL

```bash
railway status
# Output: https://your-app.railway.app
```

### 3. Oppdater Make.com Scenario

I **Modul 3**, endre URL til:
```
https://your-app.railway.app/api/claude
```

---

## 📝 Eksempel Prompt for Claude

```
Du er en ekspert på fakturaanalyse. Din oppgave er å konvertere følgende OCR-tekst fra en norsk faktura til strukturert JSON.

Bruker: {{user}}
Leverandør: {{supplier}}
Filnavn: {{filename}}

OCR-tekst:
{{ocr_text}}

VIKTIG:
1. Returner BARE gyldig JSON
2. Ingen ekstra tekst før eller etter JSON
3. Bruk norsk datoformat hvis mulig
4. Hvis et felt mangler, bruk tom streng "" eller 0

Returner JSON med følgende struktur:
{
  "invoiceNumber": "",
  "invoiceDate": "YYYY-MM-DD",
  "dueDate": "YYYY-MM-DD",
  "supplier": {
    "name": "",
    "address": "",
    "orgNumber": ""
  },
  "customer": {
    "name": "",
    "address": ""
  },
  "totalAmount": 0,
  "totalVAT": 0,
  "totalWithVAT": 0,
  "currency": "NOK",
  "lineItems": [
    {
      "description": "",
      "quantity": 0,
      "unitPrice": 0,
      "vat": 0,
      "amount": 0
    }
  ],
  "paymentInfo": {
    "accountNumber": "",
    "kidNumber": ""
  }
}
```

---

## 🎯 Neste Steg

1. ✅ Deploy Node.js til Railway
2. ✅ Opprett Make.com scenario med alle moduler
3. ✅ Test med en ekte faktura
4. ✅ Oppdater webapp til å vise "Processing..." melding
5. ✅ Implementer callback-håndtering i webapp

---

**🤖 Laget for TopLogic - AIKI Integration**
