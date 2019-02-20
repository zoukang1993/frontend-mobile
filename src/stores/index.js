import {Articles} from './articles';

class Stores {
    constructor() {
        this.articleStore = new Articles();
    }
}

export default new Stores();

