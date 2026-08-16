// pages/login/login.js
Page({
  data: {
    isLoading: false
  },

  // 登录按钮点击事件
  handleLogin() {
    const that = this
    
    // 防止重复点击
    if (this.data.isLoading) return
    this.setData({ isLoading: true })

    // 1. 直接调用云函数 login
    wx.cloud.callFunction({
      name: 'login',
      success: function(loginRes) {
        console.log('云函数返回：', loginRes)
        
        // 获取用户唯一标识 openid
        const userId = loginRes.result.openid || loginRes.result.userId
        if (!userId) {
          wx.showToast({ title: '获取用户ID失败', icon: 'none' })
          that.setData({ isLoading: false })
          return
        }

        // 2. 保存登录状态并直接跳转首页
        wx.setStorageSync('userId', userId)
        wx.setStorageSync('isLogin', true)
        
        // 3. 页面跳转
        wx.reLaunch({
          url: '/pages/home/home'
        })
      },
      fail: function(err) {
        console.error('云函数调用失败', err)
        wx.showToast({ title: '登录失败，请重试', icon: 'none' })
        that.setData({ isLoading: false })
      }
    })
  }
})