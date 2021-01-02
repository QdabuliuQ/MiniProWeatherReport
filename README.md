# 微信小程序：天知道
## 一款用于查询天气信息的微信小程序
## 点击[查看项目 API 文档](https://dev.qweather.com/docs/api/) 项目使用的是和风天气提供的API ##
### 微信搜索：天知道，可以查看预览项目。 ###

### 安装运行（安装运行前请确定已安装node环境）
* 环境安装：npm install
* 启动服务：npm run dev
* 发布代码：npm run build

### 项目要点：
* 1、获取用户位置
  * 调用微信小程序官方提供API进行获取
  * 在成功的回调函数中获取用户所在的经纬度
  * 通过经纬度发送请求发送请求获取实时天气信息
  ```js
  wx.getLocation({  // 获取地理位置
    type: 'gcj02',  
    success: function(res){
      console.log(res)
    }
  })
  ```

* 2、获取未来24小时天气数据获取
  * 保存获取的数据
  * 遍历数据，并且重新创建time属性，通过indexOf方法查找指定的字符的索引，substring截取字符串
  ```js
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
  ```

* 3、在小程序中操作DOM节点
  * 调用 createSelectorQuery 方法
  * 调用 select 方法传入参数（class选择器，id选择器，标签选择器）
  * boundingClientRect 绑定函数
  * 通过 rect 参数获取 top/bottom/left/right 等等
  ```js
  let scrollHeight = 0;
  let that = this;
  wx.createSelectorQuery().select('.tempDetail').boundingClientRect(function(rect){
    scrollHeight = rect.top
  }).exec(function(){  // exec是回调函数
    that.setData({
      scrollHeight
    })
  })
  ```

* 4、wxs语法，由于小程序中没有计算属性，在项目开发的时候使用wxs进行替代
  * 将函数写入 wxs 标签中
  * 函数要有返回值
  * 最后通过 module.exports.函数名 = 函数名;
  ```js
  <wxs module="m1">
    // 封装方法  获取日期
    var getDay = function(day) {
      var reg = getRegExp('T', 'g')  // 获取T字符
      var reg2 = getRegExp('\+', 'g')  // 获取+字符
      var index = day.search(reg) + 1  // 获取索引
      var index2 = day.search(reg2)  // 获取索引
      return day.substring(index, index2)
    }

    var getIcon = function(textDay) {
      switch (textDay) {
        case "晴":
          return "icon-taiyang icon1"
          break;
        case "多云":
          return "icon-duoyun icon2"
          break;
        case "阴":
          return "icon-duoyun3 icon2"
          break;
        case "雨":
          return "icon-xiayu1 icon3"
          break;
        case "小雨":
          return "icon-xiayu1 icon3"
          break;
        case "雪":
          return "icon-ic_ac_unit_px icon4"
          break;
        default:
          break;
      }
    }
    module.exports.getIcon = getIcon;
    module.exports.getDay = getDay;
  </wxs>
  ```
