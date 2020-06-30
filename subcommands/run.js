const Discord = require("discord.js");

exports.run = async (message, args) => {
    
    const flagArgs = args.filter(arg => arg.startsWith('--'))
    const boolArgs = args.filter(arg => /-\w/.test(arg))

    // The standardized configuration object to pass to the filtering utility
    const config = {
        dropDate: null,
        includeTld: false,
        minDomainLength: 7,
        maxDomainLength: 15,
        noHyphens: true,
        noNumbers: true,
        exactNumberOfCharacters: undefined,
        keywords: [],
        tlds: []
    }

    flagArgs.forEach(flag => {
        const kv = flag.replace('--', '').split('=')
        switch (kv[0]) {
            case "date":
                config.dropDate = kv[1]
                break
            case "length":
                const lengthParts = kv[1].split(',')
                config.minDomainLength = parseInt(lengthParts[0])
                config.maxDomainLength = parseInt(lengthParts[1])
                config.exactNumberOfCharacters = lengthParts.includes(',') && lengthParts[0] === lengthParts[1]
                    ? parseInt(lengthParts[0])
                    : undefined
                break
            case "extensions":
                config.tlds = kv[1].split(',')
                break
            case "keywords":
                config.keywords = kv[1].split(',')
                break
        }
    })

    boolArgs.forEach(bool => {
        const char = bool.replace('-', '')
        switch (char) {
            case "h":
                config.noHyphens = false
                break
            case "n":
                config.noNumbers = false
                break
        }
    })

    console.log(JSON.stringify(config, null, 2))
    require('./raw.js').run(message, JSON.stringify(config, null, 2).split(/ +/g))  
    return  
}