
String.prototype.replaceLast = function (
  search,
  replacement,
) {
  const lastIndex = this.lastIndexOf(search);

  if (lastIndex === -1) {
    return this.toString();
  }

  const before = this.substring(0, lastIndex);
  const after = this.substring(lastIndex + search.length);

  return `${before}${replacement}${after}`;
};

function searchIndexes(pat, txt) {
  const patLength = pat.length;
  const txtLength = txt.length;

  const lps = new Int32Array(patLength);

  processPattern(pat, patLength, lps);

  const indexes = [];

  let patIndex = 0;
  let txtIndex = 0;

  while (txtIndex < txtLength) {
    if (pat[patIndex] === txt[txtIndex]) {
      patIndex++;
      txtIndex++;
    }

    if (patIndex === patLength) {
      indexes.push(txtIndex - patIndex);
      patIndex = lps[patIndex - 1];
    } else if (txtIndex < txtLength && pat[patIndex] !== txt[txtIndex]) {
      if (patIndex !== 0) {
        patIndex = lps[patIndex - 1];
      } else {
        txtIndex++;
      }
    }
  }

  return indexes;
}


function processPattern(pat, patLength, lps) {
  let len = 0;
  let index = 1;

  while (index < patLength) {
    if (pat[index] === pat[len]) {
      len++;
      lps[index++] = len;
    } else if (len !== 0) {
      len = lps[len - 1];
    } else {
      lps[index++] = 0;
    }
  }
}

String.prototype.after = function() {
  const afterIndex = this.indexOf("[");
  const after = this.replace(/(\s|\n)/gim, "").startsWith("[")
    ? this.split("[").slice(1).join("[")
    : undefined;

  let inside;
  let total = "";
  let splits = [];

  if (after) {
    const before = this.substring(0, afterIndex);
    const rightIndexes = searchIndexes("[", after);
    const leftIndexes = searchIndexes("]", after);

    if (leftIndexes.length === 0) {
      inside = after;
      total = `${before}[${inside}`;
    } else if (rightIndexes.length === 0) {
      inside = after.substring(0, leftIndexes[0]);
      total = `${before}[${inside}]`;
    } else {
      const merged = [];
      let leftIndex = 0;

      for (let i = 0; i < rightIndexes.length; ++i) {
        const right = rightIndexes[i];
        let left = leftIndexes[leftIndex];

        while (left < right && typeof left === "number") {
          merged.push({
            index: left,
            isLeft: true,
          });

          left = leftIndexes[++leftIndex];
        }

        merged.push({
          index: right,
          isLeft: false,
        });

        if (typeof left !== "number") break;
      }

      while (leftIndex < leftIndexes.length) {
        const left = leftIndexes[leftIndex++];
        merged.push({
          index: left,
          isLeft: true,
        });
      }

      let index = 0;
      let depth = 1;

      for (let i = 0; i < merged.length; ++i) {
        const obj = merged[i];
        index = obj.index;

        if (obj.isLeft) --depth;
        else ++depth;

        if (!depth) break;
      }

      if (depth) index = after.length;

      inside = after.substring(0, index);
      total = `${before}[${inside}${depth ? "" : "]"}`;
    }

    splits = inside.split(";");
  }

  return {
    inside,
    total,
    splits,
    toString() {
      return total;
    },
  };
};

function unpack(
  code,
  func,
) {
  const last = code.split(func.replace("[", "")).length - 1;

  const sliced = code.split(func.replace("[", ""))[last];

  return sliced.after();
}

function findAndTransform(str, array) {
  const regex = /\$[a-zA-Z_][a-zA-Z0-9_]*(\[\.\.\.\])?/g;
  if (!str || array.length < 1) return str;
  array.forEach((element) => {
    str = str.replace(regex, (match) => match.toLowerCase());
  });

  return str;
}

function updateParamsFromArray(
  inputString,
  array,
  arrayParams,
) {
  if (array.length > arrayParams.length) {
    arrayParams = [
      ...arrayParams,
      ...Array(array.length - arrayParams.length).fill(undefined),
    ];
  }

  for (let i = 0; i < array.length; i++) {
    const regex = new RegExp(`{${array[i]}}`, "g");
    inputString = inputString.replace(regex, `${arrayParams[i]}`);
  }
  return inputString;
}

module.exports = { unpack, findAndTransform, updateParamsFromArray };