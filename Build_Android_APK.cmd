@echo off
setlocal enabledelayedexpansion
title One Corporate - Android APK Builder

echo =======================================================
echo     One Corporate Android Build and Update Tool
echo =======================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "ANDROID_DIR=%SCRIPT_DIR%android"
set "WWW_TARGET=%ANDROID_DIR%\app\src\main\assets\www"

:: Ensure JAVA_HOME is set
if "%JAVA_HOME%"=="" (
    if exist "C:\Program Files\Microsoft\jdk-17.0.20.101-hotspot" (
        set "JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.20.101-hotspot"
    )
)
if not "%JAVA_HOME%"=="" (
    set "PATH=%JAVA_HOME%\bin;%PATH%"
)

:: Ensure ANDROID_HOME is set
if "%ANDROID_HOME%"=="" (
    if exist "C:\onedrive personal files\OneDrive\Apps\sdk" (
        set "ANDROID_HOME=C:\onedrive personal files\OneDrive\Apps\sdk"
    )
)
if not "%ANDROID_HOME%"=="" (
    set "PATH=%ANDROID_HOME%\platform-tools;%PATH%"
)

echo [1/3] Synchronizing latest web files to Android assets...
if not exist "%WWW_TARGET%" mkdir "%WWW_TARGET%"

copy /y "%SCRIPT_DIR%index.html" "%WWW_TARGET%\" >nul
copy /y "%SCRIPT_DIR%app.js" "%WWW_TARGET%\" >nul
copy /y "%SCRIPT_DIR%style.css" "%WWW_TARGET%\" >nul
copy /y "%SCRIPT_DIR%sw.js" "%WWW_TARGET%\" >nul
copy /y "%SCRIPT_DIR%manifest.json" "%WWW_TARGET%\" >nul
copy /y "%SCRIPT_DIR%security.js" "%WWW_TARGET%\" >nul
copy /y "%SCRIPT_DIR%firebase-sync.js" "%WWW_TARGET%\" >nul
copy /y "%SCRIPT_DIR%logo.png" "%WWW_TARGET%\" >nul
copy /y "%SCRIPT_DIR%building maintenance.png" "%WWW_TARGET%\" >nul
copy /y "%SCRIPT_DIR%building_maintenance_icon.ico" "%WWW_TARGET%\" >nul

robocopy "%SCRIPT_DIR%assets" "%WWW_TARGET%\assets" /E /NFL /NDL /NJH /NJS >nul
robocopy "%SCRIPT_DIR%construction_guideline" "%WWW_TARGET%\construction_guideline" /E /NFL /NDL /NJH /NJS >nul
robocopy "%SCRIPT_DIR%emergency_evaluation" "%WWW_TARGET%\emergency_evaluation" /E /NFL /NDL /NJH /NJS >nul
robocopy "%SCRIPT_DIR%inventory" "%WWW_TARGET%\inventory" /E /NFL /NDL /NJH /NJS >nul
robocopy "%SCRIPT_DIR%maintenance_procedure" "%WWW_TARGET%\maintenance_procedure" /E /NFL /NDL /NJH /NJS >nul

echo       Assets synchronized successfully.
echo.

echo [2/3] Building Android APK with Gradle...
cd /d "%ANDROID_DIR%"
call gradlew.bat assembleDebug

if %ERRORLEVEL% equ 0 (
    echo.
    echo =======================================================
    echo [3/3] BUILD SUCCESSFUL!
    echo.
    echo APK Location:
    echo %ANDROID_DIR%\app\build\outputs\apk\debug\app-debug.apk
    echo =======================================================
) else (
    echo.
    echo [!] Build encountered errors. Please check the logs above.
)

echo.
pause
