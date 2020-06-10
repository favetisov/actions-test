import { emoji } from "./utils/emoji";
import { getRepository } from "./utils/repository";
import {getPr} from "./utils/pr";

// const prMergeBranch = process.env.GITHUB_REF;
const prMergeBranch = 'refs/pull/7/merge'; // debug

try {
    (async() => {
        const repo = await getRepository();
        const pr = await getPr(prMergeBranch, repo);
        if (repo.isUpToDate()) {

        } else {
            // pr.leaveComment()
        }
    })();
} catch (e) {
    console.error(e);
    process.exit(254);
}
