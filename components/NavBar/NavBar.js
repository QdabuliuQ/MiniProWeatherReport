// components/NavBar/NavBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    CityTitle:{
      type: String,
      value: ""
    },
    showBack:{
      type: Boolean,
      value: false
    },
    fontColor: {
      type: String,
      value: '#fff'
    },
    navColorBlack: {
      type: Boolean,
      value: false
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
    // 返回按钮
    goBack: function(){
      wx.navigateBack({
        delta: 1,
      })
    }
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
    if (this.properties.navColorBlack) {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: 'transparent'
      })
    } else {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: 'transparent'
      })
    }
  },
})
