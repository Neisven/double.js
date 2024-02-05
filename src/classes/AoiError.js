class ClientError extends Error {
  constructor(
    name,
    description,
    command,
    functions,
  ) {
    super(description);

    this.name = name ? `Client Error - [${name}]` : `Error`;

    this.description = description;

    this.command = command;

    this.functions = functions;
  }
}


module.exports = ClientError;