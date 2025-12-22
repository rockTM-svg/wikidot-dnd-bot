const cheerio = require('cheerio');

module.exports = {
	parseHTML: async (textHTML) => {
		const $ = cheerio.load(textHTML);
		const result = [];

		// uses array of objects to preserve the order of content (DESPERATELY needs typescript for type checking)
		$.extract({
			links: [{
				selector: '#page-content > *',
				value: (el) => {
					const text = $(el).text();
					const tag = $(el).prop('tagName');

					if (['P', 'LI', 'A'].includes(tag)) {
						result.push({ tag: 'text', content: text });
					}
					else if (tag === 'TABLE') {
						result.push({ tag: 'table-text', content: `--- ${$(el).text().replace(/\n/, '')} ---` });
					};
				},
			}],
		});

		return result;
	},
};