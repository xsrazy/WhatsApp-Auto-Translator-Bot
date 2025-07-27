# 🤖 WhatsApp Auto Translator Bot

A powerful WhatsApp bot that automatically translates messages between Indonesian, English, and Chinese languages using Google Translate API.

## ✨ Features

- **Multi-directional Translation**: Supports Indonesian ↔ English ↔ Chinese
- **Smart Language Detection**: Automatically detects source language
- **Reply Translation**: Translate messages by replying with language codes
- **Custom Language Settings**: Set default translation language per chat
- **Business Account Support**: Works with WhatsApp Business
- **Anti-Block Features**: Built-in measures to avoid WhatsApp restrictions
- **Terminal Interface**: Clean command-line interface with colored output
- **Cloud9 Support**: Optimized version for AWS Cloud9 environment

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)
- WhatsApp account (Business account recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/xsrazy/WhatsApp-Auto-Translator-Bot.git
   cd WhatsApp-Auto-Translator-Bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the bot**

   **For Local Development (Recommended):**
   ```bash
   # Windows
   run-bot.bat
   
   # Linux/Mac
   chmod +x run-bot.sh
   ./run-bot.sh
   
   # Or directly with Node.js
   node simple-translator-bot.js
   ```

   **For AWS Cloud9:**
   ```bash
   # Make script executable
   chmod +x run-cloud9.sh
   
   # Run Cloud9 optimized version
   ./run-cloud9.sh
   
   # Or directly
   node cloud9-translator-bot.js
   ```

4. **Scan QR Code**
   - Open WhatsApp on your phone
   - Go to Settings > Linked Devices
   - Scan the QR code displayed in terminal

## 🌩️ Cloud9 Support

This bot includes special support for AWS Cloud9 environment:

- **Optimized Configuration**: Extended timeouts and Cloud9-specific settings
- **Enhanced Error Handling**: Better handling of cloud environment limitations
- **Detailed Setup Guide**: See [`cloud9-setup.md`](cloud9-setup.md) for complete instructions
- **Troubleshooting**: Comprehensive solutions for common Cloud9 issues

### Cloud9 Quick Start
```bash
# Run the Cloud9 optimized version
./run-cloud9.sh
```

**⚠️ Important:** Cloud9 uses datacenter IPs which WhatsApp may block. For best results, consider using:
- VPN with residential IP
- Proxy services
- Local development environment

See [`cloud9-setup.md`](cloud9-setup.md) for detailed solutions and workarounds.

## 📱 Usage

### Translation Commands

- `!translate en Hello world` - Translate to English
- `!translate id How are you?` - Translate to Indonesian
- `!translate zh 你好` - Translate to Chinese

### Language Settings

- `!setlang en` - Set default language to English
- `!setlang id` - Set default language to Indonesian
- `!setlang zh` - Set default language to Chinese

### Reply Translation

1. Reply to any message
2. Type `!<language-code>` (e.g., `!en`, `!id`, `!zh`)
3. The bot will translate the original message

### Help Command

- `!help` - Display all available commands

## 🌐 Supported Languages

| Code | Language |
|------|----------|
| `en` | English |
| `id` | Indonesian |
| `zh` | Chinese (Simplified) |
| `zh-tw` | Chinese (Traditional) |
| `zh-cn` | Chinese (Simplified) |

## ⚙️ Configuration

The bot uses optimized settings for stability and anti-detection:

- **MultiDevice Support**: Compatible with WhatsApp's new multi-device feature
- **Extended Timeouts**: Configured for stable connections
- **Anti-Block Measures**: Reduces risk of account restrictions
- **Session Management**: Maintains login state between restarts
- **Cloud9 Optimization**: Special configuration for cloud environments

## 🛡️ Anti-Block Features

- Random user agents
- Optimized request timing
- Session persistence
- Error handling and recovery
- Compatible with WhatsApp Business
- Cloud environment detection

## 🔧 Troubleshooting

### Common Issues

1. **QR Code not appearing**
   - Ensure terminal supports image display
   - Try running in different terminal
   - Check internet connection

2. **Authentication timeout**
   - Use WhatsApp Business account
   - Ensure stable internet connection
   - Try scanning QR code faster
   - For Cloud9: Consider using VPN/proxy

3. **Translation errors**
   - Check internet connection
   - Verify Google Translate API access
   - Try shorter text messages

4. **Bot disconnects frequently**
   - Use stable internet connection
   - Avoid running multiple WhatsApp sessions
   - Consider using VPS for 24/7 operation

5. **Cloud9 Specific Issues**
   - See [`cloud9-setup.md`](cloud9-setup.md) for detailed solutions
   - Consider using residential proxy
   - Try different AWS regions

## 📋 Requirements

- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher
- **Memory**: Minimum 512MB RAM (1GB for Cloud9)
- **Internet**: Stable broadband connection
- **WhatsApp**: Personal or Business account

### Cloud9 Additional Requirements
- AWS Cloud9 environment
- Sufficient instance resources (t3.medium recommended)
- Optional: VPN/Proxy service for better success rate

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

- Use this bot responsibly and in accordance with WhatsApp's Terms of Service
- This bot is for educational and personal use only
- The developers are not responsible for any misuse or account restrictions
- Always respect privacy and obtain consent before translating messages
- Cloud9 usage may have additional limitations due to datacenter IP restrictions

## 👨‍💻 Author

**Xsrazy** ([@xsrazy](https://github.com/xsrazy))

## 🙏 Acknowledgments

- [open-wa/wa-automate](https://github.com/open-wa/wa-automate) - WhatsApp automation library
- [google-translate-api-x](https://github.com/AidanWelch/google-translate-api) - Google Translate API
- [qrcode-terminal](https://github.com/gtanner/qrcode-terminal) - QR code display in terminal

---

⭐ **Star this repository if you find it helpful!**

## 💰 You can help me by Donating
  [![BuyMeACoffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=plastic&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/xsrazy) [![PayPal](https://img.shields.io/badge/PayPal-00457C?style=plastic&logo=paypal&logoColor=white)](https://paypal.me/xsrazy) [![Patreon](https://img.shields.io/badge/Patreon-F96854?style=plastic&logo=patreon&logoColor=white)](https://patreon.com/Xsrazy) [![Ko-Fi](https://img.shields.io/badge/Ko--fi-F16061?style=plastic&logo=ko-fi&logoColor=white)](https://ko-fi.com/xsrazy)