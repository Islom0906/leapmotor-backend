const TelegramBot = require('node-telegram-bot-api');
const token = '6566600894:AAHpEPDYw_67w4--RNBtHs-GxOeLyrTwZN8';
const bot = new TelegramBot(token, {polling: true});

module.exports=bot