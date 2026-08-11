Page({
  data: {
    active: 0
  },

  // 底部vant-tabbar切换（现在用小程序原生tabBar，这个函数可以保留但不会触发）
  onChange(event) {
    const index = event.detail;
    const paths = ['/pages/home/home', '/pages/report/report', '/pages/mine/mine'];
    wx.switchTab({
      url: paths[index]
    });
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