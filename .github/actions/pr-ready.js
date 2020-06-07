console.log(process.env.GITHUB_REF);

// const { botRequest } = require('./utils/bot-request');
// const ghTgAliases = require('./utils/gh-tg-aliases');
// const git = require('simple-git/promise')(__dirname + '/../../');
// const  emo = require('./utils/emoji');
//
// // const { TG_CICD_CHANNEL_ID } = process.env;
// const TG_CICD_CHANNEL_ID = -1001273536067; // for testing
//
// const notify = async (text) => {
//     return botRequest('sendMessage', {
//         chat_id: TG_CICD_CHANNEL_ID,
//         text: text,
//         parse_mode: 'markdown',
//     });
// };
//
// (async () => {
//
//     // const updates = await botRequest('getUpdates');
//     // console.log(JSON.stringify(updates));
//     // await botRequest('sendMessage', { chat_id: ghTgAliases.tonypizzicato.chat, text: 'Bro it\'s me, bot. ' + emo.wave + 'Rise and shine!'});
//
//     const currentBranch = (await git.status()).current;
//     await git.pull('origin', 'master');
//     await git.mergeFromTo('master', currentBranch, ['--no-ff', '--no-commit']);
//     const modifiedFiles = ((await git.status()).modified);
//     if (modifiedFiles.length) {
//         await notify(emo.no_entry + 'PR ');
//         throw new Error('Branch is not up to date with master. You should first merge master into your branch, then test your code and only then mark PR as "ready"');
//     }
//     await git.reset(['--merge']);
// })()
