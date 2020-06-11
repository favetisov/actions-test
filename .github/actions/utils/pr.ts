import {Repository} from "./repository";
import {githubGraphql, githubRest} from "./github";

export const getPr = async (mergeBranch: string, repo: Repository) => {
    const number = parseInt(mergeBranch.split('/')[2]);
    const pr = new Pr(number, repo);
    await pr.loadInfo();
    return pr;
}

export class Pr {
    title: string;
    url: string;
    authorLogin: string;

    constructor(public number, public repo: Repository) {
        this.url = `https://github.com/${this.repo.owner}/${this.repo.name}/pull/${this.number}`;
    }

    async loadInfo() {
        const response = await githubGraphql(`repository(name:"${this.repo.name}", owner:"${this.repo.owner}"){
        pullRequest(number:${this.number}) { title, author {login } }
    }`);
        this.title = response.repository.pullRequest.title;
        this.authorLogin = response.repository.pullRequest.author.login;
    }

    // todo check if we can require changes
    async leaveComment(text) {
        return githubRest('POST', `/repos/${this.repo.owner}/${this.repo.name}/pulls/${this.number}/reviews`, {
            body: text,
            event: 'REQUEST_CHANGES'
        });
    }
}
