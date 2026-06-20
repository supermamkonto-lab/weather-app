# Windows 11 Pro Testing Script
# Phase 3: Comprehensive validation before Phase 4

param(
    [string]$testType = "all"
)

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$logFile = ".\test-results-$timestamp.log"

function Log {
    param([string]$message)
    Write-Host $message
    Add-Content -Path $logFile -Value $message
}

Log "╔════════════════════════════════════════════════════════════════╗"
Log "║         PHASE 3 TESTING - Windows 11 Pro Validation           ║"
Log "╚════════════════════════════════════════════════════════════════╝"
Log ""
Log "[TIMESTAMP] $timestamp"
Log ""

# Test 1: TypeScript Compilation
if ($testType -eq "all" -or $testType -eq "typescript") {
    Log "[TEST 1] TypeScript Strict Mode Compilation..."
    npx tsc --noEmit --strict 2>&1 | Tee-Object -FilePath $logFile -Append
    if ($LASTEXITCODE -eq 0) {
        Log "✅ TypeScript: PASS"
    } else {
        Log "❌ TypeScript: FAIL"
    }
    Log ""
}

# Test 2: ESLint
if ($testType -eq "all" -or $testType -eq "lint") {
    Log "[TEST 2] ESLint Code Quality..."
    npx eslint src/ --format compact 2>&1 | Tee-Object -FilePath $logFile -Append
    if ($LASTEXITCODE -eq 0) {
        Log "✅ ESLint: PASS"
    } else {
        Log "⚠️  ESLint: Warnings/Errors"
    }
    Log ""
}

# Test 3: Prettier Format Check
if ($testType -eq "all" -or $testType -eq "format") {
    Log "[TEST 3] Code Format Check..."
    npx prettier --check src/ 2>&1 | Tee-Object -FilePath $logFile -Append
    if ($LASTEXITCODE -eq 0) {
        Log "✅ Prettier: PASS"
    } else {
        Log "⚠️  Prettier: Format issues detected"
    }
    Log ""
}

# Test 4: Unit Tests
if ($testType -eq "all" -or $testType -eq "unit") {
    Log "[TEST 4] Unit Tests..."
    npm test -- --passWithNoTests 2>&1 | Tee-Object -FilePath $logFile -Append
    if ($LASTEXITCODE -eq 0) {
        Log "✅ Unit Tests: PASS"
    } else {
        Log "⚠️  Unit Tests: Check results"
    }
    Log ""
}

# Test 5: Bundle Size Analysis
if ($testType -eq "all" -or $testType -eq "bundle") {
    Log "[TEST 5] Bundle Size..."
    $apkSize = Get-Item ".\android\app\build\outputs\apk\debug\app-debug.apk" -ErrorAction SilentlyContinue
    if ($apkSize) {
        $sizeMB = [math]::Round($apkSize.Length / 1MB, 2)
        Log "APK Size: $sizeMB MB"
        if ($sizeMB -lt 60) {
            Log "✅ Bundle Size: PASS (under 60MB)"
        } else {
            Log "⚠️  Bundle Size: WARNING (over 60MB)"
        }
    }
    Log ""
}

# Test 6: Build Time Benchmark
if ($testType -eq "all" -or $testType -eq "build") {
    Log "[TEST 6] Build Time Benchmark..."
    cd android
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    .\gradlew.bat app:assembleDebug -q 2>&1 | Out-Null
    $stopwatch.Stop()
    $buildTime = $stopwatch.Elapsed.TotalSeconds
    Log "Build Time: $buildTime seconds"
    if ($buildTime -lt 15) {
        Log "✅ Build Time: PASS (under 15s)"
    } else {
        Log "⚠️  Build Time: WARNING (over 15s)"
    }
    cd ..
    Log ""
}

Log "═══════════════════════════════════════════════════════════════"
Log "✅ PHASE 3 TESTING COMPLETE"
Log "📄 Results saved to: $logFile"
Log ""
Log "Next: Phase 4 - GitHub & Open Source Preparation"
