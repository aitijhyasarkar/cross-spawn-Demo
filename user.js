const readline = require('readline');
const { aiticommand } = require('./main.js');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const recursiveAsyncReadLine = function () {
    rl.question('Enter your command: ', async (input) => {
        await aiticommand(input);
        recursiveAsyncReadLine();
    });
}
recursiveAsyncReadLine();