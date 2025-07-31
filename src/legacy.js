// Legacy support - laster alt som globale variabler for gammel kode
// Denne filen kan brukes for å opprettholde bakoverkompatibilitet

import { TopLogicApp } from './components/toplogic-app.js';
import { AppPasswordManager } from './components/password-manager.js';
import { TopLogicUtils } from './utils/toplogic-utils.js';
import { TopLogicConfig } from './config/index.js';

// Setter opp globale variabler som den gamle koden forventer
window.TopLogicApp = TopLogicApp;
window.AppPasswordManager = AppPasswordManager;
window.TopLogicUtils = TopLogicUtils;
window.TopLogicConfig = TopLogicConfig;

console.log('🔄 TopLogic Legacy Support loaded - All modules available globally');