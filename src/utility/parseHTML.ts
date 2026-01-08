import * as cheerio from "cheerio";

import type ParsedHTMLText from "../interface/parsedHTMLText.js";

// --------------------------

export default async function parseHTML(textHTML: string, selector: string) {
	const $ = cheerio.load(textHTML);
	const result: ParsedHTMLText[] = [];

	$.extract({
		links: [
			{
				selector: `${selector}`,
				value: (el) => {
					const text = $(el).text().trim();
					const tag = $(el).prop("tagName")!;

					if (["P", "A", "PRE"].includes(tag)) {
						result.push({ tag: "text", content: text });
					} else if (["UL", "TABLE"].includes(tag)) {
						result.push({ tag: "group-text", content: `\`\`\`${text}\`\`\`` });
					}
				},
			},
		],
	});

	return result;
}
