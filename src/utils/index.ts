export function tansParams(params: {[key: string]: any}) {
	let result = ''
	Object.keys(params).forEach((key) => {
		if (!Object.is(params[key], undefined) && !Object.is(params[key], null) && !Object.is(JSON.stringify(params[key]), '{}')) {
			result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
		}
	})
	return result
}

export function parseQueryString(url: string) {
    url = url == null ? window.location.href : url;
    const search = url[0] === '?' ? url.substr(1) : url.substring(url.lastIndexOf('?') + 1);
    if (search === '') return {}
    const list = search.split('&');
    const query: {[key: string]: string} = {};
    for (let i = 0; i < list.length; i++) {
        let pair = list[i].split('=');
		if (pair.length === 2 && pair[0] !== "") {
			query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
		}
    }
    return query;
}