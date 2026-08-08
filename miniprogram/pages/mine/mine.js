Page({
  data: {
    // 后续对接登录接口可替换这里的昵称、编号
    totalNum: 0,
    finishNum: 0
  },

  onLoad() {
    // 页面加载时查询当前用户上报数据统计
    const db = wx.cloud.database();
    let openid = wx.getStorageSync('openid');
    if (!openid) return;

    db.collection('report')
      .where({
        _openid: openid
      })
      .get({
        success: res => {
          const list = res.data;
          // 总上报条数
          const total = list.length;
          // 筛选已办结工单
          const finishedList = list.filter(item => item.status === '已办结');
          const finish = finishedList.length;

          this.setData({
            totalNum: total,
            finishNum: finish
          })
        }
      })
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