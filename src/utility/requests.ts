import parseHTML from "./parseHTML.js";

export async function fetchHTML(url: string, selector: string) {
	const parsedContent = await fetch(url)
		.then((res) => {
			if (res.ok) return res.text();
			return Promise.reject(res);
		})
		.then((text) => parseHTML(text, selector))
		.catch((err: Error) => {
			console.error(err.message);
			return [];
		});

	return parsedContent;
}

export async function checkPage(url: string) {
	return await fetch(url, { method: "HEAD" }).then((res) => res.status);
}
