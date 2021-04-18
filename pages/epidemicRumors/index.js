import {request} from '../../request/epidemicRequest'  // 引入方法
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    num: 10,
    rumors: []
  },

  getRumors(page, num) {
    wx.showLoading({
      title: '加载中',
      mask: true // 是否添加蒙版效果
    })
    request({
      url: '/nCoV/api/rumors',
      data: {
        page,
        num
      }
    }).then(res => {
      this.setData({
        rumors: [...this.data.rumors, ...res.data.results]
      }, () =>{
        wx.hideLoading() // 隐藏加载动画
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRumors(this.data.page, this.data.num)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },



  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page: ++ this.data.page
    })
    this.getRumors(this.data.page, this.data.num)  // 下拉请求数据
  },

})