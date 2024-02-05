const path = require("path")
const fs = require("fs");
const { Client, Collection } = require("discord.js");
const Manager = require("./AoiManager");
const TaskCompleter = require("../TaskCompleter");
const ClientError = require("./AoiError");
class Base extends Client {
  availableFunctions = new Collection();
  
  constructor(
    options = {},
    database = {},
    customFunction,
    disableFunctions,
  ) {
    super(options);
    this.database = new Manager(database);
    this.disableFunctions = disableFunctions || [];
    this.availableFunctions = loadFunctionsLib(
      path.join(__dirname, "..", "/function/"),
      new Collection(),
      disableFunctions || [],
    );
    this.addFunction(customFunction || []);
  }

  async evaluateCommand(
    command,
    code,
    eventData,
  ) {
    try {
      const taskCompleter = new TaskCompleter(
        code,
        eventData,
        this,
        {
          name: typeof command === "string" ? command : command.event,
          hasCommand: typeof command === "string" ? true : false,
          hasEvent: typeof command === "string" ? false : true,
        },
        this.database,
        this.availableFunctions,
        [...this.availableFunctions.keys()],
      );
      return await taskCompleter.completeTask();
    } catch (err) {
      console.log(err);
    }
  }

  addFunction(options) {
    if (Array.isArray(options)) {
      for (const optionVersion of options) {
        if (!optionVersion?.name) {
          throw new ClientError(
            "customFunction",
            "you did not specify the 'name' parameter",
          );
        }

        if ((optionVersion?.version ?? 0) > version) {
          throw new ClientError(
            "customFunction",
            `to load this function ${optionVersion?.name}, the library version must be equal to or greater than ${
              optionVersion?.version ?? 0
            }`,
          );
        }

        this.availableFunctions.set(
          optionVersion.name.toLowerCase(),
          optionVersion,
        );
      }
    } else {
      if (!options?.name) {
        throw new ClientError(
          "customFunction",
          "you did not specify the 'name' parameter",
        );
      }

      if ((options?.version ?? 0) > version) {
        throw new ClientError(
          "customFunction",
          `to load this function ${
            options.name
          }, the library version must be equal to or greater than ${
            options?.version ?? 0
          }`,
        );
      }

      this.availableFunctions.set(options.name.toLowerCase(), options);
    }
    return this;
  }

  removeFunction(options) {
    if (options.length < 0) {
      throw new ClientError(
        "parameter",
        "you did not specify the 'name' parameter",
      );
    }

    if (Array.isArray(options)) {
      for (const name of options) {
        this.availableFunctions.delete(name.toLowerCase());
      }
    } else {
      this.availableFunctions.delete(options.toLowerCase());
    }
    return true;
  }

  readyCommand(options) {
    if (!options?.code) {
      throw new ClientError(
        "parameter",
        "you did not specify the 'code' parameter",
      );
    }
    this.on("ready", async (ctx) => {
      await this.evaluateCommand({ event: "ready" }, options.code, {
        ...ctx,
        discord: this,
      });
    });
    return this;
  }

  messageCommand(options) {
    if (!options?.code) {
      throw new ClientError(
        "parameter",
        "you did not specify the 'code' parameter",
      );
    }
    this.on("message", async (ctx) => {
      await this.evaluateCommand({ event: "message" }, options.code, ctx);
    });
    return this;
  }

  variables(options, table) {
    this.database.variables(options, table);
  }
}

function loadFunctionsLib(
  dirPath,
  availableFunctions,
  disableFunctions,
) {
  const processFile = (itemPath) => {
    const dataFunction = require(itemPath);
    if (!dataFunction?.name && typeof !dataFunction?.callback !== "function")
      return;
    const dataFunctionName = dataFunction.name.toLowerCase();
    if (disableFunctions.includes(dataFunctionName)) return;

    availableFunctions.set(dataFunction.name.toLowerCase(), dataFunction);
  };

  const processItem = (item) => {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      loadFunctionsLib(itemPath, availableFunctions, disableFunctions);
    } else if (itemPath.endsWith(".js")) {
      processFile(itemPath);
    }
  };

  const items = fs.readdirSync(dirPath);
  items.forEach(processItem);
  return availableFunctions;
}

module.exports = Base;