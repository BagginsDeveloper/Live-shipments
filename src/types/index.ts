export interface Shipment {
  id: string;
  loadNumber: number;
  customer: string;
  shipperAddress: string;
  consigneeAddress: string;
  appointmentStatus: AppointmentStatus;
  priority: Priority;
  pickupDate: string;
  estimatedDelivery: string;
  carrier: string;
  poRef: string;
  cost: number;
  billed: number;
  margin: number;
  weight: number;
  miles: number;
  regionGroup: string;
  productDescription: string;
  mode: ShipmentMode;
  lastTrackingNote: string;
  lastEdited: string;
  customerSalesRep: string;
  carrierSalesRep: string;
  assignedTo: string;
  pieceCount: string;
  status: ShipmentStatus;
}

export type ShipmentStatus = 
  | 'Quoted'
  | 'Booked Not Covered'
  | 'Booked'
  | 'Dispatch'
  | 'In Transit'
  | 'Delivered'
  | 'Loading'
  | 'Unloading'
  | 'Unloading / Loading'
  | 'Delivered OS&D';

export type ShipmentMode = 
  | 'LTL'
  | 'FTL'
  | 'Intermodal'
  | 'Air'
  | 'Ocean'
  | 'Drayage';

export type AppointmentStatus = 
  | 'Confirmed' 
  | 'Requested' 
  | 'Not Required'
  | 'Pending';

export type Priority = 
  | 'HOT'
  | 'Standard';

export interface AppointmentStatusColors {
  [key: string]: string;
}

export interface FilterPreset {
  id: string;
  name: string;
  filters: FilterOptions;
}

export interface FilterOptions {
  loadNumber?: string;
  shipperZipStart?: string;
  shipperZipEnd?: string;
  consigneeZipStart?: string;
  consigneeZipEnd?: string;
  shipperCompany?: string;
  consigneeCompany?: string;
  carrierName?: string;
  proNumber?: string;
  pickupNumber?: string;
  poNumber?: string;
  shipperNumber?: string;
  shipmentMode?: ShipmentMode[];
  pickupDateFrom?: string;
  pickupDateTo?: string;
  estimatedDeliveryFrom?: string;
  estimatedDeliveryTo?: string;
  groupSelection?: string[];
  regions?: string[];
  customerSalesRep?: string;
  carrierSalesRep?: string;
  shipmentStatus?: ShipmentStatus[];
  priority?: Priority[];
  appointmentStatus?: AppointmentStatus[];
}

export interface Customer {
  id: string;
  name: string;
  code: string;
}

export interface Carrier {
  id: string;
  name: string;
  code: string;
}

export interface SalesRep {
  id: string;
  name: string;
  type: 'Customer' | 'Carrier';
}

export interface Group {
  id: string;
  name: string;
  description?: string;
}

export interface TableColumn {
  id: string;
  label: string;
  key: keyof Shipment;
  visible: boolean;
  sortable: boolean;
  filterable?: boolean;
  width?: string;
  sticky?: boolean;
  locked?: boolean;
}

export interface ColumnConfig {
  columns: TableColumn[];
} 