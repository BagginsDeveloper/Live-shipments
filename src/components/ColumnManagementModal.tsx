import React, { useState } from 'react';
import { TableColumn } from '../types';

// Available shipment modes
const SHIPMENT_MODES = ['All', 'LTL', 'FTL', 'Intermodal', 'Air', 'Ocean', 'Drayage'] as const;
type ShipmentMode = typeof SHIPMENT_MODES[number];

interface ColumnManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: TableColumn[];
  onColumnsChange: (columns: TableColumn[]) => void;
}

interface ModeColumnConfig {
  [mode: string]: TableColumn[];
}

const ColumnManagementModal: React.FC<ColumnManagementModalProps> = ({
  isOpen,
  onClose,
  columns,
  onColumnsChange
}) => {
  const [draggedItem, setDraggedItem] = useState<TableColumn | null>(null);
  const [localColumns, setLocalColumns] = useState<TableColumn[]>(columns);
  const [selectedMode, setSelectedMode] = useState<ShipmentMode>('All');
  const [modeColumnConfigs, setModeColumnConfigs] = useState<ModeColumnConfig>({
    'All': [...columns],
    'LTL': [...columns],
    'FTL': [...columns],
    'Intermodal': [...columns],
    'Air': [...columns],
    'Ocean': [...columns],
    'Drayage': [...columns]
  });

  const handleDragStart = (e: React.DragEvent, column: TableColumn) => {
    setDraggedItem(column);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetColumn: TableColumn) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetColumn.id) return;

    const draggedIndex = localColumns.findIndex(col => col.id === draggedItem.id);
    const targetIndex = localColumns.findIndex(col => col.id === targetColumn.id);

    const newColumns = [...localColumns];
    newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, draggedItem);

    setLocalColumns(newColumns);
    
    // Update the mode configuration
    if (selectedMode !== 'All') {
      updateModeConfig(selectedMode, newColumns);
    }
    
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const toggleColumnVisibility = (columnId: string) => {
    const newColumns = localColumns.map(col =>
      col.id === columnId ? { ...col, visible: !col.visible } : col
    );
    setLocalColumns(newColumns);
    
    // Update the mode configuration
    if (selectedMode !== 'All') {
      updateModeConfig(selectedMode, newColumns);
    }
  };

  const toggleColumnSticky = (columnId: string) => {
    const newColumns = localColumns.map(col =>
      col.id === columnId ? { ...col, sticky: !col.sticky } : col
    );
    setLocalColumns(newColumns);
    
    // Update the mode configuration
    if (selectedMode !== 'All') {
      updateModeConfig(selectedMode, newColumns);
    }
  };

  const handleSave = () => {
    // Update the current mode configuration
    if (selectedMode !== 'All') {
      updateModeConfig(selectedMode, localColumns);
    }
    
    // Save the current view (either 'All' or specific mode)
    onColumnsChange(localColumns);
    onClose();
  };

  const handleReset = () => {
    setLocalColumns(columns);
    setModeColumnConfigs({
      'All': [...columns],
      'LTL': [...columns],
      'FTL': [...columns],
      'Intermodal': [...columns],
      'Air': [...columns],
      'Ocean': [...columns],
      'Drayage': [...columns]
    });
  };

  const handleModeChange = (mode: ShipmentMode) => {
    setSelectedMode(mode);
    setLocalColumns(modeColumnConfigs[mode]);
  };

  const updateModeConfig = (mode: string, newColumns: TableColumn[]) => {
    setModeColumnConfigs(prev => ({
      ...prev,
      [mode]: newColumns
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Manage Table Columns</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shipment Mode Configuration
            </label>
            <div className="flex flex-wrap gap-2">
              {SHIPMENT_MODES.map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleModeChange(mode)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedMode === mode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <p>Drag and drop columns to reorder them. Use the checkboxes to show/hide columns.</p>
            <p className="mt-1">
              <span className="font-medium">Current Mode:</span> {selectedMode} 
              {selectedMode !== 'All' && ' - Custom configuration for this shipment mode'}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            {localColumns.map((column) => (
              <div
                key={column.id}
                draggable={column.id !== 'select' && !column.locked}
                onDragStart={(e) => handleDragStart(e, column)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column)}
                onDragEnd={handleDragEnd}
                className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 ${
                  draggedItem?.id === column.id ? 'opacity-50' : ''
                } ${column.id === 'select' || column.locked ? 'cursor-default' : 'cursor-move'}`}
              >
                <div className="flex items-center gap-3">
                  {column.id !== 'select' && !column.locked && (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                  )}
                  {column.locked && (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                  <input
                    type="checkbox"
                    checked={column.visible}
                    onChange={() => toggleColumnVisibility(column.id)}
                    className="rounded border-gray-300"
                    disabled={column.locked}
                  />
                  <span className={`text-sm font-medium ${column.locked ? 'text-gray-500' : 'text-gray-900'}`}>{column.label}</span>
                  {column.sortable && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Sortable</span>
                  )}
                  {column.filterable && (
                    <span className="text-xs text-green-500 bg-green-100 px-2 py-1 rounded">Filterable</span>
                  )}
                  {column.sticky && (
                    <span className="text-xs text-blue-500 bg-blue-100 px-2 py-1 rounded">Sticky</span>
                  )}
                  {column.locked && (
                    <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded">Locked</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleColumnSticky(column.id)}
                    disabled={column.locked}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      column.sticky 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } ${column.locked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={column.sticky ? 'Remove sticky' : 'Make sticky'}
                  >
                    {column.sticky ? 'Unstick' : 'Sticky'}
                  </button>
                  <div className="text-xs text-gray-500">
                    {column.width && `Width: ${column.width}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColumnManagementModal; 