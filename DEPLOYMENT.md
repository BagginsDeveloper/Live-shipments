# Azure App Service Deployment Guide

This guide explains how to deploy the Live Shipment View application to Azure App Service.

## Prerequisites

1. **Azure App Service**: You need an Azure App Service instance set up
2. **Publish Profile**: Download the publish profile from Azure Portal
3. **MSDeploy**: Install Web Deploy tools (usually comes with Visual Studio)

## Deployment Methods

### Method 1: Automated GitHub Actions (Recommended)

1. **Set up GitHub Secrets**:
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add a new secret named `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Copy the entire content of your `.PublishSettings` file as the value

2. **Deploy**:
   - Push to the `main` branch
   - GitHub Actions will automatically build and deploy your app

### Method 2: Manual Deployment

1. **Place Publish Profile**:
   - Copy your `live-shipments-testing.PublishSettings` file to the project root

2. **Run Deployment Script**:
   ```powershell
   npm run deploy:azure
   ```

3. **Or run the PowerShell script directly**:
   ```powershell
   .\deploy.ps1
   ```

### Method 3: Visual Studio Code

1. Install the "Azure App Service" extension
2. Right-click on the project folder
3. Select "Deploy to Web App"
4. Choose your Azure subscription and app service

## Configuration Details

### App Service Details
- **App Name**: `live-shipments-testing`
- **URL**: `https://live-shipments-testing-b9cjc7c5fhgahegm.eastus2-01.azurewebsites.net`
- **Region**: East US 2
- **Deployment Method**: Web Deploy (MSDeploy)

### Environment Variables
The following environment variables can be set in Azure App Service Configuration:

```json
{
  "REACT_APP_ENV": "production",
  "REACT_APP_API_URL": "your-api-url"
}
```

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version compatibility
   - Ensure all dependencies are installed

2. **Deployment Failures**:
   - Verify publish profile is correct
   - Check Azure App Service is running
   - Ensure MSDeploy is installed

3. **Routing Issues**:
   - The `web.config` file handles React routing
   - Ensure it's included in the build

### Logs
- Check Azure App Service logs in the Azure Portal
- Monitor GitHub Actions logs for automated deployments

## Security Notes

- Never commit publish profiles to version control
- Use GitHub Secrets for sensitive information
- Regularly rotate deployment credentials

## Support

For deployment issues, check:
1. Azure App Service logs
2. GitHub Actions logs
3. MSDeploy error messages 