const { GatewayIntentBits, Collection } = require("discord.js");
const Base = require("./AoiBase");
const Command = require("../helpers/Command.js");
const chalk = require("chalk");
const ClientError = require("./AoiError")
const { version } = require("../../package.json");

const defaultGatewayIntentBits = Object.keys(GatewayIntentBits).map(
    (index) => GatewayIntentBits[index],
  )

class DClient extends Base {
  registerCommand = new Command(this);
  commands = new Collection();
  globalVars = new Collection();

  constructor(options) {
    super({
        intents: defaultGatewayIntentBits,
    });
    this.token = options.token;
    this.prefix = this.prefix || [];
    this.optionConsole =
      options.console === undefined ? true : options.console;
  }

  command(options) {
    if (!options?.name) {
      throw new ClientError(
        "parameter",
        "you did not specify the 'name' parameter",
      );
    }
    if (!options?.code) {
      throw new ClientError(
        "parameter",
        "you did not specify the 'code' parameter",
      );
    }
    this.registerCommand.register(options);
    this.#commandInfo({ name: `/${options.name}` }, { ...options });
    return this;
  }

  async connect() {
    await this.registerCommand.handler();
    if (this.optionConsole) {
      this.on("ready", async (ctx) => {
        setTimeout(() => {
          const ctxUsername = `${ctx.user.username}#${ctx.user.discriminator}`;

          console.log(
            `${chalk.red("[ DClient ]: ")}${chalk.yellow(
              `Initialized on ${chalk.cyan("DoubleClient")} ${chalk.blue(
                `v${version}`,
              )}`,
            )} | ${chalk.green(ctxUsername)} |${chalk.cyan(
              " neisven corp.",
            )}`,
          );

          console.log(
            `${chalk.yellow("[ Official Docs ]: ")}${chalk.blue(
              "In Dev..",
            )}`,
          );

          console.log(
            `${chalk.yellow("[ Official GitHub ]: ")}${chalk.blue(
              "https://github.com/Neisven/double.js",
            )}`,
          );
        }, 4000);
      });
    }
    super.login(this.token);
  }

  #commandInfo(name, commands) {
    this.commands.set(name, commands);
  }
}

module.exports = DClient;