import React, { useState } from 'react';
import { FilterOptions, FilterPreset, ShipmentMode, ShipmentStatus } from '../types';
import { mockSalesReps, mockGroups } from '../data/mockData';
import MultiSelectDropdown from './MultiSelectDropdown';

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onSavePreset: (preset: FilterPreset) => void;
  presets: FilterPreset[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFiltersChange,
  onSavePreset,
  presets
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [presetName, setPresetName] = useState('');

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleSavePreset = () => {
    if (presetName.trim()) {
      const newPreset: FilterPreset = {
        id: Date.now().toString(),
        name: presetName,
        filters: { ...filters }
      };
      onSavePreset(newPreset);
      setPresetName('');
    }
  };

  const loadPreset = (preset: FilterPreset) => {
    onFiltersChange(preset.filters);
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const modeOptions = [
    { value: 'LTL', label: 'LTL' },
    { value: 'FTL', label: 'FTL' },
    { value: 'Intermodal', label: 'Intermodal' },
    { value: 'Air', label: 'Air' },
    { value: 'Ocean', label: 'Ocean' },
    { value: 'Drayage', label: 'Drayage' }
  ];

  const statusOptions = [
    { value: 'Quoted', label: 'Quoted' },
    { value: 'Booked Not Covered', label: 'Booked Not Covered' },
    { value: 'Booked', label: 'Booked' },
    { value: 'Dispatch', label: 'Dispatch' },
    { value: 'In Transit', label: 'In Transit' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Loading', label: 'Loading' },
    { value: 'Unloading', label: 'Unloading' },
    { value: 'Unloading / Loading', label: 'Unloading / Loading' },
    { value: 'Delivered OS&D', label: 'Delivered OS&D' }
  ];

  const groupOptions = mockGroups.map(group => ({
    value: group.name,
    label: group.name
  }));

  const regionOptions = [
    { value: 'Northeast', label: 'Northeast' },
    { value: 'Southeast', label: 'Southeast' },
    { value: 'Midwest', label: 'Midwest' },
    { value: 'West Coast', label: 'West Coast' },
    { value: 'Northwest', label: 'Northwest' },
    { value: 'Mountain', label: 'Mountain' },
    { value: 'Texas', label: 'Texas' }
  ];

  return (
    <div className="py-4">
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <h2 className="text-sm font-semibold text-slate-900">Filters</h2>
        
        {/* Preset Management */}
        <div className="flex items-center gap-2">
          <select 
            className="border border-slate-300 rounded-md px-3 py-1 text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => {
              const preset = presets.find(p => p.id === e.target.value);
              if (preset) loadPreset(preset);
            }}
            value=""
          >
            <option value="">Load Preset</option>
            {presets.map(preset => (
              <option key={preset.id} value={preset.id}>{preset.name}</option>
            ))}
          </select>
          
          <input
            type="text"
            placeholder="Preset name"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-1 text-xs w-24 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={handleSavePreset}
            className="bg-indigo-600 text-white px-3 py-1 rounded-md text-xs hover:bg-indigo-700 font-medium shadow-sm"
          >
            Save
          </button>
        </div>

        <button
          onClick={clearFilters}
          className="text-slate-600 hover:text-slate-800 text-xs font-medium"
        >
          Clear All
        </button>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-indigo-600 hover:text-indigo-700 text-xs font-medium"
        >
          {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
        </button>
      </div>

      {/* Basic Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Load #</label>
          <input
            type="text"
            value={filters.loadNumber || ''}
            onChange={(e) => handleFilterChange('loadNumber', e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-1 text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Load #"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Carrier</label>
          <input
            type="text"
            value={filters.carrierName || ''}
            onChange={(e) => handleFilterChange('carrierName', e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-1 text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Carrier"
          />
        </div>

        <div>
          <MultiSelectDropdown
            label="Mode"
            options={modeOptions}
            selectedValues={filters.shipmentMode || []}
            onChange={(values) => handleFilterChange('shipmentMode', values)}
            placeholder="Select modes..."
          />
        </div>

        <div>
          <MultiSelectDropdown
            label="Status"
            options={statusOptions}
            selectedValues={filters.shipmentStatus || []}
            onChange={(values) => handleFilterChange('shipmentStatus', values)}
            placeholder="Select statuses..."
          />
        </div>

                 <div>
           <MultiSelectDropdown
             label="Groups"
             options={groupOptions}
             selectedValues={filters.groupSelection || []}
             onChange={(values) => handleFilterChange('groupSelection', values)}
             placeholder="Select groups..."
           />
         </div>

        <div>
          <MultiSelectDropdown
            label="Regions"
            options={regionOptions}
            selectedValues={filters.regions || []}
            onChange={(values) => handleFilterChange('regions', values)}
            placeholder="Select regions..."
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Customer Rep</label>
          <select
            value={filters.customerSalesRep || ''}
            onChange={(e) => handleFilterChange('customerSalesRep', e.target.value || undefined)}
            className="w-full border border-gray-300 rounded-md px-3 py-1 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Customer Reps</option>
            {mockSalesReps.filter(rep => rep.type === 'Customer').map(rep => (
              <option key={rep.id} value={rep.name}>{rep.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Carrier Rep</label>
          <select
            value={filters.carrierSalesRep || ''}
            onChange={(e) => handleFilterChange('carrierSalesRep', e.target.value || undefined)}
            className="w-full border border-gray-300 rounded-md px-3 py-1 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Carrier Reps</option>
            {mockSalesReps.filter(rep => rep.type === 'Carrier').map(rep => (
              <option key={rep.id} value={rep.name}>{rep.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="min-w-0">
              <label className="block text-xs font-medium text-gray-700 mb-1">Shipper Zip Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={filters.shipperZipStart || ''}
                  onChange={(e) => handleFilterChange('shipperZipStart', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-1 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Start"
                />
                <input
                  type="text"
                  value={filters.shipperZipEnd || ''}
                  onChange={(e) => handleFilterChange('shipperZipEnd', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-1 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="End"
                />
              </div>
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-medium text-gray-700 mb-1">Consignee Zip Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={filters.consigneeZipStart || ''}
                  onChange={(e) => handleFilterChange('consigneeZipStart', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-1 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Start"
                />
                <input
                  type="text"
                  value={filters.consigneeZipEnd || ''}
                  onChange={(e) => handleFilterChange('consigneeZipEnd', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-1 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="End"
                />
              </div>
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-medium text-gray-700 mb-1">Shipper Company</label>
              <input
                type="text"
                value={filters.shipperCompany || ''}
                onChange={(e) => handleFilterChange('shipperCompany', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-1 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Shipper company"
              />
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-medium text-gray-700 mb-1">Consignee Company</label>
              <input
                type="text"
                value={filters.consigneeCompany || ''}
                onChange={(e) => handleFilterChange('consigneeCompany', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-1 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Consignee company"
              />
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-medium text-gray-700 mb-1">Pro #</label>
              <input
                type="text"
                value={filters.proNumber || ''}
                onChange={(e) => handleFilterChange('proNumber', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-1 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Pro number"
              />
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-medium text-gray-700 mb-1">Pickup #</label>
              <input
                type="text"
                value={filters.pickupNumber || ''}
                onChange={(e) => handleFilterChange('pickupNumber', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-1 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Pickup number"
              />
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-medium text-gray-700 mb-1">PO #</label>
              <input
                type="text"
                value={filters.poNumber || ''}
                onChange={(e) => handleFilterChange('poNumber', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-1 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="PO number"
              />
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-medium text-gray-700 mb-1">Shipper #</label>
              <input
                type="text"
                value={filters.shipperNumber || ''}
                onChange={(e) => handleFilterChange('shipperNumber', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-1 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Shipper number"
              />
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-medium text-gray-700 mb-1">Pickup Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={filters.pickupDateFrom || ''}
                  onChange={(e) => handleFilterChange('pickupDateFrom', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-1 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="date"
                  value={filters.pickupDateTo || ''}
                  onChange={(e) => handleFilterChange('pickupDateTo', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-1 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-medium text-gray-700 mb-1">Estimated Delivery Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={filters.estimatedDeliveryFrom || ''}
                  onChange={(e) => handleFilterChange('estimatedDeliveryFrom', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-1 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="date"
                  value={filters.estimatedDeliveryTo || ''}
                  onChange={(e) => handleFilterChange('estimatedDeliveryTo', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-1 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar; 