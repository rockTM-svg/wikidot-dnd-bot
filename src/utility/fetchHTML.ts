import parseHTML from "./parseHTML.js";

export default async function fetchHTML (url: string){
	const parsedContent = await fetch(url)
		.then((res) => {
			if (res.ok) return res.text();
			return Promise.reject(res);
		})
		.then(text => parseHTML(text))
		.catch(async (res: Response) => {
			console.error(`${res.status} - ${res.statusText}`);
			throw new Error(`${res.status}`);
		}
	);

	return parsedContent;
};