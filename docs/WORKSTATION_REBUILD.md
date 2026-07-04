# WORKSTATION_REBUILD.md — Complete Environment Setup Guide

**For:** Fresh Windows 11 machine with zero project dependencies  
**Time estimate:** 45-60 minutes  
**Verified:** 2026-06-22 (Real system values extracted)

---

## PART 1: SYSTEM REQUIREMENTS

### Windows

**Required:** Windows 11 Pro (or better)  
**Build:** Minimum 26100  
**Architecture:** x64 only  
**Disk space:** Minimum 50GB free  
**RAM:** Minimum 8GB (recommended 16GB)  

**Verification:**
```powershell
# Check Windows version
[Environment]::OSVersion.VersionString
# Should show: Microsoft Windows 11

# Check build number
(Get-WmiObject -Class Win32_OperatingSystem).BuildNumber
# Should show: 26100 or higher
```

---

## PART 2: CRITICAL DEVELOPMENT TOOLS

### 2.1 Node.js

**Required version:** v24.17.0 or compatible (v18+ minimum)  
**Download:** https://nodejs.org/  
**Installation:** Standard installer  
**Verification:**
```bash
node --version
# Expected: v24.17.0
```

**Post-install:**
- Node.js installer adds to PATH automatically
- Restart PowerShell after installation
- Verify: `node -v` and `npm -v` work globally

---

### 2.2 npm

**Included with:** Node.js  
**Expected version:** 11.13.0 (comes with Node.js v24.17.0)  
**Verification:**
```bash
npm --version
# Expected: 11.13.0
```

**Post-install:**
- NO separate installation needed
- Comes bundled with Node.js

---

### 2.3 Git

**Required version:** 2.51.0 or compatible (2.40+ minimum)  
**Download:** https://git-scm.com/download/win  
**Installation:** Standard installer  
**Configuration:**
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**Verification:**
```bash
git --version
# Expected: git version 2.51.0.windows.1
```

---

### 2.4 Java (JDK)

**Required version:** OpenJDK 17.0.19 (Java 17+)  
**Download:** https://adoptium.net/ (Adoptium Eclipse Temurin recommended)  
**Installation:** Standard installer  
**Post-install:**
- Verify installation path
- Set JAVA_HOME environment variable

**Verification:**
```bash
java -version
# Expected: openjdk version "17.0.19" 2026-04-21
echo $env:JAVA_HOME
# Expected: C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot\
```

**Environment variable setup:**
```powershell
# Set JAVA_HOME (replace path if different)
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot\", "User")

# Verify
echo $env:JAVA_HOME
```

---

## PART 3: ANDROID DEVELOPMENT SETUP

### 3.1 Android SDK

**Location:** `C:\Users\[YourUsername]\AppData\Local\Android\Sdk`  
**Installation method:** Android Studio or commandline tools  

**Recommended:** Download Android Studio (includes SDK)  
- Download: https://developer.android.com/studio  
- Installation: Standard installer  
- First launch will prompt SDK setup

**Verification:**
```powershell
# Check SDK exists
Test-Path $env:ANDROID_HOME
# Expected: True

# List installed platforms
ls "$env:ANDROID_HOME\platforms"
# Should show: android-34, android-36, android-36.1
```

**Environment variable setup:**
```powershell
# Set ANDROID_HOME
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\$($env:USERNAME)\AppData\Local\Android\Sdk", "User")

# Verify
echo $env:ANDROID_HOME
# Expected: C:\Users\Pablo\AppData\Local\Android\Sdk
```

---

### 3.2 Android SDK Platforms (Installed)

**For this project, you need:**

| Platform | Status | Version |
|----------|--------|---------|
| android-34 | ✅ REQUIRED | Latest stable |
| android-36 | ✅ INSTALLED | For testing |
| android-36.1 | ✅ INSTALLED | Latest patch |

**To install missing platforms:**
```bash
# Via Android Studio: Tools → SDK Manager → Select platforms
# Or via CLI:
sdkmanager "platforms;android-34"
```

---

### 3.3 Android Build Tools

**Installed versions:**
- 34.0.0 ✅ (REQUIRED for this project)
- 35.0.0 ✅
- 36.0.0 ✅
- 36.1.0 ✅
- 37.0.0 ✅

**Default (used by project):** 34.0.0

**Installation:**
```bash
# Via Android Studio: Tools → SDK Manager → Build Tools
# Or via CLI:
sdkmanager "build-tools;34.0.0"
```

**Verification:**
```powershell
ls "$env:ANDROID_HOME\build-tools"
# Should show: 34.0.0, 35.0.0, etc.
```

---

### 3.4 Gradle

**Version:** 9.3.1 (via gradle-wrapper)  
**Installation:** NOT needed - uses wrapper in project  
**Location:** `/c/AI_PROJECTS/WeatherApp/android/gradle/wrapper/gradle-wrapper.jar`

**How it works:**
- Project includes `./gradlew` (Gradle wrapper)
- First run automatically downloads Gradle 9.3.1
- No manual installation needed

**Verification:**
```bash
cd /c/AI_PROJECTS/WeatherApp/android
./gradlew --version
# Should download and show: Gradle 9.3.1
```

---

### 3.5 Android Platform Tools (adb)

**Version:** 1.0.41  
**Location:** `%ANDROID_HOME%\platform-tools\adb.exe`  
**Installed with:** Android SDK

**Verification:**
```bash
adb version
# Expected: Android Debug Bridge version 1.0.41

# Alternative:
which adb
# Should show path: /c/Users/Pablo/AppData/Local/Android/Sdk/platform-tools/adb
```

**PATH setup (if not automatic):**
```powershell
# Add to PATH
[System.Environment]::SetEnvironmentVariable(
  "PATH",
  "$env:PATH;$env:ANDROID_HOME\platform-tools",
  "User"
)
```

---

## PART 4: REACT NATIVE & PROJECT DEPENDENCIES

### 4.1 React Native

**Project version:** 0.86.0  
**Installation:** Via npm (in project)

**Verification (in project folder):**
```bash
cd /c/AI_PROJECTS/WeatherApp
npm list react-native
# Expected: react-native@0.86.0
```

---

### 4.2 React

**Project version:** 19.2.3  
**Installation:** Via npm (automatic with react-native)

**Verification:**
```bash
npm list react
# Expected: react@19.2.3
```

---

### 4.3 TypeScript

**Project version:** ^5.8.3  
**Installation:** Via npm (in devDependencies)

**Verification:**
```bash
npm list typescript
# Expected: typescript@5.8.3 (or compatible)
```

---

## PART 5: PROJECT SETUP

### Step 1: Clone Repository

```bash
cd /c/AI_PROJECTS
git clone https://github.com/supermamkonto-lab/weather-app.git
cd WeatherApp
```

### Step 2: Install Dependencies

```bash
npm install
# Downloads ~500MB of packages
# Time: ~2-3 minutes
```

### Step 3: Verify Installation

```bash
npm list react-native
npm list react
npm list typescript
```

### Step 4: Build APK

```bash
cd android
./gradlew assembleDebug
# First run: ~1-2 minutes (downloads Gradle)
# Subsequent: ~8 seconds
```

### Step 5: Deploy to Device/Emulator

```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
# APK size: ~45-50MB
# Installation time: ~30 seconds
```

### Step 6: Verify Build Works

```bash
adb logcat
# Should see app starting in logcat
# Look for: "Weather App starting" or similar logs
```

---

## PART 6: ENVIRONMENT VARIABLES (Complete Setup)

### Windows System Properties

**Open:** Settings → System → About → Advanced system settings

**Add these variables:**

| Variable | Value | Type |
|----------|-------|------|
| JAVA_HOME | `C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot\` | System |
| ANDROID_HOME | `C:\Users\[USERNAME]\AppData\Local\Android\Sdk` | System |
| ANDROID_SDK_ROOT | Same as ANDROID_HOME | System |

**Verify in PowerShell:**
```powershell
echo $env:JAVA_HOME
echo $env:ANDROID_HOME
echo $env:ANDROID_SDK_ROOT
```

---

## PART 7: TROUBLESHOOTING

### Build fails: "java: command not found"

**Solution:**
- Set JAVA_HOME correctly
- Add to PATH: `%JAVA_HOME%\bin`
- Restart PowerShell/terminal

```powershell
$env:PATH += ";$env:JAVA_HOME\bin"
```

### Build fails: "Android SDK not found"

**Solution:**
- Set ANDROID_HOME correctly
- Verify SDK folder exists: `Test-Path $env:ANDROID_HOME`
- Download missing platforms: `sdkmanager "platforms;android-34"`

### adb: "device not found"

**Solution:**
- Enable USB debugging on device
- Accept ADB authorization prompt
- Restart adb: `adb kill-server && adb start-server`
- Check connection: `adb devices`

### npm install fails

**Solution:**
- Clear npm cache: `npm cache clean --force`
- Delete node_modules: `rm -r node_modules`
- Reinstall: `npm install`

### Gradle download timeout

**Solution:**
- First build is slow (downloading Gradle)
- Allow 2-3 minutes for first build
- Verify internet connection
- Retry: `./gradlew clean && ./gradlew assembleDebug`

---

## PART 8: EXPECTED RESULTS

### Build Performance

- **First build:** 60-120 seconds (downloads Gradle)
- **Subsequent builds:** ~8 seconds
- **App startup:** ~3 seconds on device

### Successful Build Output

```
BUILD SUCCESSFUL in 8s
...
Optimized APK is at: app/build/outputs/apk/debug/app-debug.apk
```

### Successful Installation

```
app.apk:  ✓ Installed
Performance: 1234 ms (device/emulator model)
```

---

## PART 9: QUICK REFERENCE

### Essential Commands

```bash
# Get project
git clone https://github.com/supermamkonto-lab/weather-app.git

# Install dependencies
npm install

# Build APK
cd android && ./gradlew assembleDebug

# Deploy
adb install -r app/build/outputs/apk/debug/app-debug.apk

# View logs
adb logcat

# Check device connection
adb devices
```

### Key Directories

```
$JAVA_HOME = C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot\
$ANDROID_HOME = C:\Users\[USERNAME]\AppData\Local\Android\Sdk
$PROJECT = /c/AI_PROJECTS/WeatherApp
```

---

## VERIFICATION CHECKLIST

After complete setup, verify:

- [ ] `node --version` → v24.17.0+
- [ ] `npm --version` → 11.13.0+
- [ ] `git --version` → 2.51.0+
- [ ] `java -version` → openjdk 17.0.19+
- [ ] `$env:JAVA_HOME` → C:\Program Files\...
- [ ] `$env:ANDROID_HOME` → C:\Users\...\Android\Sdk
- [ ] Build succeeds: `./gradlew assembleDebug`
- [ ] APK created: `app/build/outputs/apk/debug/app-debug.apk`
- [ ] `adb devices` → shows connected device/emulator
- [ ] `adb install -r app.apk` → succeeds
- [ ] App launches on device

---

## REFERENCE DEVICE

**Motorola Edge 50 Fusion**
- Android API 34 (target)
- Screen: 6.7" AMOLED
- Resolution: 2400 × 1080
- RAM: 12GB
- Storage: 256GB

**Emulator alternative:**
- Create AVD: API 34, Pixel 8 Pro configuration
- RAM: 4GB minimum
- Storage: 2GB minimum

---

**Workstation setup completed!**

**Total time:** 45-60 minutes (first time, including downloads)  
**Maintenance:** ~5 minutes every 6 months (update Android SDK)

**Next:** Read PROJECT_MASTER_MEMORY.md to understand project architecture
