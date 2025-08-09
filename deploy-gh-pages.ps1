# Deploy to GitHub Pages PowerShell Script
Write-Host "Starting GitHub Pages deployment..." -ForegroundColor Green

# Build the project
Write-Host "Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Check if gh-pages branch exists remotely
Write-Host "Checking gh-pages branch..." -ForegroundColor Yellow
$ghPagesExists = git ls-remote --heads origin gh-pages

if ($ghPagesExists) {
    Write-Host "gh-pages branch exists, deleting it..." -ForegroundColor Yellow
    git push origin --delete gh-pages
}

# Create new gh-pages branch
Write-Host "Creating new gh-pages branch..." -ForegroundColor Yellow
git checkout --orphan gh-pages

# Remove all files except build
Write-Host "Cleaning gh-pages branch..." -ForegroundColor Yellow
git rm -rf .
git clean -fxd

# Copy build files to root
Write-Host "Copying build files..." -ForegroundColor Yellow
Copy-Item -Path "build\*" -Destination "." -Recurse -Force

# Add all files
Write-Host "Adding files to git..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "Deploy to GitHub Pages"

# Push to gh-pages branch
Write-Host "Pushing to gh-pages branch..." -ForegroundColor Yellow
git push origin gh-pages

# Go back to main branch
Write-Host "Switching back to main branch..." -ForegroundColor Yellow
git checkout main

Write-Host "Deployment completed!" -ForegroundColor Green
Write-Host "Your app should be available at: https://bagginsdeveloper.github.io/Live-shipments/" -ForegroundColor Cyan
Write-Host "Note: It may take a few minutes for the changes to appear." -ForegroundColor Yellow 