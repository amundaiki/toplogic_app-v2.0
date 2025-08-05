import { TopLogicConfig } from '../config/index.js';

// TopLogic Shared JavaScript Functionality
export class TopLogicApp {
    constructor(options = {}) {
        this.config = TopLogicConfig;
        this.options = {
            enableDragDrop: true,
            enableStatusCheck: true,
            enableNavigation: true,
            ...options
        };
        this.init();
    }

    init() {
        this.initStatusCheck();
        this.initNavigation();
        this.logDebugInfo();
    }

    // Status sjekk for file:// protocol
    initStatusCheck() {
        if (!this.options.enableStatusCheck) return;
        
        const statusCheck = this.config.STATUS_CHECK.checkFileProtocol();
        if (statusCheck.hasWarning) {
            this.showStatusWarning(statusCheck.message);
        }
    }

    showStatusWarning(message) {
        const existingWarning = document.getElementById('statusCheck');
        if (existingWarning) {
            existingWarning.style.display = 'block';
            const messageElement = document.getElementById('statusMessage');
            if (messageElement) {
                messageElement.textContent = message;
            }
        } else {
            // Lag ny advarsel hvis den ikke finnes
            const warning = document.createElement('div');
            warning.id = 'statusCheck';
            warning.style.cssText = 'background: #fff3cd; color: #856404; padding: 10px; text-align: center; font-size: 14px;';
            warning.innerHTML = `<strong>Advarsel:</strong> <span>${message}</span>`;
            
            const container = document.querySelector('.toplogic-container');
            if (container) {
                container.insertBefore(warning, container.firstChild);
            }
        }
    }

    // Initialiser navigasjon og breadcrumbs
    initNavigation() {
        if (!this.options.enableNavigation) return;
        
        this.createNavigationBar();
        this.createBackLink();
    }

    createNavigationBar() {
        // Sjekk om navigation allerede eksisterer
        if (document.querySelector('.toplogic-navigation')) return;

        const nav = document.createElement('nav');
        nav.className = 'toplogic-navigation';
        
        const navContent = document.createElement('div');
        navContent.className = 'nav-content';
        
        // Logo
        const logoLink = document.createElement('a');
                        logoLink.href = '/';
        logoLink.innerHTML = `<img src="${this.config.LOGOS.toplogic}" alt="TopLogic" class="nav-logo">`;
        
        // Breadcrumb
        const breadcrumb = this.createBreadcrumb();
        
        navContent.appendChild(logoLink);
        navContent.appendChild(breadcrumb);
        nav.appendChild(navContent);
        
        document.body.insertBefore(nav, document.body.firstChild);
    }

    createBreadcrumb() {
        const breadcrumb = document.createElement('div');
        breadcrumb.className = 'breadcrumb';
        
        const currentPath = window.location.pathname;
        const segments = currentPath.split('/').filter(segment => segment);
        
        // Hjem lenke
        const homeLink = document.createElement('a');
                        homeLink.href = '/';
        homeLink.textContent = this.config.NAVIGATION.home.title;
        breadcrumb.appendChild(homeLink);
        
        // Hvis vi ikke er på hjemmesiden
        if (segments.length > 0) {
            const separator = document.createElement('span');
            separator.className = 'breadcrumb-separator';
            separator.textContent = ' / ';
            breadcrumb.appendChild(separator);
            
            // Finn gjeldende app
            const currentApp = this.getCurrentApp(currentPath);
            if (currentApp) {
                const appSpan = document.createElement('span');
                appSpan.textContent = currentApp.title;
                breadcrumb.appendChild(appSpan);
            }
        }
        
        return breadcrumb;
    }

    getCurrentApp(path) {
        const apps = this.config.NAVIGATION.apps;
        for (const [key, app] of Object.entries(apps)) {
            if (path.includes(app.url.replace('/', ''))) {
                return app;
            }
        }
        return null;
    }

    createBackLink() {
        // Sjekk om vi ikke er på hovedsiden
                    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            return;
        }

        const backLink = document.createElement('a');
                        backLink.href = '/';
        backLink.className = 'back-link';
        backLink.textContent = 'Tilbake til hovedside';
        
        const container = document.querySelector('.toplogic-content');
        if (container) {
            container.insertBefore(backLink, container.firstChild);
        }
    }

    // Debug-informasjon
    logDebugInfo() {
        const debug = this.config.CONFIG_HELPERS.getDebugInfo();
        console.log('TopLogic App Debug Info:', debug);
    }

    // Generisk fil-opplasting funksjonalitet
    setupFileUpload(fileInputId, options = {}) {
        const defaults = {
            allowedTypes: 'pdf',
            enableDragDrop: true,
            onFileSelect: null,
            onValidationError: null
        };
        
        const settings = { ...defaults, ...options };
        const fileInput = document.getElementById(fileInputId);
        const dropZone = fileInput?.closest('.file-upload-area');
        const fileInfo = document.getElementById('fileInfo');
        const fileName = document.getElementById('fileName');
        
        if (!fileInput) {
            console.error(`File input with id '${fileInputId}' not found`);
            return;
        }

        // File input change handler
        fileInput.addEventListener('change', (e) => {
            this.handleFileSelection(e.target.files, settings, fileInfo, fileName);
        });

        // Drag and drop hvis aktivert
        if (settings.enableDragDrop && dropZone) {
            this.setupDragAndDrop(dropZone, fileInput, settings, fileInfo, fileName);
        }
    }

    setupDragAndDrop(dropZone, fileInput, settings, fileInfo, fileName) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.add('drag-over'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.remove('drag-over'), false);
        });

        dropZone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            fileInput.files = files;
            this.handleFileSelection(files, settings, fileInfo, fileName);
        });
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleFileSelection(files, settings, fileInfo, fileName) {
        if (files.length === 0) return;

        const validFiles = [];
        const invalidFiles = [];

        // Valider alle filer
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Valider filtype
            if (!this.config.CONFIG_HELPERS.isValidFileType(file, settings.allowedTypes)) {
                invalidFiles.push(`${file.name}: Ugyldig filtype`);
                continue;
            }

            // Valider filstørrelse
            if (!this.config.CONFIG_HELPERS.isValidFileSize(file)) {
                invalidFiles.push(`${file.name}: Filen er for stor`);
                continue;
            }

            validFiles.push(file);
        }

        // Vis feilmeldinger for ugyldige filer
        if (invalidFiles.length > 0) {
            const error = `Følgende filer kan ikke lastes opp:\n${invalidFiles.join('\n')}`;
            if (settings.onValidationError) {
                settings.onValidationError(error);
            }
        }

        // Hvis ingen gyldige filer, returner
        if (validFiles.length === 0) return;

        // Oppdater UI for flere filer
        if (fileName && fileInfo) {
            if (validFiles.length === 1) {
                fileName.textContent = validFiles[0].name;
            } else {
                fileName.innerHTML = `<strong>${validFiles.length} fakturaer valgt:</strong><br>` + 
                    validFiles.map(f => `• ${f.name}`).join('<br>');
            }
            fileInfo.classList.add('show');
        }

        // Callback med alle gyldige filer
        if (settings.onFileSelect) {
            settings.onFileSelect(validFiles.length === 1 ? validFiles[0] : validFiles);
        }
    }

    // Generisk form submission
    async submitForm(formData, webhookType, options = {}) {
        const defaults = {
            onStart: null,
            onProgress: null,
            onSuccess: null,
            onError: null,
            onComplete: null,
            progressInterval: 200
        };
        
        const settings = { ...defaults, ...options };
        const webhookUrl = this.config.CONFIG_HELPERS.getWebhookUrl(webhookType);
        
        if (!webhookUrl) {
            const error = `Webhook URL ikke funnet for type: ${webhookType}`;
            if (settings.onError) settings.onError(error);
            return;
        }

        // Start loading
        if (settings.onStart) settings.onStart();

        // Simuler progress hvis aktivert
        let progressInterval;
        if (settings.onProgress) {
            let progress = 0;
            progressInterval = setInterval(() => {
                progress += 10;
                settings.onProgress(Math.min(progress, 90));
            }, settings.progressInterval);
        }

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                body: formData
            });

            if (progressInterval) {
                clearInterval(progressInterval);
                if (settings.onProgress) settings.onProgress(100);
            }

            if (!response.ok) {
                throw new Error(this.config.APP_CONFIG.messages.error.serverError.replace('{status}', response.status));
            }

            // Success
            const successMessage = webhookType === 'test' 
                ? this.config.APP_CONFIG.messages.success.testMode
                : this.config.APP_CONFIG.messages.success.documentUploaded;
            
            if (settings.onSuccess) settings.onSuccess(successMessage);

        } catch (error) {
            if (progressInterval) clearInterval(progressInterval);
            const errorMessage = this.config.APP_CONFIG.messages.error.networkError.replace('{message}', error.message);
            if (settings.onError) settings.onError(errorMessage);
        } finally {
            if (settings.onComplete) settings.onComplete();
        }
    }

    // Vis meldinger
    showMessage(text, type = 'info', duration = 5000) {
        const messageElement = document.getElementById('message');
        if (!messageElement) return;

        messageElement.textContent = text;
        messageElement.className = `message ${type} show`;

        if (type === 'success' && duration > 0) {
            setTimeout(() => {
                messageElement.classList.remove('show');
            }, duration);
        }
    }

    // Progress bar kontroll
    setProgress(percentage, show = true) {
        const progressBar = document.getElementById('progressBar');
        const progressFill = document.getElementById('progressFill');
        
        if (progressBar && show) {
            progressBar.classList.add('show');
        }
        
        if (progressFill) {
            progressFill.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
        }
        
        if (percentage >= 100 && progressBar) {
            setTimeout(() => {
                progressBar.classList.remove('show');
                if (progressFill) progressFill.style.width = '0%';
            }, 1000);
        }
    }

    // Loading state kontroll
    setLoadingState(isLoading, buttonId = 'submitBtn') {
        const button = document.getElementById(buttonId);
        const spinner = document.getElementById('loadingSpinner');
        
        if (button) {
            button.disabled = isLoading;
        }
        
        if (spinner) {
            spinner.style.display = isLoading ? 'block' : 'none';
        }
    }

    // Nullstill form
    resetForm(formId, options = {}) {
        const form = document.getElementById(formId);
        if (!form) return;

        form.reset();
        
        // Skjul file info
        const fileInfo = document.getElementById('fileInfo');
        if (fileInfo) fileInfo.classList.remove('show');
        
        // Skjul meldinger
        const message = document.getElementById('message');
        if (message) message.classList.remove('show');
        
        // Reset progress
        this.setProgress(0, false);
        
        // Tilleggs-reset logikk
        if (options.onReset) options.onReset();
    }

    // Auto-detect dokumenttype basert på filnavn
    autoSelectDocumentType(filename, selectId) {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        const lowerFilename = filename.toLowerCase();
        
        if (lowerFilename.includes('test')) {
            select.value = 'test';
        } else if (lowerFilename.includes('bring')) {
            select.value = 'faktura_bring';
        } else if (lowerFilename.includes('ups')) {
            select.value = 'faktura_ups';
        } else if (lowerFilename.includes('dhl')) {
            select.value = 'faktura_dhl';
        } else if (lowerFilename.includes('postnord')) {
            select.value = 'faktura_postnord';
        } else if (lowerFilename.includes('fedex')) {
            select.value = 'faktura_fedex';
        } else if (lowerFilename.includes('schenker')) {
            select.value = 'faktura_schenker';
        } else if (lowerFilename.includes('ntg')) {
            select.value = 'faktura_ntg';
        }
    }
}