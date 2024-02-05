module.exports = {
  name: "$sendMessage",
  callback: async (context) => {
    context.argsCheck(1);
    const text = context.inside;
    if (context.isError) return;

    return await context.event.channel.send(
      text,
    );
  },
};
