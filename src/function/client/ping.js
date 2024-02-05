module.exports = {
  name: "$ping",
  callback: (context) => {
    return context.discord.ws.ping;
  }
}