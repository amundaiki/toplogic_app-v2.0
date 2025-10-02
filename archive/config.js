// TopLogic Applikasjonskonfigurasjon - Oppdatert med standardisert mal

// Miljøkonfigurasjon
const ENVIRONMENT = {
    // Automatisk detekter miljø basert på URL
    isDevelopment: () => {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.protocol === 'file:';
    },
    
    isProduction: () => {
        return window.location.hostname === 'toplogic.aiki.as' ||
               window.location.hostname === 'www.toplogic.no' ||
               window.location.hostname === 'toplogic.no';
    }
};

// Webhook URLs - Make.com integrasjoner
const WEBHOOKS = {
    // Faktura-opplaster
    faktura: 'https://hook.eu2.make.com/we9l5rfpm86f7h6vtruiltlrc7dovdm6',
    
    // Prisliste-apper
    prisliste_bring_transport: 'https://hook.eu2.make.com/mwmlrm2esor86r8w3dnyr7elo557rc2j',
    prisliste_drivstoff: 'https://hook.eu2.make.com/your-fuel-webhook',
    prisliste_valuta: 'https://hook.eu2.make.com/your-currency-webhook',
    prisliste_miljo: 'https://hook.eu2.make.com/your-environment-webhook',
    
    // Dokument-uploader webhooks
    test: 'https://hook.eu2.make.com/0dr1p19z7s77nc34gntj7satvrejip2u',
    rapport_frakt: 'https://hook.eu2.make.com/your-freight-report-webhook',
    rapport_analyse: 'https://hook.eu2.make.com/your-analysis-webhook',
    dokument_annet: 'https://hook.eu2.make.com/your-other-doc-webhook',
    
    // Kostnadsanalyse (kommer senere)
    kostnadsanalyse: 'https://hook.eu2.make.com/your-cost-analysis-webhook'
};

// App-konfigurasjon
const APP_CONFIG = {
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
    
    // Meldinger
    // Kø-innstillinger for dokumentsending
    queue: {
        delayBetweenSends: 3000, // 3 sekunder mellom hver sending
        showCountdown: true // Vis nedtelling til brukeren
    },
    
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

// Logo URLs
const LOGOS = {
    toplogic: 'https://www.toplogic.no/wp-content/uploads/2023/01/Toplogic_norge_logo.svg',
    aiki: 'https://images.squarespace-cdn.com/content/v1/67a10d12887082593bb5d293/d39dc0a0-5a17-4ef9-88a4-2d0edb45fd5e/LOGO+l.png?format=500w'
};

// Navigation struktur
const NAVIGATION = {
    home: {
        title: 'TopLogic AI-Apper',
        url: '/',
        icon: 'home'
    },
    apps: {
        fakturaOpplaster: {
            title: 'PDF faktura til EXCEL',
            url: '/faktura-opplaster/',
            icon: 'document',
            locked: false
        },
        prislisteApp: {
            title: 'Prislister til EXCEL',
            url: '/prisliste-app/',
            icon: 'chart',
            locked: false
        },
        
    }
};

// Helper-funksjoner for konfigurasjon
const CONFIG_HELPERS = {
    // Hent webhook URL basert på type
    getWebhookUrl: (type) => {
        const url = WEBHOOKS[type];
        if (!url) {
            console.warn(`Webhook URL not found for type: ${type}`);
        }
        return url;
    },
    
    // Valider filtype
    isValidFileType: (file, allowedTypes = 'pdf') => {
        const types = APP_CONFIG.allowedFileTypes[allowedTypes] || APP_CONFIG.allowedFileTypes.pdf;
        return types.includes(file.type) || file.name.toLowerCase().endsWith('.pdf');
    },
    
    // Valider filstørrelse
    isValidFileSize: (file) => {
        return file.size <= APP_CONFIG.maxFileSize;
    },
    
    // Generer timestamp
    getTimestamp: () => {
        return new Date().toISOString();
    },
    
    // Debugging info
    getDebugInfo: () => {
        return {
            environment: ENVIRONMENT.isDevelopment() ? 'development' : 'production',
            url: window.location.href,
            protocol: window.location.protocol,
            hostname: window.location.hostname
        };
    }
};

// Status sjekk for file:// protocol
const STATUS_CHECK = {
    checkFileProtocol: () => {
        if (window.location.protocol === 'file:') {
            console.warn('WARNING: Running from file:// protocol. This may cause issues with webhooks.');
            return {
                hasWarning: true,
                message: APP_CONFIG.messages.info.fileProtocolWarning
            };
        }
        return { hasWarning: false };
    }
};

// Export til global scope (siden vi ikke bruker modules)
window.TopLogicConfig = {
    ENVIRONMENT,
    WEBHOOKS,
    APP_CONFIG,
    LOGOS,
    NAVIGATION,
    CONFIG_HELPERS,
    STATUS_CHECK
};

// Debug: Vis leverandører i konsollen
console.log('🔄 TopLogic Config v5 lastet - Leverandører:', APP_CONFIG.suppliers);
console.log('✅ Standardisert mal øverst i listen!'); 