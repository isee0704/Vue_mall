import axios from 'axios'

export function request(config) {
  const instance=axios.create({
    baseURL:'http://152.136.185.210:8000/api/n3',
    timeout:5000
  });

  instance.interceptors.request.use(res=>{
    return res;
  },error => {
    console.log(error);
  });

  instance.interceptors.response.use(res => {
    return res.data;
  },error => {
    console.log(error);
  });

  return instance(config)

}
