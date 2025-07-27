@echo off
echo WhatsApp Auto Translator Bot by Xsrazy (@xsrazy)
echo.
echo Checking and installing required dependencies...
call npm install
echo.
echo Starting WhatsApp Auto Translator Bot...
echo This bot supports 3 languages that can translate to each other:
echo - Indonesian (id) - Main Language
echo - English (en)
echo - Chinese (zh, zh-CN, zh-TW, zh-HK)
echo.
echo For complete list of commands, type !help in WhatsApp
echo.
echo NOTE: If bot gets TOSBLOCK, it will try to restart automatically.
echo.
node simple-translator-bot.js
pause