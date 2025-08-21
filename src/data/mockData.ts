import { Shipment, Customer, Carrier, SalesRep, Group, ShipmentStatus, ShipmentMode, AppointmentStatus, Priority, TableColumn } from '../types';

// Helper function to generate random data
const generateRandomShipments = (count: number): Shipment[] => {
  const customers = [
    'ABC Manufacturing', 'XYZ Logistics', 'Global Imports', 'Tech Solutions', 'Ocean Freight Co',
    'Industrial Supply', 'Retail Distribution', 'Metro Transport', 'Coastal Shipping', 'Mountain Express',
    'Desert Logistics', 'Urban Freight', 'Rural Transport', 'Express Delivery', 'Premium Shipping',
    'Standard Freight', 'Quick Logistics', 'Reliable Transport', 'Fast Track Shipping', 'Elite Logistics'
  ];

  const carriers = [
    'FastFreight Inc', 'WestCoast Transport', 'Southeast Express', 'Texas Transport', 'Pacific Shipping',
    'Steel City Transport', 'Tennessee Express', 'Mountain Transport', 'Coastal Express', 'Desert Transport',
    'Urban Express', 'Rural Freight', 'Express Logistics', 'Premium Transport', 'Standard Express',
    'Quick Transport', 'Reliable Express', 'Fast Track Transport', 'Elite Express', 'Global Transport'
  ];

  const salesReps = [
    'John Smith', 'Sarah Wilson', 'Mike Johnson', 'David Brown', 'Lisa Davis', 'Tom Wilson', 'Mark Johnson',
    'Amy Chen', 'Rachel Green', 'Chris Lee', 'Mark Thompson', 'Jennifer Adams', 'Amanda Foster', 'Robert Clark',
    'Emily White', 'Michael Black', 'Jessica Brown', 'Daniel Lee', 'Ashley Garcia', 'Matthew Taylor'
  ];

  const regions = ['Northeast', 'West Coast', 'Southeast', 'Mountain', 'Midwest', 'Texas', 'Northwest'];
  const modes = ['LTL', 'FTL', 'Intermodal', 'Air', 'Ocean', 'Drayage'];
  const statuses: ShipmentStatus[] = [
  'Not Specified', 'Quoted', 'Tendered', 'Booked', 'Dispatched', 'Loading', 'In Transit', 
  'Out For Delivery', 'Refused Delivery', 'In Disposition', 'Dispositioned', 'Missed Delivery',
  'Loading/Unloading', 'Unloading', 'Delivered', 'Delivered OS&D', 'Completed', 'Hold',
  'Transferred', 'Cancelled With Charges', 'Canceled'
];
  const appointmentStatuses: AppointmentStatus[] = ['Not Required', 'Requested', 'Confirmed', 'Pending'];
  const priorities: Priority[] = ['HOT', 'Standard', 'Trace'];
  const assignedTeams = ['Dispatch Team', 'Sales Team', 'Operations Team', 'Quote Team', 'Delivery Team', 'Customer Service'];
  const equipmentTypes = ['Van', 'Reefer', 'Flatbed'];

  const productDescriptions = [
    'Automotive parts', 'Electronics', 'Import goods', 'Computer equipment', 'Marine equipment',
    'Industrial equipment', 'Retail merchandise', 'Food products', 'Pharmaceuticals', 'Textiles',
    'Machinery', 'Chemicals', 'Furniture', 'Appliances', 'Building materials', 'Agricultural products',
    'Medical supplies', 'Clothing', 'Books', 'Toys', 'Sports equipment', 'Musical instruments'
  ];

  const trackingNotes = [
    'Picked up from shipper', 'Scheduled for pickup', 'Container loaded', 'Quote provided',
    'Delivered to consignee', 'Currently unloading and loading at facility', 'Facility transfer in progress',
    'In transit to destination', 'Arrived at destination', 'Out for delivery', 'Attempted delivery',
    'Rescheduled delivery', 'Held at facility', 'Customs clearance', 'Documentation review',
    'Loading completed', 'Unloading in progress', 'Quality inspection', 'Temperature monitoring',
    'Security screening', 'Weight verification', 'Route optimization', 'Driver assigned'
  ];

  const pieceCounts = [
    '50 pallets', '25 boxes', '100 containers', '15 pallets', '75 crates', '120 pallets', '200 boxes',
    '30 pallets', '80 boxes', '150 containers', '40 pallets', '90 boxes', '180 containers', '60 pallets',
    '110 boxes', '220 containers', '70 pallets', '130 boxes', '250 containers', '85 pallets'
  ];

  const cities = [
    { city: 'New York', state: 'NY', zip: '10001' },
    { city: 'Los Angeles', state: 'CA', zip: '90210' },
    { city: 'Chicago', state: 'IL', zip: '60601' },
    { city: 'Houston', state: 'TX', zip: '77001' },
    { city: 'Phoenix', state: 'AZ', zip: '85001' },
    { city: 'Philadelphia', state: 'PA', zip: '19101' },
    { city: 'San Antonio', state: 'TX', zip: '78201' },
    { city: 'San Diego', state: 'CA', zip: '92101' },
    { city: 'Dallas', state: 'TX', zip: '75201' },
    { city: 'San Jose', state: 'CA', zip: '95101' },
    { city: 'Austin', state: 'TX', zip: '73301' },
    { city: 'Jacksonville', state: 'FL', zip: '32099' },
    { city: 'Fort Worth', state: 'TX', zip: '76101' },
    { city: 'Columbus', state: 'OH', zip: '43201' },
    { city: 'Charlotte', state: 'NC', zip: '28201' },
    { city: 'San Francisco', state: 'CA', zip: '94101' },
    { city: 'Indianapolis', state: 'IN', zip: '46201' },
    { city: 'Seattle', state: 'WA', zip: '98101' },
    { city: 'Denver', state: 'CO', zip: '80201' },
    { city: 'Washington', state: 'DC', zip: '20001' },
    { city: 'Boston', state: 'MA', zip: '02101' },
    { city: 'El Paso', state: 'TX', zip: '79901' },
    { city: 'Nashville', state: 'TN', zip: '37201' },
    { city: 'Detroit', state: 'MI', zip: '48201' },
    { city: 'Oklahoma City', state: 'OK', zip: '73101' },
    { city: 'Portland', state: 'OR', zip: '97201' },
    { city: 'Las Vegas', state: 'NV', zip: '89101' },
    { city: 'Memphis', state: 'TN', zip: '38101' },
    { city: 'Louisville', state: 'KY', zip: '40201' },
    { city: 'Baltimore', state: 'MD', zip: '21201' },
    { city: 'Milwaukee', state: 'WI', zip: '53201' },
    { city: 'Albuquerque', state: 'NM', zip: '87101' },
    { city: 'Tucson', state: 'AZ', zip: '85701' },
    { city: 'Fresno', state: 'CA', zip: '93650' },
    { city: 'Sacramento', state: 'CA', zip: '94203' },
    { city: 'Mesa', state: 'AZ', zip: '85201' },
    { city: 'Kansas City', state: 'MO', zip: '64101' },
    { city: 'Atlanta', state: 'GA', zip: '30301' },
    { city: 'Miami', state: 'FL', zip: '33101' },
    { city: 'Cleveland', state: 'OH', zip: '44101' },
    { city: 'Pittsburgh', state: 'PA', zip: '15201' }
  ];

  const streets = [
    'Industrial Blvd', 'Port Ave', 'Harbor St', 'Innovation Dr', 'Dock Rd', 'Factory Blvd', 'Distribution Dr',
    'Warehouse Dr', 'Trade Center', 'Tech Park', 'Port Terminal', 'Retail Plaza', 'Business Center',
    'Commerce St', 'Transport Ave', 'Logistics Blvd', 'Freight Way', 'Shipping Ln', 'Express Dr',
    'Delivery Rd', 'Supply Chain Blvd', 'Operations Ave', 'Distribution Center', 'Fulfillment Center'
  ];

  const shipperNames = [
    'Acme Corp', 'Tech Solutions', 'Global Manufacturing', 'Retail Plus', 'Food Services Inc',
    'Industrial Supply Co', 'Metro Transport LLC', 'Coastal Shipping Inc', 'Mountain Express Corp',
    'Desert Logistics Group', 'Urban Freight Systems', 'Rural Transport Co', 'Express Delivery Inc',
    'Premium Shipping LLC', 'Standard Freight Corp', 'Quick Logistics Inc', 'Reliable Transport Co',
    'Fast Track Shipping', 'Elite Logistics Group', 'Ocean Freight Co', 'Steel City Transport'
  ];

  const consigneeNames = [
    'Delta Industries', 'Omega Solutions', 'Prime Manufacturing', 'Elite Retail Corp', 'Fresh Food Co',
    'Advanced Supply Inc', 'City Transport LLC', 'Pacific Shipping Corp', 'Peak Express Inc',
    'Arid Logistics Group', 'Metro Freight Systems', 'Country Transport Co', 'Swift Delivery Inc',
    'Premium Logistics LLC', 'Standard Transport Corp', 'Rapid Logistics Inc', 'Trusted Transport Co',
    'Express Track Shipping', 'Superior Logistics Group', 'Atlantic Freight Co', 'Iron City Transport'
  ];

  const shipments: Shipment[] = [];

  for (let i = 8; i <= count + 7; i++) {
    const shipperCity = cities[Math.floor(Math.random() * cities.length)];
    const consigneeCity = cities[Math.floor(Math.random() * cities.length)];
    const shipperStreet = streets[Math.floor(Math.random() * streets.length)];
    const consigneeStreet = streets[Math.floor(Math.random() * streets.length)];
    const shipperName = shipperNames[Math.floor(Math.random() * shipperNames.length)];
    const consigneeName = consigneeNames[Math.floor(Math.random() * consigneeNames.length)];
    
    const pickupDate = new Date(2024, 0, Math.floor(Math.random() * 30) + 1);
    const deliveryDate = new Date(pickupDate);
    deliveryDate.setDate(pickupDate.getDate() + Math.floor(Math.random() * 7) + 1);
    
    const cost = Math.floor(Math.random() * 5000) + 500;
    const maxBuy = Math.floor(Math.random() * 4000) + 400;
    const targetRate = Math.floor(Math.random() * 6000) + 600;
    const margin = Math.floor(Math.random() * 1000) + 100;
    const billed = cost + margin;
    const weight = Math.floor(Math.random() * 15000) + 1000;
    const miles = Math.floor(Math.random() * 1000) + 50;
    const equipment = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)];
    const baseTemp = Math.floor(Math.random() * 60) + 20; // Random base temperature between 20-80°F
    const tempRange = Math.floor(Math.random() * 15) + 5; // Random range between 5-20°F
    const temperature = {
      min: baseTemp,
      max: baseTemp + tempRange
    };
    
    const lastEdited = new Date(2024, 0, Math.floor(Math.random() * 30) + 1);
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    shipments.push({
      id: i.toString(),
      loadNumber: 2024000 + i,
      customer: customers[Math.floor(Math.random() * customers.length)],
      shipperAddress: `${shipperName} - ${Math.floor(Math.random() * 999) + 1} ${shipperStreet}, ${shipperCity.city}, ${shipperCity.state} ${shipperCity.zip}`,
      consigneeAddress: `${consigneeName} - ${Math.floor(Math.random() * 999) + 1} ${consigneeStreet}, ${consigneeCity.city}, ${consigneeCity.state} ${consigneeCity.zip}`,
      appointmentStatus: appointmentStatuses[Math.floor(Math.random() * appointmentStatuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      pickupDate: pickupDate.toISOString().split('T')[0],
      estimatedDelivery: deliveryDate.toISOString().split('T')[0],
      carrier: carriers[Math.floor(Math.random() * carriers.length)],
      poRef: `PO-2024-${i.toString().padStart(3, '0')}`,
      cost,
      billed,
      margin,
      weight,
      miles,
      regionGroup: regions[Math.floor(Math.random() * regions.length)],
      productDescription: productDescriptions[Math.floor(Math.random() * productDescriptions.length)],
      mode: modes[Math.floor(Math.random() * modes.length)] as ShipmentMode,
      lastTrackingNote: trackingNotes[Math.floor(Math.random() * trackingNotes.length)],
      lastEdited: `${lastEdited.toISOString().split('T')[0]} ${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`,
      customerSalesRep: salesReps[Math.floor(Math.random() * salesReps.length)],
      carrierSalesRep: salesReps[Math.floor(Math.random() * salesReps.length)],
      assignedTo: assignedTeams[Math.floor(Math.random() * assignedTeams.length)],
      pieceCount: pieceCounts[Math.floor(Math.random() * pieceCounts.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      maxBuy,
      targetRate,
      equipment,
      temperature,
      documents: {
        bol: Math.random() > 0.3 ? `BOL-2024-${i.toString().padStart(3, '0')}.pdf` : undefined,
        pod: Math.random() > 0.4 ? `POD-2024-${i.toString().padStart(3, '0')}.pdf` : undefined,
        invoice: Math.random() > 0.5 ? `INV-2024-${i.toString().padStart(3, '0')}.pdf` : undefined
      }
    });
  }

  return shipments;
};

export const mockShipments: Shipment[] = [
  {
    id: '1',
    loadNumber: 2024001,
    customer: 'ABC Manufacturing',
    shipperAddress: 'Acme Corp - 123 Industrial Blvd, Detroit, MI 48201',
    consigneeAddress: 'Delta Industries - 456 Warehouse Dr, Chicago, IL 60601',
    appointmentStatus: 'Confirmed',
    priority: 'HOT',
    pickupDate: '2024-01-15',
    estimatedDelivery: '2024-01-17',
    carrier: 'FastFreight Inc',
    poRef: 'PO-2024-001',
    cost: 2500,
    maxBuy: 2000,
    targetRate: 3200,
    billed: 3000,
    margin: 500,
    weight: 5000,
    miles: 300,
    regionGroup: 'Midwest',
    productDescription: 'Automotive parts',
    mode: 'LTL',
    lastTrackingNote: 'Picked up from shipper',
    lastEdited: '2024-01-15 10:30 AM',
    customerSalesRep: 'John Smith',
    carrierSalesRep: 'Mike Johnson',
    assignedTo: 'Dispatch Team',
    pieceCount: '50 pallets',
    status: 'In Transit',
    equipment: 'Van',
    temperature: { min: 68, max: 78 },
    documents: {
      bol: 'BOL-2024-001.pdf',
      pod: 'POD-2024-001.pdf',
      invoice: 'INV-2024-001.pdf'
    }
  },
  {
    id: '2',
    loadNumber: 2024002,
    customer: 'XYZ Logistics',
    shipperAddress: 'Tech Solutions - 789 Port Ave, Los Angeles, CA 90210',
    consigneeAddress: 'Omega Solutions - 321 Distribution Center, Phoenix, AZ 85001',
    appointmentStatus: 'Pending',
    priority: 'Standard',
    pickupDate: '2024-01-16',
    estimatedDelivery: '2024-01-18',
    carrier: 'WestCoast Transport',
    poRef: 'PO-2024-002',
    cost: 1800,
    maxBuy: 1500,
    targetRate: 2400,
    billed: 2200,
    margin: 400,
    weight: 3000,
    miles: 400,
    regionGroup: 'West Coast',
    productDescription: 'Electronics',
    mode: 'FTL',
    lastTrackingNote: 'Scheduled for pickup',
    lastEdited: '2024-01-16 09:15 AM',
    customerSalesRep: 'Sarah Wilson',
    carrierSalesRep: 'David Brown',
    assignedTo: 'Sales Team',
    pieceCount: '25 boxes',
    status: 'Booked',
    equipment: 'Reefer',
    temperature: { min: 38, max: 48 },
    documents: {
      bol: 'BOL-2024-002.pdf',
      pod: undefined,
      invoice: undefined
    }
  },
  {
    id: '3',
    loadNumber: 2024003,
    customer: 'Global Imports',
    shipperAddress: 'Global Manufacturing - 555 Harbor St, Miami, FL 33101',
    consigneeAddress: 'Prime Manufacturing - 777 Trade Center, Atlanta, GA 30301',
    appointmentStatus: 'Confirmed',
    priority: 'HOT',
    pickupDate: '2024-01-17',
    estimatedDelivery: '2024-01-19',
    carrier: 'Southeast Express',
    poRef: 'PO-2024-003',
    cost: 3200,
    maxBuy: 2800,
    targetRate: 4000,
    billed: 3800,
    margin: 600,
    weight: 7500,
    miles: 600,
    regionGroup: 'Southeast',
    productDescription: 'Import goods',
    mode: 'Intermodal',
    lastTrackingNote: 'Container loaded',
    lastEdited: '2024-01-17 14:20 PM',
    customerSalesRep: 'Lisa Davis',
    carrierSalesRep: 'Tom Wilson',
    assignedTo: 'Operations Team',
    pieceCount: '100 containers',
    status: 'Loading',
    equipment: 'Flatbed',
    temperature: { min: 80, max: 95 },
    documents: {
      bol: 'BOL-2024-003.pdf',
      pod: undefined,
      invoice: undefined
    }
  },
  {
    id: '4',
    loadNumber: 2024004,
    customer: 'Tech Solutions',
    shipperAddress: 'Tech Solutions - 888 Innovation Dr, Austin, TX 73301',
    consigneeAddress: 'Elite Retail Corp - 999 Tech Park, Dallas, TX 75201',
    appointmentStatus: 'Requested',
    priority: 'Standard',
    pickupDate: '2024-01-18',
    estimatedDelivery: '2024-01-19',
    carrier: 'Texas Transport',
    poRef: 'PO-2024-004',
    cost: 1200,
    maxBuy: 1000,
    targetRate: 1800,
    billed: 1500,
    margin: 300,
    weight: 2000,
    miles: 200,
    regionGroup: 'Texas',
    productDescription: 'Computer equipment',
    mode: 'Air',
    lastTrackingNote: 'Quote provided',
    lastEdited: '2024-01-18 11:45 AM',
    customerSalesRep: 'Mark Johnson',
    carrierSalesRep: 'Amy Chen',
    assignedTo: 'Quote Team',
    pieceCount: '15 pallets',
    status: 'Quoted',
    equipment: 'Van',
    temperature: { min: 65, max: 75 },
    documents: {
      bol: undefined,
      pod: undefined,
      invoice: undefined
    }
  },
  {
    id: '5',
    loadNumber: 2024005,
    customer: 'Ocean Freight Co',
    shipperAddress: 'Ocean Freight Co - 444 Dock Rd, Seattle, WA 98101',
    consigneeAddress: 'Fresh Food Co - 666 Port Terminal, Portland, OR 97201',
    appointmentStatus: 'Confirmed',
    priority: 'Standard',
    pickupDate: '2024-01-19',
    estimatedDelivery: '2024-01-21',
    carrier: 'Pacific Shipping',
    poRef: 'PO-2024-005',
    cost: 4500,
    maxBuy: 4000,
    targetRate: 5800,
    billed: 5200,
    margin: 700,
    weight: 10000,
    miles: 175,
    regionGroup: 'Northwest',
    productDescription: 'Marine equipment',
    mode: 'Drayage',
    lastTrackingNote: 'Delivered to consignee',
    lastEdited: '2024-01-21 16:30 PM',
    customerSalesRep: 'Rachel Green',
    carrierSalesRep: 'Chris Lee',
    assignedTo: 'Delivery Team',
    pieceCount: '75 crates',
    status: 'Delivered',
    equipment: 'Reefer',
    temperature: { min: 32, max: 42 },
    documents: {
      bol: 'BOL-2024-005.pdf',
      pod: 'POD-2024-005.pdf',
      invoice: 'INV-2024-005.pdf'
    }
  },
  {
    id: '6',
    loadNumber: 2024006,
    customer: 'Industrial Supply',
    shipperAddress: 'Industrial Supply Co - 777 Factory Blvd, Pittsburgh, PA 15201',
    consigneeAddress: 'Advanced Supply Inc - 888 Warehouse Ave, Cleveland, OH 44101',
    appointmentStatus: 'Confirmed',
    priority: 'HOT',
    pickupDate: '2024-01-22',
    estimatedDelivery: '2024-01-23',
    carrier: 'Steel City Transport',
    poRef: 'PO-2024-006',
    cost: 2800,
    maxBuy: 2400,
    targetRate: 3600,
    billed: 3400,
    margin: 600,
    weight: 8000,
    miles: 150,
    regionGroup: 'Northeast',
    productDescription: 'Industrial equipment',
    mode: 'LTL',
    lastTrackingNote: 'Currently unloading and loading at facility',
    lastEdited: '2024-01-22 11:45 AM',
    customerSalesRep: 'Mark Thompson',
    carrierSalesRep: 'Jennifer Adams',
    assignedTo: 'Operations Team',
    pieceCount: '120 pallets',
    status: 'Loading/Unloading',
    equipment: 'Flatbed',
    temperature: { min: 70, max: 85 },
    documents: {
      bol: 'BOL-2024-006.pdf',
      pod: undefined,
      invoice: undefined
    }
  },
  {
    id: '7',
    loadNumber: 2024007,
    customer: 'Retail Distribution',
    shipperAddress: 'Retail Plus - 999 Distribution Dr, Memphis, TN 38101',
    consigneeAddress: 'Elite Retail Corp - 111 Retail Plaza, Nashville, TN 37201',
    appointmentStatus: 'Requested',
    priority: 'Standard',
    pickupDate: '2024-01-23',
    estimatedDelivery: '2024-01-24',
    carrier: 'Tennessee Express',
    poRef: 'PO-2024-007',
    cost: 1600,
    maxBuy: 1300,
    targetRate: 2200,
    billed: 2000,
    margin: 400,
    weight: 4000,
    miles: 220,
    regionGroup: 'Southeast',
    productDescription: 'Retail merchandise',
    mode: 'FTL',
    lastTrackingNote: 'Facility transfer in progress',
    lastEdited: '2024-01-23 09:30 AM',
    customerSalesRep: 'Amanda Foster',
    carrierSalesRep: 'Robert Clark',
    assignedTo: 'Dispatch Team',
    pieceCount: '200 boxes',
    status: 'Loading/Unloading',
    equipment: 'Van',
    temperature: { min: 65, max: 78 },
    documents: {
      bol: 'BOL-2024-007.pdf',
      pod: undefined,
      invoice: undefined
    }
  },
  ...generateRandomShipments(200)
];

export const mockCustomers: Customer[] = [
  { id: '1', name: 'Acme Corp', code: 'ACME' },
  { id: '2', name: 'Tech Solutions', code: 'TECH' },
  { id: '3', name: 'Global Manufacturing', code: 'GLBL' },
  { id: '4', name: 'Retail Plus', code: 'RTLP' },
  { id: '5', name: 'Food Services Inc', code: 'FOOD' }
];

export const mockCarriers: Carrier[] = [
  { id: '1', name: 'FastFreight Inc', code: 'FFI' },
  { id: '2', name: 'Reliable Transport', code: 'REL' },
  { id: '3', name: 'Express Logistics', code: 'EXP' },
  { id: '4', name: 'Coastal Shipping', code: 'COAST' },
  { id: '5', name: 'Fresh Transport', code: 'FRESH' }
];

export const mockSalesReps: SalesRep[] = [
  { id: '1', name: 'Sarah Johnson', type: 'Customer' },
  { id: '2', name: 'Tom Brown', type: 'Customer' },
  { id: '3', name: 'Amy Chen', type: 'Customer' },
  { id: '4', name: 'Chris Davis', type: 'Customer' },
  { id: '5', name: 'Karen White', type: 'Customer' },
  { id: '6', name: 'Mike Wilson', type: 'Carrier' },
  { id: '7', name: 'Lisa Garcia', type: 'Carrier' },
  { id: '8', name: 'David Lee', type: 'Carrier' },
  { id: '9', name: 'Rachel Green', type: 'Carrier' },
  { id: '10', name: 'Paul Black', type: 'Carrier' }
];

export const mockGroups: Group[] = [
  { id: '1', name: 'Northeast', description: 'Northeast Region Group' },
  { id: '2', name: 'West Coast', description: 'West Coast Region Group' },
  { id: '3', name: 'Southeast', description: 'Southeast Region Group' },
  { id: '4', name: 'Mountain', description: 'Mountain Region Group' },
  { id: '5', name: 'Midwest', description: 'Midwest Region Group' }
];

export const statusColors: Record<ShipmentStatus, string> = {
  'Not Specified': 'bg-gray-400 text-white',
  'Quoted': 'bg-yellow-400 text-yellow-900',
  'Tendered': 'bg-yellow-500 text-white',
  'Booked': 'bg-blue-500 text-white',
  'Dispatched': 'bg-purple-500 text-white',
  'Loading': 'bg-orange-500 text-white',
  'In Transit': 'bg-green-500 text-white',
  'Out For Delivery': 'bg-green-600 text-white',
  'Refused Delivery': 'bg-red-500 text-white',
  'In Disposition': 'bg-amber-500 text-amber-900',
  'Dispositioned': 'bg-amber-600 text-white',
  'Missed Delivery': 'bg-red-600 text-white',
  'Loading/Unloading': 'bg-indigo-500 text-white',
  'Unloading': 'bg-amber-500 text-amber-900',
  'Delivered': 'bg-emerald-600 text-white',
  'Delivered OS&D': 'bg-red-700 text-white',
  'Completed': 'bg-emerald-700 text-white',
  'Hold': 'bg-yellow-600 text-white',
  'Transferred': 'bg-blue-600 text-white',
  'Cancelled With Charges': 'bg-red-800 text-white',
  'Canceled': 'bg-gray-600 text-white'
};

export const appointmentStatusColors: Record<AppointmentStatus, string> = {
  'Not Required': 'bg-red-500 text-white',
  'Requested': 'bg-yellow-400 text-yellow-900',
  'Confirmed': 'bg-green-500 text-white',
  'Pending': 'bg-gray-400 text-white'
};

export const priorityColors: Record<Priority, string> = {
  'HOT': 'bg-red-500 text-white',
  'Standard': 'bg-gray-400 text-white',
  'Trace': 'bg-orange-500 text-white'
};

export const defaultColumns: TableColumn[] = [
  { id: 'select', label: '', key: 'id', visible: true, sortable: false, filterable: false, width: '40px', sticky: true, locked: true },
  { id: 'statusActions', label: 'Status & Actions', key: 'status', visible: true, sortable: true, filterable: false, width: '140px', sticky: true, locked: true },
  { id: 'loadNumber', label: 'Load #', key: 'loadNumber', visible: true, sortable: true, filterable: true, width: '80px', sticky: true },
  { id: 'documents', label: 'Documents', key: 'documents', visible: true, sortable: false, filterable: false, width: '120px', sticky: true, locked: true },
  { id: 'customer', label: 'Customer', key: 'customer', visible: true, sortable: true, filterable: true, width: '100px' },
  { id: 'shipperAddress', label: 'Shipper Address', key: 'shipperAddress', visible: true, sortable: true, filterable: true, width: '100px' },
  { id: 'consigneeAddress', label: 'Consignee Address', key: 'consigneeAddress', visible: true, sortable: true, filterable: true, width: '100px' },
  { id: 'appointmentStatus', label: 'Appointment Status', key: 'appointmentStatus', visible: true, sortable: true, filterable: true, width: '90px' },
  { id: 'priority', label: 'Priority', key: 'priority', visible: true, sortable: true, filterable: true, width: '70px' },
  { id: 'pickupDate', label: 'Pickup Date', key: 'pickupDate', visible: true, sortable: true, filterable: true, width: '80px' },
  { id: 'estimatedDelivery', label: 'Est. Delivery', key: 'estimatedDelivery', visible: true, sortable: true, filterable: true, width: '80px' },
  { id: 'carrier', label: 'Carrier', key: 'carrier', visible: true, sortable: true, filterable: true, width: '100px' },
  { id: 'poRef', label: 'PO Ref #', key: 'poRef', visible: true, sortable: true, filterable: true, width: '70px' },
  { id: 'cost', label: 'Cost', key: 'cost', visible: true, sortable: true, filterable: true, width: '60px' },
  { id: 'maxBuy', label: 'Max Buy', key: 'maxBuy', visible: true, sortable: true, filterable: true, width: '70px' },
  { id: 'targetRate', label: 'Target Rate', key: 'targetRate', visible: true, sortable: true, filterable: true, width: '80px' },
  { id: 'billed', label: 'Billed', key: 'billed', visible: true, sortable: true, filterable: true, width: '60px' },
  { id: 'margin', label: 'Margin', key: 'margin', visible: true, sortable: true, filterable: true, width: '60px' },
  { id: 'weight', label: 'Weight', key: 'weight', visible: true, sortable: true, filterable: true, width: '60px' },
  { id: 'miles', label: 'Miles', key: 'miles', visible: true, sortable: true, filterable: true, width: '50px' },
  { id: 'regionGroup', label: 'Region Group', key: 'regionGroup', visible: true, sortable: true, filterable: true, width: '90px' },
  { id: 'productDescription', label: 'Product Description', key: 'productDescription', visible: true, sortable: true, filterable: true, width: '100px' },
  { id: 'mode', label: 'Mode', key: 'mode', visible: true, sortable: true, filterable: true, width: '70px' },
  { id: 'equipment', label: 'Equipment', key: 'equipment', visible: true, sortable: true, filterable: true, width: '70px' },
  { id: 'temperature', label: 'Temperature', key: 'temperature', visible: true, sortable: true, filterable: true, width: '90px' },
  { id: 'lastTrackingNote', label: 'Last Tracking Note', key: 'lastTrackingNote', visible: true, sortable: true, filterable: true, width: '120px' },
  { id: 'lastEdited', label: 'Last Edited', key: 'lastEdited', visible: true, sortable: true, filterable: true, width: '100px' },
  { id: 'customerSalesRep', label: 'Customer Sales Rep', key: 'customerSalesRep', visible: true, sortable: true, filterable: true, width: '100px' },
  { id: 'carrierSalesRep', label: 'Carrier Sales Rep', key: 'carrierSalesRep', visible: true, sortable: true, filterable: true, width: '100px' },
  { id: 'assignedTo', label: 'Assigned To', key: 'assignedTo', visible: true, sortable: true, filterable: true, width: '90px' },
  { id: 'pieceCount', label: 'Piece Count', key: 'pieceCount', visible: true, sortable: true, filterable: true, width: '70px' }
]; 