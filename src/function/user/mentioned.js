module.exports = {
  name: "$mentioned",
  callback: async (context) => {
    const { event, splits } = context;
    const [returnIndex, flag = "no"] = splits;

    const hasValidInputs = returnIndex && ["yes", "no", "allmention"].includes(flag.toLowerCase());

    if (!hasValidInputs || event.mentions.members.size === 0) {
      return (flag.toLowerCase() === "yes") ? event.author.id : undefined;
    }

    const mentionedMembers = Array.from(event.mentions.members.values());

    const matrixLogic = {
      yes: (index) => (!isNaN(index) && index > 0 && index <= mentionedMembers.length) ? mentionedMembers[index - 1].id : event.author.id,
      allmention: () => mentionedMembers.map(member => member.id).join(","),
      default: () => event.author.id,
    };

    return matrixLogic[flag.toLowerCase()](parseInt(returnIndex));
  },
};
