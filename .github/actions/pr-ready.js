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
    await notify('im alive in GH' + emo.fire);
    const currentBranch = (await git.status()).current;
    const res = await git.mergeFromTo('master', currentBranch, ['--no-ff', '--no-commit']);
})()
