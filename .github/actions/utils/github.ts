import fetch from 'node-fetch';

const token = process.env.GITHUB_TOKEN;
// const token = '3d13c9bbb07a51ec5408c92652144dfe1a13a55d'; // for testing

export const githubGraphql = async (query) => {
    const body = JSON.stringify({ query: 'query { ' + query + '}' });
    const headers = new fetch.Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers,
        body: body,
    });
    const json = await response.json();
    if (!json.data) {
        throw new Error('ERROR LOADING GRAPHQL' + JSON.stringify(json));
    }
    return json.data;
};

export const githubRest = async (method, url, body) => {
    const headers = new fetch.Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    const response = await fetch('https://api.github.com' + url, {
        method,
        mode: 'cors',
        cache: 'no-cache',
        headers,
        body: JSON.stringify(body),
    });
    return (await response.json());
};

