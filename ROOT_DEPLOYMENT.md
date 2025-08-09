# Root Directory Deployment Configuration

## Overview
This document explains the changes made to move the Live-shipments React app from the `build/` folder to the root directory, making `index.html` accessible from the root.

## Changes Made

### 1. Package.json Updates
- **homepage**: Changed from `"https://bagginsdeveloper.github.io/Live-shipments"` to `"."`
- **build script**: Modified to copy build files to root after building
- **deploy scripts**: Updated to reference root directory instead of build folder

### 2. Build Process
The build process now:
1. Runs `react-scripts build` (creates `build/` folder)
2. Copies all files from `build/` to root directory
3. Removes the `build/` folder
4. Results in a root-deployed application

### 3. File Structure After Build
```
Live-shipments/
├── index.html          # Main entry point (accessible from root)
├── static/             # JavaScript and CSS bundles
│   ├── js/
│   └── css/
├── favicon.ico         # App icon
├── logo192.png         # App logo
├── logo512.png         # App logo (high res)
├── manifest.json       # PWA manifest
├── asset-manifest.json # Build manifest
└── ... (other build files)
```

### 4. Deployment Scripts Updated
- **deploy.ps1**: Now deploys from root directory with exclusions for source files
- **deploy-gh-pages.ps1**: Updated to copy files from root instead of build folder

### 5. Asset Paths
All static assets now use relative paths:
- `./favicon.ico`
- `./static/js/main.[hash].js`
- `./static/css/main.[hash].css`

## Benefits
1. **Direct Access**: `index.html` is now accessible from the root URL
2. **Simplified Deployment**: No need to navigate to subdirectories
3. **Better SEO**: Root-level access improves search engine indexing
4. **Cleaner URLs**: Users can access the app directly without `/build/` in the path

## Usage

### Development
```bash
npm start          # Start development server
npm run build      # Build and deploy to root
npm test           # Run tests
```

### Deployment
```bash
npm run deploy           # Deploy to Azure
npm run deploy:gh-pages # Deploy to GitHub Pages
```

## Notes
- The source code remains in the `src/` folder
- Build artifacts are automatically moved to root after each build
- All deployment scripts have been updated to work with the new structure
- The app maintains the same functionality but is now accessible from the root directory
