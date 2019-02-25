import request from '../utils/request';

export const listTags = async() => {
    return await request.get(`/v1/tags`);
}


/**
 * 
 * Article
 */
export const createArticle = async(params) => {
    return await request.post(`/v1/blogs`, params)
};
