const fetch = require('node-fetch');

const { token } = process.env.GITHUB_TOKEN;
// const token = '3d13c9bbb07a51ec5408c92652144dfe1a13a55d'; // for testing

const githubGraphql = async (query) => {
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
  console.log(response.json());
  return (await response.json()).data;
};

const githubRest = async (method, url, body) => {
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

module.exports = { githubGraphql, githubRest };
