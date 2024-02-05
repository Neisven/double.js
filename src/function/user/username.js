module.exports = {
  name: "$username",
  callback: async (context) => {
    context.argsCheck(1);
    const cleanId = context.inside.replace(/<@|>/g, '');
    const member = await context.event.guild.members.fetch(cleanId).catch(() => null);
    return member ? member.user.username : context.event.author.username;
  },
};
