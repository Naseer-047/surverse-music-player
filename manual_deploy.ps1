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

# Force the username in the URL to bypass cached wrong credentials
git remote add origin https://Naseer-047@github.com/Naseer-047/surverse-music-player.git

# Unset credential helper temporarily for this repo to force login if needed
git config credential.helper ""

# Push force to gh-pages
Write-Host "Pushing to GitHub Pages..."
Write-Host "NOTE: If asked for a password, use your GitHub Personal Access Token (or sign in via browser prompt)."
git push -u origin gh-pages --force

# Go back
Set-Location ../..

Write-Host "Deployment Complete! Check GitHub Settings > Pages."
