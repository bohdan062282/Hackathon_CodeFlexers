const Api = require("node-telegram-bot-api");

const token = "1744774850:AAH1JUhP8w-gO4gz6U16d7KoSvJcG5w-1zA";

const bot = new Api(token, { polling: true });

bot.on("message", (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (text === "/start") {
    bot.sendMessage(chatId, "Welcome to the club nigga");
  }

  if (text === "/info") {
    bot.sendMessage(chatId, "Sorry but your life doesnt matter");
  }

  bot.sendMessage(chatId, `Darova bot ${name}`);
  console.log(msg);
});
