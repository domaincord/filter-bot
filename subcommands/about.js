const Discord = require("discord.js");

exports.run = async (message, args) => {
    
    const embed = new Discord.RichEmbed()
        .setTitle('Dropfilter Bot')
        .setColor('0x25347B')
        .setDescription('Everyday thousands of domain names on the internet are abandoned and left to expire. Some of these domains have existing traffic or are extremely valuable to the right person. Dropfilter was created to make it easy to filter through all the public expiring domain name lists on the web using customizeable criteria, so that you can weed out the crap. You can find out more information on our website at [dropfilter.app](https://dropfilter.app).');

    embed.addField('Sponsor', 'Domaincord LLC [[Website](https://domaincord.com)]')

    message.channel.send({embed});
}