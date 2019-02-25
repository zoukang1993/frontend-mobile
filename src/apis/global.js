import request from '../utils/request';

export const getToken = async() => {
    return await request.get(`/v1/qiniu/uptoken`);
}
