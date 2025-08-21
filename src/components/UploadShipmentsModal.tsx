import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Shipment, TableColumn } from '../types';

interface UploadShipmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: TableColumn[];
  onUpload: (shipments: Partial<Shipment>[]) => void;
}

interface Customer {
  id: string;
  name: string;
  code: string;
}

interface ColumnMapping {
  [key: string]: string; // file column -> table column
}

interface UploadedData {
  headers: string[];
  rows: any[][];
}

interface PresetMapping {
  id: string;
  name: string;
  mappings: ColumnMapping;
  createdAt: string;
}

const UploadShipmentsModal: React.FC<UploadShipmentsModalProps> = ({
  isOpen,
  onClose,
  columns,
  onUpload
}) => {
  const [uploadedData, setUploadedData] = useState<UploadedData | null>(null);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [showPresetSave, setShowPresetSave] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset column mappings when modal opens/closes to ensure clean state
  React.useEffect(() => {
    if (isOpen) {
      setColumnMappings({});
      setUploadedData(null);
      setSelectedCustomer('');
      setPresetName('');
      setShowPresetSave(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen]);

  // Fake preset data for demonstration
  // Available customers for selection
  const customers: Customer[] = [
    { id: '1', name: 'ABC Manufacturing', code: 'ABC' },
    { id: '2', name: 'XYZ Logistics', code: 'XYZ' },
    { id: '3', name: 'Global Imports', code: 'GLBL' },
    { id: '4', name: 'Tech Solutions', code: 'TECH' },
    { id: '5', name: 'Ocean Freight Co', code: 'OCEAN' },
    { id: '6', name: 'Retail Plus', code: 'RETAIL' },
    { id: '7', name: 'Food Services Inc', code: 'FOOD' },
    { id: '8', name: 'Elite Retail Corp', code: 'ELITE' }
  ];

  const [savedPresets, setSavedPresets] = useState<PresetMapping[]>([
    {
      id: '1',
      name: 'Standard Import Format',
      mappings: {
        'Load Number': 'loadNumber',
        'Customer': 'customer',
        'Origin': 'shipperAddress',
        'Destination': 'consigneeAddress',
        'Carrier': 'carrier',
        'Cost': 'cost',
        'Weight': 'weight'
      },
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'TMS Export Format',
      mappings: {
        'Load ID': 'loadNumber',
        'Client Name': 'customer',
        'Pickup Location': 'shipperAddress',
        'Delivery Location': 'consigneeAddress',
        'Transport Provider': 'carrier',
        'Total Cost': 'cost',
        'Shipment Weight': 'weight',
        'PO Number': 'poRef'
      },
      createdAt: '2024-01-12'
    },
    {
      id: '3',
      name: 'Carrier Report Format',
      mappings: {
        'Shipment #': 'loadNumber',
        'Customer Name': 'customer',
        'From': 'shipperAddress',
        'To': 'consigneeAddress',
        'Miles': 'miles',
        'Rate': 'targetRate',
        'Equipment': 'equipment'
      },
      createdAt: '2024-01-10'
    }
  ]);

  if (!isOpen) return null;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCustomer) {
      alert('Please select a customer before uploading a file');
      event.target.value = '';
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length < 2) {
          alert('File must have at least a header row and one data row');
          return;
        }

        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1) as any[][];

        // Set uploaded data without any auto-mapping - user must manually select
        setUploadedData({ headers, rows });
        setColumnMappings({});
      } catch (error) {
        console.error('Error reading file:', error);
        alert('Error reading file. Please ensure it\'s a valid Excel or CSV file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleColumnMappingChange = (fileColumn: string, tableColumn: string) => {
    setColumnMappings(prev => ({
      ...prev,
      [fileColumn]: tableColumn
    }));
  };

  const handleUpload = () => {
    if (!uploadedData) return;

    setIsProcessing(true);
    try {
      const mappedShipments: Partial<Shipment>[] = uploadedData.rows.map((row, index) => {
        const shipment: Partial<Shipment> = {};
        
        uploadedData.headers.forEach((header, colIndex) => {
          const mappedColumn = columnMappings[header];
          if (mappedColumn && row[colIndex] !== undefined) {
            const value = row[colIndex];
            
            // Type conversion based on column type
            switch (mappedColumn) {
              case 'cost':
              case 'maxBuy':
              case 'targetRate':
              case 'billed':
              case 'margin':
                (shipment as any)[mappedColumn] = parseFloat(value) || 0;
                break;
              case 'weight':
              case 'miles':
                (shipment as any)[mappedColumn] = parseInt(value) || 0;
                break;
              case 'pickupDate':
              case 'estimatedDelivery':
                (shipment as any)[mappedColumn] = value;
                break;
              default:
                (shipment as any)[mappedColumn] = value;
            }
          }
        });

        // Generate a temporary ID for new shipments
        shipment.id = `uploaded_${Date.now()}_${index}`;
        
        // Set the selected customer for all uploaded shipments
        shipment.customer = customers.find(c => c.id === selectedCustomer)?.name || selectedCustomer;
        
        return shipment;
      });

      onUpload(mappedShipments);
      onClose();
    } catch (error) {
      console.error('Error processing upload:', error);
      alert('Error processing upload. Please check your data and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetUpload = () => {
    setUploadedData(null);
    setColumnMappings({});
    setPresetName('');
    setShowPresetSave(false);
    setSelectedCustomer('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSavePreset = () => {
    if (!presetName.trim()) {
      alert('Please enter a name for the preset');
      return;
    }

    const newPreset: PresetMapping = {
      id: Date.now().toString(),
      name: presetName.trim(),
      mappings: { ...columnMappings },
      createdAt: new Date().toISOString().split('T')[0]
    };

    setSavedPresets(prev => [newPreset, ...prev]);
    setPresetName('');
    setShowPresetSave(false);
    alert(`Preset "${newPreset.name}" saved successfully!`);
  };

  const handleLoadPreset = (preset: PresetMapping) => {
    if (!uploadedData) return;
    
    // Only apply mappings for columns that exist in the uploaded file
    const filteredMappings: ColumnMapping = {};
    uploadedData.headers.forEach(header => {
      if (preset.mappings[header]) {
        filteredMappings[header] = preset.mappings[header];
      }
    });
    
    setColumnMappings(filteredMappings);
  };

  const handleDeletePreset = (presetId: string) => {
    if (window.confirm('Are you sure you want to delete this preset?')) {
      setSavedPresets(prev => prev.filter(p => p.id !== presetId));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Upload Shipments
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!uploadedData ? (
          <div className="space-y-6">
            {/* Customer Selection */}
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Customer for Upload
              </label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full max-w-md mx-auto text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">-- Select Customer --</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.code})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Choose the customer that these shipments belong to
              </p>
            </div>

            {/* File Upload */}
            <div className="text-center py-8">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-2 text-sm text-gray-600">
                  Upload Excel or CSV file with shipment data
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Column Mapping
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Customer: <span className="font-medium text-blue-600">
                    {customers.find(c => c.id === selectedCustomer)?.name}
                  </span>
                </p>
              </div>
              <button
                onClick={resetUpload}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Upload Different File
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* File Columns */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">File Columns</h4>
                <div className="space-y-2">
                  {uploadedData.headers.map((header) => (
                    <div key={header} className="text-sm text-gray-600">
                      {header}
                    </div>
                  ))}
                </div>
              </div>

              {/* Column Mapping */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Map To Table Column</h4>
                  <button
                    onClick={() => setShowPresetSave(!showPresetSave)}
                    className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  >
                    Save Preset
                  </button>
                </div>
                
                {showPresetSave && (
                  <div className="mb-3 p-2 bg-gray-50 rounded border">
                    <input
                      type="text"
                      placeholder="Enter preset name..."
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded px-2 py-1 mb-2"
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={handleSavePreset}
                        className="flex-1 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setShowPresetSave(false)}
                        className="flex-1 text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {uploadedData.headers.map((header) => {
                    // Get list of already selected column keys (excluding current header's selection)
                    // Only consider columns that have actually been mapped (not empty strings or undefined)
                    const selectedColumns = Object.entries(columnMappings)
                      .filter(([key, value]) => {
                        // Only include mappings that:
                        // 1. Are not the current header
                        // 2. Have a value (not undefined/null)
                        // 3. Have a non-empty string value
                        return key !== header && 
                               value !== undefined && 
                               value !== null && 
                               value !== '' && 
                               value.trim() !== '';
                      })
                      .map(([, value]) => value);

                    return (
                      <select
                        key={header}
                        value={columnMappings[header] || ''}
                        onChange={(e) => handleColumnMappingChange(header, e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded-md px-2 py-1"
                      >
                        <option value="">-- Select Column --</option>
                        {columns.map((col) => {
                          // Only show "already selected" if this column is actually mapped to a different header
                          const isAlreadySelected = selectedColumns.includes(col.key);
                          return (
                            <option 
                              key={col.key} 
                              value={col.key}
                              disabled={isAlreadySelected}
                              style={{ 
                                color: isAlreadySelected ? '#9CA3AF' : 'inherit',
                                fontStyle: isAlreadySelected ? 'italic' : 'normal'
                              }}
                            >
                              {col.label}{isAlreadySelected ? ' (already selected)' : ''}
                            </option>
                          );
                        })}
                      </select>
                    );
                  })}
                </div>
              </div>

              {/* Saved Presets */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Saved Presets</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {savedPresets.length === 0 ? (
                    <div className="text-xs text-gray-500 italic">No saved presets</div>
                  ) : (
                    savedPresets.map((preset) => (
                      <div
                        key={preset.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded border hover:bg-gray-100"
                      >
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => handleLoadPreset(preset)}
                            className="text-left w-full"
                          >
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {preset.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {Object.keys(preset.mappings).length} mappings • {preset.createdAt}
                            </div>
                          </button>
                        </div>
                        <button
                          onClick={() => handleDeletePreset(preset.id)}
                          className="ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete preset"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preview (First 5 rows)</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      {uploadedData.headers.map((header) => (
                        <th key={header} className="px-2 py-1 text-left border border-gray-200">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedData.rows.slice(0, 5).map((row, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-2 py-1 border border-gray-200">
                            {String(cell || '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Upload Shipments'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadShipmentsModal;
