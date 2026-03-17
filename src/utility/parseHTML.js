import * as cheerio from "cheerio";

// --------------------------

export default async function parseHTML(textHTML, selector) {
	const $ = cheerio.load(textHTML);
	const result = [];

	$.extract({
		links: [
			{
				selector: `${selector}`,
				value: (el) => {
					const text = $(el).text().trim();
					const tag = $(el).prop("tagName");

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
