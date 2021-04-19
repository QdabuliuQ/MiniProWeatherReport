import { requestDetail} from "../../request/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityDetail: null,  // 城市信息
    tempertureDetail: null,  // 城市天气基本数据
    date: '',  // 当天星期几
    hourList: null,  // 预报24小时
    futureDaily: null,  // 未来7天数据
    dailyArr: null,  // 生活指数
    hoursDetail: null,  // 降水预报
    warningDetail: [],  // 灾害预报
    airDetail: null,  // 空气质量
    showMoreDetail: false,  // 显示/隐藏更多数据
    btnText: '点击查看更多数据',
    AttractionsDetail: null,  // 景区天气信息
  },

  // 获取星期
  getDayOfWeek(dayTime){
    let day = new Date(Date.parse(dayTime.replace(/-/g, '/'))); //将日期值格式化
    let today = new Array("星期天","星期一","星期二","星期三","星期四","星期五","星期六");
    return today[day.getDay()]; //day.getDay();根据Date返一个星期中的某其中0为星期日
  },

  toggleDetail(){
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
  onLoad: function (options) {
    let date = new Date();
    let day = '';
    
    switch (date.getDay()) {
      case 0:
        day = '星期天'
        break;
      case 1:
        day = '星期一'
        break;
      case 2:
        day = '星期二'
        break;
      case 3:
        day = '星期三'
        break;
      case 4:
        day = '星期四'
        break;
      case 5:
        day = '星期五'
        break;
      case 6:
        day = '星期六'
        break;
      default:
        break;
    }
    this.setData({
      date: day
    })
    this.setData({
      cityDetail: options
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    requestDetail({   // 获取城市天气信息
      url: '/v7/weather/now?',
      data: {
        location: this.data.cityDetail.id,
        key: 'e8fb6c5da8904432803fa50288df8e83'
      }
    }).then(res => {
      this.setData({
        tempertureDetail: res.data.now,
        showIcon: true,
      })
    })

    // 未来24小时数据
    requestDetail({
      url: '/v7/weather/24h?',
      data: {
        location: this.data.cityDetail.id,
        key: 'e8fb6c5da8904432803fa50288df8e83'
      }
    }).then(res => {
      let hourList = res.data.hourly
      for (const item of hourList) {
        item.time = parseInt(item.fxTime.substring(item.fxTime.indexOf("T")+ 1,item.fxTime.indexOf(":")))
      }
      this.setData({
        hourList
      })
    })

    // 未来七天数据
    requestDetail({
      url: '/v7/weather/7d?',
      data:{
        location: this.data.cityDetail.id,
        key: 'e8fb6c5da8904432803fa50288df8e83'
      }
    }).then(res => {
      let dayDetail = res.data.daily
      for (const item of dayDetail) {
        item.DayOfWeek = this.getDayOfWeek(item.fxDate)  // 调用方法获取星期
      }
      this.setData({
        futureDaily: dayDetail
      })
    })

    // 各项指数
    requestDetail({
      url: '/v7/indices/1d?',
      data: {
        location: this.data.cityDetail.id,
        key: 'e8fb6c5da8904432803fa50288df8e83',
        type: '1,2,3,5,6,8,9,10,13,14,15,16'
      }
    }).then(res => {
      this.setData({
        dailyArr: res.data.daily
      })
    })

    // 降水预报
    requestDetail({
      url: '/v7/minutely/5m?',
      data: {
        location: this.data.cityDetail.location,
        key: 'e8fb6c5da8904432803fa50288df8e83'
      }
    }).then(res => {
      this.setData({
        'hoursDetail.summary': res.data.summary,
        'hoursDetail.minutely': res.data.minutely
      })
    })

    // 灾害预警
    requestDetail({
      url: '/v7/warning/now?',
      data: {
        location: this.data.cityDetail.location,
        key: 'e8fb6c5da8904432803fa50288df8e83'
      }
    }).then(res => {
      this.setData({
        warningDetail: res.data.warning
      })
    })

    // 空气质量
    requestDetail({
      url: '/v7/air/now?',
      data: {
        location: this.data.cityDetail.location,
        key: 'e8fb6c5da8904432803fa50288df8e83'
      }
    }).then(res => {
      this.setData({
        airDetail: res.data.now
      })
    })

    // 景区预报
    requestDetail({
      url: '/v7/weather/7d?',
      data: {
        location: this.data.cityDetail.location,
        key: 'e8fb6c5da8904432803fa50288df8e83'
      }
    }).then(res => {
      this.setData({
        AttractionsDetail: res.data.daily
      })
    })
  },

  onShareAppMessage: function() {
    return {
      title: `查看${this.data.cityDetail.name}的天气`,
      path: '/pages/searchResult/index'
    }
  }
})