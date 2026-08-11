Page({
  data: {
    active: 0
  },
  onLoad() {
    // 检查是否已登录
    const isLogin = wx.getStorageSync('isLogin')
    const userId = wx.getStorageSync('userId')
    console.log('当前登录用户ID：', userId)  // ← 看看有没有值
    if (!isLogin) {
      wx.reLaunch({
        url: '/pages/login/login'
      })
      return
    }
  },

  onChange(e) {
    const index = e.detail
    if (index === 0) {
      console.log('当前在首页')
    } else if (index === 1) {
      wx.reLaunch({ url: '/pages/report/report' })
    } else if (index === 2) {
      wx.reLaunch({ url: '/pages/mine/mine' })
    }
  },

  goReport() {
    wx.redirectTo({
      url: '/pages/report/report'
    });
  },

  goMine() {
    wx.redirectTo({
      url: '/pages/mine/mine'
    });
  }
});