let cp = require('cross-spawn'), fs = require('fs/promises');

// global.wrapper=function wrapper(fn){
//     return function(...args){
//         try{
//             if(list.includes('VERBOSEOFF')) cp.spawn(command, list.splice(list.indexOf('VERBOSEOFF'),1), { stdio: "ignore", encoding: 'utf-8' });
//             else if (list.includes('VERBOSE')) cp.spawn(command, list.splice(list.indexOf('VERBOSE'), 1), { stdio: "inherit", encoding: 'utf-8' });
//             else cp.spawn(command, list, { stdio: "inherit", encoding: 'utf-8' });
//         } catch(e){
//             if (e.spawnargs.includes('exit')) process.exit(1);
//             else console.log('An error occured!❌');
//         }
//     }
// }

// const Wrapperfn=wrapper(add);
// let res=Wrapperfn(2,3);
// console.log(res);

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

(async () => {
    console.log('Started execution ✔️');
    const Filehandler = await fs.open('command.txt', 'r');
    Filehandler.on('change', async () => {
        const size = (await Filehandler.stat()).size, buff = Buffer.alloc(size), offset = 0, length = buff.byteLength, position = 0;
        await Filehandler.read(buff, offset, length, position);
        const command = buff.toString('utf-8').trim(), spaceIndex = command.indexOf(" ");
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
    });
    const watcher = fs.watch('command.txt');
    for await (const event of watcher)
        if (event.eventType === 'change') Filehandler.emit('change');
})();