
class Filter {

    constructor( userConfig ) {
        this.config = Object.assign({
            includeTld: false,
            minDomainLength: 1,
            maxDomainLength: 63,
            noHyphens: true,
            noNumbers: true,
            exactNumberOfCharacters: undefined,
            keywords: [],
            tlds: []
        }, userConfig)
    }

    is_select_tld(domain) {
        return this.config.tlds.filter(tld => domain.toLowerCase().includes(`.${tld}`)).length > 0;
    }

    is_proper_length(domain) {
        if (this.config.exactNumberOfCharacters !== undefined) {
            return this.is_exact_number_of_characters(domain);
        }
        let lessThanCheck = this.config.includeTld
            ? domain.length <= this.config.maxDomainLength
            : domain.split('.')[0].length <= this.config.maxDomainLength
        let greaterThanCheck = this.config.includeTld
            ? domain.length >= this.config.minDomainLength
            : domain.split('.')[0].length >= this.config.minDomainLength
        return lessThanCheck && greaterThanCheck;
    }

    is_exact_number_of_characters(domain) {
        if (this.config.exactNumberOfCharacters === undefined) return true;
        return this.config.includeTld
            ? domain.length === this.config.exactNumberOfCharacters
            : domain.split('.')[0].length === this.config.exactNumberOfCharacters
    }

    contains_no_hyphens(domain) {
        if (!this.config.noHyphens) return true;
        return !domain.includes('-');
    }

    contains_no_numbers(domain) {
        if (!this.config.noNumbers) return true;
        return [0,1,2,3,4,5,6,7,8,9].filter(num => {
            return domain.includes(num);
        }).length === 0;
    }

    contains_keyword(domain) {
        let name = domain.toLowerCase().split('.')[0];
        return this.config.keywords.filter(keyword => {
            return this.config.includeTld
                ? domain.replace('.', '').includes(keyword.toLowerCase())
                : name.includes(keyword.toLowerCase());
        }).length > 0;
    }
}

module.exports = (userConfig) => new Filter(userConfig);