require('dotenv').config();
const path = require('path');
const Discord = require('discord.js');

const baseCommandName = 'df:';

const client = new Discord.Client();

(async () => {
    await client.login(process.env.TOKEN);
    await client.user.setActivity('df:help');
})();

client.on('message', msg => {
    if (msg.author.bot) return;
    if (msg.content.indexOf(baseCommandName) !== 0) return;

    const args = msg.content
    .slice(baseCommandName.length)
    .trim()
    .split(/ +/g);
    const subcommand = args
        .shift()
        .toLowerCase();
    try {
        let commandFile = require(path.join(
        __dirname,
        'subcommands',
        `${subcommand}.js`
        ));
        commandFile.run(msg, args);
    } catch (err) {
        console.error(err);
    }
});

module.exports = client;