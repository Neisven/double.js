module.exports = {
  name: "$message",
  callback: (context) => {
    const [prefix, ...argumentsWithoutPrefix] = context.event.content.split(/\s+/);
    return argumentsWithoutPrefix.join(" ");
  }
};
