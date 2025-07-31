// Miljøkonfigurasjon
export const ENVIRONMENT = {
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