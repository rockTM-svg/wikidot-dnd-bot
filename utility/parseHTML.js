import * as cheerio from 'cheerio';

async function parseHTML(textHTML) {
	const $ = cheerio.load(textHTML);
	const result = [];

	// uses array of objects to preserve the order of content (DESPERATELY needs typescript for type checking)
	$.extract({
		links: [{
			selector: '#page-content > *',
			value: (el) => {
				const text = $(el).text().trim();
				const tag = $(el).prop('tagName');

				if (['P', 'A', 'PRE'].includes(tag)) {
					result.push({ tag: 'text', content: text });
				}
				else if (['UL', 'TABLE'].includes(tag)) {
					result.push({ tag: 'group-text', content: `\`\`\`${text}\`\`\`` });
				};
			},
		}],
	});

	return result;
};

export default parseHTML;