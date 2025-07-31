import { WEBHOOKS } from '../config/webhooks.js';
import { APP_CONFIG } from '../config/app.js';
import { ENVIRONMENT } from '../config/environment.js';

// Helper-funksjoner for konfigurasjon
export const CONFIG_HELPERS = {
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
export const STATUS_CHECK = {
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