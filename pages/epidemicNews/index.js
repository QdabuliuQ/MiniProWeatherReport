import {request} from '../../request/epidemicRequest'  // 引入方法
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    num: 10,
    news: [],  // 新闻数组
    showBtn: false,  // 返回顶部按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNews(this.data.page, this.data.num)
  },

  // 获取新闻
  getNews(page, num) {
    wx.showLoading({
      title: '加载中',
      mask: true // 是否添加蒙版效果
    })
    request({
      url: '/nCoV/api/news',
      data: {
        page,
        num
      }
    }).then((res) => {
      this.setData({
        news: [...this.data.news, ...res.data.results]
      }, () =>{
        wx.hideLoading() // 隐藏加载动画
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page: ++this.data.page
    })
    this.getNews(this.data.page, this.data.num)
  },

  onShareAppMessage: function() {
    return {
      title: `查看最新疫情资讯`,
      path: '/pages/epidemicNews/index'
    }
  },

  onPageScroll: function(e) {
    if (e.scrollTop > 2000) {
      this.setData({
        showBtn: true
      })
    } else {
      this.setData({
        showBtn: false
      })
    }
  },

  toBack() {  // 返回顶部
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 500
    })
  }
})