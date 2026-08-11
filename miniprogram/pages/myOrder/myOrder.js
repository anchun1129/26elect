const db = wx.cloud.database()
Page({
  data: {
    list: []
  },

  onLoad() {
    this.getMyOrder()
  },

  getMyOrder() {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      const openid = res.result.openid
      db.collection('report_list')
        .where({ _openid: openid })
        .orderBy('createTime', 'desc')
        .get()
        .then(res => {
          let arr = res.data.map(item => {
            let t = new Date(item.createTime)
            item.createTime = `${t.getFullYear()}-${t.getMonth()+1}-${t.getDate()} ${t.getHours()}:${t.getMinutes()}`
            return item
          })
          this.setData({ list: arr })
        })
    })
  },

  previewImg(e) {
    let list = e.currentTarget.dataset.list
    let idx = e.currentTarget.dataset.index
    wx.previewImage({
      urls: list,
      current: list[idx]
    })
  }
})