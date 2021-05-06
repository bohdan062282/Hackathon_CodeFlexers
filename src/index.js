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
  LANGUAGE_CHANGED,
} = require("./constants/common");
const criterions = require("./constants/criterions.js");
const { TRANSLATION } = require("./i18n");

let language = "lang_en";
let questionnaireResponse = [];

let result = {
  TENSION: 0,
  "Experiencing traumatic circumstances": 0,
  "Confined in a cage": 0,
  "Self-satisfaction": 0,
  "Anxiety and depression": 0,

  RESISTANCE: 0,
  "Inappropriate selective emotional response": 0,
  "Emotional and moral disorientation": 0,
  "Reduction of professional duties": 0,
  "Expanding the scope of saving emotions": 0,

  DEPLETION: 0,
  "Emotional deficits": 0,
  "Emotional detachment": 0,
  "Personal detachment (depersonalization)": 0,
  "Psychosomatic and psychovegetative disorders": 0,
};

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
    if (msg) {
      const text = msg.text || "";
      const chatId = msg.chat.id;
      const question = `${questionnaireResponse.length + 1}. ${
        TRANSLATION[language].questions[questionnaireResponse.length].text
      }`;
      switch (text) {
        case START_COMMAND: {
          questionnaireResponse = [];
          return bot.sendMessage(
            chatId,
            TRANSLATION[language].common.WELCOME_TEXT
          );
        }
        case QUESTIONNAIRE_COMMAND: {
          return bot.sendMessage(chatId, question, keyboard_options);
        }
        case LANGUAGE_COMMAND: {
          return bot.sendMessage(
            chatId,
            TRANSLATION[language].common.CHOOSE_LANGUAGE_TEXT,
            language_options
          );
        }
        default: {
          return bot.sendMessage(
            chatId,
            TRANSLATION[language].common.WRONG_COMMAND
          );
        }
      }
    } else {
      return bot.sendMessage(
        chatId,
        TRANSLATION[language].common.WRONG_COMMAND
      );
    }
  });

  bot.on("callback_query", async (msg) => {
    const chatId = msg.message.chat.id;
    const data = msg.data;

    switch (data) {
      case "no":
        {
          setAnswer(data);
          if (questionnaireResponse.length !== 84) {
            sendNewQuestions(chatId);
          } else {
            calculateResults();
          }
        }
        break;
      case "yes":
        {
          setAnswer(data);
          if (questionnaireResponse.length !== 84) {
            sendNewQuestions(chatId);
          } else {
            calculateResults();
          }
        }
        break;
      case LANG_RU:
        {
          language = LANG_RU;
          return bot.sendMessage(
            chatId,
            TRANSLATION[language].common.LANGUAGE_CHANGED
          );
        }
        break;
      case LANG_EN:
        {
          language = LANG_EN;
          return bot.sendMessage(
            chatId,
            TRANSLATION[language].common.LANGUAGE_CHANGED
          );
        }
        break;
      default: {
        return bot.sendMessage(
          chatId,
          TRANSLATION[language].common.WRONG_COMMAND
        );
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

const calculateResults = () => {
  questionnaireResponse.forEach((e) => {
    let currentQuestionSettings = QUESTIONS_SETTINGS.find(
      (item) => item.id === e.id
    );
    if (currentQuestionSettings.symbol === e.response) {
      result[currentQuestionSettings.type] += currentQuestionSettings.points;
    }
  });
  result["TENSION"] =
    result["Experiencing traumatic circumstances"] +
    result["Confined in a cage"] +
    result["Self-satisfaction"] +
    result["Anxiety and depression"];
  result["RESISTANCE"] =
    result["Inappropriate selective emotional response"] +
    result["Emotional and moral disorientation"] +
    result["Reduction of professional duties"] +
    result["Expanding the scope of saving emotions"];
  result["DEPLETION"] =
    result["Emotional deficits"] +
    result["Emotional detachment"] +
    result["Personal detachment (depersonalization)"] +
    result["Psychosomatic and psychovegetative disorders"];
  sendResultsAfterQuestionnaire();
};

const sendResultsAfterQuestionnaire = () => {
  console.log(result);
};

start();
