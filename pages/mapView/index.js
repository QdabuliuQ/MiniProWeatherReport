import {request, requestDetail} from "../../request/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],  // 标点
    cityDetailTemp: null,  // 标点当地的天气气温
    cityName: '',  // 坐标的城市名称
    showMap: false,  // 左下角城市信息
    cityID: '',  // 城市id
  },

  mapCon: null,  // map实例对象

  latitudeEnd: 0,  // 移动开始的经纬度
  longitudeEnd: 0,
  latitudeStart: 0,  // 移动最后的经纬度
  longitudeStart: 0,
  intervalTimer: -1,  // 定时器

  // 获取中心坐标的天气状况
  getCityTempDetail(longitudeEnd,latitudeEnd){
    requestDetail({
      url: '/v7/weather/3d?',
      data: {
        location: longitudeEnd+','+latitudeEnd,
        key: "e8fb6c5da8904432803fa50288df8e83"
      }
    }).then(res => {
      this.setData({
        cityDetailTemp: res.data.daily[0],
        "cityDetailTemp.longitudeEnd": parseInt(longitudeEnd).toFixed(4),
        "cityDetailTemp.latitudeEnd": parseInt(latitudeEnd).toFixed(4)
      })
    })

    request({
      url: '/v2/city/lookup?',
      data: {
        location: longitudeEnd+','+latitudeEnd,
        key: "e8fb6c5da8904432803fa50288df8e83"
      }
    }).then(res => {
      console.log(res);
      this.setData({
        cityName: res.data.location[0].name,
        cityID: res.data.location[0].id
      }, () => {
        this.setData({
          showMap: true
        })
      })
    })
  },

  // 封装方法获取当地气温信息
  getLocationTemp(e){
    let that = this
    this.mapCon.getCenterLocation({  // 获取中心点经纬度
      success: (res) => {
        // 滑动之前的位置
        if (e.type == 'begin') {
          this.latitudeStart = res.latitude  // 保存开始滑动前的位置
          this.longitudeStart = res.longitude
        }
        if (e.type == 'end') {
          this.latitudeEnd = res.latitude  // 保存滑动后的位置
          this.longitudeEnd = res.longitude
          if ((this.latitudeEnd != this.latitudeStart) || (this.longitudeEnd != this.longitudeStart)) {
            this.mapCon.translateMarker({
              markerId: 0,
              autoRotate: false,
              duration: 500,
              destination: {
                latitude: this.latitudeEnd,  // 经度
                longitude: this.longitudeEnd,  // 纬度
              },
              animationEnd: function() {
                // 清除上一次的定时器
                clearInterval(this.intervalTimer)
                // 防抖功能 避免多次没有必要的请求
                this.intervalTimer = setTimeout(() => {
                  that.getCityTempDetail(that.longitudeEnd, that.latitudeEnd)
                }, 1000)
              }
            })
          }
        }
      }
    })
  },

  // 地图拖动的时候触发
  mapChange(e){
    this.getLocationTemp(e);
  },

  // 地图渲染完成后显示
  mapUpdate(){

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function(res){
        that.setData({
          markers: [{
            id: 0,
            latitude: res.latitude,
            longitude: res.longitude,
            iconPath: '../../icon/location1.png',
            width: 30,
            height: 30,
          }]
        })
        that.getCityTempDetail(res.longitude.toFixed(4), res.latitude.toFixed(4))
      }
    })

    this.mapCon = wx.createMapContext('mapCon')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow: function () {
    
  },

  onReady: function () {
  }

})