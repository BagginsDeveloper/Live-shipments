import React, { useState, useMemo, useEffect } from 'react';
import { Shipment, ShipmentStatus, TableColumn, AppointmentStatus, Priority } from '../types';
import { statusColors, appointmentStatusColors, priorityColors } from '../data/mockData';
import ColumnManagementModal from './ColumnManagementModal';
import * as XLSX from 'xlsx';

interface ShipmentsTableProps {
  shipments: Shipment[];
  selectedShipments: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onBulkAction: (action: string, shipmentIds: string[]) => void;
  columns: TableColumn[];
  onColumnsChange: (columns: TableColumn[]) => void;
}

type SortField = keyof Shipment;
type SortDirection = 'asc' | 'desc';

const ShipmentsTable: React.FC<ShipmentsTableProps> = ({
  shipments, selectedShipments, onSelectionChange, onBulkAction,
  columns, onColumnsChange
}) => {
  const [sortField, setSortField] = useState<SortField>('loadNumber');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [bulkAction, setBulkAction] = useState<string>('');
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [openActionDropdown, setOpenActionDropdown] = useState<string | null>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openActionDropdown) {
        setOpenActionDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openActionDropdown]);

  const sortedAndFilteredShipments = useMemo(() => {
    let filtered = [...shipments];

    // Apply column filters
    Object.entries(columnFilters).forEach(([columnKey, filterValue]) => {
      if (filterValue.trim()) {
        filtered = filtered.filter(shipment => {
          const value = shipment[columnKey as keyof Shipment];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(filterValue.toLowerCase());
        });
      }
    });

    // Apply sorting
    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [shipments, sortField, sortDirection, columnFilters]);

  const handleSort = (field: keyof Shipment) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleColumnFilter = (columnKey: string, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
  };

  const handleActionClick = (shipmentId: string, action: string) => {
    console.log(`Action "${action}" clicked for shipment:`, shipmentId);
    // In a real app, you would handle the specific action here
    setOpenActionDropdown(null);
  };

  const renderCell = (shipment: Shipment, column: TableColumn) => {
    switch (column.key) {
      case 'id':
        if (column.id === 'select') {
          return (
            <input
              type="checkbox"
              checked={selectedShipments.includes(shipment.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  onSelectionChange([...selectedShipments, shipment.id]);
                } else {
                  onSelectionChange(selectedShipments.filter(id => id !== shipment.id));
                }
              }}
              className="rounded border-gray-300"
            />
          );
        }
        return null;
      
      case 'status':
        if (column.id === 'statusActions') {
          const actions = getActionsForStatus(shipment.status);
          const isDropdownOpen = openActionDropdown === shipment.id;
          
          return (
            <div className="flex flex-col gap-1">
              {/* Status Chip */}
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${statusColors[shipment.status]}`}>
                {shipment.status}
              </span>
              
              {/* Actions Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenActionDropdown(isDropdownOpen ? null : shipment.id)}
                  className="text-xs text-blue-600 hover:text-blue-800 border border-blue-300 rounded px-1.5 py-0.5 hover:bg-blue-50"
                >
                  Actions ▼
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                    {actions.map((action) => (
                      <button
                        key={action}
                        onClick={() => handleActionClick(shipment.id, action)}
                        className="block w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        }
        return (
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${statusColors[shipment.status]}`}>
            {shipment.status}
          </span>
        );
      
      case 'appointmentStatus':
        return (
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${appointmentStatusColors[shipment.appointmentStatus]}`}>
            {shipment.appointmentStatus}
          </span>
        );
      
      case 'priority':
        return (
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[shipment.priority]}`}>
            {shipment.priority}
          </span>
        );
      
      case 'loadNumber':
        return <span className="font-medium">{shipment.loadNumber}</span>;
      
      case 'customer':
        return <span>{shipment.customer}</span>;
      
      case 'shipperAddress':
        return <span>{shipment.shipperAddress}</span>;
      
      case 'consigneeAddress':
        return <span>{shipment.consigneeAddress}</span>;
      
      case 'pickupDate':
        return <span>{shipment.pickupDate}</span>;
      
      case 'estimatedDelivery':
        return <span>{shipment.estimatedDelivery}</span>;
      
      case 'carrier':
        return <span>{shipment.carrier}</span>;
      
      case 'poRef':
        return <span>{shipment.poRef}</span>;
      
      case 'cost':
        return <span>${shipment.cost.toLocaleString()}</span>;
      
      case 'maxBuy':
        return <span>${shipment.maxBuy.toLocaleString()}</span>;
      
      case 'targetRate':
        return <span>${shipment.targetRate.toLocaleString()}</span>;
      
      case 'billed':
        return <span>${shipment.billed.toLocaleString()}</span>;
      
      case 'margin':
        return <span>${shipment.margin.toLocaleString()}</span>;
      
      case 'weight':
        return <span>{shipment.weight.toLocaleString()} lbs</span>;
      
      case 'miles':
        return <span>{shipment.miles.toLocaleString()}</span>;
      
      case 'regionGroup':
        return <span>{shipment.regionGroup}</span>;
      
      case 'productDescription':
        return <span>{shipment.productDescription}</span>;
      
      case 'mode':
        return <span>{shipment.mode}</span>;
      
      case 'lastTrackingNote':
        return <span className="text-sm text-gray-600">{shipment.lastTrackingNote}</span>;
      
      case 'lastEdited':
        return <span className="text-sm text-gray-500">{shipment.lastEdited}</span>;
      
      case 'customerSalesRep':
        return <span>{shipment.customerSalesRep}</span>;
      
      case 'carrierSalesRep':
        return <span>{shipment.carrierSalesRep}</span>;
      
      case 'assignedTo':
        return <span>{shipment.assignedTo}</span>;
      
      case 'pieceCount':
        return <span>{shipment.pieceCount}</span>;
      
      default:
        return <span>{String(shipment[column.key])}</span>;
    }
  };

  const getActionsForStatus = (status: ShipmentStatus): string[] => {
    switch (status) {
      case 'Quoted':
        return ['Book', 'Edit Quote', 'Send Quote'];
      case 'Booked Not Covered':
        return ['Cover', 'Edit', 'Cancel'];
      case 'Booked':
        return ['Dispatch', 'Edit', 'Cancel'];
      case 'Dispatch':
        return ['Track', 'Edit', 'Cancel'];
      case 'In Transit':
        return ['Track', 'Update', 'Deliver'];
      case 'Loading':
        return ['Track', 'Update', 'Complete Loading'];
      case 'Unloading':
        return ['Track', 'Update', 'Complete Unloading'];
      case 'Unloading / Loading':
        return ['Track', 'Update', 'Complete Transfer'];
      case 'Delivered':
        return ['View', 'Invoice', 'Archive'];
      case 'Delivered OS&D':
        return ['View', 'Resolve', 'Archive'];
      default:
        return ['View'];
    }
  };

  const visibleColumns = columns.filter(col => col.visible);

  // Calculate left position for sticky columns
  const getStickyLeft = (columnIndex: number): string => {
    let leftPosition = 0;
    
    // Find all sticky or locked columns that come before this one and sum their widths
    for (let i = 0; i < columnIndex; i++) {
      const column = visibleColumns[i];
      if (column.sticky || column.locked) {
        // Parse width to get numeric value (remove 'px' and convert to number)
        const width = parseInt(column.width?.replace('px', '') || '0');
        leftPosition += width;
      }
    }
    
    return `${leftPosition}px`;
  };

  const exportToExcel = () => {
    // Prepare the data for export
    const exportData = sortedAndFilteredShipments.map(shipment => {
      const row: any = {};
      
      visibleColumns.forEach(column => {
        const value = shipment[column.key];
        
        // Format the value based on the column type
        switch (column.key) {
          case 'status':
            row[column.label] = value;
            break;
          case 'appointmentStatus':
            row[column.label] = value;
            break;
          case 'priority':
            row[column.label] = value;
            break;
          case 'cost':
          case 'maxBuy':
          case 'targetRate':
          case 'billed':
          case 'margin':
            row[column.label] = `$${value.toLocaleString()}`;
            break;
          case 'weight':
            row[column.label] = `${value.toLocaleString()} lbs`;
            break;
          case 'miles':
            row[column.label] = `${value.toLocaleString()}`;
            break;
          case 'pickupDate':
          case 'estimatedDelivery':
          case 'lastEdited':
            row[column.label] = value;
            break;
          default:
            row[column.label] = value;
        }
      });
      
      return row;
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Auto-size columns
    const colWidths = visibleColumns.map(col => ({
      wch: Math.max(
        col.label.length,
        ...exportData.map(row => String(row[col.label] || '').length)
      )
    }));
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Shipments');

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `shipments_export_${date}.xlsx`;

    // Save the file
    XLSX.writeFile(wb, filename);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 h-full flex flex-col">
      {/* Bulk Actions */}
      <div className="p-3 border-b border-slate-200 bg-slate-50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedShipments.length === sortedAndFilteredShipments.length && sortedAndFilteredShipments.length > 0}
              onChange={(e) => {
                if (e.target.checked) {
                  onSelectionChange(sortedAndFilteredShipments.map((s: Shipment) => s.id));
                } else {
                  onSelectionChange([]);
                }
              }}
              className="rounded border-slate-300"
            />
            <span className="text-xs text-slate-600">
              {selectedShipments.length > 0 ? `${selectedShipments.length} selected` : 'Select all'}
            </span>
          </div>

          {selectedShipments.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="border border-slate-300 rounded-md px-2 py-1 text-xs bg-white"
              >
                <option value="">Bulk Actions</option>
                <option value="delete">Delete Selected</option>
                <option value="export">Export Selected</option>
                <option value="update">Update Status</option>
              </select>
              <button
                onClick={() => {
                  if (bulkAction) {
                    onBulkAction(bulkAction, selectedShipments);
                    setBulkAction('');
                  }
                }}
                disabled={!bulkAction}
                className="bg-indigo-600 text-white px-2 py-1 rounded-md text-xs hover:bg-indigo-700 disabled:bg-slate-300 font-medium shadow-sm"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table Controls */}
      <div className="p-3 border-b border-slate-200 bg-slate-50 flex-shrink-0">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-600">
            {visibleColumns.length} columns visible
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={exportToExcel}
              className="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 font-medium shadow-sm flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export to Excel
            </button>
            <button
              onClick={() => setIsColumnModalOpen(true)}
              className="px-3 py-1 text-xs bg-slate-600 text-white rounded-md hover:bg-slate-700 font-medium shadow-sm"
            >
              Manage Columns
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto relative">
        <table className="min-w-full divide-y divide-slate-200" style={{ tableLayout: 'fixed' }}>
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              {visibleColumns.map((column, index) => (
                <th
                  key={column.id}
                  className={`px-3 py-2 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-slate-100' : ''
                  } ${(column.sticky || column.locked) ? 'sticky bg-slate-50 z-30 border-r border-slate-200 shadow-sm' : ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                  style={{ 
                    width: column.width,
                    ...((column.sticky || column.locked) && { left: getStickyLeft(index) })
                  }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
            {/* Filter Row */}
            <tr>
              {visibleColumns.map((column, index) => (
                <th
                  key={`filter-${column.id}`}
                  className={`px-3 py-2 ${(column.sticky || column.locked) ? 'sticky bg-slate-50 z-30 border-r border-slate-200 shadow-sm' : ''}`}
                  style={{ 
                    width: column.width,
                    ...((column.sticky || column.locked) && { 
                      left: getStickyLeft(index),
                      top: '32px' // Height of the first header row
                    })
                  }}
                >
                  {column.filterable && (
                    <input
                      type="text"
                      placeholder={`Filter ${column.label}`}
                      value={columnFilters[column.key] || ''}
                      onChange={(e) => handleColumnFilter(column.key, e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-md px-2 py-1 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {sortedAndFilteredShipments.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-slate-50 transition-colors">
                {visibleColumns.map((column, index) => (
                  <td
                    key={column.id}
                    className={`px-3 py-2 text-xs whitespace-nowrap ${(column.sticky || column.locked) ? 'sticky bg-white z-20 border-r border-slate-200 shadow-sm' : ''}`}
                    style={{ 
                      width: column.width,
                      ...((column.sticky || column.locked) && { left: getStickyLeft(index) })
                    }}
                  >
                    {renderCell(shipment, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Column Management Modal */}
      <ColumnManagementModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        columns={columns}
        onColumnsChange={onColumnsChange}
      />
    </div>
  );
};

export default ShipmentsTable; 