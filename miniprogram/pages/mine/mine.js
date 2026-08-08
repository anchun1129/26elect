Page({
  data: {
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
  // 跳转我的上报记录页
  goRecord() {
    wx.navigateTo({
      url: '/pages/record/record'
    })
  },
  // 跳转修改信息页
  goEditInfo() {
    wx.navigateTo({
      url: '/pages/editInfo/editInfo'
    })
  },
  // 跳转帮助页
  goHelp() {
    wx.navigateTo({
      url: '/pages/help/help'
    })
  },
  // 退出登录交互
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success(res) {
        if (res.confirm) {
          wx.showToast({ title: '已退出登录' })
        }
      }
    })
  }
})