import {observable, action} from 'mobx';
import {
    listTags,
    createArticle,
} from '../apis/blog';

export class Blog {
    @observable articles = [];
    @observable tags = [];

    @action
    async listTags() {
        try {
            const res = await listTags();
            this.tags = res.data.data;
        } catch(e) {
            throw e;
        }
    }

    @action
    async listArticle(params) {
        return params;
    }

    @action
    async createArticle(params) {
        try {
            const res = await createArticle(params);
            return res.data;
        } catch(e) {
            throw e;
        } 
    }
}
