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
};
