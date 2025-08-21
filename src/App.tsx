import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FilterBar from './components/FilterBar';
import LegendModal from './components/LegendModal';
import CreateShipmentModal from './components/CreateShipmentModal';
import ShipmentMapModal from './components/ShipmentMapModal';
import ShipmentsTable from './components/ShipmentsTable';
import ColumnManagementModal from './components/ColumnManagementModal';
import UploadShipmentsModal from './components/UploadShipmentsModal';
import SidebarMenu from './components/SidebarMenu';
import ProtectedRoute from './components/ProtectedRoute';
import PublicTrackingPage from './components/PublicTrackingPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FilterOptions, FilterPreset, TableColumn, ShipmentStatus, AppointmentStatus, Priority, Shipment } from './types';
import { mockShipments, defaultColumns } from './data/mockData';

function Dashboard() {
  const { logout } = useAuth();
  const [filters, setFilters] = useState<FilterOptions>({});
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [selectedShipments, setSelectedShipments] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isLegendModalOpen, setIsLegendModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [columns, setColumns] = useState<TableColumn[]>(defaultColumns);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const filteredShipments = useMemo(() => {
    return mockShipments.filter(shipment => {
      // Load Number filter (partial search)
      if (filters.loadNumber && !shipment.loadNumber.toString().includes(filters.loadNumber)) {
        return false;
      }

      // Carrier Name filter (partial search)
      if (filters.carrierName && !shipment.carrier.toLowerCase().includes(filters.carrierName.toLowerCase())) {
        return false;
      }

      // Shipment Mode filter (multi-select)
      if (filters.shipmentMode && filters.shipmentMode.length > 0 && !filters.shipmentMode.includes(shipment.mode)) {
        return false;
      }

      // Shipment Status filter (multi-select)
      if (filters.shipmentStatus && filters.shipmentStatus.length > 0 && !filters.shipmentStatus.includes(shipment.status)) {
        return false;
      }

      // Customer Sales Rep filter (partial search)
      if (filters.customerSalesRep && !shipment.customerSalesRep.toLowerCase().includes(filters.customerSalesRep.toLowerCase())) {
        return false;
      }

      // Carrier Sales Rep filter (partial search)
      if (filters.carrierSalesRep && !shipment.carrierSalesRep.toLowerCase().includes(filters.carrierSalesRep.toLowerCase())) {
        return false;
      }

      // Shipper Zip Range filter
      if (filters.shipperZipStart && filters.shipperZipEnd) {
        // Extract zip from address (assuming format: "address, city, state zip")
        const zipMatch = shipment.shipperAddress.match(/\d{5}/);
        if (zipMatch) {
          const zip = parseInt(zipMatch[0]);
          const start = parseInt(filters.shipperZipStart);
          const end = parseInt(filters.shipperZipEnd);
          if (zip < start || zip > end) return false;
        }
      }

      // Consignee Zip Range filter
      if (filters.consigneeZipStart && filters.consigneeZipEnd) {
        const zipMatch = shipment.consigneeAddress.match(/\d{5}/);
        if (zipMatch) {
          const zip = parseInt(zipMatch[0]);
          const start = parseInt(filters.consigneeZipStart);
          const end = parseInt(filters.consigneeZipEnd);
          if (zip < start || zip > end) return false;
        }
      }

      // Shipper Company filter (partial search)
      if (filters.shipperCompany && !shipment.shipperAddress.toLowerCase().includes(filters.shipperCompany.toLowerCase())) {
        return false;
      }

      // Consignee Company filter (partial search)
      if (filters.consigneeCompany && !shipment.consigneeAddress.toLowerCase().includes(filters.consigneeCompany.toLowerCase())) {
        return false;
      }

      // Pro Number filter (partial search)
      if (filters.proNumber && !shipment.poRef.toLowerCase().includes(filters.proNumber.toLowerCase())) {
        return false;
      }

      // Pickup Number filter (partial search)
      if (filters.pickupNumber && !shipment.poRef.toLowerCase().includes(filters.pickupNumber.toLowerCase())) {
        return false;
      }

      // PO Number filter (partial search)
      if (filters.poNumber && !shipment.poRef.toLowerCase().includes(filters.poNumber.toLowerCase())) {
        return false;
      }

      // Shipper Number filter (partial search)
      if (filters.shipperNumber && !shipment.poRef.toLowerCase().includes(filters.shipperNumber.toLowerCase())) {
        return false;
      }

      // Pickup Date Range filter
      if (filters.pickupDateFrom && filters.pickupDateTo) {
        const pickupDate = new Date(shipment.pickupDate);
        const fromDate = new Date(filters.pickupDateFrom);
        const toDate = new Date(filters.pickupDateTo);
        if (pickupDate < fromDate || pickupDate > toDate) return false;
      }

      // Group Selection filter (multi-select)
      if (filters.groupSelection && filters.groupSelection.length > 0 && !filters.groupSelection.includes(shipment.regionGroup)) {
        return false;
      }

      // Regions filter (multi-select)
      if (filters.regions && filters.regions.length > 0 && !filters.regions.includes(shipment.regionGroup)) {
        return false;
      }

      // Priority filter (multi-select)
      if (filters.priority && filters.priority.length > 0 && !filters.priority.includes(shipment.priority)) {
        return false;
      }

      // Appointment Status filter (multi-select)
      if (filters.appointmentStatus && filters.appointmentStatus.length > 0 && !filters.appointmentStatus.includes(shipment.appointmentStatus)) {
        return false;
      }

      // Equipment filter (multi-select)
      if (filters.equipment && filters.equipment.length > 0 && !filters.equipment.includes(shipment.equipment)) {
        return false;
      }

      // Estimated Delivery Date Range filter
      if (filters.estimatedDeliveryFrom && filters.estimatedDeliveryTo) {
        const deliveryDate = new Date(shipment.estimatedDelivery);
        const fromDate = new Date(filters.estimatedDeliveryFrom);
        const toDate = new Date(filters.estimatedDeliveryTo);
        if (deliveryDate < fromDate || deliveryDate > toDate) return false;
      }

      return true;
    });
  }, [filters]);

  const handleSavePreset = (preset: FilterPreset) => {
    setPresets(prev => [...prev, preset]);
  };

  const handleBulkAction = (action: string, shipmentIds: string[]) => {
    console.log(`Bulk action "${action}" performed on shipments:`, shipmentIds);
    // In a real app, you would handle the bulk action here
  };

  const handleExportToExcel = () => {
    // Import XLSX dynamically to avoid SSR issues
    import('xlsx').then((XLSX) => {
      // Prepare the data for export
      const exportData = filteredShipments.map(shipment => {
        const row: any = {};
        
        columns.filter(col => col.visible).forEach(column => {
          const value = shipment[column.key as keyof Shipment];
          
          // Format the value based on the column type
          switch (column.key) {
            case 'status':
            case 'appointmentStatus':
            case 'priority':
              row[column.label] = value;
              break;
            case 'cost':
            case 'maxBuy':
            case 'targetRate':
            case 'billed':
            case 'margin':
              row[column.label] = `$${Number(value).toLocaleString()}`;
              break;
            case 'weight':
              row[column.label] = `${Number(value).toLocaleString()} lbs`;
              break;
            case 'miles':
              row[column.label] = `${Number(value).toLocaleString()}`;
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
      const visibleColumns = columns.filter(col => col.visible);
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
    }).catch(error => {
      console.error('Error loading XLSX library:', error);
      alert('Error exporting to Excel. Please try again.');
    });
  };

  const handleManageColumns = () => {
    setIsColumnModalOpen(true);
  };

  const handleUploadShipments = () => {
    setIsUploadModalOpen(true);
  };

  const handleUploadComplete = (shipments: Partial<Shipment>[]) => {
    console.log('Uploaded shipments:', shipments);
    // In a real app, you would add these shipments to your data source
    // For now, we'll just log them
    alert(`Successfully processed ${shipments.length} shipments from upload`);
  };

  const handleBook = (customer: string) => {
    console.log(`Booking shipment for customer: ${customer}`);
    setIsCreateModalOpen(false);
  };

  const handleQuote = (customer: string) => {
    console.log(`Creating quote for customer: ${customer}`);
    setIsCreateModalOpen(false);
  };

  const handleStatusFilter = (status: ShipmentStatus) => {
    setFilters(prev => ({
      ...prev,
      shipmentStatus: prev.shipmentStatus?.includes(status) 
        ? prev.shipmentStatus.filter(s => s !== status)
        : [...(prev.shipmentStatus || []), status]
    }));
  };

  const handleAppointmentStatusFilter = (status: AppointmentStatus) => {
    setFilters(prev => ({
      ...prev,
      appointmentStatus: prev.appointmentStatus?.includes(status) 
        ? prev.appointmentStatus.filter(s => s !== status)
        : [...(prev.appointmentStatus || []), status]
    }));
  };

  const handlePriorityFilter = (priority: Priority) => {
    setFilters(prev => ({
      ...prev,
      priority: prev.priority?.includes(priority) 
        ? prev.priority.filter(p => p !== priority)
        : [...(prev.priority || []), priority]
    }));
  };

  return (
    <div className="h-screen flex bg-slate-50">
      {/* Sidebar */}
      <SidebarMenu 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 flex-shrink-0">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3">
              <h1 className="text-xl font-bold text-slate-900">Live Shipments</h1>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsMapModalOpen(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  View Map
                </button>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium shadow-sm"
                >
                  Create New Shipment
                </button>
                <button
                  onClick={logout}
                  className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium shadow-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Filters Section - Centered and Compact */}
        <div className="flex-shrink-0 bg-white border-b border-slate-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <FilterBar
              filters={filters}
              onFiltersChange={setFilters}
              onSavePreset={handleSavePreset}
              presets={presets}
              onShowLegend={() => setIsLegendModalOpen(true)}
            />
          </div>
        </div>

        {/* Legend - Hidden (now shown in modal) */}
        {/* <div className="flex-shrink-0 bg-slate-50 border-b border-slate-200">
          <div className="px-4 sm:px-6 lg:px-8 py-2">
            <Legend 
              onStatusFilter={handleStatusFilter}
              onAppointmentStatusFilter={handleAppointmentStatusFilter}
              onPriorityFilter={handlePriorityFilter}
            />
          </div>
        </div> */}



        {/* Main Content - Takes remaining space */}
        <main className="flex-1 overflow-hidden bg-slate-50">
          <div className="h-full px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-full flex flex-col">
              <div className="flex-1 min-h-0">
                <ShipmentsTable
                  shipments={filteredShipments}
                  selectedShipments={selectedShipments}
                  onSelectionChange={setSelectedShipments}
                  onBulkAction={handleBulkAction}
                  columns={columns}
                  onColumnsChange={setColumns}
                />
              </div>
              
              {/* Shipment Count and Controls - Compact */}
              <div className="flex-shrink-0 mt-3 pt-2 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>Showing {filteredShipments.length} of {mockShipments.length} shipments</span>
                    <span>{columns.filter(col => col.visible).length} columns visible</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {selectedShipments.length > 0 && (
                      <span className="text-xs text-slate-500">{selectedShipments.length} selected</span>
                    )}
                    
                    <button
                      onClick={handleExportToExcel}
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 font-medium shadow-sm flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export to Excel
                    </button>
                    
                    <button
                      onClick={handleUploadShipments}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium shadow-sm flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload Shipments
                    </button>
                    
                    <button
                      onClick={handleManageColumns}
                      className="px-3 py-1 text-xs bg-slate-600 text-white rounded-md hover:bg-slate-700 font-medium shadow-sm"
                    >
                      Manage Columns
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex-shrink-0 bg-slate-900 text-white py-2">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="text-center text-xs text-slate-300">
              © 2025 3PL Systems, Inc. All rights reserved.
            </div>
            <div className="text-center text-xs text-slate-300 mt-1">
              <a 
                href="https://3plsystems.com/terms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white underline"
              >
                Terms & Conditions
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Create Shipment Modal */}
      <CreateShipmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onBook={handleBook}
        onQuote={handleQuote}
      />

      {/* Shipment Map Modal */}
      <ShipmentMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        shipments={filteredShipments}
      />

      {/* Legend Modal */}
      <LegendModal
        isOpen={isLegendModalOpen}
        onClose={() => setIsLegendModalOpen(false)}
        onStatusFilter={handleStatusFilter}
        onAppointmentStatusFilter={handleAppointmentStatusFilter}
        onPriorityFilter={handlePriorityFilter}
      />

      {/* Column Management Modal */}
      <ColumnManagementModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        columns={columns}
        onColumnsChange={setColumns}
      />

      {/* Upload Shipments Modal */}
      <UploadShipmentsModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        columns={columns}
        onUpload={handleUploadComplete}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public tracking route - no authentication required */}
          <Route path="/tracking/:shipmentId" element={<PublicTrackingPage />} />
          
          {/* Protected dashboard route */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Default route redirects to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
