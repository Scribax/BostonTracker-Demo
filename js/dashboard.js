// Main dashboard functionality for Boston Tracker Demo
class DashboardManager {
    constructor() {
        this.currentTab = 'tracking';
        this.filteredDeliveries = [];
        this.filteredUsers = [];
        this.selectedDeliveryId = null;
        this.connectionStatus = 'connected';
    }

    init() {
        this.setupEventListeners();
        this.loadDeliveryList();
        this.loadUserManagement();
        this.loadTripHistory();
        this.loadAPKManagement();
        this.simulateConnectionStatus();
        this.startPeriodicUpdates();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
            tab.addEventListener('shown.bs.tab', (e) => {
                this.currentTab = e.target.getAttribute('data-bs-target').substring(1);
                this.onTabChanged();
            });
        });

        // Delivery search
        const deliverySearch = document.getElementById('deliverySearch');
        if (deliverySearch) {
            deliverySearch.addEventListener('input', (e) => {
                this.filterDeliveries(e.target.value);
            });
        }

        // User search
        const userSearch = document.getElementById('userSearch');
        if (userSearch) {
            userSearch.addEventListener('input', (e) => {
                this.filterUsers(e.target.value);
            });
        }

        // Modal events
        const addUserModal = document.getElementById('addUserModal');
        if (addUserModal) {
            addUserModal.addEventListener('show.bs.modal', () => {
                this.resetUserForm();
            });
        }
    }

    loadDeliveryList() {
        const deliveryList = document.getElementById('deliveryList');
        const activeCount = document.getElementById('activeCount');
        
        if (!deliveryList || !activeCount) return;

        this.filteredDeliveries = [...window.mockData.deliveries];
        const activeDeliveries = this.filteredDeliveries.filter(d => d.status !== 'entregado');
        
        activeCount.textContent = activeDeliveries.length;
        
        deliveryList.innerHTML = '';
        
        this.filteredDeliveries.forEach((delivery, index) => {
            const card = this.createDeliveryCard(delivery, index);
            deliveryList.appendChild(card);
        });
    }

    createDeliveryCard(delivery, index) {
        const card = document.createElement('div');
        card.className = 'delivery-card fade-in';
        card.style.animationDelay = `${index * 0.1}s`;
        card.setAttribute('data-delivery-id', delivery.id);

        const statusText = window.mockData.utils.getStatusText(delivery.status);
        const statusClass = window.mockData.utils.getStatusClass(delivery.status);

        card.innerHTML = `
            <div class="delivery-info">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="mb-0">${delivery.restaurant}</h6>
                    <span class="badge ${statusClass}">${statusText}</span>
                </div>
                <p class="text-muted mb-1">
                    <i class="bi bi-person"></i> ${delivery.customer}
                </p>
                <p class="text-muted mb-1">
                    <i class="bi bi-truck"></i> ${delivery.driver}
                </p>
                <div class="delivery-meta">
                    <small class="delivery-time">
                        <i class="bi bi-clock"></i> ${delivery.orderTime}
                    </small>
                    <small class="text-boston-red fw-bold">
                        $${delivery.totalAmount.toFixed(2)}
                    </small>
                </div>
                ${delivery.estimatedDelivery ? `
                    <div class="mt-2">
                        <small class="text-warning">
                            <i class="bi bi-hourglass-split"></i> ETA: ${delivery.estimatedDelivery}
                        </small>
                    </div>
                ` : ''}
            </div>
        `;

        card.addEventListener('click', () => {
            this.selectDelivery(delivery.id);
        });

        return card;
    }

    selectDelivery(deliveryId) {
        this.selectedDeliveryId = deliveryId;
        
        // Update UI
        document.querySelectorAll('.delivery-card').forEach(card => {
            card.classList.remove('active');
        });
        
        const selectedCard = document.querySelector(`[data-delivery-id="${deliveryId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('active');
            selectedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Notify map
        window.mapManager?.selectDelivery(deliveryId);
    }

    filterDeliveries(searchTerm) {
        const term = searchTerm.toLowerCase();
        this.filteredDeliveries = window.mockData.deliveries.filter(delivery => 
            delivery.restaurant.toLowerCase().includes(term) ||
            delivery.customer.toLowerCase().includes(term) ||
            delivery.driver.toLowerCase().includes(term) ||
            delivery.id.toLowerCase().includes(term)
        );
        
        this.loadDeliveryList();
    }

    loadUserManagement() {
        this.updateUserStats();
        this.loadUsersTable();
    }

    updateUserStats() {
        const totalUsers = document.getElementById('totalUsers');
        const activeUsers = document.getElementById('activeUsers');
        const adminUsers = document.getElementById('adminUsers');
        const deliveryUsers = document.getElementById('deliveryUsers');

        if (!totalUsers) return;

        const users = window.mockData.users;
        totalUsers.textContent = users.length;
        activeUsers.textContent = users.filter(u => u.status === 'active').length;
        adminUsers.textContent = users.filter(u => u.role === 'admin').length;
        deliveryUsers.textContent = users.filter(u => u.role === 'delivery').length;
    }

    loadUsersTable() {
        const tableBody = document.getElementById('usersTableBody');
        if (!tableBody) return;

        this.filteredUsers = [...window.mockData.users];
        
        tableBody.innerHTML = '';
        
        this.filteredUsers.forEach((user, index) => {
            const row = this.createUserRow(user, index);
            tableBody.appendChild(row);
        });
    }

    createUserRow(user, index) {
        const row = document.createElement('tr');
        row.className = 'fade-in';
        row.style.animationDelay = `${index * 0.05}s`;

        const roleText = window.mockData.utils.getRoleText(user.role);
        const roleClass = window.mockData.utils.getRoleClass(user.role);
        const statusClass = user.status === 'active' ? 'bg-success' : 'bg-secondary';
        const statusText = window.mockData.utils.getStatusText(user.status);

        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <i class="bi bi-person-circle text-muted me-2" style="font-size: 1.5rem;"></i>
                    <div>
                        <div class="fw-bold">${user.username}</div>
                        <small class="text-muted">ID: ${user.id}</small>
                    </div>
                </div>
            </td>
            <td>${user.email}</td>
            <td><span class="badge ${roleClass}">${roleText}</span></td>
            <td><span class="badge ${statusClass}">${statusText}</span></td>
            <td>
                <small class="text-muted">
                    ${new Date(user.lastLogin).toLocaleDateString('es-ES')}
                    <br>
                    ${new Date(user.lastLogin).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </small>
            </td>
            <td>
                <div class="btn-group btn-group-sm" role="group">
                    <button class="btn btn-outline-primary" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;

        return row;
    }

    filterUsers(searchTerm) {
        const term = searchTerm.toLowerCase();
        this.filteredUsers = window.mockData.users.filter(user => 
            user.username.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.role.toLowerCase().includes(term)
        );
        
        this.loadUsersTable();
    }

    loadTripHistory() {
        const tableBody = document.getElementById('historyTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        
        window.mockData.tripHistory.forEach((trip, index) => {
            const row = this.createTripRow(trip, index);
            tableBody.appendChild(row);
        });
    }

    createTripRow(trip, index) {
        const row = document.createElement('tr');
        row.className = 'fade-in';
        row.style.animationDelay = `${index * 0.05}s`;

        const statusClass = window.mockData.utils.getStatusClass(trip.status);
        const statusText = window.mockData.utils.getStatusText(trip.status);

        row.innerHTML = `
            <td><code>${trip.id}</code></td>
            <td>${trip.driver}</td>
            <td>${trip.restaurant}</td>
            <td>${trip.customer}</td>
            <td>${window.mockData.utils.formatDate(trip.date)}</td>
            <td>${trip.duration}</td>
            <td><span class="badge ${statusClass}">${statusText}</span></td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" title="Ver detalles">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-secondary" title="Descargar">
                        <i class="bi bi-download"></i>
                    </button>
                </div>
            </td>
        `;

        return row;
    }

    loadAPKManagement() {
        const versionsBody = document.getElementById('apkVersions');
        if (!versionsBody) return;

        versionsBody.innerHTML = '';
        
        window.mockData.apkVersions.forEach((version, index) => {
            const row = this.createAPKRow(version, index);
            versionsBody.appendChild(row);
        });
    }

    createAPKRow(version, index) {
        const row = document.createElement('tr');
        row.className = 'fade-in';
        row.style.animationDelay = `${index * 0.05}s`;

        const statusClass = window.mockData.utils.getStatusClass(version.status);
        const statusText = window.mockData.utils.getStatusText(version.status);

        row.innerHTML = `
            <td>
                <div class="fw-bold">${version.version}</div>
                <small class="text-muted" title="${version.changelog}">
                    ${version.changelog.substring(0, 50)}${version.changelog.length > 50 ? '...' : ''}
                </small>
            </td>
            <td>${window.mockData.utils.formatDate(version.date)}</td>
            <td>${version.size}</td>
            <td>${version.downloads.toLocaleString()}</td>
            <td><span class="badge ${statusClass}">${statusText}</span></td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" title="Descargar">
                        <i class="bi bi-download"></i>
                    </button>
                    ${version.status !== 'active' ? `
                        <button class="btn btn-outline-success" title="Activar">
                            <i class="bi bi-check-circle"></i>
                        </button>
                    ` : ''}
                    <button class="btn btn-outline-danger" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;

        return row;
    }

    onTabChanged() {
        // Handle tab-specific logic
        switch(this.currentTab) {
            case 'tracking':
                // Refresh map if needed
                if (window.mapManager?.map) {
                    setTimeout(() => {
                        window.mapManager.map.invalidateSize();
                    }, 100);
                }
                break;
            case 'history':
                // Set default date range
                this.setDefaultDateRange();
                break;
            case 'users':
                this.updateUserStats();
                break;
        }
    }

    setDefaultDateRange() {
        const startDate = document.getElementById('startDate');
        const endDate = document.getElementById('endDate');
        
        if (startDate && endDate) {
            const today = new Date();
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            
            startDate.value = weekAgo.toISOString().split('T')[0];
            endDate.value = today.toISOString().split('T')[0];
        }
    }

    resetUserForm() {
        const form = document.querySelector('#addUserModal form');
        if (form) {
            form.reset();
        }
    }

    simulateConnectionStatus() {
        const statusDot = document.getElementById('connectionStatus');
        const statusText = document.getElementById('connectionText');
        
        if (!statusDot || !statusText) return;

        // Simulate occasional disconnections
        setInterval(() => {
            const random = Math.random();
            
            if (random > 0.95) { // 5% chance of disconnection
                this.connectionStatus = 'disconnected';
                statusDot.className = 'connection-dot bg-danger me-2';
                statusText.textContent = 'Desconectado';
                
                // Reconnect after 3-5 seconds
                setTimeout(() => {
                    this.connectionStatus = 'connected';
                    statusDot.className = 'connection-dot bg-success me-2';
                    statusText.textContent = 'Conectado';
                }, 3000 + Math.random() * 2000);
            }
        }, 10000);
    }

    startPeriodicUpdates() {
        // Simulate live data updates every 30 seconds
        setInterval(() => {
            if (this.currentTab === 'tracking') {
                this.simulateDeliveryUpdates();
            }
        }, 30000);
    }

    simulateDeliveryUpdates() {
        // Randomly change some delivery statuses
        window.mockData.deliveries.forEach(delivery => {
            if (Math.random() > 0.8) {
                const statuses = ['pendiente', 'en_camino', 'entregado'];
                const currentIndex = statuses.indexOf(delivery.status);
                
                if (currentIndex >= 0 && currentIndex < statuses.length - 1) {
                    delivery.status = statuses[currentIndex + 1];
                }
            }
        });

        // Update times
        window.mockData.deliveries.forEach(delivery => {
            if (delivery.status === 'en_camino') {
                delivery.estimatedDelivery = new Date(Date.now() + 900000).toLocaleTimeString();
            }
        });

        // Refresh delivery list and map
        this.loadDeliveryList();
        if (window.mapManager) {
            window.mapManager.updateDeliveries(window.mockData.deliveries);
        }
    }

    showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-bg-${type} border-0`;
        toast.setAttribute('role', 'alert');

        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi bi-info-circle me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

        container.appendChild(toast);

        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();

        // Remove toast element after it's hidden
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }

    // Demo-specific methods
    demoAction(action, element) {
        element.disabled = true;
        
        const originalText = element.innerHTML;
        element.innerHTML = '<i class="bi bi-hourglass-split"></i> Procesando...';
        
        setTimeout(() => {
            element.innerHTML = originalText;
            element.disabled = false;
            
            this.showToast(`Acción "${action}" ejecutada en modo demo`, 'success');
        }, 1500);
    }
}

// Delivery Manager wrapper for external access
class DeliveryManager {
    selectDelivery(deliveryId) {
        window.dashboardManager?.selectDelivery(deliveryId);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
    window.deliveryManager = new DeliveryManager();
    
    // Initialize after mock data is available
    setTimeout(() => {
        window.dashboardManager.init();
    }, 100);

    // Add demo badge
    const demoBadge = document.createElement('div');
    demoBadge.className = 'demo-badge';
    demoBadge.innerHTML = '<i class="bi bi-play-circle"></i> DEMO';
    document.body.appendChild(demoBadge);

    // Add click handlers for demo buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn') && !e.target.closest('[data-bs-toggle]')) {
            const button = e.target.closest('.btn');
            const action = button.textContent.trim() || button.title || 'acción';
            
            // Don't interfere with Bootstrap components
            if (!button.hasAttribute('data-bs-toggle') && 
                !button.hasAttribute('data-bs-dismiss') &&
                !button.classList.contains('btn-close')) {
                
                e.preventDefault();
                window.dashboardManager.demoAction(action, button);
            }
        }
    });
});
