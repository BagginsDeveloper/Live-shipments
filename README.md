# Live Shipment View

A React application for tracking and managing live shipments with real-time updates and interactive maps.

<!-- Deployment test comment -->

## Features

### Shipment Management
- **Comprehensive Shipment Data**: Track load numbers, customer information, addresses, dates, costs, and more
- **Status Tracking**: Monitor shipment progress from pickup to delivery with visual status indicators
- **Priority Management**: Set and track shipment priorities (HOT, Standard, Trace)
- **Document Management**: View and manage BOL, POD, and Invoice documents with icons
- **Document Sharing**: Send documents via email to recipients
- **Column Customization**
- **Manual Column Mapping**: Clean, manual column mapping in upload modal for precise control
- **Clean State Management**: Modal resets to clean state on each open for consistent user experience
- **Preset Management**: Save and load column mapping presets for common file formats
- **Advanced Filtering**: Filter shipments by any field with real-time search
- **Bulk Operations**: Perform actions on multiple shipments simultaneously
- **Optimized Layout**: Compact column widths maximize screen real estate for more visible columns
- **Smart Address Display**: Addresses are stacked vertically for better readability in compact columns

### Tracking & Visibility
- **Interactive Shipment Map**: View all shipments on an interactive map with clustering
- **Real-time Tracking**: Track individual shipments with detailed updates
- **Public Tracking Links**: Generate shareable tracking links for customers
- **Milestone Timeline**: FedEx/UPS-style milestone tracking showing shipment progress
- **Breadcrumb Trail**: Visual route visualization with pickup, transit, and delivery points
- **Weather Impact Analysis**: Real-time weather data integration with impact assessment
- **Weather Heat Map**: Visual overlay showing potential weather disruptions to shipments

### Public Tracking
- **Customer Access**: Customers can track shipments without logging in
- **Professional Interface**: Clean, mobile-friendly tracking page
- **Real-time Updates**: Live shipment status and location updates
- **Route Visualization**: Interactive map showing shipment journey
- **Detailed History**: Complete tracking update history with timestamps

### Authentication & Security
- Secure login system
- Protected routes for internal users
- Public tracking accessible without authentication

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

### Document Management
- **Visual Document Indicators**: Color-coded icons show available documents at a glance
  - 🔵 **Blue**: Bill of Lading (BOL) - Shipping document
  - 🟢 **Green**: Proof of Delivery (POD) - Delivery confirmation
  - 🟣 **Purple**: Invoice - Billing document
  - ⚪ **Gray**: No documents available
- **Document Viewer**: Click "View Docs" to see all available documents for a shipment
- **Document Sharing**: Click "Send Docs" to email documents to recipients
- **Locked Column**: Documents column is locked and always visible for easy access
- **Smart Display**: Only shows "Send Docs" button when documents are available
- **Professional Interface**: Clean, intuitive design matching industry standards

### Document Features
- **BOL Management**: Track Bill of Lading documents for shipping compliance
- **POD Tracking**: Monitor Proof of Delivery confirmations
- **Invoice Access**: Quick access to billing documents
- **Email Integration**: Send documents directly from the interface
- **Placeholder System**: Ready for integration with document management systems
- **Responsive Design**: Works seamlessly on all device sizes

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

### Generating Public Tracking Links
1. Open the tracking modal for any shipment
2. Click the "📤 Generate Public Link" button
3. Copy the generated link to share with customers
4. Customers can access the link directly without logging in

### Public Tracking Page
- URL format: `/tracking/{shipmentId}`
- Example: `https://yourdomain.com/tracking/12345`
- Shows shipment progress, map, and detailed updates
- Mobile-responsive design for all devices

### Milestone Tracking
- Visual timeline showing key shipment events
- Color-coded status indicators (completed, current, upcoming)
- Location and timestamp information for each milestone
- Professional appearance similar to major shipping carriers

### Weather Impact Analysis
- **Real-time Weather Data**: Integration with OpenWeatherMap API for current conditions
- **Impact Assessment**: Automatic evaluation of weather conditions on shipment delays
- **Heat Map Overlay**: Visual representation of weather impact areas
- **Impact Levels**: Categorized as Low, Medium, High, or Severe based on multiple factors
- **Weather Factors**: Temperature, wind speed, visibility, precipitation, and conditions
- **Toggle Control**: Show/hide weather overlay as needed
- **Detailed Weather Info**: Click weather markers for comprehensive condition details

### Weather Heat Map Features
- **Color-coded Impact Zones**: 
  - 🟢 Green: Low impact (minimal delays)
  - 🟡 Yellow: Medium impact (moderate delays possible)
  - 🟠 Orange: High impact (significant delays expected)
  - 🔴 Red: Severe impact (severe disruptions likely)
- **Dynamic Radius**: Impact zones scale based on severity level
- **Interactive Popups**: Click zones for impact descriptions
- **Weather Markers**: Individual weather stations with detailed data
- **Professional Legend**: Clear visual guide for impact levels

## Setup

### Weather API Integration
1. **Get OpenWeatherMap API Key**: 
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Generate a free API key
   - Replace `YOUR_OPENWEATHERMAP_API_KEY` in `src/components/ShipmentMapModal.tsx`
2. **API Limits**: Free tier includes 1000 calls/day (sufficient for development)
3. **Production**: Consider upgrading to paid plan for higher call limits
4. **Mock Data**: Currently uses mock weather data for demonstration

### Address Display Improvements
- **Vertical Stacking**: Addresses are displayed in a compact, readable format:
  ```
  Company Name
  Street Address
  City, State Zip
  ```
- **Smart Parsing**: Automatically separates company name, street address, and city/state/zip
- **Compact Columns**: Reduced shipper and consignee address column widths from 150px to 100px
- **Tooltip Support**: Full address visible on hover for complete information
- **Responsive Text**: Uses smaller font sizes and tight line spacing for optimal space usage

### Column Width Optimization
- **Space Efficiency**: Reduced column widths across the table to show more columns simultaneously
- **Key Reductions**:
  - Customer: 120px → 100px
  - Shipper/Consignee Address: 150px → 100px
  - Appointment Status: 100px → 90px
  - Priority: 80px → 70px
  - Pickup/Delivery Dates: 90px → 80px
  - Carrier: 120px → 100px
  - PO Ref: 80px → 70px
  - Cost/Margin/Weight: 70px → 60px
  - Miles: 60px → 50px
  - Product Description: 120px → 100px
  - Mode/Equipment: 80px → 70px
  - Temperature: 110px → 90px
  - Last Tracking Note: 150px → 120px
  - Sales Reps: 120px → 100px
  - Assigned To: 100px → 90px
  - Piece Count: 80px → 70px
- **Total Space Saved**: Approximately 400px, allowing 3-4 additional columns to be visible
- **Maintained Readability**: All information remains clear and accessible despite compact sizing

### Priority Management
- **HOT Priority**: High-priority shipments requiring immediate attention (Red indicator)
- **Standard Priority**: Normal priority shipments (Gray indicator)  
- **Trace Priority**: Shipments requiring tracking and monitoring (Orange indicator)
- **Visual Indicators**: Color-coded priority chips for quick identification
- **Legend Support**: All priority levels displayed in both inline and modal legends
- **Filtering Support**: Filter shipments by priority level
- **Bulk Operations**: Apply priority changes to multiple shipments
- **Status Integration**: Priority levels work with all shipment statuses
