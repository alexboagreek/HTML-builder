const fs = require('fs');
const path = require('path');
const readline = require('readline');
const process = require('process');
const input = process.stdin;
const output = process.stdout;

const readPath = path.join(__dirname, 'text.txt');
let writeableText = fs.createWriteStream(readPath);
const rl = readline.createInterface( { input, output });

rl.write('Please, input text (for quit press: "CTRL+C" or print: "exit"):\n');

rl.addListener('line', (input) => {
  if (input === 'exit') {
    rl.write('Good Bye!');
    process.exit(0);
  }
  writeableText.write(input + '\n');
});

rl.addListener('close', () => {
  rl.write('Good Bye!');
  process.exit(0);
});