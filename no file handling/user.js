const readline = require('readline'), { aiticommand } = require('./main.js');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const recursiveAsyncReadLine = function () {
    rl.question('Enter your command: ', async (input) => {
        const { output, code } = await aiticommand(input);    //my custom spawn function call
        if (!input.includes('VERBOSEOFF')) console.log('Output:', output);  //Checking for VERBOSEOFF
        console.log('Error Code:', code, '\n');
        recursiveAsyncReadLine();
    });
};
//Driver code
recursiveAsyncReadLine();