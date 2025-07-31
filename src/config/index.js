// Hovedkonfigurasjonsfil - samler alle konfigurasjoner
import { ENVIRONMENT } from './environment.js';
import { WEBHOOKS } from './webhooks.js';
import { APP_CONFIG } from './app.js';
import { LOGOS, NAVIGATION } from './branding.js';
import { CONFIG_HELPERS, STATUS_CHECK } from '../utils/config-helpers.js';

// Samlet konfigurasjon for bakoverkompatibilitet
export const TopLogicConfig = {
    ENVIRONMENT,
    WEBHOOKS,
    APP_CONFIG,
    LOGOS,
    NAVIGATION,
    CONFIG_HELPERS,
    STATUS_CHECK
};

// Eksporter individuelle moduler også
export {
    ENVIRONMENT,
    WEBHOOKS,
    APP_CONFIG,
    LOGOS,
    NAVIGATION,
    CONFIG_HELPERS,
    STATUS_CHECK
};

// Debug: Vis leverandører i konsollen
console.log('🔄 TopLogic Config v6 lastet (ES6 modules) - Leverandører:', APP_CONFIG.suppliers);
console.log('✅ Standardisert mal øverst i listen!');