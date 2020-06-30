const Discord = require("discord.js");

exports.run = async (message, args) => {
    
    const embed = new Discord.RichEmbed()
        .setTitle('Available Filters')
        .setColor('0x25347B')
        .setDescription('These are all of the available command arguments for the \`df:run\` command.');

    embed.addField('date', 'Example: --date=M-DD-YYYY');
    embed.addField('length', 'Example: --length=min,max');
    embed.addField('hyphens', 'Example: -h');
    embed.addField('numbers', 'Example: -n');
    embed.addField('keywords', `Example: --keywords=cool,dog,seo`);
    embed.addField('extensions', `Example: --extensions=com,net`);

    message.channel.send({embed});
}