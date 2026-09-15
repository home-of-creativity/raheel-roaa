# Starts production Next.js (if needed) and a Cloudflare quick tunnel.
# Usage: .\scripts\tunnel.ps1

$ErrorActionPreference = "Stop"
Set-Location -LiteralPath (Split-Path $PSScriptRoot -Parent)

if (-not (Get-Command cloudflared -ErrorAction SilentlyContinue)) {
  Write-Error "cloudflared not found. Install: winget install Cloudflare.cloudflared"
}

$port = 3000
$probe = try { (Invoke-WebRequest -Uri "http://127.0.0.1:$port/" -UseBasicParsing -TimeoutSec 2).StatusCode } catch { $null }

if ($probe -ne 200) {
  Write-Host "Building and starting Next.js on port $port..."
  npm run build
  Start-Process -NoNewWindow -FilePath "node" -ArgumentList "node_modules/next/dist/bin/next","start","-p",$port
  Start-Sleep -Seconds 8
}

Write-Host "Opening Cloudflare quick tunnel -> http://127.0.0.1:$port"
Write-Host "Copy the https://*.trycloudflare.com URL from the log below."
cloudflared tunnel --url "http://127.0.0.1:$port"
