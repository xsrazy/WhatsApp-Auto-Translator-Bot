#!/bin/bash
echo "WhatsApp Auto Translator Bot by Xsrazy (@xsrazy)"
echo ""
echo "Memeriksa dan menginstall dependensi yang diperlukan..."
npm install
echo ""
echo "Memulai WhatsApp Auto Translator Bot..."
echo "Bot ini mendukung 3 bahasa yang dapat saling menerjemahkan:"
echo "- Bahasa Indonesia (id) - Bahasa Utama"
echo "- Bahasa Inggris (en)"
echo "- Bahasa Cina (zh, zh-CN, zh-TW, zh-HK)"
echo ""
echo "Untuk daftar lengkap perintah, ketik !help di WhatsApp"
echo ""
echo "CATATAN: Jika bot terkena TOSBLOCK, bot akan mencoba restart secara otomatis."
echo ""
node simple-translator-bot.js