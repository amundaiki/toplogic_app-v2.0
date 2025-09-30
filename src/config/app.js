// App-konfigurasjon
export const APP_CONFIG = {
    // Generelle innstillinger
    maxFileSize: 50 * 1024 * 1024, // 50MB
    maxFileSizeMB: 50, // For debugging
    allowedFileTypes: {
        pdf: ['application/pdf'],
        excel: [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/vnd.ms-excel', // .xls
            'text/csv' // .csv
        ]
    },
    
    // Brukere (for faktura-opplaster)
    users: [
        { value: 'Peter', label: 'Peter' },
        { value: 'Janne', label: 'Janne' },
        { value: 'Amund', label: 'Amund' }
    ],
    
    // Leverandører (for faktura-opplaster - hardkodet i HTML)
    suppliers: [],
    
    // Kø-innstillinger for dokumentsending
    queue: {
        delayBetweenSends: 3000, // 3 sekunder mellom hver sending
        showCountdown: true // Vis nedtelling til brukeren
    },
    
    // Meldinger
    messages: {
        success: {
            fakturaUploaded: 'Fakturaen er sendt til prosessering! Du vil motta resultatet på e-post.',
            prislisteUploaded: 'Prislisten er sendt til prosessering! Du vil motta resultatet på e-post.',
            documentUploaded: 'Dokumentet er sendt til prosessering! Du vil motta resultatet på e-post.',
            testMode: 'TEST MODUS: Dokumentet er sendt til test-webhook! Sjekk Make.com scenarioet for å se om data kom frem.',
            queueStarted: 'Sender {count} dokumenter med {delay} sekunder mellom hver...',
            queueProgress: 'Sender dokument {current} av {total}...',
            queueCompleted: 'Alle {count} dokumenter er sendt!'
        },
        error: {
            noUser: 'Vennligst velg hvem som laster opp',
            noSupplier: 'Vennligst velg leverandør',
            noDocumentType: 'Vennligst velg dokumenttype',
            noPriceType: 'Vennligst velg pristype',
            noFile: 'Vennligst velg en fil',
            noShipmentCount: 'Vennligst velg anslått antall sendinger',
            fileTooBig: 'Filen er for stor. Maksimal størrelse er 50MB.',
            invalidFileType: 'Ugyldig filtype. Kun PDF-filer er støttet.',
            noDescription: 'Vennligst beskriv hvilken liste dette er og hva som skal hentes.',
            serverError: 'Server svarte {status}',
            networkError: 'Feil: {message}. Sjekk konsollen for detaljer.'
        },
        info: {
            uploading: 'Sender til Make.com...',
            fileProtocolWarning: 'Filen kjører lokalt (file://). Dette kan forårsake problemer med opplasting. Vennligst bruk en webserver.'
        }
    }
};