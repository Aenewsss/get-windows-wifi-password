const { exec } = require('child_process');
const fs = require('fs');
const nthline = require('nthline'),
    filePath = 'wifi.txt',
    rowIndex = 32

fs.readFile('passwords.txt', (err, data) => {
    if (err) return console.log(err);
    fs.rm('passwords.txt', (err) => console.log(err));
})

exec('netsh wlan show profiles', (err, stdout, stderr) => {
    if (err) {
        return console.log('Erro', err.message);
    }
    if (stderr) {
        return console.log(stderr);
    }

    discoverWifis(stdout);

});

function discoverWifis(stdout) {
    const command = stdout.split(':');

    command.splice(0, 2);

    const str = command.toString();

    const newStr = str.split('\r\n');

    const arr = newStr.toString().split(',');

    const wifis = [];

    arr.forEach(item => {
        if (item.length < 25) {
            wifis.push(item)
        }
    });

    wifis.forEach(item => {
        const formatted = item.substr(1, item.length)
        setTimeout(() => {
            showPasswords(formatted)
        }, 600);
    })
}

function showPasswords(wifi) {
    exec(`netsh wlan show profile "${wifi}" key=clear`, (err, stdout, stderr) => {
        if (err) {
            return 1 + 1;
        }
        if (stderr) {
            return console.log(stderr);
        }

        fs.writeFile(`wifi.txt`, stdout, (err) => {
            if (err) return console.log(err.message);
        });

        nthline(rowIndex, filePath)
            .then(line => {
                const passwordStr = line.split(' ')

                const password = passwordStr[passwordStr.length - 1];

                const list = `\nWifi: ${wifi} -- Password: ${password}\n`

                fs.appendFile('passwords.txt', list, (err) => {
                    if (err) console.log(err)
                });
            }).catch(e => 1 + 1);
    });

}