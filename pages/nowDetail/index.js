import {
  requestDetail
} from "../../request/request"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: '', // 背景图片url
    cityName: '', // 所在城市名称
    hoursDetail: null, // 未来两小时数据
    airDetail: null, // 空气质量
    showMoreDetail: false, // 显示/隐藏更多数据
    btnText: '点击查看更多数据',
    AttractionsDetail: null, // 景点气温
    blurPX: 5,
    warningDetail: [], // 灾害预警
    locationID: 0,
  },

  toggleDetail() {
    let flag = this.data.showMoreDetail
    if (!flag) {
      this.setData({
        btnText: '收起更多数据'
      })
    } else {
      this.setData({
        btnText: '点击查看更多数据'
      })
    }
    this.setData({
      showMoreDetail: !flag
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let cityDetail = wx.getStorageSync('cityDetail')
    this.setData({
      cityName: cityDetail.name,
      locationID: cityDetail.location
    })

    // 降水预报
    requestDetail({
      url: '/v7/minutely/5m?',
      data: {
        location: cityDetail.location,
        key: cityDetail.key
      }
    }).then(res => {
      this.setData({
        'hoursDetail.summary': res.data.summary,
        'hoursDetail.minutely': res.data.minutely
      })
    })

    // 空气质量
    requestDetail({
      url: '/v7/air/now?',
      data: {
        location: cityDetail.location,
        key: cityDetail.key
      }
    }).then(res => {
      this.setData({
        airDetail: res.data.now
      })
    })

    // 景区预报
    // requestDetail({
    //   url: '/v7/weather/7d?',
    //   data: {
    //     location: cityDetail.location,
    //     key: cityDetail.key
    //   }
    // }).then(res => {
    //   this.setData({
    //     AttractionsDetail: res.data.daily
    //   })
    // })

    // 灾害预警
    requestDetail({
      url: '/v7/warning/now?',
      data: {
        location: cityDetail.location,
        key: cityDetail.key
      }
    }).then(res => {
      this.setData({
        warningDetail: res.data.warning
      })
    })

    let date = new Date()
    let nowTime = date.getHours()
    if (nowTime >= 6 && nowTime < 15) {
      this.setData({
        imgUrl: 'https://img.coolcr.cn/2020/12/31/343b42a5b30c5.jpg'
      })
    } else if (nowTime >= 15 && nowTime < 18) {
      this.setData({
        imgUrl: 'https://img.coolcr.cn/2021/01/02/c33a7248a5f66.jpg'
      })
    } else {
      this.setData({
        imgUrl: 'https://img.coolcr.cn/2020/12/31/217930e095d27.jpg'
      })
    }
  },

})