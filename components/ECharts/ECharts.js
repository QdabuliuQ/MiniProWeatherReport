import * as echarts from '../../ec-canvas/echarts'; // 引入echart
import {
  requestDetail
} from "../../request/request"

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    locationID: {
      type: String,
      value: '0'
    },
    width: {
      type: String,
      value: '100%'
    },
    height: {
      type: String,
      value: '100%'
    },
    ChartName: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ec: {

    },
    option: { // 图表参数

    },
    pixelRatio: 0,  // 像素比
    ecBar: {
      lazyLoad: true // 延迟加载
    },

    ecScatter: {
      lazyLoad: true 
    }
  },

  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached: function () {
      wx.getSystemInfo({
        success: (res) => {
          this.setData({  // 获取当前屏幕像素比
            pixelRatio: res.pixelRatio
          })
        }
      })
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
  },

  observers: {
    "locationID": function () {
      let that = this
      if (this.properties.locationID != 0) {
        let key = wx.getStorageSync('cityDetail').key
        requestDetail({
          url: '/v7/weather/7d?',
          data: {
            location: this.properties.locationID,
            key,
          }
        }).then(res => {
          let fxDate = []
          let tempMax = []
          let tempMin = []
          let pressure = []
          let humidity = []
          if (this.properties.ChartName == 'tempertureChart') {
            for (const item of res.data.daily) {
              fxDate.push(item.fxDate.substr(5))
              tempMax.push(item.tempMax)
              tempMin.push(item.tempMin)
            }
            this.setData({
              option: {
                title: {
                  text: '未来7天气温变化',
                  textStyle: {
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 16,
                    fontWeight: '550' ,
                  }
                },
                color: ['#ffce73', '#73ffec', '#4dbeff'],  // 颜色
                grid: {  // 图表大小
                  top: '20%',
                  left: '0%',
                  right: '0%',
                  bottom: '0%',
                  containLabel: true
                },
                xAxis: {  // x轴配置
                  type: 'category',
                  boundaryGap: true,
                  data: fxDate,
                  axisLabel: {   // 配置x轴字体
                    color: 'rgba(255,255,255,0.6)',
                    interval:0,  // 设置为0 强制显示所有的x轴项
                  },
                  axisLine: {  // 设置y轴线样式
                    show: true,
                    lineStyle: {
                      color: 'rgba(255,255,255,0.2)'
                    }
                  },
                },
                yAxis: [
                  {
                    type: 'value',
                    splitLine: {  // 设置分割线样式
                      lineStyle: {
                        color: 'rgba(255,255,255,0.2)'
                      }
                    },
                    axisLabel: {   // 配置y轴字体
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '12px',
                      formatter: '{value}°C'
                    },
                    splitLine: {  // 设置分割线样式
                      lineStyle: {
                        color: 'rgba(255,255,255,0.2)'
                      }
                    },
                    // 不显示刻度
                    axisTick: {
                      show: false
                    },
                    axisLine: {  // 设置y轴线样式
                      show: true,
                      lineStyle: {
                        color: 'rgba(255,255,255,0.2)'
                      }
                    },
                  }
                ],
                legend: {  // 图例样式
                  show: true ,
                  data: ['最高气温', '最低气温'],
                  textStyle: {  // 图例文本样式
                    color: 'rgba(255,255,255,0.6)',  // 文本颜色
                  },
                  itemHeight: 10,
                  itemWidth: 20,
                  right: '0%',
                },
                series: [{
                    name: '最高气温',
                    type: 'line',
                    data: tempMax,
                    smooth: true,  // 折线变圆滑
                  },
                  {
                    name: '最低气温',
                    type: 'line',
                    data: tempMin,
                    smooth: true,  // 折线变圆滑
                  }
                ]
              },
              ec: {
                onInit: function (canvas, width, height){
                  //初始化echarts元素，绑定到全局变量，方便更改数据
                  let chartLine = echarts.init(canvas, null, {
                      width: width,
                      height: height,
                      devicePixelRatio: that.data.pixelRatio  // 设置像素比
                  });
                  canvas.setChart(chartLine);
                  chartLine.setOption(that.data.option);
                  return chartLine
                }
              }
            })
          } else {
            for (const item of res.data.daily) {
              fxDate.push(item.fxDate.substr(5))  // 获取日期
              pressure.push(item.pressure)  // 获取气压
              humidity.push(item.humidity)  // 获取湿度
            }
            this.setData({
              option: {
                title: {
                  text: '气压/湿度变化图',
                  textStyle: {
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 16,
                    fontWeight: '550' ,
                  }
                },
                color: ['#5cff95', '#76c1ffd0'],  // 颜色
                grid: {  // 图表大小
                  top: '28%',
                  left: '2%',
                  right: '0%',
                  bottom: '0%',
                  containLabel: true
                },
                legend: {  // 图例样式
                  data: ['大气压强', '空气湿度'],
                  textStyle: {  // 图例文本样式
                    color: 'rgba(255,255,255,0.6)',  // 文本颜色
                  },
                  itemHeight: 10,
                  itemWidth: 20,
                  right: '0%',
                },
                xAxis: {  // x轴配置
                  type: 'category',
                  boundaryGap: true,
                  data: fxDate,
                  axisLabel: {   // 配置x轴字体
                    color: 'rgba(255,255,255,0.6)',
                    textStyle: {
                      fontSize:'10',
                    },
                    interval:0,  // 设置为0 强制显示所有的x轴项
                  },
                  axisLine: {  // 设置y轴线样式
                    show: true,
                    lineStyle: {
                      color: 'rgba(255,255,255,0.2)'
                    }
                  },
                },
                yAxis: [
                  {
                    type: 'value',
                    name:'大气压强',
                    nameTextStyle: {
                      color: 'rgba(255,255,255,0.8)'
                    },
                    axisLabel: {   // 配置y轴字体
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '12px',
                      formatter: '{value}帕'
                    },
                    splitLine: {  // 设置分割线样式
                      lineStyle: {
                        color: 'rgba(255,255,255,0.2)'
                      }
                    },
                    // 不显示刻度
                    axisTick: {
                      show: false
                    },
                    axisLine: {  // 设置y轴线样式
                      show: true,
                      lineStyle: {
                        color: 'rgba(255,255,255,0.2)'
                      }
                    },
                    min: 1000,  // 图表左侧最小值
                    max: 1050,  // 图表右侧最大值
                    interval: 10,  // 增值
                  },
                  {
                    type: 'value',
                    name: '空气湿度',
                    nameTextStyle: {
                      color: 'rgba(255,255,255,0.8)'
                    },
                    axisLabel: {   // 配置y轴字体
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '12px',
                      formatter: '{value}%'
                    },
                    axisLine: {  // 设置y轴线样式
                      show: true,
                      lineStyle: {
                        color: 'rgba(255,255,255,0.2)'
                      }
                    },
                    // 不显示刻度
                    axisTick: {
                      show: false
                    },
                    splitLine: {  // 设置分割线样式
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
                series: [
                  {
                    name: '大气压强',
                    type: 'line',
                    yAxisIndex: 0,
                    data: pressure,
                    smooth: true,  // 折线变圆滑
                  },
                  {
                    name: '空气湿度',
                    type: 'bar',
                    itemStyle: {  // 柱状图样式
                      barBorderRadius: [5, 5, 0, 0]  //（顺时针左上，右上，右下，左下）
                    },
                    barWidth: '45%',
                    yAxisIndex: 1,
                    data: humidity,
                  }
                ]
              },
              ec: {
                onInit: function (canvas, width, height){
                  //初始化echarts元素，绑定到全局变量，方便更改数据
                  let chartBar = echarts.init(canvas, null, {
                      width: width,
                      height: height,
                      devicePixelRatio: that.data.pixelRatio  // 设置像素比
                  });
                  canvas.setChart(chartBar);
                  chartLine.setOption(that.data.option);
                }
              }
            })
          }  
        })
      }
    }
  }
})