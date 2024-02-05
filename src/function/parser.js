
function isFloat(content) {
  if (!content.includes(".")) return false;
  if (!Number.isNaN(parseFloat(content))) return true;
  else return false;
}

function isBoolean(content) {
  if (content === "true") return true;
  else if (content === "false") return true;
  else return false;
}

function isNull(content) {
  if (content === "null") return true;
  else return false;
}

function isObject(content) {
  if (content.startsWith("{") && content.endsWith("}")) {
    try {
      return !!JSON.parse(JSON.stringify(content));
    } catch (err) {
      return false;
    }
  }
  return false;
}

function isUndefined(content) {
  if (content === "undefined") return true;
  else if (content.trim() === "") return true;
  else return false;
}

function isNaN(content) {
  if (content === "NaN") return true;
  else return false;
}

function isNumber(content) {
  return isFloat(content) || isInteger(content);
}

function toParse(character) {
  if (!character) return "unknown";
  switch (true) {
    case isUndefined(character):
      return "undefined";
    case isNumber(character):
      return "number";
    case isNaN(character):
      return "nan";
    case isObject(character):
      return "object";
    case isBoolean(character):
      return "boolean";
    case isNull(character):
      return "null";
    default:
      return "string";
  }
}


function getObjectKey(
  data,
  path,
) {
  if (!path) return data;
  const properties = path.split(".");
  function getProperty(obj, props) {
    const [currentProp, ...rest] = props;
    if (obj && obj[currentProp]) {
      if (rest.length > 0) {
        return getProperty(obj[currentProp], rest);
      } else {
        return obj[currentProp];
      }
    }
    return undefined;
  }
  return getProperty(data, properties);
}

module.exports = {
  toParse,
  getObjectKey,
};