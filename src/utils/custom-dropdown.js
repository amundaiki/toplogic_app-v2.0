// Custom Dropdown Component - Modern shadcn/ui stil
class CustomDropdown {
    constructor(selectElement, options = {}) {
        this.selectElement = selectElement;
        this.options = {
            placeholder: 'Velg...',
            searchable: false,
            ...options
        };
        
        this.isOpen = false;
        this.selectedOption = null;
        this.focusedIndex = -1;
        
        this.init();
    }
    
    init() {
        this.createCustomDropdown();
        this.bindEvents();
        this.populateOptions();
    }
    
    createCustomDropdown() {
        // Create wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'custom-dropdown';
        
        // Create trigger
        this.trigger = document.createElement('button');
        this.trigger.type = 'button';
        this.trigger.className = 'custom-dropdown-trigger placeholder';
        this.trigger.innerHTML = `
            <span class="trigger-text">${this.options.placeholder}</span>
            <i data-lucide="chevron-down" class="select-arrow"></i>
        `;
        
        // Create content
        this.content = document.createElement('div');
        this.content.className = 'custom-dropdown-content';
        
        // Replace original select
        this.selectElement.parentNode.insertBefore(this.wrapper, this.selectElement);
        this.wrapper.appendChild(this.trigger);
        this.wrapper.appendChild(this.content);
        this.wrapper.appendChild(this.selectElement);
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    populateOptions() {
        this.content.innerHTML = '';
        const options = Array.from(this.selectElement.options);
        
        options.forEach((option, index) => {
            if (option.value === '') return; // Skip placeholder
            
            const optionElement = document.createElement('button');
            optionElement.type = 'button';
            optionElement.className = 'custom-dropdown-option';
            optionElement.dataset.value = option.value;
            optionElement.dataset.index = index;
            
            // Handle emoji icons (like 🚚)
            const text = option.textContent;
            const emojiMatch = text.match(/^([🚚👤🏢📊📈📑📤]+)\s*(.*)$/);
            
            if (emojiMatch) {
                optionElement.innerHTML = `
                    <span class="option-icon">${emojiMatch[1]}</span>
                    <span class="option-text">${emojiMatch[2]}</span>
                `;
            } else {
                optionElement.innerHTML = `<span class="option-text">${text}</span>`;
            }
            
            this.content.appendChild(optionElement);
        });
        
        if (this.content.children.length === 0) {
            this.content.innerHTML = '<div class="custom-dropdown-empty">Ingen alternativer tilgjengelig</div>';
        }
    }
    
    bindEvents() {
        // Trigger click
        this.trigger.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggle();
        });
        
        // Option clicks
        this.content.addEventListener('click', (e) => {
            const option = e.target.closest('.custom-dropdown-option');
            if (option) {
                this.selectOption(option);
            }
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.wrapper.contains(e.target)) {
                this.close();
            }
        });
        
        // Keyboard navigation
        this.wrapper.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });
        
        // Listen for programmatic changes to original select
        this.selectElement.addEventListener('change', () => {
            this.updateFromSelect();
        });
        
        // Handle form reset
        this.selectElement.form?.addEventListener('reset', () => {
            setTimeout(() => this.updateFromSelect(), 0);
        });
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        this.isOpen = true;
        this.wrapper.classList.add('open');
        this.focusedIndex = -1;
        
        // Focus first option if none selected
        if (!this.selectedOption && this.content.children.length > 0) {
            this.focusedIndex = 0;
            this.updateFocus();
        }
    }
    
    close() {
        this.isOpen = false;
        this.wrapper.classList.remove('open');
        this.focusedIndex = -1;
        this.updateFocus();
    }
    
    selectOption(optionElement) {
        const value = optionElement.dataset.value;
        const text = optionElement.querySelector('.option-text').textContent;
        const icon = optionElement.querySelector('.option-icon')?.textContent || '';
        
        // Update original select
        this.selectElement.value = value;
        this.selectElement.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Update trigger
        this.trigger.innerHTML = `
            <span class="trigger-text">
                ${icon ? `<span class="option-icon">${icon}</span>` : ''}
                ${text}
            </span>
            <i data-lucide="chevron-down" class="select-arrow"></i>
        `;
        
        // Update classes
        this.trigger.classList.remove('placeholder');
        this.trigger.classList.add('has-value');
        
        // Update selected state
        this.content.querySelectorAll('.custom-dropdown-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        optionElement.classList.add('selected');
        
        this.selectedOption = optionElement;
        
        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        this.close();
    }
    
    updateFromSelect() {
        const selectedOption = this.selectElement.selectedOptions[0];
        if (selectedOption && selectedOption.value) {
            const customOption = this.content.querySelector(`[data-value="${selectedOption.value}"]`);
            if (customOption) {
                this.selectOption(customOption);
            }
        } else {
            this.reset();
        }
    }
    
    reset() {
        this.trigger.innerHTML = `
            <span class="trigger-text">${this.options.placeholder}</span>
            <i data-lucide="chevron-down" class="select-arrow"></i>
        `;
        this.trigger.classList.add('placeholder');
        this.trigger.classList.remove('has-value');
        
        this.content.querySelectorAll('.custom-dropdown-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        this.selectedOption = null;
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    handleKeydown(e) {
        if (!this.isOpen) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                this.open();
            }
            return;
        }
        
        const options = Array.from(this.content.querySelectorAll('.custom-dropdown-option'));
        
        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                this.close();
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                this.focusedIndex = Math.min(this.focusedIndex + 1, options.length - 1);
                this.updateFocus();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
                this.updateFocus();
                break;
                
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (this.focusedIndex >= 0 && options[this.focusedIndex]) {
                    this.selectOption(options[this.focusedIndex]);
                }
                break;
        }
    }
    
    updateFocus() {
        const options = Array.from(this.content.querySelectorAll('.custom-dropdown-option'));
        options.forEach((option, index) => {
            if (index === this.focusedIndex) {
                option.focus();
                option.scrollIntoView({ block: 'nearest' });
            }
        });
    }
    
    // Method to refresh options (useful when original select is populated via JS)
    refresh() {
        this.populateOptions();
        this.updateFromSelect();
    }
    
    // Method to add new option
    addOption(value, text, icon = '') {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = icon ? `${icon} ${text}` : text;
        this.selectElement.appendChild(option);
        this.refresh();
    }
    
    // Method to remove option
    removeOption(value) {
        const option = this.selectElement.querySelector(`option[value="${value}"]`);
        if (option) {
            option.remove();
            this.refresh();
        }
    }
}

// Export for use in other files
window.CustomDropdown = CustomDropdown;