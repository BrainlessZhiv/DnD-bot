const peggy = require("peggy");
const fs = require("fs");

const grammar = fs.readFileSync("./parser/grammars/diceNotation.pegjs", "utf8");
const parser = peggy.generate(grammar);

function formulaToJSON(formula) {
  return parser.parse(formula);
}

function calculateDiceInternal(json) {
  if (json.type === "dice") {
    let result = 0;
    let diceResults = [];

    // Dice rollin
    for (let i = 0; i < json.count; i++) {
      let diceResult = Math.floor(Math.random() * (json.sides - 1)) + 1;
      diceResults.push(diceResult);
    }

    // Dice extra options
    if (json.options != null) {
      switch (json.options.type) {
        case "keeph":
          diceResults.sort((a, b) => b - a);
          diceResults = diceResults.slice(0, json.options.count);
          break;
        case "keepl":
          diceResults.sort((a, b) => a - b);
          diceResults = diceResults.slice(0, json.options.count);
          break;
        case "keepc":
          // TODO: Implement keep custom die
          break;
        case "dropl":
          diceResults.sort((a, b) => b - a);
          diceResults = diceResults.slice(
            0,
            diceResults.length + 1 - json.options.count
          );
          break;
        case "droph":
          diceResults.sort((a, b) => a - b);
          diceResults = diceResults.slice(
            0,
            diceResults.length + 1 - json.options.count
          );
          break;
        case "dropc":
          // TODO: Implement drop custom die
          break;

        default:
          break;
      }
    }

    // Dice check explosive
    if (json.explosive === true) {
      diceResults.forEach((diceResult) => {
        if (diceResult === json.sides) {
          let newDiceResult = Math.floor(Math.random() * (json.sides - 1)) + 1;
          diceResults.push(newDiceResult);
        }
      });
    }

    // Dice results
    diceResults.forEach((diceResult) => {
      result += diceResult;
    });

    // Dice mods
    if (json.modifiers != null) {
      if (json.modifiers && json.modifiers.length > 0) {
        json.modifiers.forEach((modifier) => {
          if (modifier.value.type === "dice") {
            modifier.value = calculateDiceInternal(modifier.value);
          }
          switch (modifier.op) {
            case "+":
              result += modifier.value;
              break;
            case "-":
              result -= modifier.value;
              break;
            case "*":
              result *= modifier.value;
              break;
            case "/":
              result /= modifier.value;
              break;
            default:
              break;
          }
        });
      }
    }
    console.log(result);
    return result;
  } else {
    return "Not a valid formula";
  }
}

function calculateDice(formula) {
  return calculateDiceInternal(formulaToJSON(formula));
}

module.exports = { calculateDice };
