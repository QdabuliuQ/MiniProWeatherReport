

let ajaxtime = 0;
export const request = (params) => {
  // ajaxtime ++;
  // wx.showLoading({
  //   title: '加载中',
  //   mask: true  // 是否添加蒙版效果
  // })
  const baseURL = 'https://lab.isaaclin.cn'  // 请求根路径
  return new Promise((resolve,reject) => {
    wx.request({
      ...params,   // 解构对象
      url: baseURL + params.url,  // 路径拼接
      success: (result) => {
        resolve(result)
      },
      fail: (res) => {
        reject(res)
      },
      // complete 函数 表示不管异步请求成功或者失败都会执行
      complete: () => {
        // ajaxtime --;
        // if (ajaxtime === 0) {
        //   wx.hideLoading()  // 隐藏加载动画
        // }
      }
    })
  })
}