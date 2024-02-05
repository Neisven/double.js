module.exports = {
  name: "$clear",
  callback: async (context) => {
    context.argsCheck(2);
    const amount = context.event.content.slice(6).trim();
    const messages = await context.event.channel.messages.fetch({ limit: amount });
    await context.event.channel.bulkDelete(messages);
    return context.inside.includes('yes') ? amount : undefined;
  },
};
