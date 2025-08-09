# Azure App Service Deployment Script
# This script builds and deploys the React app to Azure App Service

param(
    [string]$PublishProfilePath = "live-shipments-testing.PublishSettings",
    [string]$AppName = "live-shipments-testing"
)

Write-Host "🚀 Starting deployment to Azure App Service..." -ForegroundColor Green

# Check if publish profile exists
if (-not (Test-Path $PublishProfilePath)) {
    Write-Host "❌ Publish profile not found at: $PublishProfilePath" -ForegroundColor Red
    Write-Host "Please download the publish profile from Azure Portal and place it in the project root." -ForegroundColor Yellow
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm ci
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Build the application
Write-Host "🔨 Building the application..." -ForegroundColor Blue
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Check if build directory exists
if (-not (Test-Path "build")) {
    Write-Host "❌ Build directory not found" -ForegroundColor Red
    exit 1
}

# Deploy using MSDeploy
Write-Host "📤 Deploying to Azure App Service..." -ForegroundColor Blue
try {
    # Extract publish URL and credentials from publish profile
    $publishProfile = [xml](Get-Content $PublishProfilePath)
    $webDeployProfile = $publishProfile.publishData.publishProfile | Where-Object { $_.publishMethod -eq "MSDeploy" }
    
    if (-not $webDeployProfile) {
        Write-Host "❌ Web Deploy profile not found in publish settings" -ForegroundColor Red
        exit 1
    }
    
    $publishUrl = $webDeployProfile.publishUrl
    $userName = $webDeployProfile.userName
    $userPWD = $webDeployProfile.userPWD
    $msdeploySite = $webDeployProfile.msdeploySite
    
    # Deploy using MSDeploy
    $msdeployArgs = @(
        "-source:contentPath=`"$PWD\build`""
        "-dest:contentPath=`"$msdeploySite`",ComputerName=`"https://$publishUrl`",UserName=`"$userName`",Password=`"$userPWD`",AuthType=`"Basic`""
        "-verb:sync"
        "-enableRule:DoNotDeleteRule"
    )
    
    Write-Host "Deploying to: https://$publishUrl" -ForegroundColor Cyan
    & "C:\Program Files (x86)\IIS\Microsoft Web Deploy V3\msdeploy.exe" @msdeployArgs
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Deployment successful!" -ForegroundColor Green
        Write-Host "🌐 Your app is now live at: https://$($webDeployProfile.destinationAppUrl)" -ForegroundColor Green
    } else {
        Write-Host "❌ Deployment failed" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "❌ Deployment error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green 