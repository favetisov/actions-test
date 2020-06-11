import { getRepository } from "./utils/repository";
import {getPr} from "./utils/pr";
import {TgClient} from "./utils/telegram";
import { emoji } from "./utils/emoji";

// const prMergeBranch = process.env.GITHUB_REF;
const prMergeBranch = 'refs/pull/7/merge'; // debug

const run = async () => {
    const repo = await getRepository();
    const pr = await getPr(prMergeBranch, repo);
    const tgClient = new TgClient();
    if (await repo.isUpToDate()) {
        console.log('repo is up to date');
    } else {
        await pr.leaveComment(` Branch is not up to date with master. Please follow these steps:
            1. Convert your PR state to 'draft'
            2. Merge master branch into this PR branch (\`${repo.currentBranch}\`)
            3. Test that everything works fine
            4. Change PR state to 'ready'`);
        await tgClient.sendMessage(pr.authorLogin, `${emoji.no_entry} *PR "${pr.title}" declined* ${emoji.no_entry}
PR branch is not up to date with master. Merging is prohibited. See PR comment for details
${pr.url}`)
        throw new Error('Branch is not up to date');
    }
}

run().then(() => {
    console.log("everything's fine");
}).catch((e) => {
    console.error(e);
    process.exit(254);
});
