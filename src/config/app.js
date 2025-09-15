// App-konfigurasjon
export const APP_CONFIG = {
    // Generelle innstillinger
    maxFileSize: 10 * 1024 * 1024, // 10MB
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
    
    // Leverandører (for faktura-opplaster)
    suppliers: [
        { value: 'standardisert_mal', label: 'Standardisert mal' }
    ],
    
    // Meldinger
    messages: {
        success: {
            fakturaUploaded: 'Fakturaen er sendt til prosessering! Du vil motta resultatet på e-post.',
            prislisteUploaded: 'Prislisten er sendt til prosessering! Du vil motta resultatet på e-post.',
            documentUploaded: 'Dokumentet er sendt til prosessering! Du vil motta resultatet på e-post.',
            testMode: 'TEST MODUS: Dokumentet er sendt til test-webhook! Sjekk Make.com scenarioet for å se om data kom frem.'
        },
        error: {
            noUser: 'Vennligst velg hvem som laster opp',
            noSupplier: 'Vennligst velg leverandør',
            noDocumentType: 'Vennligst velg dokumenttype',
            noPriceType: 'Vennligst velg pristype',
            noFile: 'Vennligst velg en fil',
            noShipmentCount: 'Vennligst velg anslått antall sendinger',
            fileTooBig: 'Filen er for stor. Maksimal størrelse er 10MB.',
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