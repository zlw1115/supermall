import axios from 'axios'
export function request(config) {
  // 1、创建axios的实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:8000/api/w6',
    timeout: 5000,
  })

  // 2、axios的拦截器
  // 2.1请求拦截的作用
  //拦截请求
  instance.interceptors.request.use(config=>{
    return config//不返回，内部就拿不到config信息了
    
  },err=>{
    // console.log(err);
  })

  //2.2响应拦截
  instance.interceptors.response.use(res=>{
    return res.data //拦截，处理完后返回出去
  },err=>{
    console.log(err);
  })
  // 3、发送真正的网络请求
  return instance(config)
}

