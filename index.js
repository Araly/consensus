const discord = require('discord.js');
const bot = new discord.Client();

bot.login('NDg2NjMxMjIyNzY0NjM0MTMy.DubhIw.onp7Xgjc3DABRQR6yE0CbeBAoRs');

bot.on('message', (message) => {
    if(message.content == "ping") {
        message.reply("pong");
    }
});
