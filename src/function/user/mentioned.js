module.exports = {
  name: "$mentioned",
  callback: async (context) => {
    context.argsCheck(2);
    const [id, flag] = context.inside.split(";");
    const cleanId = id.replace(/<@|>/g, '');
    if (flag.toLowerCase() === "yes") {
      try {
        const member = await context.event.guild.members.fetch(cleanId);
        return member ? cleanId : context.event.author.id;
      } catch (error) {
        console.error(`Error fetching member: ${error.message}`);
      }
    }
    return context.event.author.id;
  },
};
