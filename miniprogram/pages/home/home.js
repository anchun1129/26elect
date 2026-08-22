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

  // 底部vant-tabbar切换（现在用小程序原生tabBar，这个函数可以保留但不会触发）

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

  // 首页卡片跳上报页
  goReport() {
    wx.switchTab({
      url: '/pages/report/report'
    });
  },

  // 首页卡片跳我的页面
  goMine() {
    wx.switchTab({
      url: '/pages/mine/mine'
    });
  }
});