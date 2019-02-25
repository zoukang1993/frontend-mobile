import {Blog} from './blog';

class Stores {
    constructor() {
        this.blogStore = new Blog();
    }
}

export default new Stores();

