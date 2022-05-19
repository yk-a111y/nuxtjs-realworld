import axios from 'axios'

export const request = axios.create({
  baseURL: 'https://conduit.productionready.io/'
})

// 插件导出函数必须作为默认成员
export default ({ store }) => {
  request.interceptors.request.use(function (config) {
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Token ${store.state.user.token}`
    }
    return config
  }, function (error) {
    // 如果失败，请求还未发出就会进入这段代码
    return Promise.reject(error)
  })
}