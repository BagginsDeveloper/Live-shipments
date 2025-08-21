import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface TrackingUpdate {
  id: string;
  timestamp: string;
  location: string;
  status: string;
  description: string;
  type: 'manual' | 'automated';
  coordinates: [number, number]; // [lat, lng]
}

interface MapLocation {
  name: string;
  coordinates: [number, number];
  type: 'pickup' | 'transit' | 'delivery';
  status: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  location: string;
  status: 'completed' | 'current' | 'upcoming';
  icon: string;
}

const PublicTrackingPage: React.FC = () => {
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [shipmentData, setShipmentData] = useState<any>(null);

  // Simulate loading shipment data
  useEffect(() => {
    // In a real app, this would fetch from your API using shipmentId
    setTimeout(() => {
      setShipmentData({
        loadNumber: shipmentId || '12345',
        customer: 'ABC Company',
        shipperAddress: 'Houston, TX',
        consigneeAddress: 'Los Angeles, CA',
        estimatedDelivery: '2025-01-15',
        status: 'Delivered'
      });
      setIsLoading(false);
    }, 1000);
  }, [shipmentId]);

  // Milestone tracking data
  const milestones: Milestone[] = [
    {
      id: '1',
      title: 'Picked Up',
      description: 'Package picked up from shipper location',
      timestamp: 'Jan 13, 2025 • 8:00 AM',
      location: 'Houston, TX',
      status: 'completed',
      icon: '📦'
    },
    {
      id: '2',
      title: 'In Transit',
      description: 'Package departed Houston facility',
      timestamp: 'Jan 13, 2025 • 2:00 PM',
      location: 'Houston, TX',
      status: 'completed',
      icon: '🚚'
    },
    {
      id: '3',
      title: 'Arrived at Dallas',
      description: 'Package arrived at Dallas sorting facility',
      timestamp: 'Jan 13, 2025 • 6:20 PM',
      location: 'Dallas, TX',
      status: 'completed',
      icon: '🏢'
    },
    {
      id: '4',
      title: 'In Transit',
      description: 'Package departed Dallas facility',
      timestamp: 'Jan 14, 2025 • 9:00 AM',
      location: 'Dallas, TX',
      status: 'completed',
      icon: '🚚'
    },
    {
      id: '5',
      title: 'Arrived at Phoenix',
      description: 'Package arrived at Phoenix sorting facility',
      timestamp: 'Jan 14, 2025 • 12:30 PM',
      location: 'Phoenix, AZ',
      status: 'completed',
      icon: '🏢'
    },
    {
      id: '6',
      title: 'In Transit',
      description: 'Package departed Phoenix facility',
      timestamp: 'Jan 14, 2025 • 4:45 PM',
      location: 'Phoenix, AZ',
      status: 'completed',
      icon: '🚚'
    },
    {
      id: '7',
      title: 'Arrived at Destination',
      description: 'Package arrived at Los Angeles facility',
      timestamp: 'Jan 15, 2025 • 8:00 AM',
      location: 'Los Angeles, CA',
      status: 'completed',
      icon: '🏢'
    },
    {
      id: '8',
      title: 'Out for Delivery',
      description: 'Package is out for delivery with local courier',
      timestamp: 'Jan 15, 2025 • 10:15 AM',
      location: 'Los Angeles, CA',
      status: 'completed',
      icon: '🚛'
    },
    {
      id: '9',
      title: 'Delivered',
      description: 'Package delivered to recipient. Signature obtained.',
      timestamp: 'Jan 15, 2025 • 2:30 PM',
      location: 'Los Angeles, CA',
      status: 'completed',
      icon: '✅'
    }
  ];

  // Real tracking data with coordinates
  const trackingUpdates: TrackingUpdate[] = [
    {
      id: '1',
      timestamp: '2025-01-15 14:30:00',
      location: 'Los Angeles, CA',
      status: 'Delivered',
      description: 'Package delivered to recipient. Signature obtained.',
      type: 'automated',
      coordinates: [34.0522, -118.2437]
    },
    {
      id: '2',
      timestamp: '2025-01-15 10:15:00',
      location: 'Los Angeles, CA',
      status: 'Out for Delivery',
      description: 'Package is out for delivery with local courier.',
      type: 'automated',
      coordinates: [34.0522, -118.2437]
    },
    {
      id: '3',
      timestamp: '2025-01-15 08:00:00',
      location: 'Los Angeles, CA',
      status: 'Arrived at Destination',
      description: 'Package arrived at destination facility.',
      type: 'automated',
      coordinates: [34.0522, -118.2437]
    },
    {
      id: '4',
      timestamp: '2025-01-14 16:45:00',
      location: 'Phoenix, AZ',
      status: 'In Transit',
      description: 'Package departed Phoenix facility en route to Los Angeles.',
      type: 'automated',
      coordinates: [33.4484, -112.0740]
    },
    {
      id: '5',
      timestamp: '2025-01-14 12:30:00',
      location: 'Phoenix, AZ',
      status: 'Arrived at Facility',
      description: 'Package arrived at Phoenix sorting facility.',
      type: 'automated',
      coordinates: [33.4484, -112.0740]
    },
    {
      id: '6',
      timestamp: '2025-01-14 09:00:00',
      location: 'Phoenix, AZ',
      status: 'In Transit',
      description: 'Package departed Dallas facility en route to Phoenix.',
      type: 'automated',
      coordinates: [33.4484, -112.0740]
    },
    {
      id: '7',
      timestamp: '2025-01-13 18:20:00',
      location: 'Dallas, TX',
      status: 'Arrived at Facility',
      description: 'Package arrived at Dallas sorting facility.',
      type: 'automated',
      coordinates: [32.7767, -96.7970]
    },
    {
      id: '8',
      timestamp: '2025-01-13 14:00:00',
      location: 'Dallas, TX',
      status: 'In Transit',
      description: 'Package departed Houston facility en route to Dallas.',
      type: 'automated',
      coordinates: [32.7767, -96.7970]
    },
    {
      id: '9',
      timestamp: '2025-01-13 10:30:00',
      location: 'Houston, TX',
      status: 'Arrived at Facility',
      description: 'Package arrived at Houston sorting facility.',
      type: 'automated',
      coordinates: [29.7604, -95.3698]
    },
    {
      id: '10',
      timestamp: '2025-01-13 08:00:00',
      location: 'Houston, TX',
      status: 'Picked Up',
      description: 'Package picked up from shipper location.',
      type: 'manual',
      coordinates: [29.7604, -95.3698]
    }
  ];

  // Map locations for the route
  const mapLocations = useMemo((): MapLocation[] => [
    {
      name: 'Houston, TX',
      coordinates: [29.7604, -95.3698],
      type: 'pickup',
      status: 'Completed'
    },
    {
      name: 'Dallas, TX',
      coordinates: [32.7767, -96.7970],
      type: 'transit',
      status: 'Completed'
    },
    {
      name: 'Phoenix, AZ',
      coordinates: [33.4484, -112.0740],
      type: 'transit',
      status: 'Completed'
    },
    {
      name: 'Los Angeles, CA',
      coordinates: [34.0522, -118.2437],
      type: 'delivery',
      status: 'Completed'
    }
  ], []);

  // Calculate map center and bounds
  const mapCenter = useMemo((): [number, number] => {
    if (mapLocations.length === 0) return [39.8283, -98.5795]; // Center of US
    const lats = mapLocations.map(loc => loc.coordinates[0]);
    const lngs = mapLocations.map(loc => loc.coordinates[1]);
    return [
      (Math.min(...lats) + Math.max(...lats)) / 2,
      (Math.min(...lngs) + Math.max(...lngs)) / 2
    ];
  }, [mapLocations]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shipment information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Shipment Tracking
              </h1>
              <p className="text-gray-600 mt-1">
                Load #{shipmentData?.loadNumber} • {shipmentData?.customer}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Estimated Delivery</div>
              <div className="text-lg font-semibold text-gray-900">
                {shipmentData?.estimatedDelivery}
              </div>
            </div>
          </div>
          
          {/* Shipment Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-600 font-medium">Shipper</div>
              <div className="text-blue-900">{shipmentData?.shipperAddress}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-sm text-green-600 font-medium">Consignee</div>
              <div className="text-green-900">{shipmentData?.consigneeAddress}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-sm text-purple-600 font-medium">Status</div>
              <div className="text-purple-900">{shipmentData?.status}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Milestone Timeline */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipment Progress</h2>
          <div className="relative">
            {/* Horizontal timeline line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200"></div>
            
            <div className="flex justify-between items-start relative">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="relative flex flex-col items-center text-center max-w-32">
                  {/* Milestone dot */}
                  <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 shadow-sm mb-3 ${
                    milestone.status === 'completed' 
                      ? 'bg-green-500 border-green-500' 
                      : milestone.status === 'current'
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-gray-300 border-gray-300'
                  }`}>
                    <span className="text-lg">{milestone.icon}</span>
                    
                    {/* Status indicator */}
                    {milestone.status === 'completed' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex flex-col items-center">
                    <div className="flex flex-col items-center gap-1 mb-1">
                      <h4 className={`font-medium text-sm ${
                        milestone.status === 'completed' 
                          ? 'text-green-900' 
                          : milestone.status === 'current'
                          ? 'text-blue-900'
                          : 'text-gray-500'
                      }`}>
                        {milestone.title}
                      </h4>
                      {milestone.status === 'completed' && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                          ✓ Completed
                        </span>
                      )}
                      {milestone.status === 'current' && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                          🔄 In Progress
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-1 text-center leading-tight">{milestone.description}</p>
                    <div className="flex flex-col items-center gap-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {milestone.timestamp}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {milestone.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipment Route</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-4 h-[500px]">
              <MapContainer
                center={mapCenter}
                zoom={5}
                className="w-full h-full"
              >
                {/* OpenStreetMap Tiles */}
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* Route Line */}
                <Polyline
                  positions={mapLocations.map(loc => loc.coordinates)}
                  color="#3B82F6"
                  weight={3}
                  opacity={0.8}
                  dashArray="10, 5"
                />
                
                {/* Location Markers */}
                {mapLocations.map((location, index) => (
                  <Marker
                    key={location.name}
                    position={location.coordinates}
                    icon={L.divIcon({
                      className: 'custom-marker',
                      html: `
                        <div class="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white ${
                          location.type === 'pickup' ? 'bg-red-500' :
                          location.type === 'delivery' ? 'bg-green-500' : 'bg-yellow-500'
                        }">
                          ${index + 1}
                        </div>
                      `,
                      iconSize: [24, 24],
                      iconAnchor: [12, 12]
                    })}
                  >
                    <Popup>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{location.name}</div>
                        <div className="text-sm text-gray-600 capitalize">{location.type}</div>
                        <div className="text-xs text-gray-500">{location.status}</div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
              
              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-sm border border-gray-200 z-[1000]">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-gray-700">Pickup</span>
                </div>
                <div className="flex items-center gap-2 text-xs mt-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-700">In Transit</span>
                </div>
                <div className="flex items-center gap-2 text-xs mt-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-700">Delivery</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Updates */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Updates</h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {trackingUpdates.map((update) => (
                <div key={update.id} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-900">{update.status}</span>
                    <span className="text-xs text-gray-500">{update.timestamp}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{update.location}</div>
                  <div className="text-sm text-gray-700">{update.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>This is a public tracking page for shipment #{shipmentData?.loadNumber}</p>
          <p className="mt-1">For questions, please contact your shipping provider</p>
          
          {/* Copyright Information */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-center text-xs text-gray-400">
              © 2025 3PL Systems, Inc. All rights reserved.
            </div>
            <div className="text-center text-xs text-gray-400 mt-1">
              <a 
                href="https://3plsystems.com/terms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 underline"
              >
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicTrackingPage;
