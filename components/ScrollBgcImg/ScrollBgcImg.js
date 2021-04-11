// components/ScrollBgcImg/ScrollBgcImg.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    scrollVague: {  // 是否开启滚动模糊
      type: Boolean,
      value: false
    },
    blurPX: {  // 模糊数
      type: Number,
      value: 5,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: null  // 图片路径
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },

  lifetimes: {
    attached: function() {
      let date = new Date()
      let nowTime = date.getHours()
      if (nowTime >= 6 && nowTime < 15) {
        this.setData({  
          imgUrl: 'cloud://clouddisk-1g6nr788ca92c10a.636c-clouddisk-1g6nr788ca92c10a-1304975629/背景图片/早.jpg'
        })
      } else if (nowTime >= 15 && nowTime < 18) {
        this.setData({
          imgUrl: 'cloud://clouddisk-1g6nr788ca92c10a.636c-clouddisk-1g6nr788ca92c10a-1304975629/背景图片/昏.jpg'
        })
      } else {
        this.setData({
          imgUrl: 'cloud://clouddisk-1g6nr788ca92c10a.636c-clouddisk-1g6nr788ca92c10a-1304975629/背景图片/217930e095d27.jpg'
        })
      }
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})
