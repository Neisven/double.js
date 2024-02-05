class Command {
  commands = [];
  
  constructor(discord) {
    this.discord = discord;
  }

  register(command) {
    const existingIndex = this.commands.findIndex(
      (map) => map.name === command.name,
    );
    if (existingIndex !== -1) {
      this.commands[existingIndex] = command;
    } else {
      this.commands.push(command);
    }
    return this;
  }


  handler() {
    this.discord.on("messageCreate", async (message) => {
      const messageArgs = message.content.split(/\s+/);
      const commandIdentifier = messageArgs[0];

      if (!this.commands.length) return;
      if(message.author.bot) return;
      for (const command of this.commands) {
        const aliasesRegex = new RegExp(
          `^!(?:${(command.aliases || []).join("|")})$`,
        );
        if (
          !aliasesRegex.test(commandIdentifier) &&
          `!${command.name}` !== commandIdentifier
        )
          continue;

        await this.discord.evaluateCommand(
          commandIdentifier,
          command.code,
          message,
        );
        break;
      }
    });
  }
}

module.exports = Command;