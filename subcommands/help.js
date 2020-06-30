const Discord = require("discord.js");

exports.run = async (message, args) => {
    
    const embed = new Discord.RichEmbed()
        .setTitle('Dropfilter Bot Usage')
        .setColor('0x25347B')
        .setDescription('These are all of the available bot commands.');

        embed.addField('df:about', 'View a detailed description of what Dropfilter is all about.');
        embed.addField('df:help', 'View command usage information.');
        embed.addField('df:raw', 'Specify a raw JSON configuration string. We built a web form to quickly and easily generate a properly-formatted configuration that you can use [here](https://dropfilter.app/).');
        embed.addField('df:filters', 'View the available criteria by which you can filter domain lists using the \`df:run\` command.');

    message.channel.send({embed});
}