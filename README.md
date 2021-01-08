# 微信小程序：天知道
## 一款用于查询天气信息的微信小程序
## 点击[查看项目 API 文档](https://dev.qweather.com/docs/api/) 项目使用的是和风天气提供的API ##
### 微信搜索：天知道，可以查看预览项目。 ###

### 安装运行（安装运行前请确定已安装node环境）
* 环境安装：npm install
* 启动服务：npm run dev
* 发布代码：npm run build

### 小程序已实现的功能
* 定位查询实时天气
* 获取未来24小时逐个小时的气温
* 获取未来7天的天气情况/最高气温/最低气温
* 获取当天的详情天气数据
* 获取当天的生活指数
* 获取当前未来两小时的降水情况
* 实时空气质量数据
* 当地的4A/5A级别景区天气状况
* 点击未来7天数据中的任意一条查看更加详细的数据
* 搜索功能（支持模糊搜索）
* 热门城市推荐（点击跳转搜索）
* 点击搜索结果列表，跳转到目标地的天气状况页面
* 全国地图显示
* 地图实时查看目标地的天气状况

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

* 5、小程序动画API的使用
  * 调用 this.animate(参数一，参数二，参数三，参数四，) 方法，传入四个参数进行动画设置
    * 参数一：选择器，选中添加动画的元素，可以是class选择器/id选择器等等
    * 参数二：数组类型的动画帧，可以添加多个帧
    * 参数三：动画执行完成的时间
    * 参数四：动画执行完成后的回调函数
  ```js
  this.animate(".searchResult",[
    {opacity: 0,height: '0rpx'},
    {opacity: 0.5,height: ((res.data.location.length * 57.5 + 24) / 2)+'rpx'},
    {opacity: 1,height: (res.data.location.length * 57.5 + 24)+'rpx'},
    ],500,function(){
  })
  ```
6、小程序Map组件的使用
  * map组件需要先提供几个固定的参数
    * latitude：地图显示的纬度
    * longitude：地图显示的经度
    * markers：标记点，是一个数组形式，可以有多个标记点
    * bindregionchange：当地图发生变化的时候触发的事件（拖动/放大/缩小）都可以触发
  * 通过 wx.getLocation 获取当前的经纬度，并将经纬度赋值给地图需要用到的经纬度
    ```js
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function(res){
        that.setData({
          markers: [{
            id: 0,
            latitude: res.latitude,  // 纬度
            longitude: res.longitude,  // 经度
            iconPath: '../../icon/location1.png',  // 标记点的图标可以自定义
            width: 30,  // 标记点的宽度
            height: 30,  // 标记点的高度
          }]
        })
        // 传入经纬度获取城市信息
        that.getCityTempDetail(res.longitude.toFixed(4), res.latitude.toFixed(4))
      }
    })
    ```
  * 创建map组件的上下文对象，传入map组件的id
    ```js
    this.mapCon = wx.createMapContext('mapCon')
    ```
  * 在 bindregionchange 事件函数中调用 getLocationTemp 封装好的函数获取数据，并且实时移动标记点到屏幕的中心位置
  ```js
  getLocationTemp(e){
    let that = this
    this.mapCon.getCenterLocation({  // 获取屏幕中心点经纬度
      success: (res) => {
        // 滑动之前的位置
        if (e.type == 'begin') {
          this.latitudeStart = res.latitude  // 保存开始滑动前的位置
          this.longitudeStart = res.longitude
        }
        // 滑动结束后的位置
        if (e.type == 'end') {
          this.latitudeEnd = res.latitude  // 保存滑动后的位置
          this.longitudeEnd = res.longitude
          // 判断滑动位置是否与滑动开始的位置发生改变
          // 如果发生了改变则调用 translateMarker 方法移动标记点到中心点位置
          if ((this.latitudeEnd != this.latitudeStart) || (this.longitudeEnd != this.longitudeStart)) {
            this.mapCon.translateMarker({
              markerId: 0,  // 标记点的id
              autoRotate: false,  // 是否旋转
              duration: 500,  // 动画时间
              destination: {
                latitude: this.latitudeEnd,  // 经度
                longitude: this.longitudeEnd,  // 纬度
              },
              // 当标记点动画完成后执行的回调函数
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
  ```
  * 判断开始位置的经纬度和结束位置的经纬度是否一样，如果一样表示没有移动，不需要对标记点进行移动和发送网络请求
  * 如果位置发生了改变，则在 animationEnd(当标记点动画完成后执行的回调函数) 函数中去执行网络请求
  * 为了防止多次拖动地图会发送多次网络请求，在 animationEnd函数中使用了防抖功能
      ```js
      // 当标记点动画完成后执行的回调函数
      animationEnd: function() {
        // 清除上一次的定时器
        clearInterval(this.intervalTimer)
        // 防抖功能 避免多次没有必要的请求
        this.intervalTimer = setTimeout(() => {
          that.getCityTempDetail(that.longitudeEnd, that.latitudeEnd)
        }, 1000)
      }
      ```
    
