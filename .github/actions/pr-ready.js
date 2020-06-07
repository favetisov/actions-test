const { botRequest } = require('./utils/bot-request');
const git = require('simple-git/promise')(__dirname + '/../../');
const  emo = require('./utils/emoji');

// const { TG_CICD_CHANNEL_ID } = process.env;
const TG_CICD_CHANNEL_ID = -1001273536067; // for testing

const notify = async (text) => {
    return botRequest('sendMessage', {
        chat_id: TG_CICD_CHANNEL_ID,
        text: text,
        parse_mode: 'markdown',
    });
};

(async () => {
    const currentBranch = (await git.status()).current;
    console.log(currentBranch);
    const res =  await git.mergeFromTo('master', currentBranch, ['--no-commit'], (...res) => {
        console.log(res);
    })
    console.log(res);
})()
