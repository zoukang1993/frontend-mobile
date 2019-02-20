import {observable, action} from 'mobx';

export class Articles {
    @observable articles = [];

    @action
    async listArticle(params) {
        return params;
    }
}
