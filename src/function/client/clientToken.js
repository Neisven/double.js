module.exports = {
  name: "$clientToken",
  callback: (context) => {
    return context.discord.token;
  },
};
