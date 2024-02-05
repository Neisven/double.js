const chalk = require("chalk");
const { Collection } = require("discord.js");
const ClientError = require("./AoiError");
const { KeyValue } = require("@aoitelegram/database");

class AoiManager extends KeyValue {
  collection = new Collection();

  constructor(options) {
    super(options);
    if (options.console) {
      this.on("ready", async () => {
        const text = chalk.green("Database has been established");
        console.log(text);
      });
    }
    this.connect();
  }

  variables(
    options,
    tables = this.tables[0],
  ) {
    if (Array.isArray(tables)) {
      for (const table of tables) {
        for (const varName in options) {
          const hasVar = this.has(table, varName);
          this.collection.set(`${varName}_${table}`, options[varName]);
          if (!hasVar) {
            this.set(table, varName, options[varName]);
          }
        }
      }
    } else if (typeof tables === "string") {
      for (const varName in options) {
        const hasVar = this.has(tables, varName);
        this.collection.set(`${varName}_${tables}`, options[varName]);
        if (!hasVar) {
          this.set(tables, varName, options[varName]);
        }
      }
    } else {
      throw new ClientError(
        "parameter",
        "the parameter should be of type 'string' or 'string[]'",
      );
    }
  }
}

module.exports = AoiManager;