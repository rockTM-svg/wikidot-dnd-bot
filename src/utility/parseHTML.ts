import * as cheerio from 'cheerio';

import ParsedHTMLText from '../interface/parsedHTMLText.js';

// --------------------------

async function parseHTML(textHTML: string) {
	const $ = cheerio.load(textHTML);
	const result: ParsedHTMLText[] = [];

	// uses array of objects to preserve the order of content (DESPERATELY needs typescript for type checking)
	$.extract({
		links: [{
			selector: '#page-content > *',
			value: (el) => {
				const text = $(el).text().trim();
				const tag = $(el).prop('tagName')!;

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