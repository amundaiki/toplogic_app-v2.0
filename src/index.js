// Hovedindex for TopLogic - ES6 modules entry point
import { TopLogicApp } from './components/toplogic-app.js';
import { AppPasswordManager } from './components/password-manager.js';
import { TopLogicUtils } from './utils/toplogic-utils.js';
import { TopLogicConfig } from './config/index.js';

// Eksporter alt for enkel import
export {
    TopLogicApp,
    AppPasswordManager,
    TopLogicUtils,
    TopLogicConfig
};

// Gjør det tilgjengelig globalt for bakoverkompatibilitet (hvis nødvendig)
if (typeof window !== 'undefined') {
    window.TopLogicApp = TopLogicApp;
    window.AppPasswordManager = AppPasswordManager;
    window.TopLogicUtils = TopLogicUtils;
    window.TopLogicConfig = TopLogicConfig;
}

// Standard eksporter for enkel import
export default {
    TopLogicApp,
    AppPasswordManager,
    TopLogicUtils,
    TopLogicConfig
};