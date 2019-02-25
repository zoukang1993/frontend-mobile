import request from './request';

const getToken = async() => {
    return await request.get(`/v1/qiniu/uptoken`);
}

const getUptoken = async () => {
    const res = await getToken();
    return res.data.uptoken;
};

const uploadProps = {
    action: 'https://upload.qiniup.com',
    multiple: false,
    data: {},
    listType: 'picture',
    async beforeUpload() {
        this.data.token = await getUptoken();
        this.data.key = `designer-${new Date().getTime()}`;
    },
    defaultFileList: [],
    // onStart(file) {
    // },
    // onSuccess(ret, file) {
    // },
    // onError(err) {
    // },
    // onProgress({
    //  percent
    // }, file) {
    // }
};

export default uploadProps;
