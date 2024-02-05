```sh
npm i @neisven/double.js
```
- How to start?
create `index.js`
execute terminal: `npm init -y`
execute terminal: `npm i @neisven/double.js`

**after..**

put in file:
```js
const DClient = require("@neisven/double.js");
const bot = new DClient({
  token: "your token",
  prefix: "!" // replace on your prefix!
});

bot.readyCommand({
  code: `$print[Bot login as $userTag]`
});

bot.command({
  name: "ping",
  code: `
  $sendMessage[Hey! My delay is.. $ping]
  `
});

bot.connect();
```
great!