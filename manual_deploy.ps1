# Navigate to the frontend folder to build
Set-Location "frontend"

Write-Host "Building project..."
npm run build

# Check if build succeeded
if ($LASTEXITCODE -ne 0) {
  Write-Host "Build failed! Stopping."
  exit 1
}

# Navigate to build output
Set-Location "dist"

# Fix 404 on refresh for GitHub Pages (SPA Support)
Copy-Item "index.html" "404.html" -Force

# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Manual Deploy to GitHub Pages"

# Rename branch to gh-pages
git branch -M gh-pages

# Add remote (ignoring error if it exists)
git remote remove origin 2>$null

# Force the username in the URL to bypass cached wrong credentials
git remote add origin https://Naseer-047@github.com/Naseer-047/surverse-music-player.git

# Unset credential helper temporarily
# git config credential.helper ""

# Push force to gh-pages
Write-Host "Pushing to GitHub Pages..."
Write-Host "NOTE: If asked for a password, use your GitHub Personal Access Token."
git push -u origin gh-pages --force

# Go back to root
Set-Location ../..

Write-Host "Deployment Complete! Check GitHub Settings > Pages."
