// Map functionality for Boston Tracker Demo
class BostonTrackerMap {
    constructor() {
        this.map = null;
        this.markers = new Map();
        this.routeLayers = new Map();
        this.selectedDeliveryId = null;
        this.isInitialized = false;
    }

    async init() {
        try {
            // Hide loading spinner after a delay to simulate loading
            setTimeout(() => {
                document.getElementById('mapLoading').style.display = 'none';
            }, 2000);

            // Initialize Leaflet map
            this.map = L.map('map', {
                center: window.mockData.bostonCenter,
                zoom: 13,
                zoomControl: true,
                attributionControl: false
            });

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors'
            }).addTo(this.map);

            // Add custom attribution
            L.control.attribution({
                position: 'bottomright',
                prefix: 'Boston Tracker Demo'
            }).addTo(this.map);

            this.isInitialized = true;
            
            // Load initial deliveries
            this.updateDeliveries(window.mockData.deliveries);
            
        } catch (error) {
            console.error('Error initializing map:', error);
            this.showMapError();
        }
    }

    showMapError() {
        const mapContainer = document.getElementById('map');
        mapContainer.innerHTML = `
            <div class="d-flex align-items-center justify-content-center h-100 bg-light">
                <div class="text-center">
                    <i class="bi bi-exclamation-triangle text-warning" style="font-size: 3rem;"></i>
                    <h5 class="mt-3 text-muted">Error al cargar el mapa</h5>
                    <p class="text-muted">Refresque la página para intentar de nuevo</p>
                </div>
            </div>
        `;
    }

    updateDeliveries(deliveries) {
        if (!this.isInitialized) return;

        // Clear existing markers and routes
        this.clearAll();

        // Add markers for each delivery
        deliveries.forEach(delivery => {
            this.addDeliveryMarker(delivery);
            if (delivery.route && delivery.route.length > 0) {
                this.addRoute(delivery);
            }
        });

        // Fit map to show all markers if there are any
        if (deliveries.length > 0) {
            const group = new L.featureGroup(Array.from(this.markers.values()));
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    addDeliveryMarker(delivery) {
        if (!delivery.coordinates) return;

        const [lat, lng] = delivery.coordinates;
        
        // Create custom icon based on status
        const iconColor = this.getStatusColor(delivery.status);
        const icon = L.divIcon({
            className: 'delivery-marker',
            html: `<div style="background: ${iconColor}; width: 100%; height: 100%; border-radius: 50%;"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        // Create popup content
        const popupContent = `
            <div class="delivery-popup">
                <h6><i class="bi bi-geo-alt"></i> ${delivery.restaurant}</h6>
                <p class="mb-1"><strong>Cliente:</strong> ${delivery.customer}</p>
                <p class="mb-1"><strong>Repartidor:</strong> ${delivery.driver}</p>
                <p class="mb-2"><strong>Estado:</strong> 
                    <span class="badge ${window.mockData.utils.getStatusClass(delivery.status)}">
                        ${window.mockData.utils.getStatusText(delivery.status)}
                    </span>
                </p>
                <small class="text-muted">
                    <i class="bi bi-clock"></i> ${delivery.orderTime}
                    ${delivery.estimatedDelivery ? `<br><i class="bi bi-truck"></i> ETA: ${delivery.estimatedDelivery}` : ''}
                </small>
            </div>
        `;

        // Create marker
        const marker = L.marker([lat, lng], { icon })
            .bindPopup(popupContent)
            .addTo(this.map);

        // Add click event
        marker.on('click', () => {
            this.selectDelivery(delivery.id);
        });

        this.markers.set(delivery.id, marker);
    }

    addRoute(delivery) {
        if (!delivery.route || delivery.route.length < 2) return;

        const routeColor = delivery.status === 'entregado' ? '#6c757d' : '#dc3545';
        
        const polyline = L.polyline(delivery.route, {
            color: routeColor,
            weight: 3,
            opacity: 0.7,
            dashArray: delivery.status === 'entregado' ? '10, 5' : null
        }).addTo(this.map);

        this.routeLayers.set(delivery.id, polyline);
    }

    selectDelivery(deliveryId) {
        this.selectedDeliveryId = deliveryId;
        
        // Highlight marker
        this.markers.forEach((marker, id) => {
            const element = marker.getElement();
            if (element) {
                element.style.transform = id === deliveryId ? 'scale(1.3)' : 'scale(1)';
                element.style.zIndex = id === deliveryId ? '1000' : '999';
            }
        });

        // Update delivery list selection
        window.deliveryManager?.selectDelivery(deliveryId);
        
        // Center map on selected delivery
        const delivery = window.mockData.deliveries.find(d => d.id === deliveryId);
        if (delivery && delivery.coordinates) {
            this.map.setView(delivery.coordinates, 15);
            
            // Open popup
            const marker = this.markers.get(deliveryId);
            if (marker) {
                marker.openPopup();
            }
        }
    }

    getStatusColor(status) {
        const colorMap = {
            'en_camino': '#ffc107',
            'pendiente': '#6c757d',
            'entregado': '#28a745',
            'cancelado': '#dc3545'
        };
        return colorMap[status] || '#6c757d';
    }

    clearAll() {
        // Clear markers
        this.markers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.markers.clear();

        // Clear routes
        this.routeLayers.forEach(route => {
            this.map.removeLayer(route);
        });
        this.routeLayers.clear();
    }

    // Simulate real-time updates
    startLiveUpdates() {
        setInterval(() => {
            if (!this.isInitialized) return;
            
            // Randomly update delivery positions for active deliveries
            window.mockData.deliveries.forEach(delivery => {
                if (delivery.status === 'en_camino' && this.markers.has(delivery.id)) {
                    // Slightly move the delivery along the route
                    const newCoords = window.mockData.utils.generateRandomCoordinate(
                        delivery.coordinates, 
                        0.001
                    );
                    delivery.coordinates = newCoords;
                    
                    // Update marker position
                    const marker = this.markers.get(delivery.id);
                    if (marker) {
                        marker.setLatLng(newCoords);
                    }
                }
            });
        }, 5000); // Update every 5 seconds
    }
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mapManager = new BostonTrackerMap();
    
    // Initialize map after a short delay
    setTimeout(() => {
        window.mapManager.init();
        setTimeout(() => {
            window.mapManager.startLiveUpdates();
        }, 3000);
    }, 500);
});
