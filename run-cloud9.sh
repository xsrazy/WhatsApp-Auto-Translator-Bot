#!/bin/bash

# WhatsApp Auto Translator Bot - Cloud9 Runner
# Author: Xsrazy (@xsrazy)

echo "🌩️  WhatsApp Auto Translator Bot - Cloud9 Edition"
echo "================================================"

# Check if running in Cloud9
if [ -n "$C9_USER" ]; then
    echo "✅ Cloud9 environment detected"
    echo "⚠️  Warning: Cloud9 uses datacenter IP which may be blocked by WhatsApp"
else
    echo "❌ Not running in Cloud9 environment"
    echo "💡 Consider using simple-translator-bot.js for local development"
fi

# Check Node.js version
NODE_VERSION=$(node --version 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Node.js version: $NODE_VERSION"
else
    echo "❌ Node.js not found. Installing..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Check npm
NPM_VERSION=$(npm --version 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ npm version: $NPM_VERSION"
else
    echo "❌ npm not found"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Dependencies installed successfully"
    else
        echo "❌ Failed to install dependencies"
        exit 1
    fi
else
    echo "✅ Dependencies already installed"
fi

# Check for Cloud9-specific dependencies
echo "🔧 Installing Cloud9-specific packages..."
sudo apt-get update -qq
sudo apt-get install -y -qq \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    wget > /dev/null 2>&1

echo "✅ Cloud9 dependencies installed"

# Kill any existing Chrome processes
echo "🧹 Cleaning up existing browser processes..."
pkill -f chrome > /dev/null 2>&1
pkill -f chromium > /dev/null 2>&1

# Clear browser cache
rm -rf ~/.cache/google-chrome > /dev/null 2>&1
rm -rf ~/.config/google-chrome > /dev/null 2>&1

# Set memory limit for Node.js
export NODE_OPTIONS="--max-old-space-size=1024"

echo ""
echo "🚀 Starting WhatsApp Auto Translator Bot (Cloud9 Edition)..."
echo ""
echo "📱 Cloud9 Tips:"
echo "   • Use WhatsApp Business for better compatibility"
echo "   • Consider using VPN/proxy for residential IP"
echo "   • Keep this terminal open while bot is running"
echo "   • Monitor memory usage in Cloud9 dashboard"
echo ""
echo "🌐 For better success rate, check cloud9-setup.md"
echo ""

# Start the Cloud9 bot
node cloud9-translator-bot.js

# Check exit code
if [ $? -eq 0 ]; then
    echo "✅ Bot stopped successfully"
else
    echo "❌ Bot stopped with error"
    echo "💡 Check cloud9-setup.md for troubleshooting"
fi