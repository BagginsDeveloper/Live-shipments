import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Shipment, ShipmentStatus, TableColumn, AppointmentStatus, Priority } from '../types';
import { statusColors, appointmentStatusColors, priorityColors } from '../data/mockData';
import ColumnManagementModal from './ColumnManagementModal';
import TrackingModal from './TrackingModal';
import DocumentsModal from './DocumentsModal';
import SendDocsModal from './SendDocsModal';

// Address Display Component
const AddressDisplay: React.FC<{ address: string }> = ({ address }) => {
  // Parse address format: "Company Name - Street Address, City, State Zip"
  const parts = address.split(' - ');
  const companyName = parts[0] || '';
  const addressPart = parts[1] || '';
  
  // Split address part by commas
  const addressComponents = addressPart.split(',').map(part => part.trim());
  
  let streetAddress = '';
  let city = '';
  let stateZip = '';
  
  if (addressComponents.length >= 3) {
    streetAddress = addressComponents[0];
    city = addressComponents[1];
    stateZip = addressComponents[2];
  } else if (addressComponents.length === 2) {
    streetAddress = addressComponents[0];
    stateZip = addressComponents[1];
  } else {
    streetAddress = addressPart;
  }
  
  return (
    <div className="text-xs leading-tight">
      <div className="font-medium text-gray-900 truncate" title={companyName}>
        {companyName}
      </div>
      {streetAddress && (
        <div className="text-gray-600 truncate" title={streetAddress}>
          {streetAddress}
        </div>
      )}
      {city && stateZip && (
        <div className="text-gray-600 truncate" title={`${city}, ${stateZip}`}>
          {city}, {stateZip}
        </div>
      )}
    </div>
  );
};

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
  const [dropdownPosition, setDropdownPosition] = useState<{ x: number; y: number } | null>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingShipmentId, setTrackingShipmentId] = useState<string>('');
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
  const [isSendDocsModalOpen, setIsSendDocsModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const actionButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openActionDropdown) {
        setOpenActionDropdown(null);
        setDropdownPosition(null);
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
      
      if (aValue === undefined || bValue === undefined) return 0;
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

  const handleTrackingClick = (shipmentId: string) => {
    console.log(`Tracking clicked for shipment:`, shipmentId);
    setTrackingShipmentId(shipmentId);
    setIsTrackingModalOpen(true);
  };

  const validateBulkActionSelection = (): boolean => {
    if (selectedShipments.length === 0) {
      return false;
    }

    // Get the statuses of all selected shipments
    const selectedShipmentStatuses = selectedShipments.map(shipmentId => {
      const shipment = shipments.find(s => s.id === shipmentId);
      return shipment?.status;
    }).filter(Boolean); // Remove any undefined values

    // Check if all statuses are the same
    const uniqueStatuses = Array.from(new Set(selectedShipmentStatuses));
    
    if (uniqueStatuses.length > 1) {
      alert('Bulk actions can only be performed on shipments with the same status. Please select shipments that all have the same status.');
      return false;
    }

    return true;
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
              
              {/* Actions and Tracking Buttons */}
              <div className="flex gap-1">
                <div className="relative">
                  <button
                    ref={(el) => {
                      actionButtonRefs.current[shipment.id] = el;
                    }}
                    onClick={() => {
                      if (isDropdownOpen) {
                        setOpenActionDropdown(null);
                        setDropdownPosition(null);
                      } else {
                        const button = actionButtonRefs.current[shipment.id];
                        if (button) {
                          const rect = button.getBoundingClientRect();
                          setDropdownPosition({ x: rect.left, y: rect.bottom });
                          setOpenActionDropdown(shipment.id);
                        }
                      }
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 border border-blue-300 rounded px-1.5 py-0.5 hover:bg-blue-50"
                  >
                    Actions ▼
                  </button>
                </div>
                
                <button
                  onClick={() => handleTrackingClick(shipment.id)}
                  className="text-xs text-green-600 hover:text-green-800 border border-green-300 rounded px-1.5 py-0.5 hover:bg-green-50"
                >
                  Tracking
                </button>
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
        return <AddressDisplay address={shipment.shipperAddress} />;
      
      case 'consigneeAddress':
        return <AddressDisplay address={shipment.consigneeAddress} />;
      
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
      
      case 'equipment':
        return <span>{shipment.equipment}</span>;
      
      case 'temperature':
        return <span>{shipment.temperature.min}°F - {shipment.temperature.max}°F</span>;
      
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
      
      case 'documents':
        const documents = shipment.documents || {};
        const availableDocs = Object.values(documents).filter(doc => doc !== undefined);
        
        return (
          <div className="flex flex-col gap-1">
            {/* Document Icons */}
            <div className="flex items-center gap-1">
              {documents.bol && (
                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center" title="BOL Available">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}
              {documents.pod && (
                <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center" title="POD Available">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              {documents.invoice && (
                <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center" title="Invoice Available">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {availableDocs.length === 0 && (
                <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center" title="No Documents">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* View Docs Button */}
            <button
              onClick={() => {
                setSelectedShipment(shipment);
                setIsDocumentsModalOpen(true);
              }}
              className="text-xs text-blue-600 hover:text-blue-800 border border-blue-300 rounded px-1.5 py-0.5 hover:bg-blue-50"
            >
              View Docs
            </button>
            
            {/* Send Docs Button */}
            {availableDocs.length > 0 && (
              <button
                onClick={() => {
                  setSelectedShipment(shipment);
                  setIsSendDocsModalOpen(true);
                }}
                className="text-xs text-green-600 hover:text-green-800 border border-green-300 rounded px-1.5 py-0.5 hover:bg-green-50"
              >
                Send Docs
              </button>
            )}
          </div>
        );
      
      default:
        return <span>{String(shipment[column.key])}</span>;
    }
  };

  const getActionsForStatus = (status: ShipmentStatus): string[] => {
    switch (status) {
      case 'Not Specified':
        return ['Book', 'Quote', 'Run Rates', 'Source Capacity', 'Duplicate', 'Exact Duplicate', 'Cancel Load', 'Email Notifications'];
      case 'Quoted':
        return ['Book', 'Quote', 'Run Rates', 'Source Capacity', 'Duplicate', 'Exact Duplicate', 'Cancel Load', 'Email Notifications'];
      case 'Tendered':
        return ['Run Rates', 'Source Capacity', 'Duplicate', 'Exact Duplicate', 'Cancel Load', 'Email Notifications'];
      case 'Booked':
        return ['Quote', 'Dispatch', 'Run Rates', 'Source Capacity', 'Duplicate', 'Exact Duplicate', 'Cancel Load', 'Email Notifications'];
      case 'Dispatched':
        return ['Book', 'Quote', 'Pickup', 'Run Rates', 'Source Capacity', 'Milestone Update', 'Duplicate', 'Exact Duplicate', 'Cancel Load', 'Email Notifications'];
      case 'Loading':
        return ['Out For Delivery', 'In Disposition', 'Deliver', 'Not Picked Up', 'Run Rates', 'Source Capacity', 'Milestone Update', 'Duplicate', 'Exact Duplicate', 'Cancel Load', 'Email Notifications'];
      case 'In Transit':
        return ['Out For Delivery', 'In Disposition', 'Deliver', 'Not Picked Up', 'Schedule Appointment', 'Run Rates', 'Source Capacity', 'Milestone Update', 'Create Invoice', 'Duplicate', 'Exact Duplicate', 'Cancel Load', 'Email Notifications'];
      case 'Out For Delivery':
        return ['In Disposition', 'Deliver', 'In-Transit', 'Not Picked Up', 'Run Rates', 'Source Capacity', 'Milestone Update', 'Create Invoice', 'Duplicate', 'Exact Duplicate', 'Cancel Load', 'Email Notifications'];
      case 'Refused Delivery':
        return ['Not Delivered', 'In Disposition', 'Deliver', 'Run Rates', 'Source Capacity', 'Milestone Update', 'Create Invoice', 'Duplicate', 'Exact Duplicate', 'Cancel Load', 'Email Notifications'];
      case 'In Disposition':
        return ['Dispositioned', 'Deliver', 'Run Rates', 'Source Capacity', 'Milestone Update', 'Create Invoice', 'Duplicate', 'Exact Duplicate', 'Cancel Load', 'Email Notifications'];
      case 'Dispositioned':
        return ['Deliver', 'Run Rates', 'Source Capacity', 'Milestone Update', 'Create Invoice', 'Duplicate', 'Exact Duplicate', 'Cancel Load', 'Email Notifications'];
      case 'Missed Delivery':
        return ['Not Delivered', 'Out For Delivery', 'In Disposition', 'Deliver', 'In-Transit', 'Not Picked Up', 'Run Rates', 'Source Capacity', 'Milestone Update', 'Create Invoice', 'Duplicate', 'Exact Duplicate', 'Cancel Load', 'Email Notifications'];
      case 'Loading/Unloading':
        return ['Run Rates', 'Source Capacity', 'Milestone Update', 'Create Invoice', 'Duplicate', 'Exact Duplicate', 'Cancel Load', 'Email Notifications'];
      case 'Unloading':
        return ['Run Rates', 'Source Capacity', 'Milestone Update', 'Create Invoice', 'Duplicate', 'Exact Duplicate', 'Cancel Load', 'Email Notifications'];
      case 'Delivered':
        return ['Run Rates', 'Source Capacity', 'Milestone Update', 'Create Invoice', 'Duplicate', 'Exact Duplicate', 'Cancel Load', 'Email Notifications'];
      case 'Delivered OS&D':
        return ['Run Rates', 'Source Capacity', 'Milestone Update', 'Create Invoice', 'Duplicate', 'Exact Duplicate', 'Cancel Load', 'Email Notifications'];
      case 'Completed':
        return ['Source Capacity', 'Milestone Update', 'Duplicate', 'Exact Duplicate', 'Cancel Load', 'Email Notifications'];
      case 'Hold':
        return ['Not Delivered', 'Source Capacity', 'Milestone Update', 'Duplicate', 'Exact Duplicate', 'Cancel Load', 'Email Notifications'];
      case 'Transferred':
        return ['Book', 'Source Capacity', 'Milestone Update', 'Duplicate', 'Exact Duplicate', 'Cancel Load', 'Email Notifications'];
      case 'Cancelled With Charges':
        return ['Reinstate', 'Source Capacity', 'Milestone Update', 'Duplicate', 'Exact Duplicate', 'Email Notifications'];
      case 'Canceled':
        return ['Reinstate', 'Source Capacity', 'Milestone Update', 'Duplicate', 'Exact Duplicate', 'Email Notifications'];
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
              {(() => {
                // Get unique statuses of selected shipments
                const selectedStatuses = Array.from(new Set(selectedShipments.map(shipmentId => {
                  const shipment = shipments.find(s => s.id === shipmentId);
                  return shipment?.status;
                }).filter(Boolean)));

                const hasMultipleStatuses = selectedStatuses.length > 1;

                return (
                  <>
                    {hasMultipleStatuses && (
                      <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span>Mixed statuses selected</span>
                      </div>
                    )}
                    <select
                      value={bulkAction}
                      onChange={(e) => setBulkAction(e.target.value)}
                      className="border border-slate-300 rounded-md px-2 py-1 text-xs bg-white"
                      disabled={hasMultipleStatuses}
                    >
                      <option value="">Bulk Actions</option>
                      <option value="delete">Delete Selected</option>
                      <option value="export">Export Selected</option>
                      <option value="update">Update Status</option>
                    </select>
                    <button
                      onClick={() => {
                        if (bulkAction && validateBulkActionSelection()) {
                          onBulkAction(bulkAction, selectedShipments);
                          setBulkAction('');
                        }
                      }}
                      disabled={!bulkAction || hasMultipleStatuses}
                      className="bg-indigo-600 text-white px-2 py-1 rounded-md text-xs hover:bg-indigo-700 disabled:bg-slate-300 font-medium shadow-sm"
                    >
                      Apply
                    </button>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>



      <div className="flex-1 overflow-auto relative">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-slate-200" style={{ tableLayout: 'fixed' }}>
            <thead className="bg-slate-50">
              <tr>
                {visibleColumns.map((column, index) => (
                  <th
                    key={column.id}
                    className={`px-3 py-2 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:bg-slate-100' : ''
                    } ${(column.sticky || column.locked) ? 'sticky bg-slate-50 z-50 border-r border-slate-200 shadow-sm' : ''}`}
                    onClick={() => column.sortable && handleSort(column.key)}
                    style={{ 
                      width: column.width,
                      ...((column.sticky || column.locked) && { 
                        left: getStickyLeft(index)
                      })
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
                    className={`px-3 py-2 ${(column.sticky || column.locked) ? 'sticky bg-slate-50 z-50 border-r border-slate-200 shadow-sm' : ''}`}
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
                      className={`px-3 py-2 text-xs whitespace-nowrap ${(column.sticky || column.locked) ? 'sticky bg-white z-40 border-r border-slate-200 shadow-sm' : ''}`}
                      style={{ 
                        width: column.width,
                        ...((column.sticky || column.locked) && { 
                          left: getStickyLeft(index)
                        })
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
      </div>

      {/* Portal-based Action Dropdown */}
      {openActionDropdown && dropdownPosition && (
        createPortal(
          <div
            className="fixed w-32 bg-white border border-gray-300 rounded-md shadow-lg z-[9999]"
            style={{
              left: dropdownPosition.x,
              top: dropdownPosition.y + 4,
            }}
          >
            {getActionsForStatus(
              shipments.find(s => s.id === openActionDropdown)?.status || 'Quoted'
            ).map((action) => (
              <button
                key={action}
                onClick={() => {
                  handleActionClick(openActionDropdown, action);
                  setOpenActionDropdown(null);
                  setDropdownPosition(null);
                }}
                className="block w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
              >
                {action}
              </button>
            ))}
          </div>,
          document.body
        )
      )}

      {/* Column Management Modal */}
      <ColumnManagementModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        columns={columns}
        onColumnsChange={onColumnsChange}
      />

      {/* Tracking Modal */}
      <TrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        shipmentId={trackingShipmentId}
        shipment={shipments.find(s => s.id === trackingShipmentId)}
      />

      {/* Documents Modal */}
      <DocumentsModal
        isOpen={isDocumentsModalOpen}
        onClose={() => setIsDocumentsModalOpen(false)}
        shipment={selectedShipment}
      />

      {/* Send Docs Modal */}
      <SendDocsModal
        isOpen={isSendDocsModalOpen}
        onClose={() => setIsSendDocsModalOpen(false)}
        shipment={selectedShipment}
      />
    </div>
  );
};

export default ShipmentsTable; 