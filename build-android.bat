@echo off
echo ========================================================
echo Solo Leveling College RPG - Native Android Build Setup
echo ========================================================
echo 1. Installing Capacitor Core + Local Notifications plugin...
call npm install @capacitor/core @capacitor/android @capacitor/local-notifications
call npm install --save-dev @capacitor/cli

echo 2. Adding Capacitor Android Platform...
call npx @capacitor/cli add android

echo 3. Syncing Web Assets, Config & Notification Plugin...
call npx @capacitor/cli sync

echo 4. Building Android APK via Android CLI / Studio...
call npx @capacitor/cli open android

echo ========================================================
echo Android Native Build Setup Complete!
echo ========================================================
