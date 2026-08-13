@echo off
echo ========================================================
echo Solo Leveling College RPG - Native Android Build Setup
echo ========================================================
echo 1. Adding Capacitor Android Platform...
call npx @capacitor/cli add android

echo 2. Syncing Web Assets & Config...
call npx @capacitor/cli sync

echo 3. Building Android APK via Android CLI / Studio...
call npx @capacitor/cli open android

echo ========================================================
echo Android Native Build Setup Complete!
echo ========================================================
