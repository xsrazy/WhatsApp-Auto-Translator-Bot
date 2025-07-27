const { create, Client } = require('@open-wa/wa-automate');
const qrcode = require('qrcode-terminal');
const translate = require('google-translate-api-x');
const chalk = require('chalk');

// Cloud9 Headless Configuration (No Browser UI)
const CLOUD9_HEADLESS_CONFIG = {
    sessionId: 'wa-translator-bot-cloud9-headless',
    multiDevice: true,
    authTimeout: 300,  // 5 minutes for Cloud9
    qrTimeout: 180,    // 3 minutes for QR
    throwErrorOnTosBlock: false,
    skipUpdateCheck: true,
    headless: true,    // Force headless for Cloud9
    useChrome: false,  // Use bundled Chromium
    chromiumArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-images',
        '--disable-javascript',
        '--virtual-time-budget=5000',
        '--run-all-compositor-stages-before-draw',
        '--memory-pressure-off'
    ],
    // Cloud9 specific settings
    disableSpins: true,
    logConsole: false,
    popup: false,
    qrFormat: 'terminal',
    restartOnCrash: false,  // Don't auto-restart in Cloud9
    killProcessOnBrowserClose: true,
    browserRevision: '1095492'  // Specific Chromium version
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

// Enhanced language detection
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

// Translation function with retry
async function translateText(text, targetLang, retries = 2) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(chalk.blue(`[Cloud9] Translation attempt ${i + 1}/${retries}`));
            
            const result = await translate(text, { to: targetLang });
            
            if (result && result.text) {
                console.log(chalk.green(`[Cloud9] Translation successful`));
                return result.text;
            }
        } catch (error) {
            console.log(chalk.yellow(`[Cloud9] Translation attempt ${i + 1} failed:`, error.message));
            
            if (i === retries - 1) {
                console.log(chalk.red(`[Cloud9] All translation attempts failed`));
                return `[Translation Error] ${text}`;
            }
            
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

// Cloud9 headless startup function
async function startCloud9HeadlessBot() {
    console.log(chalk.cyan('🌩️  Starting WhatsApp Auto Translator Bot for Cloud9 (Headless Mode)...'));
    console.log(chalk.yellow('⚠️  Cloud9 Headless Environment - No browser UI'));
    
    try {
        console.log(chalk.blue('📱 Initializing WhatsApp client with Cloud9 headless configuration...'));
        
        const client = await create(CLOUD9_HEADLESS_CONFIG);
        
        console.log(chalk.green('✅ WhatsApp client initialized successfully!'));
        console.log(chalk.cyan('📱 Please scan the QR code with your WhatsApp Business app'));
        console.log(chalk.yellow('⏰ Extended timeout: 5 minutes for Cloud9 environment'));
        
        // Message handler
        client.onMessage(async (message) => {
            try {
                const chatId = message.chatId;
                const messageBody = message.body;
                
                console.log(chalk.blue(`[Cloud9] Message received: ${messageBody.substring(0, 50)}...`));
                
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
                    const helpText = `🤖 WhatsApp Auto Translator Bot (Cloud9 Headless)

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

⚡ Cloud9 Headless Edition
🔧 Optimized for AWS Cloud9 environment`;
                    
                    await client.sendText(chatId, helpText);
                    return;
                }
                
                // Handle reply translations
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
                console.error(chalk.red('[Cloud9] Error processing message:'), error.message);
            }
        });
        
        // State change handler
        client.onStateChanged((state) => {
            console.log(chalk.blue(`[Cloud9] State changed: ${state}`));
            if (state === 'CONNECTED') {
                console.log(chalk.green('🎉 Cloud9 WhatsApp Auto Translator Bot is ready! (Headless Mode)'));
                console.log(chalk.cyan('💡 Cloud9 Headless Tips:'));
                console.log(chalk.yellow('   • Bot is running in background'));
                console.log(chalk.yellow('   • No browser window will appear'));
                console.log(chalk.yellow('   • Use !help for commands'));
            }
        });
        
        // Error handling
        client.onGlobalParticipantsChanged((event) => {
            console.log(chalk.blue(`[Cloud9] Participants changed:`, event.action));
        });
        
    } catch (error) {
        console.error(chalk.red('❌ Failed to start Cloud9 headless bot:'), error.message);
        console.log(chalk.yellow('💡 Cloud9 Headless Troubleshooting:'));
        console.log(chalk.yellow('   1. Try: node simple-translator-bot.js'));
        console.log(chalk.yellow('   2. Check memory usage in Cloud9'));
        console.log(chalk.yellow('   3. Restart Cloud9 environment'));
        console.log(chalk.yellow('   4. Use local development instead'));
        
        process.exit(1);
    }
}

// Start the Cloud9 headless bot
startCloud9HeadlessBot().catch(error => {
    console.error(chalk.red('💥 Cloud9 Headless Bot startup failed:'), error.message);
    console.log(chalk.yellow('💡 Try using the regular bot: node simple-translator-bot.js'));
    process.exit(1);
});