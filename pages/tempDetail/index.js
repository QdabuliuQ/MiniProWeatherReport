import {request, requestDetail} from "../../request/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: '',  // 背景图片
    showBack: true,  // 显示返回按钮
    index: 0,  // 点击传递的参数
    cityName: '',  // 城市名称
    dayDetail: null,  // 当天数据
    blurPX: 5,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      index: options.index,  // 保存页面传参
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onShow(){
    let date = new Date()
    let nowTime = date.getHours()
    if (nowTime >= 6 && nowTime < 18) {
      this.setData({
        imgUrl: 'https://img.coolcr.cn/2020/12/31/343b42a5b30c5.jpg'
      })
    } else {
      this.setData({
        imgUrl: 'https://img.coolcr.cn/2020/12/31/217930e095d27.jpg'
      })
    }
    let that = this
    wx.getLocation({
      type: 'gcj02',  
      success: function(res){
        request({
          url: '/v2/city/lookup?',
          data:{
            location: res.longitude + ',' + res.latitude,
            key: 'e8fb6c5da8904432803fa50288df8e83'
          }
        }).then(res => {
          
          that.setData({
            cityName: res.data.location[0].name
          })
        })

        requestDetail({
          url: '/v7/weather/7d?',
          data: {
            location: res.longitude + ',' + res.latitude,
            key: 'e8fb6c5da8904432803fa50288df8e83'
          }
        }).then(res => {
          that.setData({
            dayDetail: res.data.daily[that.data.index]
          })
        })
      }
    })  
  },
})