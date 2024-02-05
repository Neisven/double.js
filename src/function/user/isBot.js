module.exports = {
  name: "$isBot",
  callback: async (context) => {
    context.argsCheck(1);
    const id = context.inside;
    if(context.isError) return;
    const user = await context.discord.users.fetch(id);
    const isBot = user.bot;
    return isBot;
  }
}