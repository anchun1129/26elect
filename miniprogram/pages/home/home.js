Page({
  data: {
    active: 0
  },

  onChange(event) {
    const index = event.detail;
    const paths = ['/pages/home/home', '/pages/report/report', '/pages/mine/mine'];
    wx.redirectTo({
      url: paths[index]
    });
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