Page({
  data: {
    // 初始为空，后续云函数返回结果赋值给这里
    recordList: []
  },

  // 图片放大预览
  previewImage(e) {
    const src = e.currentTarget.dataset.src
    wx.previewImage({
      urls: [src]
    })
  },

  // 待对接云函数：获取我的上报记录
  async getRecordList() {
    wx.showLoading({ title: "加载中" })
    try {
      // 等队友云函数 getMyReport 就绪再打开下面代码
      /*
      const res = await wx.cloud.callFunction({
        name: "getMyReport"
      })
      if(res.result.success){
        this.setData({
          recordList: res.result.data
        })
      }
      */
    } catch (err) {
      wx.showToast({ title: "获取记录失败", icon: "none" })
      console.error(err)
    }
    wx.hideLoading()
  },

  onLoad() {
    // 云函数完成后取消注释
    // this.getRecordList()
  }
})