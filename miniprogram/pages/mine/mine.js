const db = wx.cloud.database()
Page({
  data: {
    openid: "",
    totalNum: 0,
    finishNum: 0,
    active: 2
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
    // 查询当前用户工单并统计
    queryMyReport(openid) {
      db.collection("reports")   // ✅ 改为你真实存数据的集合 reports
        .where({
          _openid: openid        // ✅ 使用微信自动生成的 _openid 字段（最稳妥）
        })
        .get()
        .then(res => {
          const allList = res.data
          const total = allList.length
          
          // 统计“已办结”（兼容 processed 和 finished 两种状态）
          const finish = allList.filter(item => 
            item.status === "finished" || item.status === "processed"
          ).length
  
          this.setData({
            totalNum: total,
            finishNum: finish
          })
        })
    },

   // 跳转到我的上报记录页面
   goRecord() {
    wx.navigateTo({
      url: '/pages/record/record'
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