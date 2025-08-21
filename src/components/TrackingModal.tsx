import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Shipment } from '../types';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipmentId: string;
  shipment?: Shipment;
}

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

const TrackingModal: React.FC<TrackingModalProps> = ({
  isOpen,
  onClose,
  shipmentId,
  shipment
}) => {
  const [updateFilter, setUpdateFilter] = useState<'all' | 'manual' | 'automated'>('manual');
  const [showPublicLink, setShowPublicLink] = useState(false);
  const [publicLink, setPublicLink] = useState('');

  // Generate public tracking link
  const generatePublicLink = () => {
    const baseUrl = window.location.origin;
    const trackingUrl = `${baseUrl}/tracking/${shipmentId}`;
    setPublicLink(trackingUrl);
    setShowPublicLink(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(publicLink);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

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

  // Filter updates based on selected type
  const filteredUpdates = updateFilter === 'all' 
    ? trackingUpdates 
    : trackingUpdates.filter(update => update.type === updateFilter);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Tracking - Load #{shipment?.loadNumber || shipmentId}
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={generatePublicLink}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              📤 Generate Public Link
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Public Link Modal */}
        {showPublicLink && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-1">Public Tracking Link Generated!</h3>
                <p className="text-xs text-blue-700 mb-2">
                  Share this link with your customers to let them track their shipment independently.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={publicLink}
                    readOnly
                    className="text-xs bg-white border border-blue-300 rounded px-3 py-2 flex-1"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-2 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowPublicLink(false)}
                className="text-blue-400 hover:text-blue-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        <div className="flex gap-6 h-[70vh]">
          {/* Left Side - Map */}
          <div className="flex-1 bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Shipment Route</h3>
            
            {/* Real Map Container */}
            <div className="bg-white rounded-lg border border-gray-200 h-full relative overflow-hidden">
              <MapContainer
                center={mapCenter}
                zoom={5}
                className="w-full h-full"
                style={{ minHeight: '300px' }}
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
          
          {/* Right Side - Tracking Updates */}
          <div className="w-80 bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Detailed Updates</h3>
              <select
                value={updateFilter}
                onChange={(e) => setUpdateFilter(e.target.value as 'all' | 'manual' | 'automated')}
                className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white"
              >
                <option value="all">All Updates</option>
                <option value="manual">Manual Updates</option>
                <option value="automated">Automated Updates</option>
              </select>
            </div>
            
            <div className="space-y-3 max-h-[40vh] overflow-y-auto">
              {filteredUpdates.map((update) => (
                <div key={update.id} className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-gray-900">{update.status}</span>
                    <span className="text-xs text-gray-500">{update.timestamp}</span>
                  </div>
                  <div className="text-xs text-gray-600 mb-1">{update.location}</div>
                  <div className="text-xs text-gray-700">{update.description}</div>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      update.type === 'manual' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {update.type === 'manual' ? 'Manual' : 'Automated'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackingModal;
