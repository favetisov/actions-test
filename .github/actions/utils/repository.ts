const git = require('simple-git/promise')(__dirname + '/../../');

export const getRepository = async () => {
        const repo = new Repository();
        await repo.init();
        return repo;
}

export class Repository {
    name: string;
    owner: string;
    currentBranch: string;

    async init() {
        const remote = await git.remote(['show', 'origin']);
        [this.owner, this.name] = remote.split('github.com/')[1].split("\n")[0].split('/');
        const newRemote = `https://action:${process.env.GITHUB_TOKEN}@github.com/${this.owner}/${this.name}`;
        await git.addConfig('user.email', 'action@github.com');
        await git.addConfig('user.name', 'GitHub Action');
        // await git.removeRemote('origin');
        // await git.addRemote('origin', newRemote);
        await git.fetch(['--all']);
        this.currentBranch = (await git.status()).current;
    }

    async isUpToDate() {
        try {
            await git.mergeFromTo('origin/master', 'HEAD', ['--no-ff', '--no-commit']);
            const modifiedFiles = ((await git.status()).modified);
            console.log(modifiedFiles, 'modified files');
            if (modifiedFiles.length) {
                throw new Error('Has modified files: ' + modifiedFiles.join(', '))
            }
            return true;
        } catch (e) {
            return false;
        } finally {
            await git.reset(['--merge']);
        }
    }
}
