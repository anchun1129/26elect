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
      success: async function (loginRes) {
        console.log('云函数返回：', loginRes)

        // 获取用户唯一标识 openid
        const userId = loginRes.result.openid || loginRes.result.userId
        if (!userId) {
          wx.showToast({ title: '获取用户ID失败', icon: 'none' })
          that.setData({ isLoading: false })
          return
        }

        // 2. 保存基础登录状态
        wx.setStorageSync('userId', userId)
        wx.setStorageSync('isLogin', true)

        // =====新增：调用云函数获取当前用户角色，存入本地userInfo=====
        try {
          const roleRes = await wx.cloud.callFunction({
            name: "getCurrentUserRole"
          })
          wx.setStorageSync('userInfo', {
            userId: userId,
            role: roleRes.result.role
          })
        } catch (e) {
          console.error("获取用户角色失败", e)
          wx.setStorageSync('userInfo', {
            userId: userId,
            role: 0
          })
        }

        // 3. 页面跳转
        wx.reLaunch({
          url: '/pages/home/home'
        })

      },
      fail: function (err) {
        console.error('云函数调用失败', err)
        wx.showToast({ title: '登录失败，请重试', icon: 'none' })
        that.setData({ isLoading: false })
      }
    })
  }
})
