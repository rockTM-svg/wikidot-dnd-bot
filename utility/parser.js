const cheerio = require('cheerio');

// works but parsing needs to be more specific
module.exports = {
	parse: async (textHTML) => {
		const $ = cheerio.load(textHTML);

		/* for every child element in parent element determined by selector, append object to array. */
		const result = $.extract({
			links: {
				selector: '.main-content',
				value: {
					title: '.page-title > span',
					content: [ 'p, li' ],
					tableHeader: [ 'tr > th' ],
					tableContent: [ 'tr > td' ],
				},
			},
		});

		return result;
	},
};