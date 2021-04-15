import * as echarts from '../../ec-canvas/echarts' // 引入echart
import {
  requestDetail
} from "../../request/request"

let chartLine; // 图表实例
let chartLine2;
function setBarOption(fxDate = null, tempMax = null, tempMin = null) { // 设置图表1数据函数
  return {
    title: {
      text: '未来7天气温变化',
      textStyle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '550',
      }
    },
    color: ['#fec721', '#61ff1c', '#4dbeff'], // 颜色
    grid: { // 图表大小
      top: '20%',
      left: '0%',
      right: '0%',
      bottom: '0%',
      containLabel: true
    },
    xAxis: { // x轴配置
      type: 'category',
      boundaryGap: true,
      data: fxDate || [], // 判断数据是否传入
      axisLabel: { // 配置x轴字体
        color: 'rgba(255,255,255,0.8)',
        interval: 0, // 设置为0 强制显示所有的x轴项
      },
      axisLine: { // 设置y轴线样式
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.2)'
        }
      },
    },
    yAxis: [{
      type: 'value',
      splitLine: { // 设置分割线样式
        lineStyle: {
          color: 'rgba(255,255,255,0.2)'
        }
      },
      axisLabel: { // 配置y轴字体
        color: 'rgba(255,255,255,0.8)',
        fontSize: '12px',
        formatter: '{value}°C'
      },
      splitLine: { // 设置分割线样式
        lineStyle: {
          color: 'rgba(255,255,255,0.2)'
        }
      },
      // 不显示刻度
      axisTick: {
        show: false
      },
      axisLine: { // 设置y轴线样式
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.2)'
        }
      },
    }],
    legend: { // 图例样式
      show: true,
      data: ['最高气温', '最低气温'],
      textStyle: { // 图例文本样式
        color: 'rgba(255,255,255,0.6)', // 文本颜色
      },
      itemHeight: 10,
      itemWidth: 20,
      right: '0%',
    },
    series: [{
        name: '最高气温',
        type: 'line',
        // data: tempMax,
        data: tempMax || [],
        smooth: true, // 折线变圆滑
      },
      {
        name: '最低气温',
        type: 'line',
        // data: tempMin,
        data: tempMin || [],
        smooth: true, // 折线变圆滑
      }
    ]
  }
}

function setBarLineOption(fxDate = null, pressure = null, humidity = null) { // 设置图表2的数据函数
  return {
    title: {
      text: '气压/湿度变化图',
      textStyle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: '550',
      }
    },
    color: ['#7bdfde', '#e9ff9c'], // 颜色
    grid: { // 图表大小
      top: '28%',
      left: '2%',
      right: '2%',
      bottom: '0%',
      containLabel: true
    },
    legend: { // 图例样式
      data: ['大气压强', '空气湿度'],
      textStyle: { // 图例文本样式
        color: 'rgba(255,255,255,0.6)', // 文本颜色
      },
      itemHeight: 10,
      itemWidth: 20,
      right: '0%',
    },
    xAxis: { // x轴配置
      type: 'category',
      boundaryGap: true,
      data: fxDate || [],
      axisLabel: { // 配置x轴字体
        color: 'rgba(255,255,255,0.8)',
        textStyle: {
          fontSize: '10',
        },
        interval: 0, // 设置为0 强制显示所有的x轴项
      },
      axisLine: { // 设置y轴线样式
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.2)'
        }
      },
    },
    yAxis: [{
        type: 'value',
        name: '大气压强',
        nameTextStyle: {
          color: 'rgba(255,255,255,0.8)'
        },
        axisLabel: { // 配置y轴字体
          color: 'rgba(255,255,255,0.8)',
          fontSize: '12px',
          formatter: '{value}帕'
        },
        splitLine: { // 设置分割线样式
          lineStyle: {
            color: 'rgba(255,255,255,0.2)'
          }
        },
        // 不显示刻度
        axisTick: {
          show: false
        },
        axisLine: { // 设置y轴线样式
          show: true,
          lineStyle: {
            color: 'rgba(255,255,255,0.2)'
          }
        },
        min: 1000, // 图表左侧最小值
        max: 1020, // 图表右侧最大值
        interval: 4, // 增值
      },
      {
        type: 'value',
        name: '空气湿度',
        nameTextStyle: {
          color: 'rgba(255,255,255,0.8)'
        },
        axisLabel: { // 配置y轴字体
          color: 'rgba(255,255,255,0.6)',
          fontSize: '12px',
          formatter: '{value}%'
        },
        axisLine: { // 设置y轴线样式
          show: true,
          lineStyle: {
            color: 'rgba(255,255,255,0.2)'
          }
        },
        // 不显示刻度
        axisTick: {
          show: false
        },
        splitLine: { // 设置分割线样式
          lineStyle: {
            color: 'rgba(255,255,255,0.2)'
          }
        },
        position: 'right',
        min: 0,
        max: 100,
        interval: 20,
      },
    ],
    series: [{
        name: '大气压强',
        type: 'line',
        yAxisIndex: 0,
        data: pressure || [],
        smooth: true, // 折线变圆滑
      },
      {
        name: '空气湿度',
        type: 'bar',
        itemStyle: { // 柱状图样式
          barBorderRadius: [5, 5, 0, 0] //（顺时针左上，右上，右下，左下）
        },
        barWidth: '45%',
        yAxisIndex: 1,
        data: humidity || [],
      }
    ]
  }
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


Page({
  /**
   * 页面的初始数据
   */
  data: {
    cityName: '', // 所在城市名称
    hoursDetail: null, // 未来两小时数据
    airDetail: null, // 空气质量
    showMoreDetail: false, // 显示/隐藏更多数据
    btnText: '点击查看更多数据',
    AttractionsDetail: null, // 景点气温
    warningDetail: [], // 灾害预警
    locationID: 0,
    show: false,

    ecBar: {  // 图表1配置
      onInit: function (canvas, width, height) {
        //初始化echarts元素，绑定到全局变量，方便更改数据
        chartLine = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: getPixelRatio()
        });
        canvas.setChart(chartLine);

        //可以先不setOption，等数据加载好后赋值，
        //不过那样没setOption前，echats元素是一片空白
        chartLine.setOption(setBarOption());
      }
    },

    ecBar2: {  // 图表2配置
      onInit: function (canvas, width, height) {
        //初始化echarts元素，绑定到全局变量，方便更改数据
        chartLine2 = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: getPixelRatio()
        });
        canvas.setChart(chartLine2);

        //可以先不setOption，等数据加载好后赋值，
        //不过那样没setOption前，echats元素是一片空白
        chartLine2.setOption(setBarLineOption());
      }
    },
    pixelRatio: 0, // 像素比
    barComponent: null,
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
  onLoad: function (options) {
  },

  getBarOption() { // 请求数据
    let detail = wx.getStorageSync('cityDetail')
    let that = this
    requestDetail({ // 发起网络请求
      url: '/v7/weather/7d?',
      data: {
        location: detail.location,
        key: detail.key,
      }
    }).then(res => {
      let fxDate = [] // 日期
      let tempMax = [] // 最高气温
      let tempMin = [] // 最低气温
      let pressure = [] // 气压
      let humidity = [] // 湿度
      for (const item of res.data.daily) { // 遍历循环处理数据
        fxDate.push(item.fxDate.substr(5))
        tempMax.push(item.tempMax)
        tempMin.push(item.tempMin)
        pressure.push(item.pressure)  // 获取气压
        humidity.push(item.humidity)  // 获取湿度
      }
      let option = setBarOption(fxDate, tempMax, tempMin) // 调用方法设置图表option参数
      let option2 = setBarLineOption(fxDate, pressure, humidity)  // 设置图片option
      chartLine.setOption(option) // 调用 setOption 设置图表参数
      chartLine2.setOption(option2)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    setTimeout(() => {
      this.getBarOption()
    }, 500)
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
  },
})