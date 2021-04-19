import {request} from "../../request/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',  // 输入框值
    topCityList: null,  // 热门城市
    searchResult: [],  // 搜索结果
  },
  TimeId: -1,  // 全局变量存放定时器

  input(e){
    let str = e.detail.value
    this.setData({
      inputValue: str
    })
    clearInterval(this.TimeId)  // 清除上一次的延时器
    if (!str.trim()) {  // 判断输入内容是否为空
      this.setData({
        searchResult: []  // 清空数据
      })
      return
    }
    this.TimeId = setTimeout(() => {  // 重新创建新的延时器 （防抖）
      this.getSearchResult(str)  // 发起请求
    }, 1000)  // 相隔一秒后
  },

  getSearchResult(str){
    request({
      url: '/v2/city/lookup?',
      data: {
        location: this.data.inputValue,
        key: wx.getStorageSync('cityDetail').key
      }
    }).then(res => {
      this.setData({
        searchResult: res.data.location
      })
      if (res.data.code != 404) {
        this.animate(".searchResult",[
          {opacity: 0,height: '0rpx'},
          {opacity: 0.5,height: ((res.data.location.length * 67.5 + 24) / 2)+'rpx'},
          {opacity: 1,height: (res.data.location.length * 67.5 + 24)+'rpx'},
        ],500,function(){
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let cityDetail = wx.getStorageSync('cityDetail')
    request({
      url: '/v2/city/top?',
      data: {
        key: cityDetail.key
      }
    }).then(res => {
      this.setData({
        topCityList: res.data.topCityList
      })
    })
  },

  onShareAppMessage: function() {
    return {
      title: '搜索喜欢的城市',
      path: '/pages/search/index'
    }
  }
})