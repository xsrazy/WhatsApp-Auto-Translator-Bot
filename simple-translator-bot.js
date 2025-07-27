#!/usr/bin/env node

/**
 * WhatsApp Auto Translator Bot
 * Created by Xsrazy (@xsrazy)
 * GitHub: https://github.com/xsrazy/WhatsApp-Auto-Translator-Bot
 */

const qrcode = require('qrcode-terminal');
const { create, ev } = require('@open-wa/wa-automate');
const translate = require('google-translate-api-x');
const chalk = require('chalk');
const randomUseragent = require('random-useragent');

// Configuration
const config = {
  defaultTargetLang: 'id', // Indonesian as default
  showOriginal: true
};

// Supported languages
const supportedLanguages = {
  'id': 'Indonesian',
  'en': 'English',
  'zh': 'Chinese'
};

// Chinese variants
const chineseVariants = {
  'zh': 'Chinese (Auto)',
  'zh-CN': 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)',
  'zh-HK': 'Chinese (Hong Kong)'
};

// Map to store user language preferences
const userLanguagePrefs = new Map();

// Print banner
console.log(chalk.green('='.repeat(50)));
console.log(chalk.green.bold('WhatsApp Auto Translator Bot'));
console.log(chalk.green('='.repeat(50)));
console.log(chalk.yellow('Default target language:'), chalk.white(config.defaultTargetLang));
console.log(chalk.yellow('Supported languages:'), chalk.white('Indonesian, English, Chinese'));
console.log(chalk.green('='.repeat(50)));

// Translate text using Google Translate API
async function translateText(text, targetLang, sourceLang = null) {
  try {
    // If source language is not provided, let Google Translate detect it
    if (!sourceLang) {
      sourceLang = 'auto';
    }
    
    // Use Google Translate API with forceTo option for all languages to ensure compatibility
    const options = {
      from: sourceLang,
      to: targetLang,
      forceTo: true, // Force target language for all translations
      forceFrom: sourceLang !== 'auto' // Force source language if specified
    };
    
    const result = await translate(text, options);

    // Skip if source and target languages are the same
    if (result.from.language.iso === targetLang) {
      return {
        translatedText: text,
        sourceLang: result.from.language.iso,
        targetLang: targetLang,
        translated: false
      };
    }

    return {
      translatedText: result.text,
      sourceLang: result.from.language.iso,
      targetLang: targetLang,
      translated: true
    };
  } catch (error) {
    console.error(chalk.red('Translation error:'), error.message);
    return { 
      translatedText: text, 
      sourceLang: 'unknown',
      targetLang: targetLang,
      translated: false,
      error: error.message
    };
  }
}

// Format translated message
function formatTranslatedMessage(original, translation, showOriginal = true) {
  const sourceLangName = supportedLanguages[translation.sourceLang] || 
                         chineseVariants[translation.sourceLang] || 
                         translation.sourceLang;
  
  const targetLangName = supportedLanguages[translation.targetLang] || 
                         chineseVariants[translation.targetLang] || 
                         translation.targetLang;
  
  if (translation.error) {
    return `❌ Translation error: ${translation.error}`;
  }
  
  if (!translation.translated) {
    return `ℹ️ Message is already in ${targetLangName}`;
  }
  
  if (showOriginal) {
    return `🔄 *${sourceLangName} → ${targetLangName}*\n\n` +
           `*Original:* ${original}\n\n` +
           `*Translation:* ${translation.translatedText}`;
  } else {
    return `🔄 *${sourceLangName} → ${targetLangName}*\n\n` +
           `${translation.translatedText}`;
  }
}

// Generate help message
function generateHelpMessage() {
  let helpMessage = '*WhatsApp Auto Translator Bot Commands:*\n\n';
  helpMessage += '!translate <text> [target-lang] - Translate text to target language\n';
  helpMessage += '!t <text> [target-lang] - Short form of translate command\n';
  helpMessage += '!setlang <lang-code> - Set your preferred target language\n';
  helpMessage += '!help - Show this help message\n\n';
  
  helpMessage += '*Reply Translation:*\n';
  helpMessage += 'Reply to any message with !<lang-code> to translate it\n';
  helpMessage += 'Example: Reply with !id to translate to Indonesian\n\n';
  
  helpMessage += '*Multi-Directional Translation:*\n';
  helpMessage += 'All languages can translate to and from each other\n';
  helpMessage += 'Example: Indonesian → English, English → Chinese, Chinese → Indonesian\n\n';
  
  helpMessage += '*Supported Languages:*\n';
  helpMessage += '!id = Indonesian (Default)\n';
  helpMessage += '!en = English\n';
  
  helpMessage += '\n*Chinese Variants:*\n';
  for (const [code, name] of Object.entries(chineseVariants)) {
    helpMessage += `!${code} = ${name}\n`;
  }
  
  return helpMessage;
}

// Generate a random user agent
function getRandomUserAgent() {
  return randomUseragent.getRandom(ua => {
    return ua.browserName === 'Chrome' && parseFloat(ua.browserVersion) >= 80;
  });
}

// Handle TOS block with retry mechanism
async function handleTosBlock(error, retryCount = 0, maxRetries = 3) {
  if (retryCount >= maxRetries) {
    console.error(chalk.red('Maximum retry attempts reached. Could not bypass TOS block.'));
    console.error(chalk.yellow('Suggestions:'));
    console.error(chalk.yellow('1. Try using a different WhatsApp account'));
    console.error(chalk.yellow('2. Wait for a few hours before trying again'));
    console.error(chalk.yellow('3. Make sure you\'re using the latest version of @open-wa/wa-automate'));
    process.exit(1);
  }
  
  console.log(chalk.yellow(`TOS block detected. Retrying... (Attempt ${retryCount + 1}/${maxRetries})`));
  
  // Wait for a random time between 5-15 seconds before retrying
  const waitTime = Math.floor(Math.random() * 10000) + 5000;
  console.log(chalk.yellow(`Waiting for ${waitTime/1000} seconds before retry...`));
  await new Promise(resolve => setTimeout(resolve, waitTime));
  
  // Try again with a new user agent
  await startBot(retryCount + 1);
}

// Start the bot
async function startBot(retryCount = 0) {
  console.log(chalk.yellow('Starting WhatsApp Bot...'));
  console.log(chalk.yellow('This may take a moment. Please wait...'));
  
  try {
    // Generate a random user agent
    const userAgent = getRandomUserAgent();
    console.log(chalk.blue('Using user agent:'), chalk.gray(userAgent));
    // Create a new client with stable minimal configuration
    const client = await create({
      sessionId: 'wa-translator-bot',
      multiDevice: true,
      authTimeout: 60,
      qrTimeout: 30,
      throwErrorOnTosBlock: false,
      skipUpdateCheck: true,
      headless: true, // Use headless for better stability
      useChrome: false // Use bundled chromium for consistency
    });
    
    console.log(chalk.green('WhatsApp Auto Translator Bot is ready!'));
    console.log(chalk.yellow('Commands:'));
    console.log(chalk.white('  !translate <text> [target-lang] - Translate text to target language'));
    console.log(chalk.white('  !setlang <lang-code> - Set your preferred target language'));
    console.log(chalk.white('  !help - Show available commands and language codes'));
    console.log(chalk.white('  Reply to a message with !<lang-code> - Translate the message to that language'));
    
    // Message handler
    client.onMessage(async (message) => {
      try {
        // Ignore messages from yourself
        if (message.fromMe) return;
        
        const text = message.body.trim();
        const sender = message.from;
        
        // Process commands
        if (text.startsWith('!translate') || text.startsWith('!t')) {
          const parts = text.split(' ');
          
          if (parts.length < 2) {
            await client.reply(message.from, 'Usage: !translate <text> [target-lang]', message.id);
            return;
          }
          
          let targetLang = userLanguagePrefs.get(sender) || config.defaultTargetLang;
          let textToTranslate = '';
          
          // Check if the last part is a valid language code
          const lastPart = parts[parts.length - 1].toLowerCase();
          if (supportedLanguages[lastPart] || chineseVariants[lastPart]) {
            targetLang = lastPart;
            textToTranslate = parts.slice(1, parts.length - 1).join(' ');
          } else {
            textToTranslate = parts.slice(1).join(' ');
          }
          
          const translation = await translateText(textToTranslate, targetLang);
          const formattedMessage = formatTranslatedMessage(textToTranslate, translation, config.showOriginal);
          await client.reply(message.from, formattedMessage, message.id);
          return;
        }
        
        if (text.startsWith('!setlang')) {
          const parts = text.split(' ');
          
          if (parts.length !== 2) {
            await client.reply(message.from, 'Usage: !setlang <lang-code>', message.id);
            return;
          }
          
          const langCode = parts[1].toLowerCase();
          if (!supportedLanguages[langCode] && !chineseVariants[langCode]) {
            await client.reply(message.from, `Invalid language code. Supported codes: id, en, zh, zh-CN, zh-TW, zh-HK`, message.id);
            return;
          }
          
          userLanguagePrefs.set(sender, langCode);
          const langName = supportedLanguages[langCode] || chineseVariants[langCode];
          await client.reply(message.from, `Your preferred language has been set to ${langName} (${langCode}).`, message.id);
          return;
        }
        
        if (text === '!help') {
          const helpMessage = generateHelpMessage();
          await client.reply(message.from, helpMessage, message.id);
          return;
        }
        
        // Check if this is a reply with a language command
        if (message.quotedMsg && /^!([a-z]{2}(-[A-Z]{2})?)$/i.test(text)) {
          const match = text.match(/^!([a-z]{2}(-[A-Z]{2})?)$/i);
          const targetLang = match[1].toLowerCase();
          
          // Validate the language code
          if (!supportedLanguages[targetLang] && !chineseVariants[targetLang]) {
            await client.reply(message.from, `Invalid language code. Supported codes: id, en, zh, zh-CN, zh-TW, zh-HK`, message.id);
            return;
          }
          
          // Get the quoted message
          const originalText = message.quotedMsg.body;
          
          // Skip empty messages
          if (!originalText) {
            await client.reply(message.from, 'The quoted message has no text to translate.', message.id);
            return;
          }
          
          // Translate the original message
          const translation = await translateText(originalText, targetLang);
          
          // Reply with the translation
          const formattedMessage = formatTranslatedMessage(originalText, translation, config.showOriginal);
          await client.reply(message.from, formattedMessage, message.id);
          return;
        }
      } catch (error) {
        console.error(chalk.red('Error processing message:'), error);
      }
    });
    
    // Handle process termination
    process.on('SIGINT', async () => {
      console.log(chalk.yellow('\nShutting down...'));
      await client.kill();
      process.exit(0);
    });
  } catch (error) {
    console.error(chalk.red('Error starting bot:'), error);
    
    // Check if the error is a TOS block
    if (error.message && error.message.includes('TOSBLOCK')) {
      console.log(chalk.yellow('WhatsApp TOS block detected.'));
      await handleTosBlock(error, retryCount);
    } else {
      // For other errors, exit with error code
      process.exit(1);
    }
  }
}

// Listen for TOS block events
ev.on('TOSBLOCK', async () => {
  console.log(chalk.red('TOS block detected during operation.'));
  console.log(chalk.yellow('Attempting to restart the bot...'));
  
  // Wait for a random time between 5-15 seconds before restarting
  const waitTime = Math.floor(Math.random() * 10000) + 5000;
  console.log(chalk.yellow(`Waiting for ${waitTime/1000} seconds before restart...`));
  await new Promise(resolve => setTimeout(resolve, waitTime));
  
  // Restart the bot
  startBot(0);
});

// Start the bot
startBot();