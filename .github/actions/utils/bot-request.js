const fetch = require('node-fetch');

// const { TG_BOT_TOKEN } = process.env;
const TG_BOT_TOKEN = '1198760423:AAFY6ztUS6AbbWaA4N29vU2fyBF6kUrS_Oc'; // for testing


const botRequest = async (method, params = {}) => {
    const response = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/${method}`, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
};

module.exports = { botRequest };
