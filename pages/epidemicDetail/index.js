import {
  request
} from '../../request/epidemicRequest'
import * as echarts from '../../ec-canvas/echarts' // 引入echart
import '../../ec-canvas/china'

// 设置图表数据
function setMapOptions(cityData) {
  let option = {
    visualMap: {
      show: true,
      type: 'piecewise',
      splitNumber: 4,
      itemWidth: 20,
      itemHeight: 10,
      itemGap: 5,
      textStyle: {
        color: '#999'
      },
      pieces: [{
          min: 1000,
          color: '#7D1818',
          label: '>=1000人'
        },
        {
          min: 100,
          max: 999,
          color: '#BF2321',
          label: '100-999人'
        },
        {
          min: 10,
          max: 99,
          color: '#FF7B66',
          label: '10-99人'
        },
        {
          min: 1,
          max: 9,
          color: '#FFA789',
          label: '1-9人'
        },
      ],
    },
    series: [{
      name: '',
      type: 'map',
      mapType: 'china',
      roam: false,
      zoom: 1.2,
      itemStyle: {
        normal: {
          label: {
            show: true
          }
        },
        emphasis: {
          label: {
            show: true
          }
        }
      },
      label: {
        normal: {
          textStyle: {
            fontSize: 7,
            color: '#333'
          }
        },
        emphasis: {
          show: true
        }
      },
      data: cityData != undefined ? cityData : [],
    }]
  }
  return option
}

function getPixelRatio() { // 获取图表像素比
  let px;
  wx.getSystemInfo({
    success: (res) => {
      px = res.pixelRatio
    }
  })
  return px
}

let chartsMap; // 图表对象
let optionsChart = setMapOptions()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBack: true, // 显示返回按钮
    title: '全国疫情速报',
    todayDetail: null, // 当天疫情信息
    updateTime: null, // 最近更新时间
    ecMap: { // 图表1配置
      onInit: function (canvas, width, height) {
        //初始化echarts元素，绑定到全局变量，方便更改数据
        chartsMap = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: getPixelRatio()
        });
        canvas.setChart(chartsMap);
        //可以先不setOption，等数据加载好后赋值，
        //不过那样没setOption前，echats元素是一片空白
        chartsMap.setOption(optionsChart);
      }
    },
    cityData: [],  // 城市信息
    halfCityData: [],  // 部分城市信息
    currentData: [],  // 当前使用的数据
    moreBtnText: '查看更多',  // 更多按钮文本
    isShowhalf: true,  // 是否显示部分数据
    iconClass: 'icon-gengduoshuju',  // 图标切换
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true // 是否添加蒙版效果
    })
    // 基本数据
    request({
      url: '/nCoV/api/overall',
      data: {
        latest: 1
      }
    }).then(res => {
      let dt = new Date(res.data.results[0].updateTime)
      const y = dt.getFullYear(); // 获取年份
      const m = (dt.getMonth() + 1) > 9 ? (dt.getMonth() + 1) : ('0' +(dt.getMonth() + 1))
      const d = (dt.getDate()) > 9 ? (dt.getDate()) : ('0' +dt.getDate())
      const h = (dt.getHours()) > 9 ? (dt.getHours()) : ('0' +dt.getHours())
      const mi = (dt.getMinutes()) > 9 ? (dt.getMinutes()) : ('0' +dt.getMinutes())
      let time = `${y}-${m}-${d} ${h}:${mi}`
      this.setData({
        todayDetail: res.data.results[0],
        updateTime: time
      })
    })
    wx.request({
      url: 'https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5',
      success: (res) => {
        let detail = JSON.parse(res.data.data)  // 将数据解析
        console.log(detail);
        let cityCurrentDetail = [] // 城市数组
        let halfCityData = []
        let cityData = []  // 城市疫情信息
        for (const item of detail.areaTree[0].children) { // 循环处理数据
          cityCurrentDetail.push({
            name: item.name,
            value: item.total.nowConfirm
          })
          cityData.push({
            name: item.name,  // 城市名称
            confirm: item.total.confirm,  // 累计确诊
            heal: item.total.heal,  // 累计治愈
            dead: item.total.dead,  // 累计死亡
            newConfirm: item.today.confirm,  // 新增确诊
          })
        }
        for (let i = 0; i < 10; i++) {
          halfCityData.push({
            name: cityData[i].name,  // 城市名称
            confirm: cityData[i].confirm,  // 累计确诊
            heal: cityData[i].heal,  // 累计治愈
            dead: cityData[i].dead,  // 累计死亡
            newConfirm: cityData[i].newConfirm,  // 新增确诊
          })
        }
        this.setData({
          cityData,
          halfCityData,
          currentData: halfCityData
        })
        let newOption = setMapOptions(cityCurrentDetail) // 将处理完成的数据放入方法 重新设置图表option
        wx.setStorageSync('cityEpidemicDetail', cityCurrentDetail)
        setTimeout(() => {
          chartsMap.setOption(newOption)
          wx.hideLoading() // 隐藏加载动画
        }, 1000)
      },
      complete: () => {
        
      }
    })
  },

  // 更多按钮切换
  toggleMore() {
    if (this.data.isShowhalf) {
      this.setData({
        isShowhalf: !this.data.isShowhalf,
        currentData: this.data.cityData,
        moreBtnText: '收起',
        iconClass: 'icon-shouqishuju'
      })
    } else {
      this.setData({
        isShowhalf: !this.data.isShowhalf,
        currentData: this.data.halfCityData,
        moreBtnText: '查看更多',
        iconClass: 'icon-gengduoshuju'
      })
    }
  },

  // 复制城市信息
  // 
  copyCityDetail(e) {
    let dt = new Date();
    const y = dt.getFullYear();  // 获取年份
    const m = (dt.getMonth() + 1 + '').padStart(2, '0');  // 获取月份
    const d = (dt.getDate()+ '').padStart(2, '0');  // 获取日期
    let time = `${y}年/${m}月/${d}日`
    let data = e.currentTarget.dataset
    wx.setClipboardData({  // 复制文本
      data: `今天是${time} \n \n今天的疫情速报： \n———————————————— \n城市名称：${data.name} \n已治愈人数：${data.heal}人 \n新增确诊人数：${data.newconfirm}人 \n累计确诊人数：${data.confirm}人 \n死亡人数：${data.dead}人 \n————————————————  \n1、${this.data.todayDetail.note1} \n2、${this.data.todayDetail.note2} \n3、${this.data.todayDetail.note3} \n进入查看更多数据：#小程序：云舒天气`,
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

})
