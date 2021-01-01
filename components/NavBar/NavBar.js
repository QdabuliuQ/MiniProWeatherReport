// components/NavBar/NavBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    CityTitle:{
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    globalData:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  },

  attached: function() {
    // 在组件实例进入页面节点树时执行
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          'globalData.statusBarHeight': res.statusBarHeight,
          'globalData.navBarHeight': 44 + res.statusBarHeight
        })
      }
    })
  },
})
