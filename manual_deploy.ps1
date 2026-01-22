# Navigate to the build folder
Set-Location "frontend/dist"

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
git remote add origin https://github.com/Naseer-047/surverse-music-player.git

# Push force to gh-pages
Write-Host "Pushing to GitHub Pages..."
git push -u origin gh-pages --force

# Go back
Set-Location ../..

Write-Host "Deployment Complete! Check GitHub Settings > Pages."
