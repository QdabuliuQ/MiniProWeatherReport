import {request, requestDetail} from "../../request/request"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // markers: [],  // 标点
    cityDetailTemp: null,  // 标点当地的天气气温
    cityName: '',  // 坐标的城市名称
    showMap: false,  // 左下角城市信息
    cityID: '',  // 城市id
    latitudeFirst: '',  
    longitudeFirst: '',
    scale: 16,  // 缩放比例
    locationLa: 0,  // 当前定位
    locationLo: 0,
  },

  mapCon: null,  // map实例对象

  latitudeEnd: 0,  // 移动开始的经纬度
  longitudeEnd: 0,
  latitudeStart: 0,  // 移动最后的经纬度
  longitudeStart: 0,
  intervalTimer: -1,  // 定时器

  // 定位按钮
  positioning(){
    // 调用 moveToLocation 方法移动到起始位置
    this.mapCon.moveToLocation({
      longitude: this.data.locationLo,
      latitude: this.data.locationLa,
    })
    this.getCityTempDetail( this.data.locationLo, this.data.locationLa)
  },

  // 放大按钮
  maxScale(){
    let scale = this.data.scale;
    if (scale <= 20) {
      if (scale == 19) {
        scale = 20;
        this.setData({
          scale,
          latitudeFirst: this.data.cityDetailTemp.latitudeEnd,
          longitudeFirst: this.data.cityDetailTemp.longitudeEnd
        })
        return
      }
      scale += 2;
      this.setData({
        scale,
        latitudeFirst: this.data.cityDetailTemp.latitudeEnd,
        longitudeFirst: this.data.cityDetailTemp.longitudeEnd
      })
    }
  },

  // 缩小按钮
  minScale(){
    let scale = this.data.scale;
    if (scale >= 3) {
      if (scale == 4) {
        scale = 3;
        this.setData({
          scale
        })
        return
      }
      scale -= 2;
      this.setData({
        scale
      })
    }
  },

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
        "cityDetailTemp.longitudeEnd": parseFloat(longitudeEnd).toFixed(4),
        "cityDetailTemp.latitudeEnd": parseFloat(latitudeEnd).toFixed(4)
      })
    })

    request({
      url: '/v2/city/lookup?',
      data: {
        location: longitudeEnd+','+latitudeEnd,
        key: "e8fb6c5da8904432803fa50288df8e83"
      }
    }).then(res => {
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
            console.log(this.latitudeStart,this.longitudeStart +'--'+ this.latitudeEnd, this.longitudeEnd);
            // 防抖功能 避免多次没有必要的请求
            this.intervalTimer = setTimeout(() => {
              that.getCityTempDetail(that.longitudeEnd, that.latitudeEnd)
            }, 1000)
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
          latitudeFirst: res.latitude,
          longitudeFirst: res.longitude,
          locationLa: res.latitude,
          locationLo: res.longitude,
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