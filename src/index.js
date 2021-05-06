const Api = require("node-telegram-bot-api");
const token = "1744774850:AAH1JUhP8w-gO4gz6U16d7KoSvJcG5w-1zA";
const bot = new Api(token, { polling: true });

const { keyboard_options, language_options } = require("./options.js");
const { QUESTIONS_SETTINGS } = require("./constants/questions.js");
const {
  WELCOME_TEXT,
  WRONG_COMMAND,
  START_COMMAND,
  LANGUAGE_COMMAND,
  QUESTIONNAIRE_COMMAND,
  LANG_EN,
  LANG_RU,
  CHOOSE_LANGUAGE_TEXT,
} = require("./constants/common");
const { TRANSLATION } = require("./i18n");

let language = "lang_en";
let questionnaireResponse = [];

const start = () => {
  bot.setMyCommands([
    {
      command: START_COMMAND,
      description: "Start bot",
    },
    {
      command: QUESTIONNAIRE_COMMAND,
      description: "Start questionnaire",
    },
    {
      command: LANGUAGE_COMMAND,
      description: "Choose language [EN/RU]",
    },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const question = `${questionnaireResponse.length + 1}. ${
      TRANSLATION[language].questions[questionnaireResponse.length].text
    }`;

    switch (text) {
      case START_COMMAND: {
        questionnaireResponse = [];
        return bot.sendMessage(chatId, WELCOME_TEXT);
      }
      case QUESTIONNAIRE_COMMAND: {
        return bot.sendMessage(chatId, question, keyboard_options);
      }
      case LANGUAGE_COMMAND: {
        return bot.sendMessage(chatId, CHOOSE_LANGUAGE_TEXT, language_options);
      }
      default: {
        return bot.sendMessage(chatId, WRONG_COMMAND);
      }
    }
  });

  bot.on("callback_query", async (msg) => {
    const chatId = msg.message.chat.id;
    const data = msg.data;

    switch (data) {
      case "no":
        {
          setAnswer(data);
          if (questionnaireResponse.length !== 5) {
            sendNewQuestions(chatId);
          } else {
            console.log(questionnaireResponse);
          }
        }
        break;
      case "yes":
        {
          setAnswer(data);
          if (questionnaireResponse.length !== 5) {
            sendNewQuestions(chatId);
          } else {
            console.log(questionnaireResponse);
          }
        }
        break;
      case LANG_RU:
        {
          language = LANG_RU;
        }
        break;
      case LANG_EN:
        {
          language = LANG_EN;
        }
        break;
      default: {
        return bot.sendMessage(chatId, WRONG_COMMAND);
      }
    }
  });
};

const setAnswer = (msg) => {
  questionnaireResponse.push({
    id: questionnaireResponse.length + 1,
    response: msg,
  });
};

const sendNewQuestions = (chatId) => {
  const question = `${questionnaireResponse.length + 1}. ${
    TRANSLATION[language].questions[questionnaireResponse.length].text
  }`;
  return bot.sendMessage(chatId, question, keyboard_options);
};

start();
