const cp = require('cross-spawn');
const spawnPromise = (command, list) => {
    return new Promise((resolve, reject) => {
        // remove VERBOSE/VERBOSEOFF flag from the string
        let spawnArgs, options;
        if (list.includes('VERBOSEOFF')) spawnArgs = list.filter(arg => arg !== 'VERBOSEOFF'), options = { stdio: 'pipe', encoding: 'utf8' };
        else if (list.includes('VERBOSE')) spawnArgs = list.filter(arg => arg !== 'VERBOSE'), options = { stdio: 'pipe', encoding: 'utf8' };
        else spawnArgs = list, options = { stdio: 'pipe', encoding: 'utf8' };
        if (command === 'exit' || command === 'EXIT') console.log('\nBye 👋\n'), process.exit(1);  //Handle exit flag
        const child = cp.spawn(command, spawnArgs, options);   //Execution of command
        //Error and o/p handling
        let output = '', errorOutput = '';
        child.stdout.on('data', data => {
            output += data.toString();
        });
        child.stderr.on('data', data => {
            errorOutput += data.toString();
        });
        child.on('close', code => {
            if (code !== 0) {
                const error = new Error();
                error.output = errorOutput.trim();
                reject(error);
                return;
            }
            resolve({ output: output.trim(), code });
        });
        child.on('error', err => {
            reject(err);
        });
    });
};
const aiticommand = async (buff) => {
    console.log('\nStarted execution ✔️\n');
    //  command and flags extraction
    const command = buff.trim(), spaceIndex = command.indexOf(" ");
    let actcommand, flags;
    if (spaceIndex !== -1) actcommand = command.substring(0, spaceIndex), flags = command.substring(spaceIndex + 1).split(" ");
    else actcommand = command, flags = [];
    // Caliing our spawn function with command and flags as arguments
    try {
        const { output, code } = await spawnPromise(actcommand, flags);
        console.log('\nFinished execution ✅\n');
        return { output, code };
    } catch (e) {
        console.log(`\nAn error occurred!❌\n`);
        return { output: e.output || '', code: 1 };
    }
};
module.exports = { aiticommand };