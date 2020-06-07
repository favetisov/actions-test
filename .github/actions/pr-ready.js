const { botRequest } = require('./utils/bot-request');
const { githubGraphql, githubRest } = require('./utils/github');
const ghTgAliases = require('./utils/gh-tg-aliases');
const git = require('simple-git/promise')(__dirname + '/../../');
const  emo = require('./utils/emoji');

// const { TG_CICD_CHANNEL_ID } = process.env;
// const TG_CICD_CHANNEL_ID = -1001273536067; // for testing

// const notify = async (text) => {
//     return botRequest('sendMessage', {
//         chat_id: TG_CICD_CHANNEL_ID,
//         text: text,
//         parse_mode: 'markdown',
//     });
// };

const prMergeBranch = process.env.GITHUB_REF;
console.log(prMergeBranch);
// const prMergeBranch = 'refs/pull/7/merge'; // debug
const prNumber = prMergeBranch.split('/')[2];

(async () => {
    const remote = await git.remote(['show', 'origin']);
    const [repoOwner, repoName] = remote.split('github.com/')[1].split("\n")[0].split('/');
    const prUrl = `https://github.com/${repoOwner}/${repoName}/pull/${prNumber}`;
    console.log(repoOwner, repoName, prNumber)
    const response = await githubGraphql(`repository(name:"${repoName}", owner:"${repoOwner}"){
        pullRequest(number:${prNumber}) {
            title
            author {
                login
            }
        }
    }`);

    const prTitle = response.repository.pullRequest.title;
    const prAuthor = response.repository.pullRequest.author.login;
    const tgUser = ghTgAliases[prAuthor];

    const currentBranch = (await git.status()).current;
    await git.pull('origin', 'master');
    await git.mergeFromTo('master', currentBranch, ['--no-ff', '--no-commit']);
    const modifiedFiles = ((await git.status()).modified);
    if (modifiedFiles.length) {
        if (tgUser) {
            await botRequest('sendMessage', {
                chat_id: tgUser.chatId,
                text: `${emo.no_entry} *PR "${prTitle}" declined* ${emo.no_entry}
PR branch is not up to date with master. Merging is prohibited. See PR comment for details
${prUrl}`,
                parse_mode: 'markdown'
                })
        }

        await githubRest('POST', `/repos/${repoOwner}/${repoName}/pulls/${prNumber}/reviews`, {
            body: `[bot]
        Branch is not up to date with master. Please follow these steps:
        1. Convert your PR state to 'draft'
        2. Merge master branch into this PR branch (\`${currentBranch}\`)
        3. Test that everything works fine
        4. Change PR state to 'ready'`,
            event: 'COMMENT'
        });
        await git.reset(['--merge']);
        throw new Error('Branch is not up to date with master. You should first merge master into your branch, then test your code and only then mark PR as "ready"');
    }
    await git.reset(['--merge']);

})()
