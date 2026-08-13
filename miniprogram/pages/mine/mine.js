const db = wx.cloud.database()
Page({
  data: {
    openid: "",
    totalNum: 0,
    finishNum: 0
    active: 2
  },
  onChange(e) {
    const index = e.detail
    if (index === 0) {
      wx.reLaunch({
        url: '/pages/home/home'
      })
    } else if (index === 1) {
      wx.reLaunch({
        url: '/pages/report/report'
      })
    } else if (index === 2) {
      // 当前在我的页面，不做跳转
      console.log('当前已在我的页面')
    }
  },

  onLoad() {
    this.getUserOpenId()
  },

  // 获取用户openid
  getUserOpenId() {
    wx.cloud.callFunction({
      name: "login"
    }).then(res => {
      const openid = res.result.openid
      this.setData({ openid })
      this.queryMyReport(openid)
    })
  },

  // 查询当前用户工单并统计
  queryMyReport(openid) {
    db.collection("report_list")
      .where({
        _openid: openid
      })
      .get()
      .then(res => {
        const allList = res.data
        const total = allList.length
        const finish = allList.filter(item => item.status === "finished").length
        this.setData({
          totalNum: total,
          finishNum: finish
        })
      })
  },

  // 跳转我的上报记录（对应app.json注册的 myOrder 页面）
  goRecord() {
    wx.navigateTo({
      url: "/pages/myOrder/myOrder"
    })
  },

  // 空占位函数
  goEditInfo() {
    wx.showToast({ title: "功能开发中", icon: "none" })
  },
  goHelp() {
    wx.showToast({ title: "功能开发中", icon: "none" })
  },
  logout() {
    wx.showModal({
      title: "提示",
      content: "确定退出登录吗？",
      success: res => {
        if (res.confirm) {
          wx.showToast({ title: "已退出" })
        }
      }
    })
  }
})