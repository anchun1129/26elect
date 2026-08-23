Page({
  data: {
    loading: true,
    data: {}
  },

  onLoad() {
    console.log('=== 统计页面加载成功 ===');
    this.loadStats();
  },

  loadStats(callback) {
    this.setData({ loading: true });

    wx.cloud.callFunction({
      name: 'dashboardStats',
      data: {}
    }).then(res => {
      if (res.result && res.result.success) {
        this.setData({
          data: res.result.data,
          loading: false
        });
      } else {
        wx.showToast({ title: '数据获取失败', icon: 'none' });
        this.setData({ loading: false });
      }
      callback && callback();
    }).catch(err => {
      console.error('云函数报错：', err);
      wx.showToast({ title: '调用失败', icon: 'none' });
      this.setData({ loading: false });
      callback && callback();
    });
  },

  onPullDownRefresh() {
    this.loadStats(() => wx.stopPullDownRefresh());
  }
});
