import { emoji } from "./utils/emoji";
import { getRepository } from "./utils/repository";
import {getPr} from "./utils/pr";

// const prMergeBranch = process.env.GITHUB_REF;
const prMergeBranch = 'refs/pull/7/merge'; // debug

const run = async () => {
    console.log('before repo');
    const repo = await getRepository();
    console.log('before pr');
    const pr = await getPr(prMergeBranch, repo);
    console.log('after pr');
    if (await repo.isUpToDate()) {
        console.log('repo is up to date');
    } else {
        await pr.leaveComment(` Branch is not up to date with master. Please follow these steps:
            1. Convert your PR state to 'draft'
            2. Merge master branch into this PR branch (\`${repo.currentBranch}\`)
            3. Test that everything works fine
            4. Change PR state to 'ready'`);

    }
}

run().then(() => {
    console.log("everything's fine");
}).catch((e) => {
    console.error(e);
    process.exit(254);
});
