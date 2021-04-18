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
    toastBackgroundColor: '#fff',
    blurPX: 0,

    aniName: '',  // 按钮动画
    showLeftBtn: true,  // 隐藏按钮
    showLeftBtnTip: false,  // 隐藏按钮提示
    tipAniName: '',  // 提示动画
    tipPosition: 0,  // 默认提示框位置为0
    audioUrl: null,  // 音频地址
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
        console.log(result);
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
                // let toastPosition = 400  // 计算位置
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
                  tipPosition: toastPosition,
                  toastBackgroundColor: activeColor
                })
              });
              query.exec(function (res) {})
              wx.createSelectorQuery().select('.topLine').boundingClientRect(function(rect){
                scrollHeight = rect.top
              }).exec(function(){  // exec是回调函数
                that.setData({
                  scrollHeight
                })
                console.log(scrollHeight);
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

  // 节流函数
  // fn 执行函数
  // delay 间隔时间
  throttle(delay, e) {
    let valid = true  // 当前函数是否可执行
    if (!valid) {  // 函数不可执行
      return false
    }
    valid = false  // 执行函数 修改判断条件为false
    setTimeout(() => {
      this.listenScroll(e)
      valid = true  // 函数执行完成后 修改判断条件为ture
    }, delay)
  },


  listenScroll(e) {  // 监听滚动
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
  },

  onShow(){
  },

  onReady() {
    setTimeout(() => {
      this.setData({
        showLeftBtnTip: true
      })
    }, 3000)

    setTimeout(() => {
      this.setData({
        showLeftBtnTip: false
      })
    }, 10000)
  },

  shareDetail() {  // 复制天气速报
    let dt = new Date(this.data.tempertureDetail.obsTime);
    const y = dt.getFullYear();  // 获取年份
    const m = (dt.getMonth() + 1 + '').padStart(2, '0');  // 获取月份
    const d = (dt.getDate()+ '').padStart(2, '0');  // 获取日期
    const h = dt.getHours(); 
    let time = `${y}年/${m}月/${d}日`
    let moment = ''
    if (h >= 5 && h <= 11) {
      moment = '早上好'
    } else if (h >= 12 && h <= 13){
      moment = '中午好'
    } else if (h >= 14 && h <= 17){
      moment = '下午好'
    } else {
      moment = '晚上好'
    }
    let temdetail = this.data.tempertureDetail
    let dailyArr = this.data.dailyArr
    wx.setClipboardData({  // 赋值文本
      data: `${moment}呀~ 今天是${time} ${this.data.date} \n \n您所在的位置是：${this.data.cityDetail.name}(经度：${this.data.longitude.toFixed(2)}，纬度：${this.data.latitude.toFixed(2)}) \n \n今天天气速报如下🌈： \n⭐⭐⭐⭐⭐⭐ \n天气状况：${temdetail.text}，当前温度：${temdetail.temp}°，${temdetail.windDir}${temdetail.windScale}级 风速${temdetail.windSpeed}m/s，空气质量：${this.data.airDetail.aqi} ${this.data.airDetail.category} \n${dailyArr[1].name}🌂：${dailyArr[1].category}，${dailyArr[2].name}🚗：${dailyArr[2].category}，${dailyArr[6].name}👸：${dailyArr[6].category}，${dailyArr[8].name}🏀：${dailyArr[8].category}，${dailyArr[11].name}💊：${dailyArr[11].category}\n⭐⭐⭐⭐⭐⭐\n欢迎使用#小程序：云舒天气`,
      success: function () {
      	// 添加下面的代码可以复写复制成功默认提示文本`内容已复制` 
        wx.showToast({
          title: '复制成功',
          duration: 3000
        })
        wx.getClipboardData({
          success: function (res) {
          }
        })
      }
    })
  },
  // 获取星期

  playReportAudio() {
  },


  onPageScroll(e){ // 获取滚动条当前位置
    let h = wx.getSystemInfoSync().windowHeight
    if (e.scrollTop + h >= this.data.scrollHeight && this.data.toastPosition != this.data.tipPosition) {
      
      this.setData({
        toastPosition: this.data.tipPosition
      })
    }
    this.throttle(250, e)
  }
})