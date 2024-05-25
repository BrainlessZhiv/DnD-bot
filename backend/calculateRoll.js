const peggy = require('peggy');
const fs = require('fs');
const { Random, MersenneTwister19937 } = require('random-js');

const grammar = fs.readFileSync('./parser/grammars/diceNotation.pegjs', 'utf8');
const parser = peggy.generate(grammar);

function formulaToJSON(formula) {
	try {
		return parser.parse(formula);
	}
	catch (error) {
		console.error(error);
		return { type: 'error', message: 'Invalid formula' };
	}
}

function calculateDiceInternal(json, userId) {
	if (json.type === 'dice') {
		let result = 0;
		let diceResults = [];
		const modResults = [];

		// Dice rollin
		for (let i = 0; i < json.count; i++) {
			const random = new Random(MersenneTwister19937.autoSeed());
			let diceResult;
			if (userId == '343600248872239115') {
				diceResult = random.integer(parseInt(json.sides / 2), json.sides);
			}
			else {
				diceResult = random.integer(1, json.sides);
			}
			diceResults.push(diceResult);
		}

		// Dice extra options
		if (json.options != null) {
			switch (json.options.type) {
			case 'keeph':
				diceResults.sort((a, b) => b - a);
				diceResults = diceResults.slice(0, json.options.count);
				break;
			case 'keepl':
				diceResults.sort((a, b) => a - b);
				diceResults = diceResults.slice(0, json.options.count);
				break;
			case 'keepc':
				// TODO: Implement keep custom die
				break;
			case 'dropl':
				diceResults.sort((a, b) => b - a);
				diceResults = diceResults.slice(
					0,
					diceResults.length + 1 - json.options.count,
				);
				break;
			case 'droph':
				diceResults.sort((a, b) => a - b);
				diceResults = diceResults.slice(
					0,
					diceResults.length + 1 - json.options.count,
				);
				break;
			case 'dropc':
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
					const newDiceResult =
            Math.floor(Math.random() * (json.sides - 1)) + 1;
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
					if (modifier.value.type === 'dice') {
						modifier.value = calculateDiceInternal(modifier.value).result;
					}
					switch (modifier.op) {
					case '+':
						modResults.push(' + ' + modifier.value);
						result += modifier.value;
						break;
					case '-':
						modResults.push(' - ' + modifier.value);
						result -= modifier.value;
						break;
					case '*':
						modResults.push(' * ' + modifier.value);
						result *= modifier.value;
						break;
					case '/':
						modResults.push(' / ' + modifier.value);
						result /= modifier.value;
						break;
					default:
						break;
					}
				});
			}
		}
		console.log(...diceResults);
		console.log(result);
		return { diceResults, modResults, result };
	}
	else {
		return json.message;
	}
}

function calculateDice(formula, userId) {
	return calculateDiceInternal(formulaToJSON(formula), userId);
}

module.exports = { calculateDice };
