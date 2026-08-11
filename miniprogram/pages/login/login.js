// pages/login/login.js
Page({
  data: {
    isLoading: false
  },

  // 登录按钮点击事件 - 必须同步调用 getUserProfile
  handleLogin() {
    const that = this
    
    // 防止重复点击
    if (this.data.isLoading) return
    this.setData({ isLoading: true })

    // ⚠️ 关键：getUserProfile 必须在用户点击的回调中直接调用
    // 不能放在 setTimeout、Promise、async 等异步操作里
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: function(profileRes) {
        console.log('授权成功', profileRes)
        
        // 授权成功后再调云函数获取 openid
        wx.cloud.callFunction({
          name: 'login',
          success: function(loginRes) {
            console.log('云函数返回：', loginRes)
            
            const userId = loginRes.result.openid || loginRes.result.userId
            if (!userId) {
              wx.showToast({ title: '获取用户ID失败', icon: 'none' })
              that.setData({ isLoading: false })
              return
            }

            // 保存登录信息
            wx.setStorageSync('userId', userId)
            wx.setStorageSync('userInfo', profileRes.userInfo)
            wx.setStorageSync('isLogin', true)
            
            // 跳转首页
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
      },
      fail: function(err) {
        console.error('授权失败', err)
        that.setData({ isLoading: false })
        
        // 用户拒绝授权时提示
        if (err.errMsg && err.errMsg.includes('getUserProfile:fail')) {
          wx.showModal({
            title: '需要授权',
            content: '需要获取您的头像和昵称用于显示，请允许授权后重试。',
            confirmText: '好的',
            showCancel: false,
            success: function() {
              // 用户点击"好的"后可以再次尝试
              // 但不能再自动调用，需要用户再次点击登录按钮
            }
          })
        } else {
          wx.showToast({ title: '授权失败，请重试', icon: 'none' })
        }
      }
    })
  },

  // 隐私政策
  showPrivacy() {
    wx.showModal({
      title: '隐私政策',
      content: '我们仅收集您的头像和昵称用于显示，不会用于其他用途。',
      showCancel: false,
      confirmText: '我知道了'
    })
  },

  // 用户协议
  showTerms() {
    wx.showModal({
      title: '用户协议',
      content: '使用本小程序即代表您同意遵守社区规范，如实上报违规信息。',
      showCancel: false,
      confirmText: '我知道了'
    })
  }
})