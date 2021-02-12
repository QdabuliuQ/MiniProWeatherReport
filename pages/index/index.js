//index.js
//获取应用实例
import {request, requestDetail} from "../../request/request"
Page({
  data: {
    latitude:'',  // 纬度
    longitude:'',  // 经度
    cityDetail:{},  // 城市基本信息
    tempertureDetail: {},  // 气温信息
    date: '',  // 星期
    hourList: [],  // 未来二十四小时数据
    imgUrl: '',  // 背景图片
    futureDaily: [],  // 未来七天数据
    dailyArr: [],  // 各项指数
    blurPX: 0,  // 背景模糊指数
    scrollTop: 0,  // 距离顶部距离
    scrollHeight: 0,  // 可滚动高度
    showBack: false,  // 隐藏返回按钮
    showContainer: false,
    airDetail: {
      aqi: '',
      category: ''
    }, // 空气质量
    globalData: null,  // 顶部高度
    toastPosition: 0,  // 提示框位置
    toastBackgroundColor: '#fff'
  },
  blurPXIndex: 0,
  
  
  onLoad(){
    // 在组件实例进入页面节点树时执行
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          'globalData.statusBarHeight': res.statusBarHeight,
          'globalData.navBarHeight': 44 + res.statusBarHeight
        })
      }
    })

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
    
    wx.getLocation({  // 获取地理位置
      type: 'gcj02',  
      success: (result) => {
        this.setData({
          latitude: result.latitude,  // 保存纬度
          longitude: result.longitude  // 保存经度
        })
        let loc = this.data.longitude + ','+ this.data.latitude
        request({
          url: '/v2/city/lookup?',  // 获取城市基本信息
          data:{
            location: loc,
            key: 'e8fb6c5da8904432803fa50288df8e83'
          }
        }).then(res => {
          this.setData({
            'cityDetail.id': res.data.location[0].id,
            'cityDetail.name': res.data.location[0].name,
          }, function(){
            wx.setStorageSync('cityDetail', {
              name: this.data.cityDetail.name,
              location: loc,
              key: 'e8fb6c5da8904432803fa50288df8e83'
            })
          })
          requestDetail({   // 获取城市天气信息
            url: '/v7/weather/now?',
            data: {
              location: this.data.cityDetail.id,
              key: 'e8fb6c5da8904432803fa50288df8e83'
            }
          }).then(res => {
            this.setData({
              tempertureDetail: res.data.now
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
              dailyArr: res.data.daily,
              showContainer: true
            }, () => {
              let scrollHeight = 0;  // 默认滚动高度
              let colorList = ['#7bd9c7','#77d28c','#e6c831','#dd9428','#d9651d','#d0361a']  // 颜色数组
              let activeColor;  // 活跃颜色
              let that = this
              const query = wx.createSelectorQuery() // 创建节点查询器 query
              query.select('.airLine').boundingClientRect(function(res) {
                let toastPosition = res.width / 500 * that.data.airDetail.aqi  // 计算位置
                if (toastPosition > 0 && toastPosition <= res.width * 0.1) {
                  activeColor = colorList[0]
                } else if (toastPosition > res.width * 0.1 && toastPosition <= res.width * 0.2 ){
                  activeColor = colorList[1]
                } else if (toastPosition > res.width * 0.2 && toastPosition <= res.width * 0.3 ){
                  activeColor = colorList[2]
                } else if (toastPosition > res.width * 0.3 && toastPosition <= res.width * 0.4 ){
                  activeColor = colorList[3]
                } else if (toastPosition > res.width * 0.4 && toastPosition <= res.width * 0.6 ){
                  activeColor = colorList[4]
                } else if (toastPosition > res.width * 0.6){
                  activeColor = colorList[5]
                }
                that.setData({
                  toastPosition,
                  toastBackgroundColor: activeColor
                })
              });
              query.exec(function (res) {})
              wx.createSelectorQuery().select('.tempDetail').boundingClientRect(function(rect){
                scrollHeight = rect.top
              }).exec(function(){  // exec是回调函数
                that.setData({
                  scrollHeight
                })
              })
            })
          })
          // 空气质量
          requestDetail({
            url: '/v7/air/now?',
            data: {
              location: loc,
              key: 'e8fb6c5da8904432803fa50288df8e83'
            }
          }).then(res => {
            this.setData({
              'airDetail.aqi': res.data.now.aqi,
              'airDetail.category': res.data.now.category,
            })
          })
        })
      }
    })
  },

  onShow(){
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

  onReady() {
    
  },

  // 获取星期
  getDayOfWeek(dayTime){
    let day = new Date(Date.parse(dayTime.replace(/-/g, '/'))); //将日期值格式化
    let today = new Array("星期天","星期一","星期二","星期三","星期四","星期五","星期六");
    return today[day.getDay()]; //day.getDay();根据Date返一个星期中的某其中0为星期日
  },

  onPageScroll:function(e){ // 获取滚动条当前位置
    if (e.scrollTop > this.data.scrollTop) {
      let index = this.data.scrollHeight / 5
      if (this.blurPXIndex <= 5) { 
        this.blurPXIndex = e.scrollTop / index
        this.setData({
          blurPX: this.blurPXIndex
        })
      }
    } else {
      let index = this.data.scrollHeight / 5
      if (this.blurPXIndex >= 0) {
        this.blurPXIndex = e.scrollTop / index
        this.setData({
          blurPX: this.blurPXIndex
        })
      }
    }
    this.setData({
      scrollTop: e.scrollTop
    })
  }
})
