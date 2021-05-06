const Api = require("node-telegram-bot-api");
const token = "1744774850:AAH1JUhP8w-gO4gz6U16d7KoSvJcG5w-1zA";
const bot = new Api(token, { polling: true });

const { keyboard_options } = require("./options.js");

let language = "en";
let questionnaireResponse = [];

const start = () => {
  bot.setMyCommands([
    {
      command: "/start",
      description: "Start bot",
    },
    {
      command: "/questionnaire",
      description: "Start questionnaire",
    },
    {
      command: "/language",
      description: "Choose language [EN/RU]",
    },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      questionnaireResponse =
        questionnaireResponse.length === 84 ? [] : questionnaireResponse;

      return bot.sendMessage(
        chatId,
        "Welcome to the CodeFlexers social support bot. \nIt will help you to deal with your professional burnout problems. \nAfter a short test you will receive information about your burnout state and will receive advice to handle the situation."
      );
    }

    if (text === "/questionnaire") {
      return bot.sendMessage(
        chatId,
        "1. QuestionQuestionQuestionQuestionQuestionQuestion",
        keyboard_options
      );
    }

    if (text === "/language") {
    }

    return bot.sendMessage(chatId, "Wrong command, try again!");
  });

  bot.on("callback_query", async (msg) => {
    const chatId = msg.message.chat.id;
    const data = msg.data;

    if (msg.data === "no") {
      return bot.sendMessage(chatId, "You clicked on No");
    }

    if (msg.data === "yes") {
      return bot.sendMessage(chatId, "You clicked on Yes");
    }
  });
};

start();
