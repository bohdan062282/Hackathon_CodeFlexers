module.exports = {
  keyboard_options: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: "Yes", callback_data: "yes" },
          { text: "No", callback_data: "no" },
        ],
      ],
    }),
  },
  language_options: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: "EN", callback_data: "lang_en" },
          { text: "RU", callback_data: "lang_ru" },
        ],
      ],
    }),
  },
};
