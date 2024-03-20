const peggy = require('peggy');
const fs = require('fs');

// Load the grammar from a file
const grammar = fs.readFileSync('./parser/grammars/diceNotation.pegjs', 'utf8');

const parser = peggy.generate(grammar);

// Now you can use the parser to parse dice notation:
const result = parser.parse('10d%dl2+5/2*(3d10kh1!) 10');
console.log(result);

return result;