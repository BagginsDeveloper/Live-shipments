import React, { useState, useMemo } from 'react';
import FilterBar from './components/FilterBar';
import Legend from './components/Legend';
import CreateShipmentModal from './components/CreateShipmentModal';
import ShipmentMapModal from './components/ShipmentMapModal';
import ShipmentsTable from './components/ShipmentsTable';
import SidebarMenu from './components/SidebarMenu';
import FeedbackModal from './components/FeedbackModal';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Shipment, FilterOptions, FilterPreset, TableColumn, ShipmentStatus, AppointmentStatus, Priority } from './types';
import { mockShipments, defaultColumns } from './data/mockData';

function Dashboard() {
  const { logout } = useAuth();
  const [filters, setFilters] = useState<FilterOptions>({});
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [selectedShipments, setSelectedShipments] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
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
                  onClick={() => setIsFeedbackModalOpen(true)}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium shadow-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Submit Feedback
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
            />
          </div>
        </div>

        {/* Legend - Compact */}
        <div className="flex-shrink-0 bg-slate-50 border-b border-slate-200">
          <div className="px-4 sm:px-6 lg:px-8 py-2">
            <Legend 
              onStatusFilter={handleStatusFilter}
              onAppointmentStatusFilter={handleAppointmentStatusFilter}
              onPriorityFilter={handlePriorityFilter}
            />
          </div>
        </div>

        {/* Results Summary - Compact */}
        <div className="flex-shrink-0 bg-white border-b border-slate-200">
          <div className="px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex justify-between items-center">
              <div className="text-sm text-slate-600">
                Showing {filteredShipments.length} of {mockShipments.length} shipments
              </div>
              <div className="text-sm text-slate-600">
                {selectedShipments.length > 0 && `${selectedShipments.length} selected`}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Takes remaining space */}
        <main className="flex-1 overflow-hidden bg-slate-50">
          <div className="h-full px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-full">
              <ShipmentsTable
                shipments={filteredShipments}
                selectedShipments={selectedShipments}
                onSelectionChange={setSelectedShipments}
                onBulkAction={handleBulkAction}
                columns={columns}
                onColumnsChange={setColumns}
              />
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

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;
