import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker, Circle } from 'react-leaflet';
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

interface ShipmentMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipments: Shipment[];
}

interface Location {
  lat: number;
  lng: number;
  shipments: Shipment[];
}

interface Cluster {
  lat: number;
  lng: number;
  count: number;
  shipments: Shipment[];
}

interface WeatherData {
  lat: number;
  lng: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  visibility: number;
  conditions: string;
  impactLevel: 'low' | 'medium' | 'high' | 'severe';
  impactDescription: string;
}

interface WeatherImpact {
  lat: number;
  lng: number;
  radius: number;
  impactLevel: 'low' | 'medium' | 'high' | 'severe';
  description: string;
}

const ShipmentMapModal: React.FC<ShipmentMapModalProps> = ({
  isOpen,
  onClose,
  shipments
}) => {
  const [zoom, setZoom] = useState(4);
  const [center, setCenter] = useState<[number, number]>([39.8283, -98.5795]); // Center of US
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [weatherImpacts, setWeatherImpacts] = useState<WeatherImpact[]>([]);
  const [showWeatherOverlay, setShowWeatherOverlay] = useState(true);
  const [selectedWeatherLocation, setSelectedWeatherLocation] = useState<WeatherData | null>(null);

  // Weather API configuration (you'll need to get an API key from OpenWeatherMap)
  const WEATHER_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with actual API key
  const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  // Parse addresses to get coordinates (simplified - in real app you'd use a geocoding service)
  const locations = useMemo(() => {
    const locationMap = new Map<string, Location>();
    
    shipments.forEach(shipment => {
      // Extract state from shipper address (simplified parsing)
      const stateMatch = shipment.shipperAddress.match(/,\s*([A-Z]{2})\s*\d{5}/);
      if (stateMatch) {
        const state = stateMatch[1];
        
        // Simplified state coordinates (in real app, you'd geocode the full address)
        const stateCoords: { [key: string]: { lat: number; lng: number } } = {
          'CA': { lat: 36.7783, lng: -119.4179 },
          'TX': { lat: 31.9686, lng: -99.9018 },
          'FL': { lat: 27.6648, lng: -81.5158 },
          'NY': { lat: 42.1657, lng: -74.9481 },
          'IL': { lat: 40.6331, lng: -89.3985 },
          'PA': { lat: 40.5908, lng: -77.2098 },
          'OH': { lat: 40.4173, lng: -82.9071 },
          'GA': { lat: 32.1656, lng: -82.9001 },
          'NC': { lat: 35.7596, lng: -79.0193 },
          'MI': { lat: 44.3148, lng: -85.6024 },
          'NJ': { lat: 40.0583, lng: -74.4057 },
          'VA': { lat: 37.7693, lng: -78.1700 },
          'WA': { lat: 47.4009, lng: -121.4905 },
          'AZ': { lat: 33.7298, lng: -111.4312 },
          'MA': { lat: 42.2304, lng: -71.5301 },
          'TN': { lat: 35.7478, lng: -86.6923 },
          'IN': { lat: 39.8494, lng: -86.2583 },
          'MO': { lat: 38.4561, lng: -92.2884 },
          'MD': { lat: 39.0639, lng: -76.8021 },
          'CO': { lat: 39.5501, lng: -105.7821 },
          'MN': { lat: 46.7296, lng: -94.6859 },
          'WI': { lat: 44.5133, lng: -89.0133 },
          'LA': { lat: 31.1695, lng: -91.8678 },
          'AL': { lat: 32.3182, lng: -86.9023 },
          'SC': { lat: 33.8569, lng: -80.9450 },
          'KY': { lat: 37.6681, lng: -84.6701 },
          'OR': { lat: 44.5720, lng: -122.0709 },
          'OK': { lat: 35.0078, lng: -97.0929 },
          'CT': { lat: 41.6032, lng: -73.0877 },
          'IA': { lat: 42.0329, lng: -93.1638 },
          'MS': { lat: 32.7416, lng: -89.6787 },
          'AR': { lat: 34.9697, lng: -92.3731 },
          'KS': { lat: 38.5111, lng: -96.8005 },
          'UT': { lat: 39.3210, lng: -111.0937 },
          'NV': { lat: 38.8026, lng: -116.4194 },
          'NM': { lat: 34.5199, lng: -105.8701 },
          'NE': { lat: 41.4925, lng: -99.9018 },
          'WV': { lat: 38.5976, lng: -80.4549 },
          'ID': { lat: 44.2405, lng: -114.4788 },
          'HI': { lat: 19.8968, lng: -155.5828 },
          'NH': { lat: 43.1939, lng: -71.5724 },
          'ME': { lat: 44.6939, lng: -69.3819 },
          'RI': { lat: 41.5801, lng: -71.4774 },
          'MT': { lat: 46.8797, lng: -110.3626 },
          'DE': { lat: 38.9108, lng: -75.5277 },
          'SD': { lat: 44.2998, lng: -99.4388 },
          'ND': { lat: 47.5515, lng: -101.0020 },
          'AK': { lat: 63.5887, lng: -154.4931 },
          'VT': { lat: 44.0459, lng: -72.7107 },
          'WY': { lat: 42.7475, lng: -107.2085 }
        };

        const coords = stateCoords[state];
        if (coords) {
          const key = `${coords.lat},${coords.lng}`;
          if (locationMap.has(key)) {
            locationMap.get(key)!.shipments.push(shipment);
          } else {
            locationMap.set(key, {
              lat: coords.lat,
              lng: coords.lng,
              shipments: [shipment]
            });
          }
        }
      }
    });

    return Array.from(locationMap.values());
  }, [shipments]);

  // Get impact description
  const getImpactDescription = useCallback((impactLevel: 'low' | 'medium' | 'high' | 'severe'): string => {
    switch (impactLevel) {
      case 'low':
        return 'Minimal impact on shipments';
      case 'medium':
        return 'Moderate delays possible';
      case 'high':
        return 'Significant delays expected';
      case 'severe':
        return 'Severe disruptions likely';
      default:
        return 'Unknown impact level';
    }
  }, []);

  // Assess weather impact based on conditions
  const assessWeatherImpact = useCallback((weatherData: any): 'low' | 'medium' | 'high' | 'severe' => {
    const { temp, wind_speed, visibility, weather } = weatherData.main || {};
    const conditions = weather?.[0]?.main?.toLowerCase() || '';
    
    let impactScore = 0;
    
    // Temperature impact
    if (temp < 20 || temp > 100) impactScore += 2;
    else if (temp < 32 || temp > 90) impactScore += 1;
    
    // Wind impact
    if (wind_speed > 25) impactScore += 3;
    else if (wind_speed > 15) impactScore += 2;
    else if (wind_speed > 10) impactScore += 1;
    
    // Visibility impact
    if (visibility < 1) impactScore += 3;
    else if (visibility < 3) impactScore += 2;
    else if (visibility < 5) impactScore += 1;
    
    // Weather condition impact
    if (['thunderstorm', 'snow', 'sleet'].includes(conditions)) impactScore += 3;
    else if (['rain', 'drizzle'].includes(conditions)) impactScore += 2;
    else if (['fog', 'mist'].includes(conditions)) impactScore += 1;
    
    if (impactScore >= 6) return 'severe';
    if (impactScore >= 4) return 'high';
    if (impactScore >= 2) return 'medium';
    return 'low';
  }, []);

  // Generate weather impact circles for heat map
  const generateWeatherImpacts = useCallback((weather: WeatherData[]) => {
    const impacts: WeatherImpact[] = weather
      .filter(w => w.impactLevel !== 'low')
      .map(w => ({
        lat: w.lat,
        lng: w.lng,
        radius: w.impactLevel === 'severe' ? 200000 : w.impactLevel === 'high' ? 150000 : 100000, // meters
        impactLevel: w.impactLevel,
        description: w.impactDescription
      }));
    
    setWeatherImpacts(impacts);
  }, []);

  // Fetch weather data for locations
  const fetchWeatherData = useCallback(async () => {
    if (WEATHER_API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
      // Use mock weather data for demonstration
      const mockWeatherData: WeatherData[] = locations.map(location => {
        const impactLevels: ('low' | 'medium' | 'high' | 'severe')[] = ['low', 'medium', 'high', 'severe'];
        const impactLevel = impactLevels[Math.floor(Math.random() * impactLevels.length)];
        
        return {
          lat: location.lat,
          lng: location.lng,
          temperature: Math.round(20 + Math.random() * 40 - 20), // -20 to 40°C
          humidity: Math.round(30 + Math.random() * 50), // 30-80%
          windSpeed: Math.round(5 + Math.random() * 25), // 5-30 mph
          precipitation: Math.round(Math.random() * 100), // 0-100%
          visibility: Math.round(5 + Math.random() * 10), // 5-15 miles
          conditions: ['Clear', 'Cloudy', 'Rain', 'Snow', 'Storm'][Math.floor(Math.random() * 5)],
          impactLevel,
          impactDescription: getImpactDescription(impactLevel)
        };
      });
      
      setWeatherData(mockWeatherData);
      generateWeatherImpacts(mockWeatherData);
      return;
    }

    try {
      const weatherPromises = locations.map(async (location) => {
        const response = await fetch(
          `${WEATHER_BASE_URL}?lat=${location.lat}&lon=${location.lng}&appid=${WEATHER_API_KEY}&units=imperial`
        );
        const data = await response.json();
        
        const impactLevel = assessWeatherImpact(data);
        
        return {
          lat: location.lat,
          lng: location.lng,
          temperature: Math.round(data.main.temp),
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed),
          precipitation: data.rain ? Math.round(data.rain['1h'] || 0) : 0,
          visibility: Math.round(data.visibility / 1609.34), // Convert meters to miles
          conditions: data.weather[0].main,
          impactLevel,
          impactDescription: getImpactDescription(impactLevel)
        };
      });

      const weatherResults = await Promise.all(weatherPromises);
      setWeatherData(weatherResults);
      generateWeatherImpacts(weatherResults);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }, [locations, getImpactDescription, assessWeatherImpact, generateWeatherImpacts]);

  // Fetch weather data when modal opens
  useEffect(() => {
    if (isOpen && locations.length > 0) {
      fetchWeatherData();
    }
  }, [isOpen, locations, fetchWeatherData]);

  // Create clusters based on zoom level
  const clusters = useMemo(() => {
    if (zoom >= 6) {
      // Show individual locations when zoomed in
      return locations.map(location => ({
        lat: location.lat,
        lng: location.lng,
        count: location.shipments.length,
        shipments: location.shipments
      }));
    } else {
      // Cluster nearby locations when zoomed out
      const clusterRadius = zoom <= 3 ? 10 : 5; // Degrees
      const clusterMap = new Map<string, Cluster>();

      locations.forEach(location => {
        const clusterKey = `${Math.floor(location.lat / clusterRadius)},${Math.floor(location.lng / clusterRadius)}`;
        
        if (clusterMap.has(clusterKey)) {
          const cluster = clusterMap.get(clusterKey)!;
          cluster.count += location.shipments.length;
          cluster.shipments.push(...location.shipments);
        } else {
          clusterMap.set(clusterKey, {
            lat: location.lat,
            lng: location.lng,
            count: location.shipments.length,
            shipments: location.shipments
          });
        }
      });

      return Array.from(clusterMap.values());
    }
  }, [locations, zoom]);

  const handleClusterClick = (cluster: Cluster) => {
    if (zoom < 6) {
      // Zoom in to show individual locations
      setZoom(6);
      setCenter([cluster.lat, cluster.lng]);
    } else {
      // Show shipment details
      setSelectedLocation({
        lat: cluster.lat,
        lng: cluster.lng,
        shipments: cluster.shipments
      });
    }
  };

  const handleWeatherLocationClick = (weather: WeatherData) => {
    setSelectedWeatherLocation(weather);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-6xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Shipment Locations ({shipments.length} shipments)
          </h2>
          <div className="flex items-center gap-2">
            {/* Weather Overlay Toggle */}
            <button
              onClick={() => setShowWeatherOverlay(!showWeatherOverlay)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                showWeatherOverlay 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {showWeatherOverlay ? '🌤️ Hide Weather' : '🌤️ Show Weather'}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Weather Impact Heat Map Overlay */}
            {showWeatherOverlay && weatherImpacts.map((impact, index) => (
              <Circle
                key={`impact-${index}`}
                center={[impact.lat, impact.lng]}
                radius={impact.radius}
                pathOptions={{
                  color: impact.impactLevel === 'severe' ? '#dc2626' : 
                         impact.impactLevel === 'high' ? '#ea580c' : '#d97706',
                  fillColor: impact.impactLevel === 'severe' ? '#dc2626' : 
                            impact.impactLevel === 'high' ? '#ea580c' : '#d97706',
                  fillOpacity: impact.impactLevel === 'severe' ? 0.3 : 
                              impact.impactLevel === 'high' ? 0.25 : 0.2,
                  weight: 2
                }}
              >
                <Popup>
                  <div className="text-center">
                    <div className={`font-bold text-lg ${
                      impact.impactLevel === 'severe' ? 'text-red-700' :
                      impact.impactLevel === 'high' ? 'text-orange-700' : 'text-yellow-700'
                    }`}>
                      {impact.impactLevel.toUpperCase()} Impact
                    </div>
                    <div className="text-sm text-gray-600">{impact.description}</div>
                  </div>
                </Popup>
              </Circle>
            ))}
            
            {/* Weather Data Markers */}
            {showWeatherOverlay && weatherData.map((weather, index) => (
              <CircleMarker
                key={`weather-${index}`}
                center={[weather.lat, weather.lng]}
                radius={8}
                fillColor={weather.impactLevel === 'severe' ? '#dc2626' : 
                           weather.impactLevel === 'high' ? '#ea580c' : 
                           weather.impactLevel === 'medium' ? '#d97706' : '#10b981'}
                color="white"
                weight={2}
                opacity={0.9}
                fillOpacity={0.8}
                eventHandlers={{
                  click: () => handleWeatherLocationClick(weather)
                }}
              >
                <Popup>
                  <div className="text-center min-w-32">
                    <div className="font-bold text-sm mb-2">Weather Conditions</div>
                    <div className="text-xs space-y-1">
                      <div>🌡️ {weather.temperature}°F</div>
                      <div>💨 {weather.windSpeed} mph</div>
                      <div>💧 {weather.humidity}%</div>
                      <div>👁️ {weather.visibility} mi</div>
                      <div className={`font-medium mt-2 ${
                        weather.impactLevel === 'severe' ? 'text-red-700' :
                        weather.impactLevel === 'high' ? 'text-orange-700' : 
                        weather.impactLevel === 'medium' ? 'text-yellow-700' : 'text-green-700'
                      }`}>
                        {weather.impactLevel.toUpperCase()} IMPACT
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
            
            {/* Clusters/Markers */}
            {clusters.map((cluster, index) => (
              <CircleMarker
                key={index}
                center={[cluster.lat, cluster.lng]}
                radius={zoom >= 6 ? 8 : 12}
                fillColor={cluster.count > 10 ? '#ef4444' : cluster.count > 5 ? '#f97316' : '#3b82f6'}
                color="white"
                weight={2}
                opacity={0.8}
                fillOpacity={0.8}
                eventHandlers={{
                  click: () => handleClusterClick(cluster)
                }}
              >
                <Popup>
                  <div className="text-center">
                    <div className="font-bold text-lg">{cluster.count}</div>
                    <div className="text-sm text-gray-600">shipments</div>
                    {zoom >= 6 && (
                      <button
                        onClick={() => setSelectedLocation({
                          lat: cluster.lat,
                          lng: cluster.lng,
                          shipments: cluster.shipments
                        })}
                        className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>

          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 bg-white rounded-md shadow-md border border-gray-200">
            <div className="flex flex-col">
              <button
                onClick={() => setZoom(prev => Math.min(prev + 1, 10))}
                className="p-2 hover:bg-gray-100 border-b border-gray-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                onClick={() => setZoom(prev => Math.max(prev - 1, 1))}
                className="p-2 hover:bg-gray-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Weather Legend */}
          {showWeatherOverlay && (
            <div className="absolute bottom-4 right-4 bg-white px-4 py-3 rounded-md shadow-md border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">Weather Impact Legend</div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Low Impact</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Medium Impact</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span>High Impact</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Severe Impact</span>
                </div>
              </div>
            </div>
          )}

          {/* Zoom Level Indicator */}
          <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-md shadow-md border border-gray-200">
            <div className="text-sm text-gray-600">
              {zoom >= 6 ? 'Individual locations' : 'Clustered locations'}
            </div>
            <div className="text-xs text-gray-500">
              {zoom >= 6 ? 'Click markers for details' : 'Click clusters to zoom in'}
            </div>
          </div>
        </div>

        {/* Shipment Details Modal */}
        {selectedLocation && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-4xl flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Shipments in this location ({selectedLocation.shipments.length})
                </h3>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="grid gap-3">
                  {selectedLocation.shipments.map(shipment => (
                    <div key={shipment.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900">
                            Load #{shipment.loadNumber} - {shipment.customer}
                          </div>
                          <div className="text-sm text-gray-600">
                            {shipment.shipperAddress}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Status: {shipment.status} | Priority: {shipment.priority}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            ${shipment.cost.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {shipment.weight.toLocaleString()} lbs
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weather Details Modal */}
        {selectedWeatherLocation && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white rounded-lg shadow-xl w-96 max-h-96 flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Weather Details</h3>
                <button
                  onClick={() => setSelectedWeatherLocation(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold mb-2 ${
                      selectedWeatherLocation.impactLevel === 'severe' ? 'text-red-700' :
                      selectedWeatherLocation.impactLevel === 'high' ? 'text-orange-700' : 
                      selectedWeatherLocation.impactLevel === 'medium' ? 'text-yellow-700' : 'text-green-700'
                    }`}>
                      {selectedWeatherLocation.impactLevel.toUpperCase()} IMPACT
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      {selectedWeatherLocation.impactDescription}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{selectedWeatherLocation.temperature}°F</div>
                      <div className="text-xs text-gray-600">Temperature</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{selectedWeatherLocation.humidity}%</div>
                      <div className="text-xs text-gray-600">Humidity</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{selectedWeatherLocation.windSpeed} mph</div>
                      <div className="text-xs text-gray-600">Wind Speed</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{selectedWeatherLocation.visibility} mi</div>
                      <div className="text-xs text-gray-600">Visibility</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-900">Conditions</div>
                    <div className="text-lg text-blue-700">{selectedWeatherLocation.conditions}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipmentMapModal; 