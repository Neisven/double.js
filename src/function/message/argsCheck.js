module.exports = {
  name: "$argsCheck",
  callback: async (context) => {
    const { splits } = context;
    const [expectedCount, errorMessage] = splits;
    if (expectedCount && errorMessage) {
      const count = parseInt(expectedCount);
      if (!isNaN(count) && splits.length - 2 < count) {
        return Promise.resolve(context.event.reply(errorMessage));
      }
    }
    return Promise.resolve(undefined);
  },
};
