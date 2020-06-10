const { GITHUB_TOKEN } = process.env;
const git = require('simple-git/promise')(__dirname + '/../../');
const { githubGraphql, githubRest } = require('./utils/github');

const repo = {
    owner: '',
    name: '',
    constructor() {
        console.log('IM NE')
    }
}

const pr = {
    prMergeBranch: process.env.GITHUB_REF,
    url: '',
    number: ''
}



const run = async () => {

    await git.addConfig('user.email', 'action@github.com');
    await git.addConfig('user.name', 'GitHub Action');
    const remote = await git.remote(['show', 'origin']);
    const [repoOwner, repoName] = remote.split('github.com/')[1].split("\n")[0].split('/');
    const newRemote = `https://action:${GITHUB_TOKEN}@github.com/${repoOwner}/${repoName}`;
    await git.removeRemote('origin');
    await git.addRemote('origin', newRemote);
    await git.fetch(['--all']);

    const prNumber = pr.mergeBranch.split('/')[2];
    const prUrl = `https://github.com/${repoOwner}/${repoName}/pull/${prNumber}`;
    const response = await githubGraphql(`repository(name:"${repoName}", owner:"${repoOwner}"){
        pullRequest(number:${prNumber}) { title, author {login } }
    }`);
    const prTitle = response.repository.pullRequest.title;
    const prAuthor = response.repository.pullRequest.author.login;
    const tgUser = ghTgAliases[prAuthor];


    try {
        await git.mergeFromTo('origin/master', 'HEAD', ['--no-ff', '--no-commit']);
        const modifiedFiles = ((await git.status()).modified);
        if (modifiedFiles.length) {
            throw new Error('Has modified files: ' + modifiedFiles.join(', '))
        }
    } catch (e) {
        if (tgUser) await tgSendDeclinedMessage(tgUser, prTitle);
        await ghLeaveDeclinedComment();
    } finally {
        await git.reset(['--merge']);
    }
}

run().then(() => {
    console.log('branch is up to date with master');
}).catch((e) => {
    console.error(e);
    process.exit(254);
})


const tgSendDeclinedMessage = (tgUser, prTitle) => {
    return botRequest('sendMessage', {
        chat_id: tgUser.chatId,
        text: `${emo.no_entry} *PR "${prTitle}" declined* ${emo.no_entry}
PR branch is not up to date with master. Merging is prohibited. See PR comment for details
${prUrl}`,
        parse_mode: 'markdown'
    })
}

const ghLeaveDeclinedComment = () => {
    return githubRest('POST', `/repos/${repoOwner}/${repoName}/pulls/${prNumber}/reviews`, {
                body: `[bot]
        Branch is not up to date with master. Please follow these steps:
        1. Convert your PR state to 'draft'
        2. Merge master branch into this PR branch (\`${currentBranch}\`)
        3. Test that everything works fine
        4. Change PR state to 'ready'`,
                event: 'COMMENT'
            });
}
