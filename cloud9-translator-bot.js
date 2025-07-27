const { create, Client } = require('@open-wa/wa-automate');
const qrcode = require('qrcode-terminal');
const translate = require('google-translate-api-x');
const chalk = require('chalk');

// Cloud9-specific configuration
const CLOUD9_CONFIG = {
    sessionId: 'wa-translator-bot-cloud9',
    multiDevice: true,
    authTimeout: 180,  // Extended timeout for cloud environment
    qrTimeout: 120,    // Extended QR timeout
    throwErrorOnTosBlock: false,
    skipUpdateCheck: true,
    headless: false,   // Non-headless for Cloud9
    useChrome: true,   // Force Chrome usage
    chromiumArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--remote-debugging-port=9222',
        '--remote-debugging-address=0.0.0.0',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    ],
    // Cloud9 specific settings
    disableSpins: true,
    logConsole: false,
    popup: false,
    qrFormat: 'terminal',
    restartOnCrash: true,
    killProcessOnBrowserClose: true
};

// Language settings
let userLanguageSettings = {};
const supportedLanguages = {
    'en': 'English',
    'id': 'Indonesian', 
    'zh': 'Chinese (Simplified)',
    'zh-tw': 'Chinese (Traditional)',
    'zh-cn': 'Chinese (Simplified)'
};

// Enhanced language detection for Cloud9
function detectLanguage(text) {
    // Indonesian patterns
    if (/\b(saya|anda|dengan|untuk|dari|yang|ini|itu|adalah|akan|sudah|belum|tidak|bisa|harus|mau|ingin)\b/i.test(text)) {
        return 'id';
    }
    
    // Chinese patterns
    if (/[\u4e00-\u9fff]/.test(text)) {
        return /[\u4e00-\u9fff]{2,}/.test(text) ? 'zh' : 'zh';
    }
    
    // Default to English
    return 'en';
}

// Enhanced translation function for Cloud9
async function translateText(text, targetLang, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(chalk.blue(`[Cloud9] Translation attempt ${i + 1}/${retries}`));
            
            const result = await translate(text, { to: targetLang });
            
            if (result && result.text) {
                console.log(chalk.green(`[Cloud9] Translation successful: ${text} -> ${result.text}`));
                return result.text;
            }
        } catch (error) {
            console.log(chalk.yellow(`[Cloud9] Translation attempt ${i + 1} failed:`, error.message));
            
            if (i === retries - 1) {
                console.log(chalk.red(`[Cloud9] All translation attempts failed`));
                return `[Translation Error] ${text}`;
            }
            
            // Wait before retry (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
    }
}

// Cloud9 startup function
async function startCloud9Bot() {
    console.log(chalk.cyan('🌩️  Starting WhatsApp Auto Translator Bot for Cloud9...'));
    console.log(chalk.yellow('⚠️  Cloud9 Environment Detected - Using optimized settings'));
    
    try {
        console.log(chalk.blue('📱 Initializing WhatsApp client with Cloud9 configuration...'));
        
        const client = await create(CLOUD9_CONFIG);
        
        console.log(chalk.green('✅ WhatsApp client initialized successfully!'));
        console.log(chalk.cyan('📱 Please scan the QR code with your WhatsApp Business app'));
        console.log(chalk.yellow('⏰ Extended timeout: 3 minutes for Cloud9 environment'));
        
        // Enhanced message handler for Cloud9
        client.onMessage(async (message) => {
            try {
                const chatId = message.chatId;
                const messageBody = message.body;
                const isGroup = message.isGroupMsg;
                
                console.log(chalk.blue(`[Cloud9] Message received: ${messageBody}`));
                
                // Handle translation commands
                if (messageBody.startsWith('!translate ')) {
                    const parts = messageBody.split(' ');
                    if (parts.length >= 3) {
                        const targetLang = parts[1];
                        const textToTranslate = parts.slice(2).join(' ');
                        
                        if (supportedLanguages[targetLang]) {
                            console.log(chalk.blue(`[Cloud9] Translating to ${supportedLanguages[targetLang]}`));
                            const translatedText = await translateText(textToTranslate, targetLang);
                            await client.sendText(chatId, `🌐 Translation (${supportedLanguages[targetLang]}):\n${translatedText}`);
                        } else {
                            await client.sendText(chatId, '❌ Unsupported language. Use: en, id, zh, zh-tw, zh-cn');
                        }
                    }
                    return;
                }
                
                // Handle language setting commands
                if (messageBody.startsWith('!setlang ')) {
                    const targetLang = messageBody.split(' ')[1];
                    if (supportedLanguages[targetLang]) {
                        userLanguageSettings[chatId] = targetLang;
                        await client.sendText(chatId, `✅ Default language set to ${supportedLanguages[targetLang]}`);
                    } else {
                        await client.sendText(chatId, '❌ Unsupported language. Use: en, id, zh, zh-tw, zh-cn');
                    }
                    return;
                }
                
                // Handle help command
                if (messageBody === '!help') {
                    const helpText = `🤖 WhatsApp Auto Translator Bot (Cloud9 Edition)

📝 Commands:
• !translate <lang> <text> - Translate text
• !setlang <lang> - Set default language
• !help - Show this help

🌐 Supported Languages:
• en - English
• id - Indonesian  
• zh - Chinese (Simplified)
• zh-tw - Chinese (Traditional)
• zh-cn - Chinese (Simplified)

💡 Examples:
• !translate en Halo dunia
• !translate id Hello world
• !setlang en

⚡ Cloud9 Optimized Version
🔧 Enhanced for AWS Cloud9 environment`;
                    
                    await client.sendText(chatId, helpText);
                    return;
                }
                
                // Handle reply translations (Cloud9 optimized)
                if (message.quotedMsg && messageBody.startsWith('!')) {
                    const targetLang = messageBody.substring(1);
                    if (supportedLanguages[targetLang]) {
                        const quotedText = message.quotedMsg.body;
                        console.log(chalk.blue(`[Cloud9] Reply translation to ${supportedLanguages[targetLang]}`));
                        const translatedText = await translateText(quotedText, targetLang);
                        await client.sendText(chatId, `🌐 Translation (${supportedLanguages[targetLang]}):\n${translatedText}`);
                    }
                    return;
                }
                
            } catch (error) {
                console.error(chalk.red('[Cloud9] Error processing message:'), error);
            }
        });
        
        // Enhanced ready handler for Cloud9
        client.onStateChanged((state) => {
            console.log(chalk.blue(`[Cloud9] State changed: ${state}`));
            if (state === 'CONNECTED') {
                console.log(chalk.green('🎉 Cloud9 WhatsApp Auto Translator Bot is ready!'));
                console.log(chalk.cyan('💡 Cloud9 Tips:'));
                console.log(chalk.yellow('   • Keep this terminal tab open'));
                console.log(chalk.yellow('   • Monitor for any disconnections'));
                console.log(chalk.yellow('   • Use !help for commands'));
            }
        });
        
        // Cloud9 specific error handling
        client.onGlobalParticipantsChanged((event) => {
            console.log(chalk.blue(`[Cloud9] Participants changed:`, event));
        });
        
    } catch (error) {
        console.error(chalk.red('❌ Failed to start Cloud9 bot:'), error);
        console.log(chalk.yellow('💡 Cloud9 Troubleshooting:'));
        console.log(chalk.yellow('   1. Check if port 9222 is available'));
        console.log(chalk.yellow('   2. Ensure sufficient memory/CPU'));
        console.log(chalk.yellow('   3. Try restarting the Cloud9 environment'));
        console.log(chalk.yellow('   4. Consider using a VPN/proxy service'));
        
        process.exit(1);
    }
}

// Start the Cloud9 bot
startCloud9Bot().catch(error => {
    console.error(chalk.red('💥 Cloud9 Bot startup failed:'), error);
    process.exit(1);
});