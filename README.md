# Live Shipments - React TypeScript Application

A modern, responsive web application for managing live shipment tracking and logistics operations. Built with React, TypeScript, and TailwindCSS.

## Features

### 🎯 Core Functionality
- **Advanced Filtering System**: Comprehensive filter bar with 15+ filter options
- **Filter Presets**: Save and load custom filter configurations
- **Real-time Shipment Tracking**: View shipment status with color-coded indicators
- **Bulk Operations**: Select multiple shipments and perform batch actions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### 📊 Filter Options
- Load Number
- Shipper/Consignee Zip Ranges
- Shipper/Consignee Companies
- Carrier Name
- Pro Number, Pickup Number, PO Number, Shipper Number
- Shipment Mode (LTL, FTL, Intermodal, Air, Ocean)
- Pickup Date Range
- Group Selection
- Customer/Carrier Sales Representatives
- Shipment Status (Multi-select)

### 🎨 Status Legend
Color-coded status indicators for:
- Quoted (Blue)
- Booked Not Covered (Yellow)
- Booked (Green)
- Dispatch (Purple)
- In Transit (Indigo)
- Delivered (Emerald)
- Loading (Orange)
- Unloading (Amber)
- Delivered OS&D (Red)

### 📋 Shipments Table
Comprehensive table with 20+ columns including:
- Status with dynamic action options
- Load Number, Customer, Addresses
- Appointment Status
- Pickup/Delivery Dates
- Carrier Information
- Financial Data (Cost, Billed, Margin)
- Weight, Miles, Region Group
- Product Description, Mode
- Tracking Notes, Last Edited
- Sales Representatives
- Piece Count with Type
- Dynamic Actions based on Status

### 🔧 Bulk Actions
- Book Selected Shipments
- Dispatch Selected Shipments
- Cancel Selected Shipments
- Delete Selected Shipments

### ➕ Create New Shipment
- Customer selection dropdown
- Book or Quote options
- Modal-based interface

## Technology Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Custom components with Headless UI patterns
- **State Management**: React Hooks (useState, useMemo)
- **Build Tool**: Create React App

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── FilterBar.tsx   # Advanced filtering interface
│   ├── Legend.tsx      # Status color legend
│   ├── CreateShipmentModal.tsx  # New shipment creation
│   └── ShipmentsTable.tsx       # Main data table
├── data/               # Mock data and constants
│   └── mockData.ts     # Sample shipment data
├── types/              # TypeScript type definitions
│   └── index.ts        # All application types
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
└── pages/              # Page components (future use)
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd live-shipments
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Login Credentials

To access the application, use the following credentials:

- **Username**: `admin`
- **Password**: `3PLDevelopment!1`

The login page features a modern design with a professional background image and secure authentication system.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Usage

### Filtering Shipments
1. Use the filter bar at the top to narrow down shipments
2. Click "Show Advanced" for additional filter options
3. Save frequently used filters as presets
4. Use the "Clear All" button to reset filters

### Managing Shipments
1. Select individual shipments using checkboxes
2. Use bulk actions for multiple shipments
3. Click on column headers to sort data
4. Use the actions dropdown for individual shipment operations

### Creating New Shipments
1. Click "Create New Shipment" button
2. Select a customer from the dropdown
3. Choose "Book" or "Quote" based on your needs

## Customization

### Adding New Filter Fields
1. Update the `FilterOptions` interface in `src/types/index.ts`
2. Add the field to the `FilterBar` component
3. Update the filtering logic in `App.tsx`

### Modifying Status Colors
Edit the `statusColors` object in `src/data/mockData.ts` to change the color scheme.

### Adding New Shipment Fields
1. Update the `Shipment` interface in `src/types/index.ts`
2. Add the column to `ShipmentsTable.tsx`
3. Update mock data in `src/data/mockData.ts`

## Mock Data

The application includes comprehensive mock data with:
- 5 sample shipments with realistic data
- 5 customers with codes
- 5 carriers with codes
- 10 sales representatives (5 customer, 5 carrier)
- 5 region groups
- Status color mappings

## Future Enhancements

- [ ] Real-time data integration
- [ ] Export functionality (CSV, PDF)
- [ ] Advanced search with full-text search
- [ ] Drag-and-drop interface for status updates
- [ ] Email notifications
- [ ] Mobile app version
- [ ] Dark mode support
- [ ] Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
