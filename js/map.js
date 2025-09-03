// Map functionality for Boston Tracker Demo with fallback
class BostonTrackerMap {
    constructor() {
        this.map = null;
        this.markers = new Map();
        this.routeLayers = new Map();
        this.selectedDeliveryId = null;
        this.isInitialized = false;
        this.useStaticFallback = false;
    }

    async init() {
        try {
            // Show loading first
            this.showLoading();

            // Try to initialize Leaflet map
            await this.initLeafletMap();
            
        } catch (error) {
            console.error('Leaflet failed, using static fallback:', error);
            this.initStaticFallback();
        }
    }

    showLoading() {
        const loadingElement = document.getElementById('mapLoading');
        if (loadingElement) {
            loadingElement.style.display = 'flex';
            loadingElement.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner-border text-boston-red" role="status">
                        <span class="visually-hidden">Cargando mapa...</span>
                    </div>
                    <div class="loading-text">Cargando mapa de Boston...</div>
                </div>
            `;
        }
    }

    async initLeafletMap() {
        return new Promise((resolve, reject) => {
            try {
                // Test if Leaflet is available
                if (typeof L === 'undefined') {
                    throw new Error('Leaflet not loaded');
                }

                // Initialize map with timeout
                const initTimeout = setTimeout(() => {
                    reject(new Error('Map initialization timeout'));
                }, 10000);

                // Initialize Leaflet map
                this.map = L.map('map', {
                    center: window.mockData.bostonCenter,
                    zoom: 13,
                    zoomControl: true,
                    attributionControl: false,
                    tap: true,
                    touchZoom: true,
                    dragging: true,
                    scrollWheelZoom: true,
                    doubleClickZoom: true,
                    maxZoom: 18,
                    minZoom: 10
                });

                // Add tiles with error handling
                const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '© OpenStreetMap contributors',
                    detectRetina: true,
                    errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
                });

                tileLayer.on('tileerror', () => {
                    console.warn('Tile loading error, map may be slow');
                });

                tileLayer.addTo(this.map);

                // Add custom attribution
                L.control.attribution({
                    position: 'bottomright',
                    prefix: 'Boston Tracker Demo'
                }).addTo(this.map);

                // Clear timeout
                clearTimeout(initTimeout);

                // Hide loading and setup
                setTimeout(() => {
                    this.hideLoading();
                    this.setupMapEvents();
                    this.isInitialized = true;
                    this.updateDeliveries(window.mockData.deliveries);
                    resolve();
                }, 1000);

            } catch (error) {
                reject(error);
            }
        });
    }

    initStaticFallback() {
        console.log('Using static map fallback');
        this.useStaticFallback = true;
        
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div class="static-map-container">
                    <div class="static-map-header">
                        <h5><i class="bi bi-geo-alt text-boston-red"></i> Mapa de Boston - Vista Estática</h5>
                        <p class="text-muted">Vista simulada del área de entregas</p>
                    </div>
                    
                    <div class="static-map-content">
                        <svg width="100%" height="400" viewBox="0 0 800 400" style="background: #e8f4f8;">
                            <!-- Boston City Background -->
                            <rect width="100%" height="100%" fill="#f0f8ff"/>
                            
                            <!-- Streets -->
                            <g stroke="#ddd" stroke-width="2" fill="none">
                                <line x1="0" y1="100" x2="800" y2="100"/>
                                <line x1="0" y1="200" x2="800" y2="200"/>
                                <line x1="0" y1="300" x2="800" y2="300"/>
                                <line x1="100" y1="0" x2="100" y2="400"/>
                                <line x1="300" y1="0" x2="300" y2="400"/>
                                <line x1="500" y1="0" x2="500" y2="400"/>
                                <line x1="700" y1="0" x2="700" y2="400"/>
                            </g>
                            
                            <!-- Boston Harbor -->
                            <circle cx="650" cy="80" r="30" fill="#4a90e2" opacity="0.3"/>
                            <text x="650" y="85" text-anchor="middle" font-size="10" fill="#666">Harbor</text>
                            
                            <!-- Delivery Markers -->
                            <g id="static-markers">
                                <!-- Active Deliveries -->
                                <circle cx="200" cy="150" r="8" fill="#ffc107" stroke="white" stroke-width="2"/>
                                <text x="200" y="135" text-anchor="middle" font-size="10" fill="#333">North End Pizza</text>
                                
                                <circle cx="450" cy="250" r="8" fill="#6c757d" stroke="white" stroke-width="2"/>
                                <text x="450" y="235" text-anchor="middle" font-size="10" fill="#333">Back Bay Bistro</text>
                                
                                <circle cx="350" cy="180" r="8" fill="#28a745" stroke="white" stroke-width="2"/>
                                <text x="350" y="165" text-anchor="middle" font-size="10" fill="#333">Fenway Grill</text>
                                
                                <circle cx="150" cy="280" r="8" fill="#ffc107" stroke="white" stroke-width="2"/>
                                <text x="150" y="265" text-anchor="middle" font-size="10" fill="#333">South End Cafe</text>
                                
                                <circle cx="600" cy="200" r="8" fill="#6c757d" stroke="white" stroke-width="2"/>
                                <text x="600" y="185" text-anchor="middle" font-size="10" fill="#333">Cambridge Corner</text>
                            </g>
                            
                            <!-- Routes -->
                            <g stroke="#dc3545" stroke-width="3" fill="none" opacity="0.7">
                                <path d="M200,150 Q250,160 300,170 Q340,175 350,180"/>
                                <path d="M150,280 Q200,270 250,275 Q300,280 350,285"/>
                            </g>
                            
                            <!-- Boston Label -->
                            <text x="400" y="380" text-anchor="middle" font-size="16" font-weight="bold" fill="#dc3545">BOSTON, MA</text>
                        </svg>
                    </div>
                    
                    <div class="static-map-footer">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="delivery-legend">
                                <small class="me-3">
                                    <span class="badge" style="background: #ffc107;">En Camino</span>
                                </small>
                                <small class="me-3">
                                    <span class="badge" style="background: #6c757d;">Pendiente</span>
                                </small>
                                <small>
                                    <span class="badge" style="background: #28a745;">Entregado</span>
                                </small>
                            </div>
                            <button class="btn btn-outline-boston-red btn-sm" onclick="location.reload()">
                                <i class="bi bi-arrow-clockwise"></i> Cargar Mapa Interactivo
                            </button>
                        </div>
                    </div>
                </div>
                
                <style>
                .static-map-container {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                }
                
                .static-map-header {
                    padding: 1rem;
                    background: #f8f9fa;
                    border-bottom: 1px solid #dee2e6;
                    text-align: center;
                }
                
                .static-map-header h5 {
                    margin: 0;
                    color: #333;
                }
                
                .static-map-content {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                }
                
                .static-map-footer {
                    padding: 1rem;
                    background: #f8f9fa;
                    border-top: 1px solid #dee2e6;
                }
                
                .delivery-legend .badge {
                    color: white;
                    font-weight: 500;
                }
                
                #static-markers circle {
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                #static-markers circle:hover {
                    r: 10;
                    opacity: 0.8;
                }
                </style>
            `;
        }

        // Add click handlers for static markers
        setTimeout(() => {
            this.setupStaticMarkerEvents();
        }, 100);

        this.isInitialized = true;
    }

    setupStaticMarkerEvents() {
        const markers = document.querySelectorAll('#static-markers circle');
        markers.forEach((marker, index) => {
            marker.addEventListener('click', () => {
                const delivery = window.mockData.deliveries[index];
                if (delivery) {
                    this.selectDelivery(delivery.id);
                    this.showStaticPopup(delivery, marker);
                }
            });
        });
    }

    showStaticPopup(delivery, markerElement) {
        // Remove existing popup
        const existingPopup = document.querySelector('.static-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        const popup = document.createElement('div');
        popup.className = 'static-popup';
        popup.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 250px;
        `;

        popup.innerHTML = `
            <div class="delivery-popup">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6><i class="bi bi-geo-alt"></i> ${delivery.restaurant}</h6>
                    <button class="btn-close btn-sm" onclick="this.parentElement.parentElement.parentElement.remove()"></button>
                </div>
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

        document.getElementById('map').appendChild(popup);

        // Auto-close popup after 5 seconds
        setTimeout(() => {
            if (popup.parentElement) {
                popup.remove();
            }
        }, 5000);
    }

    hideLoading() {
        const loadingElement = document.getElementById('mapLoading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    setupMapEvents() {
        if (!this.map) return;

        // Add resize handler
        window.addEventListener('resize', () => {
            if (this.map) {
                setTimeout(() => {
                    this.map.invalidateSize();
                }, 100);
            }
        });

        // Handle orientation change on mobile
        window.addEventListener('orientationchange', () => {
            if (this.map) {
                setTimeout(() => {
                    this.map.invalidateSize();
                    this.map.setView(window.mockData.bostonCenter, this.map.getZoom());
                }, 500);
            }
        });
    }

    updateDeliveries(deliveries) {
        if (!this.isInitialized) return;

        if (this.useStaticFallback) {
            // Update static markers
            this.updateStaticMarkers(deliveries);
            return;
        }

        if (!this.map) return;

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
            try {
                const group = new L.featureGroup(Array.from(this.markers.values()));
                if (group.getBounds && group.getBounds().isValid()) {
                    this.map.fitBounds(group.getBounds().pad(0.1));
                }
            } catch (error) {
                console.warn('Error fitting bounds:', error);
            }
        }
    }

    updateStaticMarkers(deliveries) {
        // Update static marker colors based on current delivery status
        const markers = document.querySelectorAll('#static-markers circle');
        
        deliveries.forEach((delivery, index) => {
            if (markers[index]) {
                const color = this.getStatusColor(delivery.status);
                markers[index].setAttribute('fill', color);
            }
        });
    }

    addDeliveryMarker(delivery) {
        if (!delivery.coordinates || !this.map) return;

        const [lat, lng] = delivery.coordinates;
        
        const iconColor = this.getStatusColor(delivery.status);
        const icon = L.divIcon({
            className: 'delivery-marker',
            html: `<div style="background: ${iconColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

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

        const marker = L.marker([lat, lng], { icon })
            .bindPopup(popupContent, {
                maxWidth: 250,
                closeButton: true
            })
            .addTo(this.map);

        marker.on('click', () => {
            this.selectDelivery(delivery.id);
        });

        this.markers.set(delivery.id, marker);
    }

    addRoute(delivery) {
        if (!delivery.route || delivery.route.length < 2 || !this.map) return;

        const routeColor = delivery.status === 'entregado' ? '#6c757d' : '#dc3545';
        
        const polyline = L.polyline(delivery.route, {
            color: routeColor,
            weight: 4,
            opacity: 0.7,
            dashArray: delivery.status === 'entregado' ? '10, 5' : null
        }).addTo(this.map);

        this.routeLayers.set(delivery.id, polyline);
    }

    selectDelivery(deliveryId) {
        this.selectedDeliveryId = deliveryId;
        
        if (this.useStaticFallback) {
            // Handle static map selection
            const markers = document.querySelectorAll('#static-markers circle');
            markers.forEach(marker => {
                marker.setAttribute('stroke-width', '2');
            });
            
            const delivery = window.mockData.deliveries.find(d => d.id === deliveryId);
            if (delivery) {
                const index = window.mockData.deliveries.indexOf(delivery);
                if (markers[index]) {
                    markers[index].setAttribute('stroke-width', '4');
                    this.showStaticPopup(delivery, markers[index]);
                }
            }
        } else if (this.map) {
            // Handle Leaflet map selection
            this.markers.forEach((marker, id) => {
                const element = marker.getElement();
                if (element) {
                    element.style.transform = id === deliveryId ? 'scale(1.3)' : 'scale(1)';
                    element.style.zIndex = id === deliveryId ? '1000' : '999';
                }
            });

            const delivery = window.mockData.deliveries.find(d => d.id === deliveryId);
            if (delivery && delivery.coordinates) {
                this.map.setView(delivery.coordinates, Math.max(this.map.getZoom(), 15));
                
                const marker = this.markers.get(deliveryId);
                if (marker) {
                    marker.openPopup();
                }
            }
        }

        // Update delivery list selection
        window.deliveryManager?.selectDelivery(deliveryId);
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
        if (this.useStaticFallback) return;
        
        this.markers.forEach(marker => {
            if (this.map) {
                this.map.removeLayer(marker);
            }
        });
        this.markers.clear();

        this.routeLayers.forEach(route => {
            if (this.map) {
                this.map.removeLayer(route);
            }
        });
        this.routeLayers.clear();
    }

    startLiveUpdates() {
        setInterval(() => {
            if (!this.isInitialized) return;
            
            if (this.useStaticFallback) {
                // Update static map occasionally
                this.updateStaticMarkers(window.mockData.deliveries);
                return;
            }

            // Update Leaflet markers
            window.mockData.deliveries.forEach(delivery => {
                if (delivery.status === 'en_camino' && this.markers.has(delivery.id)) {
                    const newCoords = window.mockData.utils.generateRandomCoordinate(
                        delivery.coordinates, 
                        0.001
                    );
                    delivery.coordinates = newCoords;
                    
                    const marker = this.markers.get(delivery.id);
                    if (marker) {
                        marker.setLatLng(newCoords);
                    }
                }
            });
        }, 5000);
    }

    invalidateSize() {
        if (this.map) {
            this.map.invalidateSize();
        }
    }
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mapManager = new BostonTrackerMap();
    
    setTimeout(() => {
        window.mapManager.init();
        setTimeout(() => {
            window.mapManager.startLiveUpdates();
        }, 3000);
    }, 500);
});

// Handle tab switching
document.addEventListener('shown.bs.tab', (e) => {
    if (e.target.getAttribute('data-bs-target') === '#tracking') {
        setTimeout(() => {
            if (window.mapManager) {
                window.mapManager.invalidateSize();
            }
        }, 100);
    }
});
