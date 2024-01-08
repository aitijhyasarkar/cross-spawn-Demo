let cp = require('cross-spawn');
const spawnPromise = (command, list) => {
    return new Promise((resolve, reject) => {
        let spawnArgs, options;
        if (list.includes('VERBOSEOFF')) {
            spawnArgs = list.filter(arg => arg !== 'VERBOSEOFF');
            options = { stdio: 'ignore', encoding: 'utf8' };
        } else if (list.includes('VERBOSE')) {
            spawnArgs = list.filter(arg => arg !== 'VERBOSE');
            options = { stdio: 'inherit', encoding: 'utf8' };
        } else {
            spawnArgs = list;
            options = { stdio: 'inherit', encoding: 'utf8' };
        }
        if (command === 'exit') {
            console.log('\nBye 👋\n');
            process.exit(1);
        }
        const child = cp.spawn(command, spawnArgs, options);
        child.on('close', code => {
            if (code !== 0) {
                reject(new Error());
                return;
            }
            resolve();
        });
        child.on('error', reject);
    });
}
const aiticommand= async (buff) => {
    console.log('\nStarted execution ✔️\n');
    const command = buff.trim(), spaceIndex = command.indexOf(" ");
    let actcommand, flags;
    if (spaceIndex !== -1) {
        actcommand = command.substring(0, spaceIndex);
        flags = command.substring(spaceIndex + 1).split(" ");
    } else {
        actcommand = command;
        flags = [];
    }
    try {
        await spawnPromise(actcommand, flags);
        console.log('\nFinished execution ✅\n');
    } catch (e) {
        console.log('\nAn error occured!❌\n')
    }
};
module.exports={aiticommand};