Page({
  data: {
    active: 2
  },

  onChange(event) {
    const index = event.detail;
    const paths = ['/pages/home/home', '/pages/report/report', '/pages/mine/mine'];
    wx.redirectTo({
      url: paths[index]
    });
  },

  // 跳转到上报页
  goReport() {
    wx.redirectTo({
      url: '/pages/report/report'
    });
  },

  // 跳转到我的页
  goMine() {
    wx.redirectTo({
      url: '/pages/mine/mine'
    });
  }
});