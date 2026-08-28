Page({
  data: {
    active: 0,
    isAdmin: false // 控制管理员按钮是否显示
  },

  onLoad() {
    // 检查是否已登录
    const isLogin = wx.getStorageSync('isLogin')
    const userId = wx.getStorageSync('userId')
    console.log('当前登录用户ID：', userId)
    if (!isLogin) {
      wx.reLaunch({
        url: '/pages/login/login'
      })
      return
    }
  },

  // 每次回到首页执行，判断管理员身份
  onShow() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo && userInfo.role === 1) {
      this.setData({
        isAdmin: true
      })
    } else {
      this.setData({
        isAdmin: false
      })
    }
  },

  // 跳转到管理员后台页面
  goAdmin() {
    wx.navigateTo({
      url: "/pages/admin/admin"
    })
  },

  // 底部vant‑tabbar切换
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

