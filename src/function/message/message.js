module.exports = {
  name: "$message",
  callback: (context) => {
    const c = context.event.content;
    if (!c) return undefined;
    const [prefix, ...argumentsWithoutPrefix] = context.event.content.split(/\s+/);
    return argumentsWithoutPrefix.join(" ");
  }
};
