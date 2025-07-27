# WhatsApp Auto Translator Bot

A simple WhatsApp bot that translates messages between Indonesian, English, and Chinese.

## Author

Created by Xsrazy  
GitHub: [@xsrazy](https://github.com/xsrazy)  
Repository: [WhatsApp Auto Translator Bot](https://github.com/xsrazy/WhatsApp-Auto-Translator-Bot)

## Features

- **Main Language**: Indonesian
- **Additional Languages**: 
  - English
  - Chinese (with variants: Auto, Simplified, Traditional, Hong Kong)
- **Multi-Directional Translation**: All languages can translate to and from each other
- **Simple Commands**: Easy-to-use commands for translation
- **User Preferences**: Set your preferred target language for translations
- **QR Code Login**: Login to WhatsApp Web using a QR code

## Installation

1. Make sure you have [Node.js](https://nodejs.org/) installed
2. Clone this repository or download the files
3. Install dependencies:

```bash
npm install
```

## Usage

### Starting the Bot

#### Windows
```
run-bot.bat
```

#### Linux/Mac
```bash
chmod +x run-bot.sh
./run-bot.sh
```

### Commands

- `!translate <text> [language-code]` - Translate text to target language
- `!t <text> [language-code]` - Short form of translate command
- `!setlang <language-code>` - Set your preferred target language
- `!help` - Show help message with available commands and language codes

### Reply Translation

Reply to any message with `!<language-code>` to translate it.

Example: Reply with `!en` to translate to English

## Supported Languages

### Language Codes
- `id` = Indonesian (Default)
- `en` = English

### Chinese Variants
- `zh` = Chinese (Auto)
- `zh-CN` = Chinese (Simplified)
- `zh-TW` = Chinese (Traditional)
- `zh-HK` = Chinese (Hong Kong)

## Anti-Block Features

This bot includes mechanisms to avoid and handle WhatsApp's Terms of Service blocks (TOSBLOCK):

- **Auto-Retry**: Automatically retries connection when a TOS block is detected
- **Random User Agents**: Uses different browser fingerprints to avoid detection
- **Built-in Stealth**: Uses @open-wa/wa-automate's built-in anti-detection features
- **Session Randomization**: Creates unique session IDs to prevent tracking
- **Non-Headless Mode**: Uses visible browser to appear more human-like

If you encounter a TOSBLOCK error, the bot will automatically attempt to reconnect with different settings.

## Dependencies

- [@open-wa/wa-automate](https://github.com/open-wa/wa-automate-nodejs): WhatsApp Web automation
- [google-translate-api-x](https://github.com/AidanWelch/google-translate-api): Google Translate API
- [qrcode-terminal](https://github.com/gtanner/qrcode-terminal): QR code generation in terminal
- [chalk](https://github.com/chalk/chalk): Terminal text styling
- [random-useragent](https://github.com/skratchdot/random-useragent): Generates random user agents

## License

MIT

---

## 💰 You can help me by Donating
  [![BuyMeACoffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=plastic&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/xsrazy) [![PayPal](https://img.shields.io/badge/PayPal-00457C?style=plastic&logo=paypal&logoColor=white)](https://paypal.me/xsrazy) [![Patreon](https://img.shields.io/badge/Patreon-F96854?style=plastic&logo=patreon&logoColor=white)](https://patreon.com/Xsrazy) [![Ko-Fi](https://img.shields.io/badge/Ko--fi-F16061?style=plastic&logo=ko-fi&logoColor=white)](https://ko-fi.com/xsrazy)