module.exports = {
  name: "$mentioned",
  callback: async (context) => {
    context.argsCheck(2);
    const [id, flag] = context.inside.split(";");
    const guild = context.event.guild;
    if (id && flag.toLowerCase() === "yes") {
      try {
        const member = await guild.members.fetch(id);
        return member ? id : context.event.author.id;
      } catch (error) {
        return context.event.author.id;
      }
    }
  },
};
