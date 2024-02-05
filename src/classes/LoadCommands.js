const fs = require("node:fs");
const path = require("node:path");
const figlet = require("figlet");
const ClientError = require("./AoiError");

class LoadCommands {
  countLoadCmd = 1;
  countLoadVar = 1;

  constructor(discord) {
    this.discord = discord;
    discord.loadCommands = this;
  }

  loadCommands(dirPath, log = true, updated = false) {
    if (!dirPath) {
      throw new ClientError(
        "parameter",
        "you did not specify the 'dirPath' parameter",
      );
    }
    if (this.countLoadCmd === 1) {
      dirPath = path.join(process.cwd(), dirPath);
      if (log) {
        const bigText = figlet.textSync("DoubleClient");
        console.log(bigText);
      }
      this.countLoadCmd = 0;
      this.path = dirPath;
    }

    if (!fs.existsSync(dirPath)) {
      throw new ClientError(
        "file",
        "the specified file path was not found",
        dirPath,
      );
    }

    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        this.loadCommands(itemPath, log, updated);
      } else if (itemPath.endsWith(".js")) {
        delete require.cache[itemPath];
        const requireFun = require(itemPath);
        const dataFunc = requireFun.default || requireFun;

        if (Array.isArray(dataFunc)) {
          for (const dataArrayFunc of dataFunc) {
            if (dataArrayFunc.name) {
              this.discord.command({
                name: dataArrayFunc.name,
                aliases: dataArrayFunc.aliases,
                typeChannel: dataArrayFunc.typeChannel,
                code: dataArrayFunc.code,
              });
              if (log) {
                console.log(
                  `|---------------------------------------------------------------------|\n`,
                  `| Loading in ${itemPath} | Loaded '${dataArrayFunc.name}' | command |`,
                );
              }
            }

            if (dataArrayFunc.type && !updated) {
              const eventType = LoadCommands.loaderEventType(
                dataArrayFunc.type,
              );
              this.runEvent(this.discord, eventType, dataArrayFunc);
              if (log) {
                console.log(
                  `|---------------------------------------------------------------------|\n`,
                  `| Loading in ${itemPath} | Loaded '${dataArrayFunc.type}' | event |`,
                );
              }
            }
          }
        } else {
          if (dataFunc.name) {
            this.discord.command({
              name: dataFunc.name,
              aliases: dataFunc.aliases,
              typeChannel: dataFunc.typeChannel,
              code: dataFunc.code,
            });
            if (log) {
              console.log(
                `|---------------------------------------------------------------------|\n`,
                `| Loading in ${itemPath} | Loaded '${dataFunc.name}' | command |`,
              );
            }
          }

          if (dataFunc.type && !updated) {
            const eventType = LoadCommands.loaderEventType(dataFunc.type);
            this.runEvent(this.discord, eventType, dataFunc);
            if (log) {
              console.log(
                `|---------------------------------------------------------------------|\n`,
                `| Loading in ${itemPath} | Loaded '${dataFunc.type}' | event |`,
              );
            }
          }
        }
      }
    }
    return this;
  }

  loadVariables(dirPath, log = true) {
    if (!dirPath) {
      throw new ClientError(
        "parameter",
        "you did not specify the 'dirPath' parameter",
      );
    }
    if (this.countLoadVar == 1) {
      dirPath = path.join(process.cwd(), dirPath);
      if (log) {
        const bigText = figlet.textSync("Variables");
        console.log(bigText);
      }
      this.countLoadVar = 0;
      this.path = dirPath;
    }

    if (!fs.existsSync(dirPath)) {
      throw new ClientError(
        "file",
        "the specified file path was not found",
        dirPath,
      );
    }

    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        this.loadVariables(itemPath, log);
      } else if (itemPath.endsWith(".js")) {
        delete require.cache[itemPath];
        const requireVariables = require(itemPath);
        const dataVariables = requireVariables.default || requireVariables;
        if (
          (!Array.isArray(dataVariables) &&
            typeof dataVariables !== "object") ||
          dataVariables?.length === 0 ||
          Object.keys(dataVariables)?.length === 0
        ) {
          throw new ClientError(
            "parameter",
            "to store variables from the loader, specify an array or an object of parameters",
            itemPath,
          );
        }
        if (Array.isArray(dataVariables)) {
          for (const dataVariablesArray of dataVariables) {
            if (!dataVariablesArray?.variables) {
              throw new ClientError(
                "parameter",
                "you did not specify the 'variables' parameter",
                itemPath,
              );
            }
            if (log) {
              console.log(
                `|---------------------------------------------------------------------|\n`,
                `| Loading in ${itemPath} | Loaded | variables |`,
              );
            }
            this.discord.variables(
              dataVariablesArray.variables,
              dataVariablesArray.tables,
            );
          }
        } else {
          if (!dataVariables?.variables) {
            throw new ClientError(
              "parameter",
              "you did not specify the 'variables' parameter",
              itemPath,
            );
          }
          if (log) {
            console.log(
              `|---------------------------------------------------------------------|\n`,
              `| Loading in ${itemPath} | Loaded | variables |`,
            );
          }
          this.discord.variables(
            dataVariables.variables,
            dataVariables.tables,
          );
        }
      }
    }
  }

  runEvent(
    discord,
    eventType,
    data,
  ) {
    switch (eventType.hasEvent) {
      case "ready":
        discord.readyCommand(data);
        break;
      case "message":
        discord.messageCommand(data);
        break;
      default:
        throw new ClientError(
          "loader",
          `event '${eventType.parameter}' is not defined`,
        );
    }
  }

  static loaderEventType(type) {
    const events = {
      ready: "ready",
      message: "message",
    };
    return { hasEvent: events[type] ?? null, parameter: type };
  }
}

module.exports = LoadCommands;