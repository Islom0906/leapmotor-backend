const TelegramBot = require('node-telegram-bot-api');
const token = '6443379325:AAFgjBLk7kd4KLk3Hi9K_cMHVVOiw5jldn4';
const bot = new TelegramBot(token, {polling: true});

module.exports=bot