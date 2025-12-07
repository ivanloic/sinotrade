# Script pour démarrer le serveur de produits
Write-Host "🚀 Démarrage du serveur de produits SinoTrade..." -ForegroundColor Cyan
Write-Host ""

# Vérifier si Node.js est installé
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Aller dans le dossier server
Set-Location -Path "server"

# Vérifier si node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
    npm install
    Write-Host "✓ Dépendances installées" -ForegroundColor Green
    Write-Host ""
}

# Démarrer le serveur
Write-Host "🎯 Démarrage du serveur sur http://localhost:3001" -ForegroundColor Cyan
Write-Host "📝 Endpoint API: http://localhost:3001/api/products/add" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arrêter le serveur" -ForegroundColor Yellow
Write-Host ""

npm start
