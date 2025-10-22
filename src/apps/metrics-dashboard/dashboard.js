// Dashboard JavaScript - Metrics & Statistikk
import { supabase } from '../../config/supabase.js';

class Dashboard {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.sortColumn = 'created_at';
        this.sortDirection = 'desc';
        this.searchTerm = '';
        this.filterPeriod = 7; // dager
        
        this.activityChart = null;
        this.breakdownChart = null;
        
        this.init();
    }

    async init() {
        console.log('🚀 Initialiserer Dashboard...');
        
        try {
            // Initialiser event listeners
            this.initEventListeners();
            
            // Last inn alle data med mock data
            await this.loadDashboardData();
            
            this.updateLastUpdated();
            
            console.log('✅ Dashboard initialisert');
            
        } catch (error) {
            console.error('❌ Feil ved initialisering av dashboard:', error);
            this.showError();
        }
    }

    initEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterPeriod = parseInt(e.target.dataset.period);
                this.updateCharts();
            });
        });

        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.currentPage = 1;
                this.updateActivityTable();
            });
        }

        // Table sorting
        document.querySelectorAll('[data-sort]').forEach(th => {
            th.addEventListener('click', (e) => {
                const column = e.target.dataset.sort;
                if (this.sortColumn === column) {
                    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortColumn = column;
                    this.sortDirection = 'desc';
                }
                this.updateActivityTable();
            });
        });

        // Pagination
        document.getElementById('prevPage').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.updateActivityTable();
            }
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            this.currentPage++;
            this.updateActivityTable();
        });

        // Retry button
        document.getElementById('retryButton').addEventListener('click', () => {
            this.init();
        });
    }

    async loadDashboardData() {
        console.log('📊 Laster dashboard-data fra Supabase...');
        
        try {
            // Prøv å laste ekte data fra Supabase
            const [kpiData, chartData, activityData] = await Promise.all([
                this.loadKPIDataFromSupabase(),
                this.loadChartDataFromSupabase(),
                this.loadActivityDataFromSupabase()
            ]);

            // Oppdater UI
            this.updateKPICards(kpiData);
            this.updateCharts(chartData);
            this.updateActivityTable(activityData);

        } catch (error) {
            console.warn('⚠️ Supabase ikke tilgjengelig, bruker mock data:', error);
            
            // Fallback til mock data
            const kpiData = this.getMockKPIData();
            const chartData = this.getMockChartData();
            const activityData = this.getMockActivityData();

            this.updateKPICards(kpiData);
            this.updateCharts(chartData);
            this.updateActivityTable(activityData);
        }
    }

    async loadKPIDataFromSupabase() {
        console.log('📈 Laster KPI-data fra Supabase...');
        
        if (!supabase) {
            throw new Error('Supabase ikke tilgjengelig');
        }

        const { data, error } = await supabase
            .from('dashboard_kpis')
            .select('*')
            .single();

        if (error) {
            console.error('Feil ved lasting av KPI-data:', error);
            throw error;
        }

        return {
            totalTimeSaved: data.total_time_saved_hours || 0,
            totalAutomations: data.total_automations || 0,
            activeCustomers: data.active_customers || 0,
            efficiencyRate: data.total_automations > 0 ? 95.0 : 0
        };
    }

    async loadChartDataFromSupabase() {
        console.log('📊 Laster chart-data fra Supabase...');
        
        if (!supabase) {
            throw new Error('Supabase ikke tilgjengelig');
        }

        const days = this.filterPeriod;
        const { data, error } = await supabase
            .from('daily_activity')
            .select('*')
            .order('activity_date', { ascending: false })
            .limit(days);

        if (error) {
            console.error('Feil ved lasting av chart-data:', error);
            throw error;
        }

        // Konverter til format som Chart.js forventer
        const labels = data.map(item => 
            new Date(item.activity_date).toLocaleDateString('no-NO', { 
                month: 'short', 
                day: 'numeric' 
            })
        ).reverse();

        const chartData = data.map(item => item.automation_count).reverse();

        return {
            activity: { labels, data: chartData }
        };
    }

    async loadActivityDataFromSupabase() {
        console.log('📋 Laster aktivitetsdata fra Supabase...');
        
        if (!supabase) {
            throw new Error('Supabase ikke tilgjengelig');
        }

        const { data, error } = await supabase
            .from('automation_logs')
            .select('*')
            .neq('user_name', 'Amund')
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            console.error('Feil ved lasting av aktivitetsdata:', error);
            throw error;
        }

        return data || [];
    }

    getMockKPIData() {
        return {
            totalTimeSaved: 125.5,
            totalAutomations: 89,
            activeCustomers: 12,
            efficiencyRate: 94.5
        };
    }

    getMockChartData() {
        const days = this.filterPeriod;
        const activityData = this.generateMockActivityData(days);
        const breakdownData = this.generateMockBreakdownData();
        
        return {
            activity: activityData,
            breakdown: breakdownData
        };
    }

    getMockActivityData() {
        return [
            {
                id: '1',
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
                automation_type: 'faktura',
                user_name: 'Kunde A',
                file_count: 1,
                time_saved_minutes: 5,
                status: 'completed',
                supplier: 'Uno-X'
            },
            {
                id: '2',
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
                automation_type: 'prisliste_bring_transport',
                user_name: 'Kunde B',
                file_count: 1,
                time_saved_minutes: 10,
                status: 'completed',
                supplier: null
            },
            {
                id: '3',
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
                automation_type: 'faktura',
                user_name: 'Kunde C',
                file_count: 3,
                time_saved_minutes: 15,
                status: 'completed',
                supplier: 'Shell'
            },
            {
                id: '4',
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
                automation_type: 'faktura',
                user_name: 'Kunde A',
                file_count: 2,
                time_saved_minutes: 10,
                status: 'completed',
                supplier: 'Circle K'
            },
            {
                id: '5',
                created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
                automation_type: 'prisliste_bring_transport',
                user_name: 'Kunde D',
                file_count: 1,
                time_saved_minutes: 10,
                status: 'completed',
                supplier: null
            }
        ];
    }

    generateMockActivityData(days) {
        const data = [];
        const labels = [];
        
        // Generer data for siste 3 måneder (90 dager)
        for (let i = 89; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('no-NO', { month: 'short', day: 'numeric' }));
            
            // Generer realistisk data med noe variasjon
            const baseValue = 3;
            const variation = Math.sin(i * 0.1) * 2 + Math.random() * 3;
            data.push(Math.max(0, Math.floor(baseValue + variation)));
        }
        
        return { labels, data };
    }

    generateMockBreakdownData() {
        return {
            labels: ['Fakturaer', 'Prislister', 'Andre'],
            data: [65, 25, 10]
        };
    }

    updateKPICards(data) {
        console.log('📈 Oppdaterer KPI-kort...');
        
        // Total tidsbesparelse
        const totalTimeElement = document.getElementById('totalTimeSaved');
        if (totalTimeElement) {
            totalTimeElement.textContent = `${data.totalTimeSaved}h`;
        }

        // Total automations
        const totalAutomationsElement = document.getElementById('totalAutomations');
        if (totalAutomationsElement) {
            totalAutomationsElement.textContent = data.totalAutomations.toLocaleString();
        }

        // Aktive kunder
        const activeCustomersElement = document.getElementById('activeCustomers');
        if (activeCustomersElement) {
            activeCustomersElement.textContent = data.activeCustomers.toLocaleString();
        }

        // Effektivitetsrate
        const efficiencyRateElement = document.getElementById('efficiencyRate');
        if (efficiencyRateElement) {
            efficiencyRateElement.textContent = `${data.efficiencyRate}%`;
        }
    }

    updateCharts(chartData) {
        console.log('📊 Oppdaterer grafer...');
        
        if (!chartData) {
            chartData = this.getMockChartData();
        }
        
        this.updateActivityChart(chartData.activity);
    }

    updateActivityChart(data) {
        const ctx = document.getElementById('activityChart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.activityChart) {
            this.activityChart.destroy();
        }

        this.activityChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Automations per dag',
                    data: data.data,
                    borderColor: '#c72027',
                    backgroundColor: 'rgba(199, 32, 39, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#c72027',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            stepSize: 1,
                            color: '#a1a1aa'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#a1a1aa'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    updateBreakdownChart(data) {
        const ctx = document.getElementById('breakdownChart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.breakdownChart) {
            this.breakdownChart.destroy();
        }

        this.breakdownChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.data,
                    backgroundColor: [
                        '#c72027',
                        '#ff6b6b',
                        '#4ecdc4'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 3,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    updateActivityTable(data) {
        console.log('📋 Oppdaterer aktivitetstabell...');
        
        if (!data || data.length === 0) {
            this.renderEmptyTable();
            return;
        }

        this.renderActivityTable(data);
    }

    renderActivityTable(data) {
        const tbody = document.getElementById('activityTableBody');
        if (!tbody) return;

        tbody.innerHTML = data.map(item => `
            <tr>
                <td>${this.formatDate(item.created_at)}</td>
                <td>${this.formatAutomationType(item.automation_type)}</td>
                <td>${item.user_name}</td>
                <td>${item.file_count}</td>
                <td>${item.time_saved_minutes} min</td>
                <td><span class="status-badge status-${item.status}">${item.status}</span></td>
            </tr>
        `).join('');
    }

    renderEmptyTable() {
        const tbody = document.getElementById('activityTableBody');
        if (!tbody) return;

        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-row">
                    <div class="empty-state">
                        <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <p>Ingen data tilgjengelig</p>
                    </div>
                </td>
            </tr>
        `;
    }

    updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        
        // Update pagination info
        const paginationInfo = document.getElementById('paginationInfo');
        if (paginationInfo) {
            const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
            const endItem = Math.min(this.currentPage * this.itemsPerPage, totalItems);
            paginationInfo.textContent = `Viser ${startItem}-${endItem} av ${totalItems}`;
        }

        // Update prev/next buttons
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        
        if (prevBtn) prevBtn.disabled = this.currentPage <= 1;
        if (nextBtn) nextBtn.disabled = this.currentPage >= totalPages;

        // Update page buttons
        const paginationPages = document.getElementById('paginationPages');
        if (paginationPages) {
            let pagesHtml = '';
            
            // Show max 5 pages around current page
            const startPage = Math.max(1, this.currentPage - 2);
            const endPage = Math.min(totalPages, startPage + 4);
            
            for (let i = startPage; i <= endPage; i++) {
                pagesHtml += `<button class="page-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            
            paginationPages.innerHTML = pagesHtml;
            
            // Add event listeners to page buttons
            paginationPages.querySelectorAll('.page-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.currentPage = parseInt(e.target.dataset.page);
                    this.updateActivityTable();
                });
            });
        }
    }

    updateSortIndicators() {
        // Remove all sort indicators
        document.querySelectorAll('[data-sort]').forEach(th => {
            th.classList.remove('asc', 'desc');
        });

        // Add indicator to current sort column
        const currentTh = document.querySelector(`[data-sort="${this.sortColumn}"]`);
        if (currentTh) {
            currentTh.classList.add(this.sortDirection);
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('no-NO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatAutomationType(type) {
        const types = {
            'faktura': '📄 Faktura',
            'prisliste_bring_transport': '📈 Prisliste (Bring)',
            'prisliste_drivstoff': '⛽ Prisliste (Drivstoff)',
            'prisliste_valuta': '💱 Prisliste (Valuta)',
            'prisliste_miljo': '🌱 Prisliste (Miljø)'
        };
        return types[type] || type;
    }

    updateLastUpdated() {
        const lastUpdatedTime = document.getElementById('lastUpdatedTime');
        if (lastUpdatedTime) {
            lastUpdatedTime.textContent = new Date().toLocaleTimeString('no-NO');
        }
    }

    showLoading(show) {
        // Loading er alltid skjult siden vi bruker mock data
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    showError() {
        this.showLoading(false);
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.style.display = 'block';
        }
    }
}

// Initialiser dashboard når DOM er lastet
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});

// Auto-refresh hver 30 sekunder
setInterval(() => {
    if (window.dashboard) {
        console.log('🔄 Auto-refreshing dashboard...');
        window.dashboard.loadDashboardData();
        window.dashboard.updateLastUpdated();
    }
}, 30000);
