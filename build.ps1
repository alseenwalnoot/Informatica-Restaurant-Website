$ErrorActionPreference = "Stop"

# Root
$root = Get-Location

# Paths
$backend   = "$root\cppbackend"
$frontend  = "$root\react-frontend"
$build     = "$backend\build"
$release   = "$root\release"

$exeSrc    = "$build\Release\app.exe"
$dbSrc     = "$backend\meals.db"
$distSrc   = "$frontend\dist"

$distDst   = "$release\templates\dist"

Write-Host "=== Cleaning release directory ==="
Remove-Item -Recurse -Force $release -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force $release | Out-Null

Write-Host "=== Building backend ==="
cmake -S $backend -B $build `
  -DCMAKE_TOOLCHAIN_FILE="$env:VCPKG_ROOT\scripts\buildsystems\vcpkg.cmake"

cmake --build $build --config Release

Write-Host "=== Building frontend ==="
Push-Location $frontend
npm run build
Pop-Location

Write-Host "=== Assembling release ==="

# Copy backend exe
Copy-Item $exeSrc $release

# Copy database
Copy-Item $dbSrc $release

# Copy frontend dist
New-Item -ItemType Directory -Force $distDst | Out-Null
Copy-Item "$distSrc\*" $distDst -Recurse

Write-Host ""
Write-Host "=== RELEASE READY ==="
Write-Host "Location: $release"
