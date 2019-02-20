import axios from 'axios';

axios.defaults.timeout = 5000;

axios.defaults.baseURL = 'https://gateway.kuipmake.com/api';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

export default axios;
