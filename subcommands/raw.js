const { RichEmbed } = require('discord.js');
const Filter = require('../utils/filter');
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
const { promisify } = require('util');

exports.run = async (message, args) => {
    const jsonStr = args.splice(0).filter(Boolean).join('').replace(/ +/g,'').trim();
    const json = JSON.parse(jsonStr);
    const lookupDate = json.dropDate ? moment(json.dropDate, 'M-DD-YYYY') : moment();
    const filter = Filter(json);
    const filename = lookupDate.format('M-DD-YYYY');

    try {
        await promisify(fs.open)(`tmp/${filename}.txt`, 'r')
    } catch(err) {
        console.warn('Could not find file. Attempting to download it now...')
        const response = await axios({
            method: 'get',
            url: `http://www.namejet.com/download/${filename}.txt`,
        })
        if (response.status === 200) {
            try {
                await promisify(fs.writeFile)(`tmp/${filename}.txt`, response.data);
            } catch(err) {
                console.warn('Could not write temp file.')
            }
        }
    }

    const domains = await promisify(fs.readFile)(`tmp/${filename}.txt`, "utf8")
    let filteredDomains = domains
        .split('\n')
        .filter(Boolean) // filter out empty items
        .filter(filter.is_proper_length, filter)
        .filter(filter.contains_no_hyphens, filter)
        .filter(filter.contains_no_numbers, filter)
        .filter(filter.is_select_tld, filter)
        .filter(filter.contains_keyword, filter);

    const totalDomains = domains.split('\n').filter(Boolean).length;
    const totalFiltered = filteredDomains.length;

    if (json.keywords.length === 0 || json.tlds.length === 0) {
        const randomSelection = domains.split('\n').filter(Boolean).sort(() => .5 - Math.random()).slice(0,15)
        let embed = new RichEmbed();
        embed.setTitle(`${totalDomains} domains`)
        embed.setDescription(`You didn't specify any keywords or extensions, so here is the full list for today instead.`)
        embed.addField('Source', "Namejet", true)
        embed.addField('Drop Date', filename, true)
        embed.addField('Sampling', randomSelection.join('\n'))
        embed.attachFile({
            attachment: fs.readFileSync(`tmp/${filename}.txt`), 
            name: `Namejet-${filename}.txt`
        })
        return message.channel.send({embed});
    }
    if (totalFiltered === 0) return message.reply("No results today matching your criteria");
    const path = `results/${message.member.user.username}-${filename}.txt`;

    try {
        await promisify(fs.writeFile)(path, filteredDomains.join('\n'));
    } catch(err) {
        console.warn('Could not write results file.')
    }

    const randomSelection = filteredDomains.sort(() => .5 - Math.random()).slice(0,15)
    let embed = new RichEmbed();
    embed.setTitle(`${totalFiltered} matched out of ${totalDomains} domains`)
    embed.setDescription(`Displaying a random selection of ${randomSelection.length} results. To view the full list of matching results, download your personalized file above.`)
    embed.addField('Source', "Namejet", true)
    embed.addField('Drop Date', filename, true)
    embed.addField('Sampling', randomSelection.join('\n'))
    embed.attachFile({
        attachment: fs.readFileSync(path),
        name: `${message.member.user.username}-${filename}.txt`
    })
    await message.channel.send({embed});

    try {
        await promisify(fs.unlink)(`results/${message.member.user.username}-${filename}.txt`);
    } catch(err) {
        console.warn('Could not delete results file.')
    }

    return
};