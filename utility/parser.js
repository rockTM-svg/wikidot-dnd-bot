const cheerio = require('cheerio');

// works but parsing needs to be more specific
module.exports = {
	parse: async (data, selector) => {
		const $ = cheerio.load(data);

		if (selector) return await $(selector).text();
		return await $('body').text();
	},
};